import { SectionHeader } from "@/components/ui/section-header";
import { RecipientDashboard } from "@/components/dashboard/RecipientDashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function RequestDashboardPage() {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SectionHeader
            title={`Welcome, ${userProfile?.name || 'Recipient'}!`}
            subtitle="View donations sent by donors and track deliveries."
          />
        </div>
        <RecipientDashboard />
      </div>
    </div>
  );
}