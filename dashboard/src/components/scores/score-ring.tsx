"use client";

import { useEffect, useState } from "react";

interface ScoreRingProps {
	score: number;
	grade: string;
	size?: number;
	strokeWidth?: number;
	animated?: boolean;
}

function getScoreHslVar(score: number): string {
	if (score >= 700) return "var(--score-green)";
	if (score >= 400) return "var(--score-yellow)";
	return "var(--score-red)";
}

export function ScoreRing({
	score,
	grade,
	size = 200,
	strokeWidth = 12,
	animated = true,
}: ScoreRingProps): React.ReactElement {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const percentage = Math.max(0, Math.min(1000, score)) / 1000;
	const targetOffset = circumference * (1 - percentage);

	const [offset, setOffset] = useState(animated ? circumference : targetOffset);

	useEffect(() => {
		if (!animated) {
			setOffset(targetOffset);
			return;
		}
		// Defer to next frame so the CSS transition triggers from the initial value
		const frame = requestAnimationFrame(() => {
			setOffset(targetOffset);
		});
		return () => cancelAnimationFrame(frame);
	}, [animated, targetOffset]);

	const center = size / 2;
	const strokeColor = `hsl(${getScoreHslVar(score)})`;

	return (
		<div
			className="relative inline-flex items-center justify-center"
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="-rotate-90"
				role="img"
				aria-label={`Score ring: ${grade} ${score}/1000`}
			>
				{/* Background track */}
				<circle
					cx={center}
					cy={center}
					r={radius}
					fill="none"
					stroke="hsl(var(--border))"
					strokeWidth={strokeWidth}
					opacity={0.3}
				/>
				{/* Colored fill */}
				<circle
					cx={center}
					cy={center}
					r={radius}
					fill="none"
					stroke={strokeColor}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					style={{
						transition: "stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
					}}
				/>
			</svg>
			{/* Center text */}
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="font-heading text-4xl font-bold leading-none">{grade}</span>
				<span className="mt-1 font-mono text-sm text-[hsl(var(--muted-foreground))]">
					{score}/1000
				</span>
			</div>
		</div>
	);
}
