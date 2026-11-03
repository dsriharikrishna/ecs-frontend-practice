import type { ServiceStatus } from "../../types";

const styles: Record<ServiceStatus | "Passed" | "Scanning" | "Attention", string> = {
  Healthy: "status-badge status-healthy",
  Deploying: "status-badge status-deploying",
  Degraded: "status-badge status-degraded",
  Passed: "status-badge status-healthy",
  Scanning: "status-badge status-deploying",
  Attention: "status-badge status-degraded",
};

export function StatusBadge({
  status,
}: {
  status: ServiceStatus | "Passed" | "Scanning" | "Attention";
}) {
  return (
    <span className={styles[status]}>
      <span className="status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}
