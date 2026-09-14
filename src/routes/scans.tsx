import { createFileRoute } from "@tanstack/react-router";
import { DashboardPlaceholder } from "../components/dashboard/dashboard-placeholder";
export const Route = createFileRoute("/scans")({ component: Scans });
function Scans() {
  return (
    <DashboardPlaceholder
      title="Scan History"
      description="Your scan history will appear here."
    />
  );
}
