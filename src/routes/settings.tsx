import { createFileRoute } from "@tanstack/react-router";

import { DashboardPlaceholder } from "../components/dashboard/dashboard-placeholder";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  return (
    <DashboardPlaceholder
      title="Settings"
      description="Workspace settings will appear here."
    />
  );
}
