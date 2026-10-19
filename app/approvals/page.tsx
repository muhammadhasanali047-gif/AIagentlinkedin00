import { DashboardLayout } from "@/frontend/components/layout/DashboardLayout";
import { ApprovalsQueue } from "@/frontend/components/approvals/ApprovalsQueue";

export default function ApprovalsPage() {
  return (
    <DashboardLayout title="Human Review & Approval Queue">
      <ApprovalsQueue />
    </DashboardLayout>
  );
}
