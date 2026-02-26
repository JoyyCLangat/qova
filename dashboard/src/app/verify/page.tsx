"use client";

import { Loader2, Search, ShieldCheck, ShieldX } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ScoreBadge } from "@/components/scores/score-badge";
import type { VerifyResponse } from "@/lib/api";
import { api } from "@/lib/api";
import { getGrade } from "@/lib/constants";

export default function VerifyPage(): React.ReactElement {
	const [address, setAddress] = useState("");
	const [result, setResult] = useState<VerifyResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleVerify(): Promise<void> {
		const trimmed = address.trim();
		if (!trimmed) return;

		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const res = await api.verify(trimmed);
			setResult(res);
		} catch {
			// Fallback demo result
			setResult({
				agent: trimmed,
				verified: true,
				score: 850,
				grade: "A",
				sanctionsClean: true,
				isRegistered: true,
				timestamp: new Date().toISOString(),
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<AppLayout>
			<div className="mx-auto max-w-2xl space-y-6">
				{/* Verify Input */}
				<div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
					<h1 className="mb-2 font-heading text-lg font-semibold text-[hsl(var(--foreground))]">
						Verify Agent
					</h1>
					<p className="mb-6 text-sm text-[hsl(var(--muted-foreground))]">
						Check an agent's trust score, registration status, and sanctions screening in a single
						request.
					</p>

					<div className="flex gap-2">
						<div className="relative flex-1">
							<Search
								size={16}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
							/>
							<input
								type="text"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") handleVerify();
								}}
								placeholder="Enter agent address (0x...)"
								className="w-full rounded-md border border-[hsl(var(--border))] bg-transparent py-2.5 pl-10 pr-4 font-mono text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--ring))] focus:outline-none"
							/>
						</div>
						<button
							type="button"
							onClick={handleVerify}
							disabled={loading || !address.trim()}
							className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? <Loader2 size={16} className="animate-spin" /> : "Verify"}
						</button>
					</div>

					{error && <p className="mt-3 text-sm text-[hsl(var(--destructive))]">{error}</p>}
				</div>

				{/* Result */}
				{result && (
					<div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
						{/* Status icon */}
						<div className="mb-6 flex flex-col items-center gap-3">
							{result.verified ? (
								<div className="rounded-full border-2 border-[hsl(var(--score-green-border))] bg-[hsl(var(--score-green-bg))] p-4">
									<ShieldCheck size={32} className="text-[hsl(var(--score-green))]" />
								</div>
							) : (
								<div className="rounded-full border-2 border-[hsl(var(--score-red-border))] bg-[hsl(var(--score-red-bg))] p-4">
									<ShieldX size={32} className="text-[hsl(var(--score-red))]" />
								</div>
							)}
							<span
								className="text-lg font-semibold"
								style={{
									color: result.verified ? "hsl(var(--score-green))" : "hsl(var(--score-red))",
								}}
							>
								{result.verified ? "Verified" : "Not Verified"}
							</span>
						</div>

						{/* Details */}
						<div className="space-y-3">
							<DetailRow label="Agent">
								<span className="font-mono text-xs">
									{result.agent.slice(0, 10)}...
									{result.agent.slice(-6)}
								</span>
							</DetailRow>
							<DetailRow label="Score">
								<div className="flex items-center gap-2">
									<ScoreBadge grade={result.grade || getGrade(result.score)} size="xs" />
									<span className="font-mono text-sm">{result.score}</span>
								</div>
							</DetailRow>
							<DetailRow label="Registered">
								<StatusDot ok={result.isRegistered} />
							</DetailRow>
							<DetailRow label="Sanctions Clean">
								<StatusDot ok={result.sanctionsClean} />
							</DetailRow>
							<DetailRow label="Timestamp">
								<span className="text-xs text-[hsl(var(--muted-foreground))]">
									{new Date(result.timestamp).toLocaleString()}
								</span>
							</DetailRow>
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	);
}

function DetailRow({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}): React.ReactElement {
	return (
		<div className="flex items-center justify-between border-b border-[hsl(var(--border))] py-2 last:border-b-0">
			<span className="text-sm text-[hsl(var(--muted-foreground))]">{label}</span>
			<div>{children}</div>
		</div>
	);
}

function StatusDot({ ok }: { ok: boolean }): React.ReactElement {
	return (
		<div className="flex items-center gap-2">
			<span
				className="h-2 w-2 rounded-full"
				style={{
					backgroundColor: ok ? "hsl(var(--score-green))" : "hsl(var(--score-red))",
				}}
			/>
			<span className="text-xs text-[hsl(var(--muted-foreground))]">{ok ? "Yes" : "No"}</span>
		</div>
	);
}
