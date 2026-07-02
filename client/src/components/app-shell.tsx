import { Bell, Search, Send, SlidersHorizontal, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { navItems, peopleCard } from "@/data/mock";

type AppShellProps = {
  activePath: string;
  children: React.ReactNode;
  user?: { fullName?: string; email?: string; role?: string } | null;
  onLogout?: () => void;
};

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

function AppShell({ activePath, children, user,onLogout }: AppShellProps) {
  const displayName = user?.fullName?.trim() || peopleCard.name;
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Open to work";
  const initials = getInitials(displayName);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-black leading-none text-slate-950">
                Network Pro
              </div>
              <div className="text-xs font-medium text-slate-500">
                Premium professional network
              </div>
            </div>
          </div>

          <div className="hidden flex-1 items-center gap-3 md:flex">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-11 shadow-sm"
                placeholder="Search people, posts, companies, or jobs"
              />
            </div>
            <Button variant="outline" size="icon" aria-label="Filter">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="hidden sm:inline-flex">
              <Send className="h-4 w-4" />
              Invite
            </Button>

            <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white px-2 py-1 shadow-sm">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden pr-2 text-left sm:block">
                <div className="text-sm font-semibold text-slate-900">
                  {displayName}
                </div>
                <div className="text-xs text-slate-500">{roleLabel}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const path =
              item === "Home"
                ? "/feed"
                : item === "My Network"
                  ? "/profile"
                  : item === "Jobs"
                    ? "/jobs"
                    : item === "Messaging"
                      ? "/messages"
                      : "/notifications";
            const active =
              activePath === path || (path === "/feed" && activePath === "/");

            return (
              <Link
                key={item}
                to={path}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  active
                    ? "bg-slate-950 text-white shadow-soft"
                    : "bg-white/80 text-slate-600 hover:bg-white hover:text-slate-950",
                ].join(" ")}
              >
                {item}
              </Link>
            );
          })}
          <Badge variant="accent" className="ml-auto hidden md:inline-flex">
            9 new opportunities
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          {children}
        </div>
      </main>
    </div>
  );
}

export { AppShell };
