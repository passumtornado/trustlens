import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "../components/dashboard/dashboard-shell";
import {
  ScanHistoryContent,
  ScanHistoryLoading,
} from "../components/dashboard/scan-history-content";
import { getScanHistoryData } from "../lib/server/scan-history-data";

export const Route = createFileRoute("/scans")({
  loader: () => getScanHistoryData(),
  pendingComponent: ScanHistoryLoading,
  component: Scans,
});

function Scans() {
  const data = Route.useLoaderData();

  return (
    <DashboardShell>
      <ScanHistoryContent data={data} />
    </DashboardShell>
  );
}
