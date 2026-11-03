import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "../../data/mock-data";
import { StatusBadge } from "../ui/StatusBadge";

export function ServiceTable() {
  return (
    <section className="panel-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="panel-title">ECS services</h2>
          <p className="mt-1 text-xs text-slate-500">Health and task capacity by service</p>
        </div>
        <Link to="/services" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">
          View all <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table min-w-[690px]">
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">Status</th>
              <th scope="col">Tasks</th>
              <th scope="col">CPU</th>
              <th scope="col">Memory</th>
              <th scope="col"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.name}>
                <td>
                  <div className="font-semibold text-slate-800">{service.name}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{service.cluster} cluster</div>
                </td>
                <td><StatusBadge status={service.status} /></td>
                <td className="font-medium text-slate-700">{service.tasks}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="mini-meter"><span style={{ width: `${service.cpu}%` }} /></div>
                    <span className="text-xs text-slate-600">{service.cpu}%</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="mini-meter mini-meter-violet"><span style={{ width: `${service.memory}%` }} /></div>
                    <span className="text-xs text-slate-600">{service.memory}%</span>
                  </div>
                </td>
                <td>
                  <button type="button" className="icon-button" aria-label={`More options for ${service.name}`}>
                    <MoreHorizontal className="size-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400 sm:px-6">
        <span>Showing 3 of 8 services</span>
        <span>Updated just now</span>
      </div>
    </section>
  );
}
