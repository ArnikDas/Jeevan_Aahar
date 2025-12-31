import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DonationResponse } from "@/services/donationService";
import { format } from "date-fns";
import {
    MapPin,
    Clock,
    Calendar,
    Phone,
    Mail,
    Package,
    Utensils,
    User,
    Navigation,
    FileText,
    Image as ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PopulatedDonor } from "@/services/donationService";

interface DonationDetailsDialogProps {
    donation: DonationResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const foodTypeEmojis: Record<string, string> = {
    cooked: "🍛",
    raw: "🥬",
    packaged: "📦",
    beverages: "🥤",
    bakery: "🍞",
    dairy: "🥛",
};

const foodTypeLabels: Record<string, string> = {
    cooked: "Cooked Food",
    raw: "Raw Ingredients",
    packaged: "Packaged Items",
    beverages: "Beverages",
    bakery: "Bakery Items",
    dairy: "Dairy Products",
};

export function DonationDetailsDialog({
    donation,
    open,
    onOpenChange,
}: DonationDetailsDialogProps) {
    if (!donation) return null;

    // Check if donor is populated (object) or just an ID (string)
    const donorProfile = typeof donation.donor === 'object' ? donation.donor as PopulatedDonor : null;

    console.log("DonationDetailsDialog - donation.donor:", donation.donor);
    console.log("DonationDetailsDialog - donorProfile:", donorProfile);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <span className="text-3xl">
                            {foodTypeEmojis[donation.foodType] || "🍽️"}
                        </span>
                        {donation.name}
                    </DialogTitle>
                    <DialogDescription>
                        Complete donation details and donor information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Donor Profile Section */}
                    {donation.donor && (
                        <>
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Donor Profile
                                </h3>
                                {donorProfile ? (
                                    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary flex items-center justify-center flex-shrink-0">
                                                {donorProfile.avatar ? (
                                                    <img
                                                        src={donorProfile.avatar}
                                                        alt={donorProfile.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="h-8 w-8 text-muted-foreground" />
                                                )}
                                            </div>
                                            {/* Donor Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-lg">{donorProfile.name}</h4>
                                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 capitalize">
                                                        {donorProfile.role}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    {donorProfile.phone && (
                                                        <p className="text-muted-foreground flex items-center gap-2">
                                                            <Phone className="h-3 w-3" />
                                                            <a href={`tel:${donorProfile.phone}`} className="text-primary hover:underline">
                                                                {donorProfile.phone}
                                                            </a>
                                                        </p>
                                                    )}
                                                    {donorProfile.address && (
                                                        <p className="text-muted-foreground flex items-start gap-2">
                                                            <MapPin className="h-3 w-3 mt-0.5" />
                                                            <span className="text-xs">{donorProfile.address}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                                        <p className="text-sm text-muted-foreground text-center">
                                            Donor profile not available
                                        </p>
                                    </div>
                                )}
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Food Image */}
                    {donation.picture && (
                        <div className="w-full rounded-lg overflow-hidden border border-border">
                            <img
                                src={donation.picture}
                                alt={donation.name}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    )}

                    {/* Food Details Section */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Utensils className="h-5 w-5 text-primary" />
                            Food Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-secondary/30 rounded-lg p-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Food Type</p>
                                <p className="font-medium capitalize">
                                    {foodTypeLabels[donation.foodType] || donation.foodType}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Quantity</p>
                                <p className="font-medium">{donation.quantity} servings</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <p className="text-xs text-muted-foreground">Food Name</p>
                                <p className="font-medium">{donation.name}</p>
                            </div>
                            {donation.additionalNote && (
                                <div className="space-y-1 col-span-2">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        Additional Notes
                                    </p>
                                    <p className="text-sm">{donation.additionalNote}</p>
                                </div>
                            )}
                            <div className="space-y-1 col-span-2">
                                <p className="text-xs text-muted-foreground">Prepared At</p>
                                <p className="text-sm">
                                    {format(new Date(donation.preparedAt), "PPpp")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Pickup Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-accent" />
                            Pickup Information
                        </h3>
                        <div className="space-y-3 bg-secondary/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Pickup Date</p>
                                    <p className="font-medium">
                                        {format(new Date(donation.pickupDate), "EEEE, MMMM dd, yyyy")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Pickup Time</p>
                                    <p className="font-medium">
                                        {format(new Date(donation.pickupTime), "h:mm a")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Location Details */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-success" />
                            Location Details
                        </h3>
                        <div className="space-y-3 bg-secondary/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Address</p>
                                    <p className="text-sm">{donation.address}</p>
                                </div>
                            </div>
                            {donation.landmark && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Landmark</p>
                                        <p className="text-sm">{donation.landmark}</p>
                                    </div>
                                </div>
                            )}
                            {donation.latitude !== undefined && donation.longitude !== undefined && (
                                <div className="flex items-start gap-3">
                                    <Navigation className="h-4 w-4 text-muted-foreground mt-1" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Coordinates</p>
                                        <p className="text-sm font-mono">
                                            📍 {donation.latitude.toFixed(6)}, {donation.longitude.toFixed(6)}
                                        </p>
                                        <a
                                            href={`https://www.google.com/maps?q=${donation.latitude},${donation.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline mt-1 inline-block"
                                        >
                                            Open in Google Maps →
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Contact Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="h-5 w-5 text-info" />
                            Contact Information
                        </h3>
                        <div className="space-y-3 bg-secondary/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Phone Number</p>
                                    <a
                                        href={`tel:${donation.phone}`}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {donation.phone}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <a
                                        href={`mailto:${donation.email}`}
                                        className="text-sm text-primary hover:underline break-all"
                                    >
                                        {donation.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                                Submitted: {format(new Date(donation.createdAt), "PPp")}
                            </span>
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                Available
                            </Badge>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
