import type { Activity, EcsService, ImageRepository } from "../types";

export const services: EcsService[] = [
  {
    name: "web-frontend",
    cluster: "production",
    status: "Healthy",
    tasks: "2 / 2",
    cpu: 18,
    memory: 42,
    updated: "4 min ago",
  },
  {
    name: "orders-api",
    cluster: "production",
    status: "Healthy",
    tasks: "3 / 3",
    cpu: 36,
    memory: 61,
    updated: "18 min ago",
  },
  {
    name: "worker-queue",
    cluster: "staging",
    status: "Deploying",
    tasks: "1 / 2",
    cpu: 12,
    memory: 54,
    updated: "Just now",
  },
];

export const activities: Activity[] = [
  {
    title: "Deployment completed",
    description: "web-frontend · v1.8.4 is now running",
    time: "4 min ago",
    kind: "success",
  },
  {
    title: "Service scaled",
    description: "orders-api · desired count changed to 3",
    time: "18 min ago",
    kind: "info",
  },
  {
    title: "Image scan passed",
    description: "web-frontend · 0 critical vulnerabilities",
    time: "32 min ago",
    kind: "success",
  },
  {
    title: "Deployment in progress",
    description: "worker-queue · replacing task 1 of 2",
    time: "Just now",
    kind: "warning",
  },
];

export const repositories: ImageRepository[] = [
  {
    name: "web-frontend",
    uri: "123456789012.dkr.ecr.us-east-1.amazonaws.com/web-frontend",
    images: 14,
    lastPushed: "4 min ago",
    scan: "Passed",
  },
  {
    name: "orders-api",
    uri: "123456789012.dkr.ecr.us-east-1.amazonaws.com/orders-api",
    images: 8,
    lastPushed: "18 min ago",
    scan: "Passed",
  },
  {
    name: "worker-queue",
    uri: "123456789012.dkr.ecr.us-east-1.amazonaws.com/worker-queue",
    images: 6,
    lastPushed: "1 hr ago",
    scan: "Scanning",
  },
];

export const cpuSeries = [31, 40, 35, 54, 46, 61, 43, 52, 48, 69, 58, 64, 51, 72, 60, 68, 56, 76, 62, 70, 53, 65, 50, 59];
export const memorySeries = [46, 49, 45, 50, 48, 52, 47, 53, 51, 56, 50, 54, 49, 58, 53, 56, 51, 59, 54, 57, 52, 58, 53, 56];
