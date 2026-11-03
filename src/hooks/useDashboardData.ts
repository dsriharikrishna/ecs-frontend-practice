import { useCallback, useEffect, useState } from "react";
import { activities, services } from "../data/mock-data";

type DashboardData = {
  services: typeof services;
  activities: typeof activities;
};

type DashboardState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: DashboardData; updatedAt: Date };

function loadMockData() {
  return new Promise<DashboardData>((resolve) => {
    window.setTimeout(() => resolve({ services, activities }), 350);
  });
}

function toErrorState(error: unknown): DashboardState {
  return {
    status: "error",
    message:
      error instanceof Error ? error.message : "Dashboard data could not be loaded.",
  };
}

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({ status: "loading" });

  const refresh = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const data = await loadMockData();
      setState({ status: "success", data, updatedAt: new Date() });
    } catch (error) {
      setState(toErrorState(error));
    }
  }, []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      void loadMockData().then(
        (data) => {
          if (active) setState({ status: "success", data, updatedAt: new Date() });
        },
        (error: unknown) => {
          if (active) setState(toErrorState(error));
        },
      );
    }, 350);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  return { state, refresh };
}
