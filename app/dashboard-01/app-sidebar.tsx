"use client"

import Link from "next/link"
import {
  IconCreditCard,
  IconDashboard,
  IconListDetails,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { SignOutButton } from "@/components/ui/app_components/sign_out_button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string
    email: string
  }
}

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Wallet", url: "/wallet", icon: IconCreditCard },
  { title: "Groups", url: "/groups", icon: IconUsers },
  { title: "Subscriptions", url: "/subscriptions", icon: IconListDetails },
  { title: "Settings", url: "/settings", icon: IconSettings },
]

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const resolvedUser = user ?? {
    name: "User",
    email: "user@example.com",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconDashboard className="!size-5" />
                <span className="text-base font-semibold">PayXen</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          <div className="flex items-center justify-between gap-2 rounded-md border p-3 text-xs">
            <div className="min-w-0">
              <p className="truncate font-medium">{resolvedUser.name}</p>
              <p className="text-muted-foreground truncate">{resolvedUser.email}</p>
            </div>
            <SignOutButton compact className="shrink-0" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
