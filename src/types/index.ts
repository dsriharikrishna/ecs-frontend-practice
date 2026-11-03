export type ServiceStatus = "Healthy" | "Deploying" | "Degraded";

export interface EcsService {
  name: string;
  cluster: string;
  status: ServiceStatus;
  tasks: string;
  cpu: number;
  memory: number;
  updated: string;
}

export interface Activity {
  title: string;
  description: string;
  time: string;
  kind: "success" | "info" | "warning";
}

export interface ImageRepository {
  name: string;
  uri: string;
  images: number;
  lastPushed: string;
  scan: "Passed" | "Scanning" | "Attention";
}
