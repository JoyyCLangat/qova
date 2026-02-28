import { getScoreColor } from "@/lib/constants";

interface ScoreIndicatorProps {
	score: number;
	grade: string;
}

export function ScoreIndicator({ score, grade }: ScoreIndicatorProps): React.ReactElement {
	const color = getScoreColor(score);

	return (
		<div className="flex items-center gap-2">
			<span className="font-mono text-sm text-[var(--foreground)]">{score}</span>
			<span className="font-mono text-xs font-bold" style={{ color }}>
				({grade})
			</span>
		</div>
	);
}
