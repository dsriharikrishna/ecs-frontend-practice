import {
  Activity,
  Boxes,
  CircleHelp,
  Cloud,
  Container,
  LayoutDashboard,
  Layers3,
  Settings,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const primaryLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/services", label: "ECS Services", icon: Container },
  { to: "/images", label: "Container Images", icon: Boxes },
  { to: "/deployments", label: "Deployments", icon: Layers3 },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && <button className="sidebar-backdrop lg:hidden" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`app-sidebar ${open ? "app-sidebar-open" : ""}`}>
        <div className="flex h-[76px] items-center justify-between px-6">
          <NavLink to="/" className="flex items-center gap-3" aria-label="Cloudscape home" onClick={onClose}>
            <span className="brand-mark"><Cloud className="size-[21px]" strokeWidth={2.2} aria-hidden="true" /></span>
            <span className="text-[15px] font-semibold tracking-[-0.03em] text-white">cloudscape</span>
          </NavLink>
          <button type="button" className="icon-button text-slate-400 lg:hidden" onClick={onClose} aria-label="Close navigation">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4 pt-5">
          <p className="sidebar-label">WORKSPACE</p>
          <button type="button" className="workspace-switcher">
            <span className="workspace-avatar">A</span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-xs font-semibold text-slate-100">Acme Cloud</span>
              <span className="mt-0.5 block text-[10px] text-slate-400">Production account</span>
            </span>
            <span className="text-xs text-slate-500" aria-hidden="true">⌄</span>
          </button>
        </div>
        <nav className="mt-8 px-3" aria-label="Main navigation">
          <p className="sidebar-label px-3">MONITORING</p>
          <div className="mt-2 space-y-1">
            {primaryLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
              >
                <Icon className="size-[17px]" strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
                {label === "ECS Services" && <span className="nav-count">8</span>}
              </NavLink>
            ))}
          </div>
          <p className="sidebar-label mt-8 px-3">PREFERENCES</p>
          <div className="mt-2 space-y-1">
            <NavLink to="/settings" onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              <Settings className="size-[17px]" strokeWidth={1.8} aria-hidden="true" />
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>
        <div className="sidebar-bottom">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            All systems operational
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-4">
            <button type="button" className="sidebar-utility"><CircleHelp className="size-4" aria-hidden="true" /> Help center</button>
            <Activity className="size-4 text-slate-500" aria-hidden="true" />
          </div>
          <p className="mt-3 text-[10px] text-slate-600">Cloudscape console · v1.8.4</p>
        </div>
      </aside>
    </>
  );
}
