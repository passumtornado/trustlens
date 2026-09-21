import type { ReactNode } from "react";

import {
  Bell,
  Clock3,
  FileText,
  House,
  Menu,
  Search,
  Settings,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";

import logo from "../../assets/logo/trustlens-medium-240x60.svg";
import lightLogo from "../../assets/logo/trustlens-navbar-light-320x80.svg";
import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";

type DashboardShellProps = { children: ReactNode };

const navigation = [
  { label: "Dashboard", to: "/dashboard", icon: House },
  { label: "New Scan", to: "/scan/new", icon: Search },
  { label: "Scan History", to: "/scans", icon: Clock3 },
  { label: "Reports", to: "/reports", icon: FileText },
] as const;

const accountNavigation = [
  { label: "Profile", to: "/profile", icon: UserRound },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div className="flex h-full flex-col px-4 py-5">
      <Link
        to="/dashboard"
        className="mb-9 flex items-center gap-3 px-3"
        onClick={onNavigate}
      >
        <img
          src={lightLogo}
          alt="TrustLens"
          className="h-auto w-44 dark:hidden"
        />
        <img
          src={logo}
          alt="TrustLens"
          className="hidden h-auto w-44 dark:block"
        />
      </Link>
      <nav className="space-y-1" aria-label="Dashboard navigation">
        {navigation.map(({ label, to, icon: Icon }) => {
          const active =
            pathname === to || (to === "/dashboard" && pathname === "/");
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{
                className:
                  "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
              }}
              data-active={active}
            >
              <Icon size={19} strokeWidth={1.9} />
              {label}
            </Link>
          );
        })}
        <div className="my-5 border-t border-sidebar-border/70" />
        {accountNavigation.map(({ label, to, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{
                className:
                  "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
              }}
              data-active={active}
            >
              <Icon size={19} strokeWidth={1.9} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-white/10 bg-white/10 p-4 text-sidebar-foreground">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-sm font-bold">Free Plan</p>
            <p className="mt-1 text-xs text-sidebar-foreground/65">
              25 scans/day
            </p>
          </div>
          <Zap size={17} className="text-sky-300" />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-[48%] rounded-full bg-sky-300" />
        </div>
        <p className="mt-2 text-right text-xs text-sidebar-foreground/65">
          12 / 25 used
        </p>
        <Button className="mt-4 h-9 w-full bg-primary text-xs text-primary-foreground hover:bg-primary/90">
          Upgrade
        </Button>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-sidebar lg:block">
        <SidebarContent onNavigate={() => undefined} />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="relative h-full w-72 bg-sidebar shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-md p-2 text-sidebar-foreground"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>
          <div className="relative max-w-xl flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              className="h-10 w-full rounded-lg border border-input bg-muted/35 pl-10 pr-4 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
              placeholder="Search scans, domains or reports..."
              aria-label="Search dashboard"
            />
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative rounded-md p-2 text-muted-foreground hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-risk-danger" />
            </button>
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                JD
              </div>
              <div className="hidden leading-tight xl:block">
                <p className="text-sm font-semibold">John Doe</p>
                <p className="text-xs text-muted-foreground">Free Plan</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="min-h-[calc(100dvh-4rem)] p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
