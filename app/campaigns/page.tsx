import { DashboardLayout } from "@/frontend/components/layout/DashboardLayout";
import { CampaignsManagement } from "@/frontend/components/campaigns/CampaignsManagement";

export default function CampaignsPage() {
  return (
    <DashboardLayout title="Campaigns & Sequence Automation">
      <CampaignsManagement />
    </DashboardLayout>
  );
}
