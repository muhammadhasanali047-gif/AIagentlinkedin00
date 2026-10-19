import { DashboardLayout } from "@/frontend/components/layout/DashboardLayout";
import { InboxManagement } from "@/frontend/components/inbox/InboxManagement";

export default function InboxPage() {
  return (
    <DashboardLayout title="Inbox & Reply Intelligence">
      <InboxManagement />
    </DashboardLayout>
  );
}
