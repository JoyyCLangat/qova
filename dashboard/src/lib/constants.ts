/** Score grade thresholds -- mirrors @qova/core constants. */
export const SCORE_GRADE_THRESHOLDS = [
	{ grade: "AAA", min: 950 },
	{ grade: "AA", min: 900 },
	{ grade: "A", min: 850 },
	{ grade: "BBB", min: 750 },
	{ grade: "BB", min: 650 },
	{ grade: "B", min: 550 },
	{ grade: "CCC", min: 450 },
	{ grade: "CC", min: 350 },
	{ grade: "C", min: 250 },
	{ grade: "D", min: 0 },
] as const;

export type ScoreGrade = "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "CC" | "C" | "D";

/** Get letter grade from numeric score. */
export function getGrade(score: number): ScoreGrade {
	for (const { grade, min } of SCORE_GRADE_THRESHOLDS) {
		if (score >= min) return grade;
	}
	return "D";
}

/** Get score color class based on score value. */
export function getScoreColorClass(score: number): "green" | "yellow" | "red" {
	if (score >= 700) return "green";
	if (score >= 400) return "yellow";
	return "red";
}

/** Get hex color for a score. */
export function getScoreColor(score: number): string {
	if (score >= 700) return "#22C55E";
	if (score >= 400) return "#FACC15";
	return "#EF4444";
}

/** Format score as zero-padded 4-char string. */
export function formatScore(score: number): string {
	return String(Math.max(0, Math.min(1000, Math.round(score)))).padStart(4, "0");
}

/** Score to percentage (0-100). */
export function scoreToPercentage(score: number): number {
	return score / 10;
}

/** Shorten Ethereum address for display. */
export function shortenAddress(address: string): string {
	if (address.length < 10) return address;
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Explorer URL for Base Sepolia. */
export const EXPLORER_URL = "https://sepolia.basescan.org";

/** Format a relative timestamp. */
export function timeAgo(isoString: string): string {
	const now = Date.now();
	const then = new Date(isoString).getTime();
	const diffMs = now - then;
	const diffSec = Math.floor(diffMs / 1000);

	if (diffSec < 60) return `${diffSec}s ago`;
	const diffMin = Math.floor(diffSec / 60);
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;
	const diffDay = Math.floor(diffHr / 24);
	return `${diffDay}d ago`;
}
