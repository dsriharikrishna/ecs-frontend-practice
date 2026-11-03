import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-blue-700">404 · Page not found</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">This page isn’t in your workspace</h1>
      <p className="mt-2 text-sm text-slate-500">The link may be incorrect or the page may have moved.</p>
      <Link to="/" className="button-primary mt-5">Back to dashboard</Link>
    </div>
  );
}
