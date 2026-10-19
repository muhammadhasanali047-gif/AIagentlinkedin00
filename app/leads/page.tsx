import { DashboardLayout } from "@/frontend/components/layout/DashboardLayout";
import { LeadsManagement } from "@/frontend/components/leads/LeadsManagement";

export default function LeadsPage() {
  return (
    <DashboardLayout title="Leads & Prospects Management">
      <LeadsManagement />
    </DashboardLayout>
  );
}
