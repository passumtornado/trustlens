import { createFileRoute } from "@tanstack/react-router";

import { DashboardPlaceholder } from "../components/dashboard/dashboard-placeholder";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  return (
    <DashboardPlaceholder
      title="Profile"
      description="Profile settings will appear here."
    />
  );
}
