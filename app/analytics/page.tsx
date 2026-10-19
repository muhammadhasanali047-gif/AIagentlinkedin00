import { DashboardLayout } from "@/frontend/components/layout/DashboardLayout";
import { AnalyticsDashboard } from "@/frontend/components/analytics/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <DashboardLayout title="Performance & Conversion Analytics">
      <AnalyticsDashboard />
    </DashboardLayout>
  );
}
