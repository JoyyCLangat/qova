"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AgentDetailsResponse } from "@/lib/api";
import type { ScoreGrade } from "@/lib/constants";

const GRADE_ORDER: ScoreGrade[] = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C", "D"];

function getBarColor(grade: ScoreGrade): string {
	switch (grade) {
		case "AAA":
		case "AA":
		case "A":
		case "BBB":
			return "#22C55E";
		case "BB":
		case "B":
		case "CCC":
			return "#FACC15";
		case "CC":
		case "C":
		case "D":
			return "#EF4444";
	}
}

interface GradeBucket {
	grade: ScoreGrade;
	count: number;
}

function CustomTooltip({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: Array<{ value: number }>;
	label?: string;
}): React.ReactElement | null {
	if (!active || !payload?.length) return null;
	return (
		<div className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--popover))] px-3 py-2 text-xs">
			<p className="font-medium text-[hsl(var(--popover-foreground))]">{label}</p>
			<p className="text-[hsl(var(--muted-foreground))]">
				{payload[0].value} agent{payload[0].value !== 1 ? "s" : ""}
			</p>
		</div>
	);
}

export function ScoreDistribution({
	agents,
}: {
	agents: AgentDetailsResponse[];
}): React.ReactElement {
	const buckets: GradeBucket[] = GRADE_ORDER.map((grade) => ({
		grade,
		count: agents.filter((a) => a.grade === grade).length,
	}));

	return (
		<div className="h-[300px] w-full">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={buckets} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
					<XAxis
						dataKey="grade"
						axisLine={false}
						tickLine={false}
						tick={{
							fontSize: 12,
							fill: "hsl(var(--muted-foreground))",
						}}
					/>
					<YAxis
						allowDecimals={false}
						axisLine={false}
						tickLine={false}
						tick={{
							fontSize: 12,
							fill: "hsl(var(--muted-foreground))",
						}}
					/>
					<Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
					<Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
						{buckets.map((bucket) => (
							<Cell key={bucket.grade} fill={getBarColor(bucket.grade)} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
