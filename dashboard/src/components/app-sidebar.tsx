"use client"

import {
  ArrowsLeftRight,
  ChartBar,
  ChartLine,
  Gear,
  MagnifyingGlass,
  Robot,
  ShieldCheck,
  Wallet,
} from "@phosphor-icons/react"
import { LogoMark } from "@/components/brand/logo-mark"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Qova User",
    email: "user@qova.cc",
    avatar: "",
  },
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: ChartBar,
    },
    {
      title: "Agents",
      url: "/agents",
      icon: Robot,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: ArrowsLeftRight,
    },
    {
      title: "Scores",
      url: "/scores",
      icon: ChartLine,
    },
    {
      title: "Budgets",
      url: "/budgets",
      icon: Wallet,
    },
    {
      title: "Verify",
      url: "/verify",
      icon: ShieldCheck,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Gear,
    },
    {
      title: "Search",
      url: "#",
      icon: MagnifyingGlass,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <LogoMark className="!h-5 !w-auto" />
                <span className="text-base font-semibold">Qova</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
