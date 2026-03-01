"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentType } from "react"
import type { IconProps } from "@phosphor-icons/react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

function openCommandPalette(): void {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    }),
  )
}

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: ComponentType<IconProps>
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>): React.ReactElement {
  const pathname = usePathname()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isSearch = item.url === "#search"
            const isExternal = item.url.startsWith("http")
            const isActive = !isSearch && !isExternal && pathname.startsWith(item.url)

            if (isSearch) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={openCommandPalette}
                  >
                    <item.icon weight="regular" />
                    <span>{item.title}</span>
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border bg-sidebar-accent px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      <span className="text-[11px]">&#8984;</span>K
                    </kbd>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                >
                  <Link
                    href={item.url}
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <item.icon weight={isActive ? "fill" : "regular"} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
