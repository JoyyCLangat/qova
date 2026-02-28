"use client"

import {
  ArrowsLeftRight,
  ChartBar,
  Robot,
  ShieldCheck,
  TrendUp,
  TrendDown,
} from "@phosphor-icons/react"
import { useAgentList } from "@/hooks/use-convex-data"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const agents = useAgentList()

  const totalAgents = agents.length
  const avgScore = totalAgents > 0
    ? Math.round(agents.reduce((s, a) => s + a.score, 0) / totalAgents)
    : 0
  const highGrade = agents.filter((a) => a.score >= 700).length
  const registered = agents.filter((a) => a.isRegistered).length

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Agents</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums font-mono @[250px]/card:text-3xl">
            {totalAgents}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Robot weight="fill" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {registered} registered on-chain <ShieldCheck className="size-4" weight="fill" />
          </div>
          <div className="text-muted-foreground">
            Monitored by Qova protocol
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums font-mono @[250px]/card:text-3xl">
            {avgScore}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendUp />
              Trust
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Across all scored agents <ChartBar className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Scale: 0 - 1000
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>High Grade (A+)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums font-mono @[250px]/card:text-3xl">
            {highGrade}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {highGrade > totalAgents / 2 ? <TrendUp /> : <TrendDown />}
              {totalAgents > 0 ? `${Math.round((highGrade / totalAgents) * 100)}%` : "0%"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Score {"\u2265"} 700 (BBB or above) <ShieldCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Investment-grade agents
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Volume</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums font-mono @[250px]/card:text-3xl">
            {totalVolume(agents)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ArrowsLeftRight />
              ETH
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Cumulative transaction volume <ArrowsLeftRight className="size-4" />
          </div>
          <div className="text-muted-foreground">
            All tracked agents
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

function totalVolume(agents: { totalVolume?: string }[]): string {
  let sum = 0
  for (const a of agents) {
    if (!a.totalVolume) continue
    const match = a.totalVolume.match(/([\d.]+)/)
    if (match) sum += Number.parseFloat(match[1])
  }
  return `${sum.toFixed(2)} ETH`
}
