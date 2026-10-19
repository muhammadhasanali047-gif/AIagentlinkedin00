import { DashboardLayout } from "@/frontend/components/layout/DashboardLayout";
import { SettingsManagement } from "@/frontend/components/settings/SettingsManagement";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings & Integrations">
      <SettingsManagement />
    </DashboardLayout>
  );
}
