import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "../components/dashboard/dashboard-shell";
import {
  DashboardContent,
  DashboardLoading,
} from "../components/dashboard/dashboard-content";
import { getDashboardData } from "../lib/server/dashboard-data";

export const Route = createFileRoute("/dashboard")({
  loader: () => getDashboardData(),
  pendingComponent: DashboardLoading,
  component: Dashboard,
});

function Dashboard() {
  const data = Route.useLoaderData();
  return (
    <DashboardShell>
      <DashboardContent data={data} />
    </DashboardShell>
  );
}
