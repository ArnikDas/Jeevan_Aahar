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
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const recipientStats = [
  { label: "Meals Received", value: "2,800", icon: Utensils, color: "success" },
  { label: "People Fed", value: "450", icon: Users, color: "accent" },
  { label: "Total Donations", value: "18", icon: Package, color: "primary" },
  { label: "This Month", value: "5", icon: Heart, color: "info" },
];

const recentRequests = [
  {
    id: 1,
    food: "Cooked Meals",
    quantity: "100 meals",
    date: "Dec 21, 2024",
    status: "Matched",
    donor: "Green Valley Restaurant",
    image: "🍛",
  },
  {
    id: 2,
    food: "Groceries",
    quantity: "50 kg",
    date: "Dec 19, 2024",
    status: "Delivered",
    donor: "City Fresh Market",
    image: "🛒",
  },
  {
    id: 3,
    food: "Packaged Food",
    quantity: "200 packets",
    date: "Dec 16, 2024",
    status: "Delivered",
    donor: "ABC Caterers",
    image: "📦",
  },
  {
    id: 4,
    food: "Baby Food",
    quantity: "30 units",
    date: "Dec 14, 2024",
    status: "Delivered",
    donor: "Community Kitchen",
    image: "🍼",
  },
];

const upcomingDeliveries = [
  {
    id: 1,
    food: "Lunch Meals",
    quantity: "75 meals",
    time: "Today, 2:00 PM",
    donor: "Hotel Sunrise",
    status: "In Transit",
  },
  {
    id: 2,
    food: "Dinner Packets",
    quantity: "50 packets",
    time: "Today, 7:00 PM",
    donor: "Spice Garden",
    status: "Confirmed",
  },
];

const statusStyles = {
  "Delivered": "bg-success/10 text-success border-success/20",
  "Matched": "bg-info/10 text-info border-info/20",
  "In Transit": "bg-accent/10 text-accent border-accent/20",
  "Pending": "bg-warning/10 text-warning border-warning/20",
  "Confirmed": "bg-primary/10 text-primary border-primary/20",
};

export function RecipientDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome, Hope Foundation! 👋</h2>
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

      {/* Upcoming Deliveries Alert */}
      <Card className="bg-gradient-to-r from-accent/5 to-warning/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-accent/10">
              <Bell className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Upcoming Deliveries Today
                <Badge className="bg-accent text-accent-foreground">{upcomingDeliveries.length}</Badge>
              </h3>
              <div className="mt-3 space-y-2">
                {upcomingDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <div>
                      <p className="font-medium">{delivery.food} • {delivery.quantity}</p>
                      <p className="text-sm text-muted-foreground">From {delivery.donor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{delivery.time}</p>
                      <Badge variant="outline" className={statusStyles[delivery.status as keyof typeof statusStyles]}>
                        {delivery.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Donations Received */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Recent Donations Received</CardTitle>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="text-3xl">{request.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{request.food}</p>
                    <Badge variant="outline" className={statusStyles[request.status as keyof typeof statusStyles]}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.quantity} • From {request.donor}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{request.date}</p>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Track Deliveries", icon: MapPin, to: "/request-dashboard", color: "info" },
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