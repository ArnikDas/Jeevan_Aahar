import {
  Utensils,
  CheckCircle2,
  Clock,
  Package,
  Heart,
  TrendingUp,
  MapPin,
  Calendar,
  Eye,
  Inbox,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getDonations, DonationResponse } from "@/services/donationService";
import { format } from "date-fns";

const statusStyles = {
  "Delivered": "bg-success/10 text-success border-success/20",
  "In Transit": "bg-accent/10 text-accent border-accent/20",
  "Pending": "bg-warning/10 text-warning border-warning/20",
};

export function DonorDashboard() {
  const { userProfile } = useAuth();


  // Fetch donations from backend
  const { data: donationsData, isLoading, error } = useQuery({
    queryKey: ["donations"],
    queryFn: getDonations,
    enabled: !!userProfile, // Only fetch when user is authenticated
  });

  // Debug logging
  console.log("User Profile:", userProfile);
  console.log("All Donations Data:", donationsData);

  // Filter donations by current user's email
  const userDonations = donationsData?.data?.filter(
    (donation: DonationResponse) => {
      console.log("Checking donation email:", donation.email, "vs user email:", userProfile?.email);
      return donation.email === userProfile?.email;
    }
  ) || [];

  console.log("Filtered User Donations:", userDonations);

  // Calculate stats
  const totalDonations = userDonations.length;
  const totalMeals = userDonations.reduce((sum: number, d: DonationResponse) => sum + d.quantity, 0);
  const thisMonth = userDonations.filter((d: DonationResponse) => {
    const donationDate = new Date(d.createdAt);
    const now = new Date();
    return donationDate.getMonth() === now.getMonth() &&
      donationDate.getFullYear() === now.getFullYear();
  }).length;

  const donorStats = [
    { label: "Total Donations", value: totalDonations.toString(), icon: Package, color: "primary" },
    { label: "Meals Shared", value: totalMeals.toString(), icon: Utensils, color: "success" },
    { label: "Families Fed", value: Math.floor(totalMeals / 4).toString(), icon: Heart, color: "accent" },
    { label: "This Month", value: thisMonth.toString(), icon: Calendar, color: "info" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {userProfile?.name || 'Donor'}! 👋</h2>
          <p className="text-muted-foreground">Thank you for making a difference in your community.</p>
        </div>
        <Button className="gradient-hero border-0" asChild>
          <Link to="/donate">
            <Package className="mr-2 h-4 w-4" />
            New Donation
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {donorStats.map((stat, index) => (
          <Card key={stat.label} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-${stat.color}/10`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Impact Summary */}
      {totalDonations > 0 ? (
        <Card className="bg-gradient-to-r from-primary/5 to-success/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Amazing Impact! 🎉</h3>
                <p className="text-muted-foreground text-sm">
                  You've donated {totalMeals} meals and helped approximately {Math.floor(totalMeals / 4)} families. Keep up the great work!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-primary/5 to-success/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Start Making an Impact! 🌱</h3>
                <p className="text-muted-foreground text-sm">
                  Make your first donation to help those in need. Every meal matters!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Donations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : userDonations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-secondary/50 mb-4">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No donations yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                You haven't made any donations yet. Start sharing your surplus food to make a difference!
              </p>
              <Button className="gradient-hero border-0" asChild>
                <Link to="/donate">
                  <Package className="mr-2 h-4 w-4" />
                  Make Your First Donation
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {userDonations.slice(0, 5).map((donation: DonationResponse) => (
                <div
                  key={donation._id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary">
                    <img
                      src={donation.picture}
                      alt={donation.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{donation.name}</p>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        Submitted
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {donation.quantity} servings{donation.foodType ? ` • ${donation.foodType}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(donation.createdAt), "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(donation.pickupDate), "MMM dd")} pickup
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Donate Food", icon: Package, to: "/donate", color: "primary" },
          { label: "Profile", icon: User, to: "/profile", color: "info" },
          { label: "View Impact", icon: TrendingUp, to: "/donate-dashboard", color: "success" },
          { label: "History", icon: Clock, to: "/donate-dashboard", color: "accent" },
        ].map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-${action.color}/50 hover:shadow-soft transition-all`}
          >
            <action.icon className={`h-6 w-6 text-${action.color}`} />
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}