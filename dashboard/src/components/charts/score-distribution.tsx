"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { useGradeDistribution } from "@/hooks/use-convex-data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const GRADE_ORDER = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C", "D"]

function gradeColor(grade: string): string {
  if (["AAA", "AA", "A", "BBB"].includes(grade)) return "var(--score-green)"
  if (["BB", "B", "CCC"].includes(grade)) return "var(--score-yellow)"
  return "var(--score-red)"
}

const chartConfig = {
  count: {
    label: "Agents",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ScoreDistribution() {
  const distribution = useGradeDistribution()

  const chartData = GRADE_ORDER.map((grade) => ({
    grade,
    count: distribution[grade] ?? 0,
    fill: gradeColor(grade),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
        <CardDescription>Agents by credit grade</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="grade"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={30}
              allowDecimals={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideIndicator />}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((entry) => (
                <Cell key={entry.grade} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
