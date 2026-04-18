import { NavLink } from "react-router-dom";
import {
  Activity,
  Cable,
  KeyRound,
  LayoutDashboard,
  Moon,
  Sun,
  Users,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

const NAV = [
  { to: "/health", label: "Service Health", icon: Activity },
  { to: "/api", label: "API Activity", icon: LayoutDashboard },
  { to: "/queues", label: "Queues & Jobs", icon: Cable },
  { to: "/secrets", label: "Secrets & Config", icon: KeyRound },
  { to: "/tenants", label: "Tenants & Auth", icon: Users },
  { to: "/workflows", label: "Workflows", icon: Workflow },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-card/40 md:flex md:flex-col">
          <div className="flex h-16 items-center gap-2 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">FastMVC</div>
              <div className="text-xs text-muted-foreground">Dashboard</div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-border/60 p-4 text-xs text-muted-foreground">
            Auto-refresh every 10s
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-border/60 px-6">
            <div className="flex items-center gap-2 md:hidden">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">FastMVC Dashboard</span>
            </div>
            <div className="hidden md:block" />
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </header>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
