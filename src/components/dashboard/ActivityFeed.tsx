import { Check, Circle, Info, TriangleAlert } from "lucide-react";
import type { Activity } from "../../types";

const icons = {
  success: Check,
  info: Info,
  warning: TriangleAlert,
};

export function ActivityFeed({ items }: { items: Activity[] }) {
  return (
    <section className="panel-card">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="panel-title">Recent activity</h2>
          <p className="mt-1 text-xs text-slate-500">Latest changes across your environment</p>
        </div>
        <button type="button" className="icon-button" aria-label="More activity options">
          <Circle className="size-4" aria-hidden="true" />
        </button>
      </div>
      <ol className="divide-y divide-slate-100">
        {items.map((item, index) => {
          const Icon = icons[item.kind];
          return (
            <li className="flex gap-3.5 px-5 py-4" key={`${item.title}-${index}`}>
              <span className={`activity-icon activity-${item.kind}`}>
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                  <time className="text-[10px] text-slate-400">{item.time}</time>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <button type="button" className="w-full border-t border-slate-100 px-5 py-3 text-center text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-blue-700">
        View activity log
      </button>
    </section>
  );
}
