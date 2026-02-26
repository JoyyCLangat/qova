import { ScoreBadge } from "./score-badge";

interface ScoreIndicatorProps {
	score: number;
	grade: string;
}

export function ScoreIndicator({ score, grade }: ScoreIndicatorProps): React.ReactElement {
	return (
		<div className="flex items-center gap-2">
			<ScoreBadge grade={grade} size="xs" />
			<span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{score}</span>
		</div>
	);
}
