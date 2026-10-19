import { DashboardLayout } from "@/frontend/components/layout/DashboardLayout";
import { FollowUpsManagement } from "@/frontend/components/followups/FollowUpsManagement";

export default function FollowUpsPage() {
  return (
    <DashboardLayout title="Follow-Up Schedule & Cadence">
      <FollowUpsManagement />
    </DashboardLayout>
  );
}
