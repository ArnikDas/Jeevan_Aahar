import { SectionHeader } from "@/components/ui/section-header";
import { DonorDashboard } from "@/components/dashboard/DonorDashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function DonateDashboardPage() {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SectionHeader
            title={`Welcome, ${userProfile?.name || 'Donor'}!`}
            subtitle="Track your donations and see the impact you're making."
          />
        </div>
        <DonorDashboard />
      </div>
    </div>
  );
}