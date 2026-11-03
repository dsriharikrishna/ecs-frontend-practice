import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/services": "ECS Services",
  "/images": "Container Images",
  "/deployments": "Deployments",
  "/settings": "Settings",
};

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onMenuClick} className="icon-button -ml-2 lg:hidden" aria-label="Open navigation">
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline">Workspace</span>
          <span className="hidden sm:inline text-slate-300">/</span>
          <span className="truncate font-semibold text-slate-700">{titles[pathname] ?? "Page"}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <label className="topbar-search">
          <Search className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
          <input type="search" placeholder="Search resources..." aria-label="Search resources" />
          <kbd className="hidden rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 md:block">⌘ K</kbd>
        </label>
        <button type="button" className="icon-button relative" aria-label="Notifications, 2 unread">
          <Bell className="size-[18px]" aria-hidden="true" />
          <span className="notification-dot" />
        </button>
        <div className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" />
        <button type="button" className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-slate-100" aria-label="Account menu">
          <span className="user-avatar">JD</span>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-semibold text-slate-800">Jordan Davis</span>
            <span className="mt-0.5 block text-[10px] text-slate-400">Admin</span>
          </span>
          <ChevronDown className="hidden size-3.5 text-slate-400 sm:block" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
