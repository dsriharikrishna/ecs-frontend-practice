import { Check, Circle, GitBranch, Rocket, TriangleAlert } from "lucide-react";
import { PageHeading } from "../components/ui/PageHeading";

const deployments = [
  { version: "v1.8.4", name: "Improve dashboard loading performance", commit: "a7c3e91", branch: "main", service: "web-frontend", time: "Today, 10:42 AM", status: "Succeeded" },
  { version: "v1.8.3", name: "Update container health check path", commit: "8bf21d4", branch: "main", service: "web-frontend", time: "Today, 9:18 AM", status: "Succeeded" },
  { version: "v1.8.2", name: "Tune worker queue concurrency", commit: "0d4f7ac", branch: "release/1.8", service: "worker-queue", time: "Today, 8:56 AM", status: "In progress" },
  { version: "v1.8.1", name: "Add service-level metrics", commit: "981cd26", branch: "main", service: "orders-api", time: "Yesterday, 4:32 PM", status: "Rolled back" },
];

export function DeploymentsPage() {
  return (
    <>
      <PageHeading eyebrow="RELEASES" title="Deployments" description="Track releases and rollback status across ECS services." action={<button type="button" className="button-secondary"><GitBranch className="size-3.5" aria-hidden="true" /> All branches</button>} />
      <section className="panel-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div><h2 className="panel-title">Deployment history</h2><p className="mt-1 text-xs text-slate-500">Most recent activity first</p></div>
          <button type="button" className="button-secondary"><Rocket className="size-3.5" aria-hidden="true" /> Deploy</button>
        </div>
        <ol className="divide-y divide-slate-100">
          {deployments.map((deployment) => (
            <li key={deployment.version} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div className="flex min-w-[250px] flex-1 items-start gap-3">
                <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${deployment.status === "Succeeded" ? "bg-emerald-50 text-emerald-600" : deployment.status === "In progress" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>
                  {deployment.status === "Succeeded" ? <Check className="size-4" aria-hidden="true" /> : deployment.status === "In progress" ? <Circle className="size-3" aria-hidden="true" /> : <TriangleAlert className="size-4" aria-hidden="true" />}
                </span>
                <div><p className="text-sm font-semibold text-slate-800">{deployment.name}</p><p className="mt-1.5 text-xs text-slate-500">{deployment.service} <span className="mx-1 text-slate-300">·</span> {deployment.version} <span className="mx-1 text-slate-300">·</span> <code>{deployment.commit}</code></p></div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${deployment.status === "Succeeded" ? "bg-emerald-50 text-emerald-700" : deployment.status === "In progress" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{deployment.status}</span>
                <span className="min-w-32 text-right text-[11px] text-slate-400">{deployment.time}</span>
              </div>
            </li>
          ))}
        </ol>
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Showing 4 of 63 deployments</div>
      </section>
    </>
  );
}
