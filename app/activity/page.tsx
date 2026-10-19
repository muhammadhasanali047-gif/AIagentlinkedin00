import { DashboardLayout } from "@/frontend/components/layout/DashboardLayout";
import { ActivityLogs } from "@/frontend/components/activity/ActivityLogs";

export default function ActivityPage() {
  return (
    <DashboardLayout title="Security & Activity Audit Trail">
      <ActivityLogs />
    </DashboardLayout>
  );
}
