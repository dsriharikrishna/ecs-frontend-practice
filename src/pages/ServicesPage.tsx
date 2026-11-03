import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { PageHeading } from "../components/ui/PageHeading";
import { StatusBadge } from "../components/ui/StatusBadge";
import { services } from "../data/mock-data";

export function ServicesPage() {
  const [query, setQuery] = useState("");
  const visibleServices = services.filter((service) =>
    `${service.name} ${service.cluster}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <PageHeading eyebrow="COMPUTE" title="ECS Services" description="Monitor service health, capacity, and resource utilization." action={<button type="button" className="button-primary">+ Create service</button>} />
      <section className="panel-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:px-5">
          <label className="table-search">
            <Search className="size-4 text-slate-400" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter services..." aria-label="Filter services" />
          </label>
          <button type="button" className="button-secondary"><SlidersHorizontal className="size-3.5" aria-hidden="true" /> Filters</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table min-w-[760px]">
            <thead><tr><th scope="col">Service name</th><th scope="col">Cluster</th><th scope="col">Status</th><th scope="col">Tasks</th><th scope="col">CPU</th><th scope="col">Memory</th><th scope="col">Last updated</th></tr></thead>
            <tbody>{visibleServices.map((service) => (
              <tr key={service.name}>
                <td className="font-semibold text-slate-800">{service.name}</td>
                <td className="text-slate-600">{service.cluster}</td>
                <td><StatusBadge status={service.status} /></td>
                <td className="text-slate-700">{service.tasks}</td>
                <td>{service.cpu}%</td><td>{service.memory}%</td><td className="text-slate-500">{service.updated}</td>
              </tr>
            ))}</tbody>
          </table>
          {visibleServices.length === 0 && <p className="px-5 py-10 text-center text-sm text-slate-500">No services match “{query}”.</p>}
        </div>
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">{visibleServices.length} services</div>
      </section>
    </>
  );
}
