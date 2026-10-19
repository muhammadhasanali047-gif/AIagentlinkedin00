import { DashboardLayout } from "@/frontend/components/layout/DashboardLayout";
import { DashboardOverview } from "@/frontend/components/dashboard/DashboardOverview";

export default function HomePage() {
  return (
    <DashboardLayout title="Overview & Command Center">
      <DashboardOverview />
    </DashboardLayout>
  );
}
