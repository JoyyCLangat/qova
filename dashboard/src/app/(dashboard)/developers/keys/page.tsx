"use client"

import { useState } from "react"
import {
  Key,
  Plus,
  Copy,
  Trash,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ApiKeyEntry {
  id: string
  name: string
  prefix: string
  scopes: string[]
  createdAt: string
  lastUsed: string | null
  isActive: boolean
}

// Demo data
const DEMO_KEYS: ApiKeyEntry[] = [
  {
    id: "1",
    name: "Production",
    prefix: "qova_prod_8x",
    scopes: ["agents:read", "scores:read", "verify"],
    createdAt: "2026-01-15",
    lastUsed: "2026-02-28",
    isActive: true,
  },
  {
    id: "2",
    name: "Development",
    prefix: "qova_dev_3k",
    scopes: ["agents:read", "agents:write", "scores:read", "scores:write"],
    createdAt: "2026-02-01",
    lastUsed: "2026-02-27",
    isActive: true,
  },
  {
    id: "3",
    name: "CI/CD Pipeline",
    prefix: "qova_ci_9m",
    scopes: ["agents:read", "scores:read"],
    createdAt: "2026-02-10",
    lastUsed: null,
    isActive: false,
  },
]

export default function ApiKeysPage(): React.ReactElement {
  const [keys] = useState<ApiKeyEntry[]>(DEMO_KEYS)
  const [createOpen, setCreateOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [revealedKey, setRevealedKey] = useState<string | null>(null)

  function handleCreate(): void {
    if (!newKeyName.trim()) return
    const fakeKey = `qova_${newKeyName.toLowerCase().replace(/\s+/g, "_")}_${Math.random().toString(36).slice(2, 10)}`
    setRevealedKey(fakeKey)
    setCreateOpen(false)
    setNewKeyName("")
    toast.success("API key created. Copy it now -- it won't be shown again.")
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">API Keys</h2>
            <p className="text-sm text-muted-foreground">
              Manage API keys for programmatic access to the Qova API
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4 mr-1" />
                Create Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogDescription>
                  Give your key a name to identify its usage.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Key Name</Label>
                  <Input
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production, CI/CD"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!newKeyName.trim()}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Revealed key banner */}
      {revealedKey && (
        <div className="px-4 lg:px-6">
          <div className="rounded-lg border border-score-green-border bg-score-green-bg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Your new API key</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Copy this key now. It will not be shown again.
                </p>
                <code className="font-mono text-sm bg-background px-2 py-1 rounded border">
                  {revealedKey}
                </code>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(revealedKey)
                    toast.success("Copied to clipboard")
                  }}
                >
                  <Copy className="size-3.5 mr-1" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRevealedKey(null)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keys table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Keys</CardTitle>
            <CardDescription>
              {keys.length} key{keys.length !== 1 ? "s" : ""} configured
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 text-xs">Name</TableHead>
                  <TableHead className="text-xs">Key</TableHead>
                  <TableHead className="text-xs">Scopes</TableHead>
                  <TableHead className="text-xs">Created</TableHead>
                  <TableHead className="text-xs">Last Used</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="pr-6 text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2">
                        <Key className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{key.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {key.prefix}...
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {key.scopes.slice(0, 2).map((scope) => (
                          <Badge key={scope} variant="outline" className="text-[10px]">
                            {scope}
                          </Badge>
                        ))}
                        {key.scopes.length > 2 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{key.scopes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {key.createdAt}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {key.lastUsed ?? "Never"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          key.isActive
                            ? "text-score-green border-score-green-border bg-score-green-bg"
                            : "text-muted-foreground"
                        }
                      >
                        {key.isActive ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-7 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
