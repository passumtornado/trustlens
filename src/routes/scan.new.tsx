import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "../components/dashboard/dashboard-shell";
import { NewScanContent } from "../components/dashboard/new-scan-content";

export const Route = createFileRoute("/scan/new")({ component: NewScan });

function NewScan() {
  return (
    <DashboardShell>
      <NewScanContent />
    </DashboardShell>
  );
}
