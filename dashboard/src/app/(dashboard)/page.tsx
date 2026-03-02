"use client"

import Link from "next/link"
import { SectionCards } from "@/components/section-cards"
import { ScoreTrendChart } from "@/components/charts/score-trend-chart"
import { ScoreDistribution } from "@/components/charts/score-distribution"
import { ActivityChart } from "@/components/charts/activity-chart"
import { ScoreBadge } from "@/components/scores/score-badge"
import { Badge } from "@/components/ui/badge"
import { useLeaderboard, useRecentActivity } from "@/hooks/use-convex-data"
import { PageHeader } from "@/components/shared/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function OverviewPage(): React.ReactElement {
  const leaderboard = useLeaderboard(5)
  const recentActivity = useRecentActivity(10)

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <PageHeader
          title="Dashboard"
          subtitle="Real-time overview of your registered agents and the ecosystem"
        />
      </div>
      <SectionCards />

      <div className="px-4 lg:px-6">
        <ScoreTrendChart />
      </div>

      <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <ScoreDistribution />

        <Card>
          <CardHeader>
            <CardTitle>Top Agents</CardTitle>
            <CardDescription>
              <Link href="/agents" className="hover:underline">
                View all agents
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {leaderboard.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6 w-10 text-xs">#</TableHead>
                    <TableHead className="text-xs">Agent</TableHead>
                    <TableHead className="text-xs">Grade</TableHead>
                    <TableHead className="pr-6 text-right text-xs">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((agent) => (
                    <TableRow key={agent.address}>
                      <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                        {agent.rank}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/agents/${agent.address}`}
                          className="font-mono text-sm hover:underline"
                        >
                          {agent.addressShort}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <ScoreBadge grade={agent.grade} size="xs" />
                      </TableCell>
                      <TableCell className="pr-6 text-right font-mono text-xs text-muted-foreground tabular-nums">
                        {agent.score}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No agents scored yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <ActivityChart />

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest agent transactions</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {recentActivity.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6 text-xs">Agent</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-right text-xs">Amount</TableHead>
                    <TableHead className="pr-6 text-right text-xs">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell className="pl-6">
                        <Link
                          href={`/agents/${tx.agent}`}
                          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {tx.addressShort}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {tx.amount && (
                          <span className="font-mono text-xs">{tx.amount}</span>
                        )}
                      </TableCell>
                      <TableCell className="pr-6 text-right text-xs text-muted-foreground">
                        {timeAgo(tx.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No activity recorded yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
