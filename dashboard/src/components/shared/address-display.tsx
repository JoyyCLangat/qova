"use client"

import { useState } from "react"
import { Copy, Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface AddressDisplayProps {
  address: string
  truncate?: boolean
  className?: string
}

export function AddressDisplay({
  address,
  truncate = true,
  className,
}: AddressDisplayProps): React.ReactElement {
  const [copied, setCopied] = useState(false)

  const displayAddress = truncate
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address

  function handleCopy(): void {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors",
        className
      )}
      title={address}
    >
      {displayAddress}
      {copied ? (
        <Check className="size-3.5 text-[var(--status-green-text)]" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  )
}
