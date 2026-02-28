"use client";

import type { ScoreGrade } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
	grade: ScoreGrade | string;
	score?: number;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	showScore?: boolean;
}

const sizeClasses: Record<string, string> = {
	xs: "text-[10px] px-1.5 py-0.5",
	sm: "text-xs px-2 py-0.5",
	md: "text-sm px-2.5 py-1",
	lg: "text-base px-3 py-1.5",
	xl: "text-xl px-5 py-2",
};

function getGradeColorKey(grade: string): "green" | "yellow" | "red" {
	const greenGrades = ["AAA", "AA", "A", "BBB"];
	const yellowGrades = ["BB", "B", "CCC"];
	if (greenGrades.includes(grade)) return "green";
	if (yellowGrades.includes(grade)) return "yellow";
	return "red";
}

export function ScoreBadge({
	grade,
	score,
	size = "md",
	showScore = false,
}: ScoreBadgeProps): React.ReactElement {
	const color = getGradeColorKey(grade);

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-md border font-mono font-bold tracking-widest",
				sizeClasses[size],
			)}
			style={{
				background: `var(--score-${color}-bg)`,
				color: `var(--score-${color})`,
				borderColor: `var(--score-${color}-border)`,
			}}
		>
			{grade}
			{showScore && score !== undefined && <span className="opacity-70">{score}</span>}
		</span>
	);
}
