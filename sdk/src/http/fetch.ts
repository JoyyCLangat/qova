/**
 * HTTP transport layer — fetch wrapper with authentication, retries, and error mapping.
 * @author Qova Engineering <eng@qova.cc>
 */

import { QovaApiError, QovaAuthError, QovaNetworkError, QovaRateLimitError } from "./errors.js";

/** SDK version — used in User-Agent header. */
export const SDK_VERSION = "0.1.0";

export interface FetchConfig {
	baseUrl: string;
	apiKey: string;
	timeout: number;
	maxRetries: number;
	retryDelay: number;
	headers: Record<string, string>;
}

interface RequestOptions {
	method: "GET" | "POST" | "PUT" | "DELETE";
	path: string;
	body?: unknown;
	query?: Record<string, string>;
}

/**
 * Pause execution for a given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build a full URL from base, path, and optional query params.
 */
function buildUrl(base: string, path: string, query?: Record<string, string>): string {
	const url = new URL(path, base);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			url.searchParams.set(key, value);
		}
	}
	return url.toString();
}

/**
 * Determine if an HTTP status code is retryable.
 */
function isRetryable(status: number): boolean {
	return status === 429 || status >= 500;
}

/**
 * Parse the Retry-After header into milliseconds.
 */
function parseRetryAfter(header: string | null): number | null {
	if (!header) return null;
	const seconds = Number.parseInt(header, 10);
	if (!Number.isNaN(seconds)) return seconds * 1000;
	const date = Date.parse(header);
	if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
	return null;
}

/**
 * Safely parse JSON from a response, throwing QovaApiError on parse failure.
 */
function parseJson<T>(text: string, status: number): T {
	try {
		return JSON.parse(text) as T;
	} catch {
		throw new QovaApiError(
			`Invalid JSON in response (status ${status})`,
			status,
			"INVALID_RESPONSE",
			text,
		);
	}
}

/**
 * Execute an HTTP request with retry logic, auth, and error mapping.
 */
export async function request<T>(config: FetchConfig, options: RequestOptions): Promise<T> {
	const url = buildUrl(config.baseUrl, options.path, options.query);
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${config.apiKey}`,
		"User-Agent": `@qova/core/${SDK_VERSION}`,
		...config.headers,
	};

	const body = options.body ? JSON.stringify(options.body) : undefined;
	let lastError: Error | null = null;

	for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
		// Create a fresh AbortSignal per attempt so retries get their own timeout window
		const fetchOptions: RequestInit = {
			method: options.method,
			headers,
			body,
			signal: AbortSignal.timeout(config.timeout),
		};

		try {
			const response = await fetch(url, fetchOptions);

			// Success — parse JSON safely
			if (response.ok) {
				const text = await response.text();
				if (!text) return {} as T;
				return parseJson<T>(text, response.status);
			}

			// Auth errors — don't retry
			if (response.status === 401) {
				const respBody = await response.json().catch(() => ({}));
				throw new QovaAuthError(
					(respBody as Record<string, string>).error ?? "Invalid API key",
					response.status,
				);
			}

			if (response.status === 403) {
				const respBody = await response.json().catch(() => ({}));
				throw new QovaAuthError(
					(respBody as Record<string, string>).error ?? "Insufficient permissions",
					response.status,
				);
			}

			// Rate limit
			if (response.status === 429) {
				const retryAfter = parseRetryAfter(response.headers.get("Retry-After"));
				if (attempt < config.maxRetries) {
					const delay = retryAfter ?? config.retryDelay * 2 ** attempt;
					await sleep(delay);
					continue;
				}
				throw new QovaRateLimitError(
					retryAfter ?? config.retryDelay,
				);
			}

			// Server errors — retry
			if (isRetryable(response.status) && attempt < config.maxRetries) {
				await sleep(config.retryDelay * 2 ** attempt);
				continue;
			}

			// Client error — don't retry
			const respBody = await response.json().catch(() => ({}));
			throw new QovaApiError(
				(respBody as Record<string, string>).error ?? `Request failed with status ${response.status}`,
				response.status,
				(respBody as Record<string, string>).code,
				respBody,
			);
		} catch (error) {
			// Re-throw Qova errors (includes QovaApiError from parseJson)
			if (
				error instanceof QovaApiError ||
				error instanceof QovaAuthError ||
				error instanceof QovaRateLimitError
			) {
				throw error;
			}

			// Network / timeout errors — retry
			lastError = error instanceof Error ? error : new Error(String(error));

			if (attempt < config.maxRetries) {
				await sleep(config.retryDelay * 2 ** attempt);
				continue;
			}
		}
	}

	throw new QovaNetworkError(
		lastError?.message ?? "Request failed after retries",
		lastError ?? undefined,
	);
}
