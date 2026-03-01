"use client"

import {
  ArrowsLeftRight,
  ChartBar,
  ChartLine,
  ChartLineUp,
  Gear,
  Globe,
  MagnifyingGlass,
  Robot,
  ShieldCheck,
  Wallet,
  Question,
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
  SidebarSeparator,
} from "@/components/ui/sidebar"

const data = {
  navPlatform: [
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
  ],
  navAnalytics: [
    {
      title: "CRE Engine",
      url: "/cre",
      icon: ChartLineUp,
    },
    {
      title: "Ecosystem",
      url: "/ecosystem",
      icon: Globe,
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
  ],
  navSecurity: [
    {
      title: "Verify",
      url: "/verify",
      icon: ShieldCheck,
    },
  ],
  navSecondary: [
    {
      title: "Search",
      url: "#search",
      icon: MagnifyingGlass,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Gear,
    },
    {
      title: "Help",
      url: "https://docs.qova.cc",
      icon: Question,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>): React.ReactElement {
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
                <div className="flex flex-col gap-0 leading-none">
                  <span className="text-sm font-semibold tracking-tight">Qova</span>
                  <span className="text-[10px] text-muted-foreground">Trust Infrastructure</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Platform" items={data.navPlatform} />
        <NavMain label="Analytics" items={data.navAnalytics} />
        <NavMain label="Security" items={data.navSecurity} />
        <SidebarSeparator className="mx-0" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
