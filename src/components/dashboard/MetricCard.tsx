import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function MetricCard({
  label,
  value,
  detail,
  trend,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  trend?: { value: string; direction: "up" | "down" };
  icon: LucideIcon;
  accent: "blue" | "violet" | "green" | "amber";
}) {
  return (
    <article className="metric-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-slate-950">{value}</p>
        </div>
        <span className={`metric-icon metric-icon-${accent}`}>
          <Icon className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {trend && (
          <span className={`inline-flex items-center gap-0.5 font-semibold ${trend.direction === "up" ? "text-emerald-700" : "text-rose-600"}`}>
            {trend.direction === "up" ? (
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            ) : (
              <ArrowDownRight className="size-3.5" aria-hidden="true" />
            )}
            {trend.value}
          </span>
        )}
        <span className="text-slate-500">{detail}</span>
      </div>
    </article>
  );
}
