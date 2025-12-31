import {
  Utensils,
  CheckCircle2,
  Clock,
  Package,
  Heart,
  Users,
  MapPin,
  Calendar,
  Eye,
  Bell,
  Inbox,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDonations, DonationResponse } from "@/services/donationService";
import { format, isToday } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const statusStyles = {
  "Delivered": "bg-success/10 text-success border-success/20",
  "Matched": "bg-info/10 text-info border-info/20",
  "In Transit": "bg-accent/10 text-accent border-accent/20",
  "Pending": "bg-warning/10 text-warning border-warning/20",
  "Confirmed": "bg-primary/10 text-primary border-primary/20",
  "Available": "bg-success/10 text-success border-success/20",
};

const foodTypeEmojis: Record<string, string> = {
  cooked: "🍛",
  raw: "🥬",
  packaged: "📦",
  beverages: "🥤",
  bakery: "🍞",
  dairy: "🥛",
};

export function RecipientDashboard() {
  const { userProfile } = useAuth();

  // Fetch all donations from backend
  const { data: donationsData, isLoading, error } = useQuery({
    queryKey: ["donations"],
    queryFn: getDonations,
  });

  const allDonations = donationsData?.data || [];

  // Filter donations for today's pickups
  const todayPickups = allDonations.filter((d: DonationResponse) =>
    isToday(new Date(d.pickupDate))
  );

  // Calculate stats
  const totalDonations = allDonations.length;
  const totalMeals = allDonations.reduce((sum: number, d: DonationResponse) => sum + d.quantity, 0);
  const peopleFed = Math.floor(totalMeals / 4);
  const thisMonth = allDonations.filter((d: DonationResponse) => {
    const donationDate = new Date(d.createdAt);
    const now = new Date();
    return donationDate.getMonth() === now.getMonth() &&
      donationDate.getFullYear() === now.getFullYear();
  }).length;

  const recipientStats = [
    { label: "Meals Available", value: totalMeals.toString(), icon: Utensils, color: "success" },
    { label: "People Can Feed", value: peopleFed.toString(), icon: Users, color: "accent" },
    { label: "Total Donations", value: totalDonations.toString(), icon: Package, color: "primary" },
    { label: "This Month", value: thisMonth.toString(), icon: Heart, color: "info" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome, {userProfile?.name || 'Recipient'}! 👋</h2>
          <p className="text-muted-foreground">View donations sent by donors and track deliveries.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {recipientStats.map((stat, index) => (
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

      {/* Today's Pickups Alert */}
      {todayPickups.length > 0 && (
        <Card className="bg-gradient-to-r from-accent/5 to-warning/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-accent/10">
                <Bell className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Available for Pickup Today
                  <Badge className="bg-accent text-accent-foreground">{todayPickups.length}</Badge>
                </h3>
                <div className="mt-3 space-y-2">
                  {todayPickups.slice(0, 3).map((donation: DonationResponse) => (
                    <div key={donation._id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                      <div>
                        <p className="font-medium">{donation.name} • {donation.quantity} servings</p>
                        <p className="text-sm text-muted-foreground">
                          {donation.address.split(',')[0]}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {format(new Date(donation.pickupTime), "h:mm a")}
                        </p>
                        <Badge variant="outline" className={statusStyles["Available"]}>
                          Available
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Available Donations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Available Donations</CardTitle>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : allDonations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-secondary/50 mb-4">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No donations available</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                There are no donations available at the moment. Check back later!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {allDonations.slice(0, 10).map((donation: DonationResponse) => (
                <div
                  key={donation._id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                    {donation.picture ? (
                      <img
                        src={donation.picture}
                        alt={donation.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">
                        {foodTypeEmojis[donation.foodType] || "🍽️"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{donation.name}</p>
                      <Badge variant="outline" className={statusStyles["Available"]}>
                        Available
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {donation.quantity} servings{donation.foodType ? ` • ${donation.foodType}` : ''}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {donation.address.split(',').slice(0, 2).join(',')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(donation.pickupDate), "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(donation.pickupTime), "h:mm a")}
                    </p>
                    <Button variant="ghost" size="sm" className="h-7 px-2 mt-1">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
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
          { label: "Track Deliveries", icon: MapPin, to: "/request-dashboard", color: "info" },
          { label: "Profile", icon: User, to: "/profile", color: "accent" },
          { label: "Our Impact", icon: Heart, to: "/request-dashboard", color: "success" },
          { label: "History", icon: Clock, to: "/request-dashboard", color: "primary" },
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