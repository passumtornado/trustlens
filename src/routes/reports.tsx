import { createFileRoute } from "@tanstack/react-router";
import { DashboardPlaceholder } from "../components/dashboard/dashboard-placeholder";
export const Route = createFileRoute("/reports")({ component: Reports });
function Reports() {
  return (
    <DashboardPlaceholder
      title="Reports"
      description="Your verification reports will appear here."
    />
  );
}
