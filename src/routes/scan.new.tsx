import { createFileRoute } from "@tanstack/react-router";
import { DashboardPlaceholder } from "../components/dashboard/dashboard-placeholder";
export const Route = createFileRoute("/scan/new")({ component: NewScan });
function NewScan() {
  return (
    <DashboardPlaceholder
      title="New Scan"
      description="The scan submission workflow will be added in a later feature."
    />
  );
}
