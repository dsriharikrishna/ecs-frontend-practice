import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-content">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="main-content">
          <Outlet />
        </main>
        <footer className="page-footer">
          <span>© 2025 Cloudscape Infrastructure</span>
          <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-500" /> Mock environment · us-east-1</span>
        </footer>
      </div>
    </div>
  );
}
