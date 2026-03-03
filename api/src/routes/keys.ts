/**
 * API key management endpoints.
 *
 * Allows authenticated users to create, list, and revoke API keys
 * programmatically. Requires a valid session token or existing API key
 * with admin scope.
 *
 * @author Qova Engineering <eng@qova.cc>
 */

import { Hono } from "hono";
import { validateBody } from "../middleware/validate.js";
import { apiKeyAuth, getApiKey, API_SCOPES } from "../middleware/auth.js";
import { z } from "zod";

export const apiKeyRoutes = new Hono();

/** Schema for creating a new API key. */
const CreateApiKeyRequest = z.object({
	name: z.string().min(1).max(100),
	scopes: z.array(
		z.enum([
			"agents:read",
			"agents:write",
			"transactions:read",
			"transactions:write",
			"scores:read",
			"admin",
		]),
	).min(1),
	expiresInDays: z.number().int().min(1).max(365).optional(),
});

/**
 * SHA-256 hash a string. Uses Web Crypto API.
 */
async function sha256(input: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate a cryptographically random API key.
 */
function generateApiKey(): string {
	const randomBytes = new Uint8Array(30);
	crypto.getRandomValues(randomBytes);
	const key =
		"qova_" +
		Array.from(randomBytes)
			.map((b) => b.toString(36).padStart(2, "0"))
			.join("")
			.slice(0, 40);
	return key;
}

/**
 * POST /api/keys — Create a new API key.
 *
 * Returns the full key ONCE. The key cannot be retrieved again.
 * Store it securely.
 */
apiKeyRoutes.post(
	"/",
	apiKeyAuth({ scope: API_SCOPES.ADMIN }),
	validateBody(CreateApiKeyRequest),
	async (c) => {
		const caller = getApiKey(c);
		if (!caller) return c.json({ error: "Unauthorized" }, 401);

		const body = c.get("body") as z.infer<typeof CreateApiKeyRequest>;

		// Generate the key
		const key = generateApiKey();
		const keyPrefix = key.slice(0, 12);
		const keyHash = await sha256(key);

		const expiresAt = body.expiresInDays
			? Date.now() + body.expiresInDays * 86400000
			: undefined;

		// Store in Convex
		const convexUrl = process.env.CONVEX_URL;
		if (convexUrl) {
			try {
				await fetch(`${convexUrl}/api/mutation`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						path: "mutations/apiKeys:create",
						args: {
							userId: caller.userId,
							name: body.name,
							scopes: body.scopes,
							expiresAt,
						},
					}),
				});
			} catch (error) {
				console.error("[keys] Failed to store key in Convex:", error);
				return c.json({ error: "Failed to create key" }, 500);
			}
		}

		return c.json(
			{
				key, // ⚠️ Only returned once — store it securely
				keyPrefix,
				name: body.name,
				scopes: body.scopes,
				expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
				warning: "This is the only time the full key will be shown. Store it securely.",
			},
			201,
		);
	},
);

/** GET /api/keys — List API keys for the authenticated user. */
apiKeyRoutes.get(
	"/",
	apiKeyAuth({ scope: API_SCOPES.ADMIN }),
	async (c) => {
		const caller = getApiKey(c);
		if (!caller) return c.json({ error: "Unauthorized" }, 401);

		const convexUrl = process.env.CONVEX_URL;
		if (!convexUrl) {
			return c.json({ keys: [], hint: "CONVEX_URL not configured" });
		}

		try {
			const res = await fetch(`${convexUrl}/api/query`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					path: "queries/apiKeys:listByUser",
					args: { userId: caller.userId },
				}),
			});

			if (!res.ok) return c.json({ keys: [] });

			const result = await res.json() as { value: unknown[] };
			return c.json({ keys: result.value ?? [] });
		} catch {
			return c.json({ keys: [] });
		}
	},
);

/** DELETE /api/keys/:id — Revoke an API key. */
apiKeyRoutes.delete(
	"/:id",
	apiKeyAuth({ scope: API_SCOPES.ADMIN }),
	async (c) => {
		const caller = getApiKey(c);
		if (!caller) return c.json({ error: "Unauthorized" }, 401);

		const id = c.req.param("id");

		const convexUrl = process.env.CONVEX_URL;
		if (!convexUrl) {
			return c.json({ error: "CONVEX_URL not configured" }, 500);
		}

		try {
			await fetch(`${convexUrl}/api/mutation`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					path: "mutations/apiKeys:revoke",
					args: { id },
				}),
			});

			return c.json({ revoked: true, id });
		} catch {
			return c.json({ error: "Failed to revoke key" }, 500);
		}
	},
);
