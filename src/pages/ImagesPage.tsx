import { Copy, Search } from "lucide-react";
import { useState } from "react";
import { PageHeading } from "../components/ui/PageHeading";
import { StatusBadge } from "../components/ui/StatusBadge";
import { repositories } from "../data/mock-data";

export function ImagesPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const visible = repositories.filter((repository) => repository.name.toLowerCase().includes(query.toLowerCase()));

  async function copyUri(name: string, uri: string) {
    try {
      await navigator.clipboard.writeText(uri);
      setCopied(name);
      window.setTimeout(() => setCopied(null), 1800);
    } catch (error) {
      console.error("Could not copy image URI to clipboard.", error);
    }
  }

  return (
    <>
      <PageHeading eyebrow="ARTIFACTS" title="Container images" description="Browse repositories and review image scan status." action={<button type="button" className="button-primary">Create repository</button>} />
      <section className="panel-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:px-5">
          <label className="table-search"><Search className="size-4 text-slate-400" aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search repositories..." aria-label="Search repositories" /></label>
          <p className="text-xs text-slate-500">Region <span className="font-semibold text-slate-700">us-east-1</span></p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table min-w-[720px]">
            <thead><tr><th scope="col">Repository</th><th scope="col">Image URI</th><th scope="col">Images</th><th scope="col">Last pushed</th><th scope="col">Scan status</th></tr></thead>
            <tbody>{visible.map((repository) => (
              <tr key={repository.name}>
                <td><span className="font-semibold text-slate-800">{repository.name}</span><span className="mt-1 block text-[10px] text-slate-400">Private repository</span></td>
                <td><div className="flex items-center gap-2"><code className="max-w-[260px] truncate rounded bg-slate-50 px-2 py-1 text-[10px] text-slate-600">{repository.uri}</code><button type="button" className="icon-button !size-7" onClick={() => void copyUri(repository.name, repository.uri)} aria-label={`Copy ${repository.name} image URI`}><Copy className="size-3" aria-hidden="true" /></button><span className="sr-only" aria-live="polite">{copied === repository.name ? "Copied image URI" : ""}</span></div></td>
                <td>{repository.images}</td><td className="text-slate-500">{repository.lastPushed}</td><td><StatusBadge status={repository.scan} /></td>
              </tr>
            ))}</tbody>
          </table>
          {visible.length === 0 && <p className="px-5 py-10 text-center text-sm text-slate-500">No repositories match “{query}”.</p>}
        </div>
      </section>
    </>
  );
}
