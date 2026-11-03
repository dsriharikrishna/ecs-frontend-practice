import {
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  CloudCog,
  Container,
  Cpu,
  HardDrive,
  RefreshCw,
  Server,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { MetricCard } from "../components/dashboard/MetricCard";
import { ResourceChart } from "../components/dashboard/ResourceChart";
import { ServiceTable } from "../components/dashboard/ServiceTable";
import { EmptyState } from "../components/ui/EmptyState";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useDashboardData } from "../hooks/useDashboardData";

export function DashboardPage() {
  const { state, refresh } = useDashboardData();

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">TUESDAY, NOVEMBER 3</p>
          <h1 className="page-title">Infrastructure overview</h1>
          <p className="mt-1.5 text-sm text-slate-500">A live look at the health of your cloud environment.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 sm:inline-flex">
            <span className="size-1.5 rounded-full bg-emerald-500" /> All systems operational
          </span>
          <button type="button" className="button-secondary" onClick={() => void refresh()}>
            <RefreshCw className={`size-3.5 ${state.status === "loading" ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Infrastructure metrics">
        <MetricCard label="Active services" value="8" detail="Across 2 clusters" trend={{ value: "2", direction: "up" }} icon={Container} accent="blue" />
        <MetricCard label="Running tasks" value="14" detail="of 16 desired" trend={{ value: "1", direction: "up" }} icon={Server} accent="violet" />
        <MetricCard label="Avg. CPU usage" value="38.6%" detail="vs. last 24 hours" trend={{ value: "4.2%", direction: "down" }} icon={Cpu} accent="green" />
        <MetricCard label="Avg. memory" value="56.2%" detail="of allocated capacity" icon={HardDrive} accent="amber" />
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.8fr)]">
        <ResourceChart />
        <section className="panel-card p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="panel-title">Deployment health</h2>
              <p className="mt-1 text-xs text-slate-500">Across all environments</p>
            </div>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><CloudCog className="size-[17px]" aria-hidden="true" /></span>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-[2.4rem] font-semibold leading-none tracking-[-0.06em] text-slate-950">96.8<span className="ml-1 text-xl text-slate-400">%</span></p>
              <p className="mt-2 text-xs text-slate-500">successful deployments</p>
            </div>
            <span className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <ArrowDownRight className="size-3.5" aria-hidden="true" /> 1.4%
            </span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[96.8%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>0%</span><span>Target 95%</span><span>100%</span></div>
          <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-500"><CheckCircle2 className="size-3.5 text-emerald-500" aria-hidden="true" /> Successful</span>
              <span className="font-semibold text-slate-800">61</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-500"><TriangleAlert className="size-3.5 text-amber-500" aria-hidden="true" /> In progress</span>
              <span className="font-semibold text-slate-800">2</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-500"><span className="size-3.5 rounded-full border border-rose-300" /> Failed</span>
              <span className="font-semibold text-slate-800">1</span>
            </div>
          </div>
          <Link to="/deployments" className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-blue-700 hover:text-blue-900">
            Deployment history <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </section>
      </section>

      {state.status === "loading" ? (
        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]" aria-label="Loading dashboard data" aria-live="polite">
          <div className="skeleton-panel h-[300px]" />
          <div className="skeleton-panel h-[300px]" />
        </div>
      ) : state.status === "error" ? (
        <div className="mt-5">
          <EmptyState
            title="Dashboard data unavailable"
            message={state.message}
            action={<button type="button" className="button-secondary" onClick={() => void refresh()}>Try again</button>}
          />
        </div>
      ) : (
        <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
          <ServiceTable />
          <ActivityFeed items={state.data.activities} />
        </div>
      )}
      {state.status === "success" && (
        <p className="sr-only" aria-live="polite">
          Dashboard updated at {state.updatedAt.toLocaleTimeString()}.
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-white p-2 text-blue-700 shadow-sm"><CloudCog className="size-4" aria-hidden="true" /></span>
          <div>
            <p className="text-xs font-semibold text-slate-800">Your infrastructure, at a glance</p>
            <p className="mt-0.5 text-[11px] text-slate-500">Connect an AWS account to replace sample values with live metrics.</p>
          </div>
        </div>
        <StatusBadge status="Healthy" />
      </div>
    </>
  );
}
