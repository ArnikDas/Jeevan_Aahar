import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Home, Navigation, User, Camera, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/services/userService";

export default function ProfileCompletionPage() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { user, userProfile, refreshUserProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const [formData, setFormData] = useState({
        phone: "",
        address: "",
        landmark: "",
        latitude: undefined as number | undefined,
        longitude: undefined as number | undefined,
        avatar: "",
    });

    // Redirect if profile already completed
    useEffect(() => {
        if (userProfile?.isCompleted) {
            const redirectPath = userProfile.role === "donor" ? "/donate-dashboard" : "/request-dashboard";
            navigate(redirectPath, { replace: true });
        }
    }, [userProfile, navigate]);

    const handleGetLocation = () => {
        setIsGettingLocation(true);

        if (!navigator.geolocation) {
            toast({
                title: "Geolocation not supported",
                description: "Your browser doesn't support geolocation. Please enter your address manually.",
                variant: "destructive",
            });
            setIsGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }));
                toast({
                    title: "Location captured! 📍",
                    description: "Your location has been successfully captured.",
                });
                setIsGettingLocation(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast({
                    title: "Location access denied",
                    description: "Please enable location access or enter your address manually.",
                    variant: "destructive",
                });
                setIsGettingLocation(false);
            }
        );
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please select an image smaller than 2MB.",
                variant: "destructive",
            });
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                avatar: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.phone || !formData.address) {
            toast({
                title: "Missing required fields",
                description: "Please fill in phone and address.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            await updateUserProfile({
                phone: formData.phone,
                address: formData.address,
                landmark: formData.landmark || undefined,
                latitude: formData.latitude,
                longitude: formData.longitude,
                avatar: formData.avatar || undefined,
            });

            // Refresh user profile in context
            await refreshUserProfile();

            toast({
                title: "Profile completed! 🎉",
                description: "Your profile has been successfully set up.",
            });

            // Redirect to appropriate dashboard
            const redirectPath = userProfile?.role === "donor" ? "/donate-dashboard" : "/request-dashboard";
            navigate(redirectPath, { replace: true });
        } catch (error: any) {
            toast({
                title: "Profile update failed",
                description: error.message || "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <Card className="border-border shadow-card">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
                        <CardDescription>
                            We need a few more details to set up your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                                        {formData.avatar ? (
                                            <img src={formData.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-12 w-12 text-muted-foreground" />
                                        )}
                                    </div>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </label>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Upload a profile picture (optional)</p>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Phone Number <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        className="pl-10"
                                        value={formData.phone}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address">
                                    Full Address <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Textarea
                                        id="address"
                                        placeholder="Street, City, State, ZIP"
                                        className="pl-10 min-h-[80px]"
                                        value={formData.address}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Landmark */}
                            <div className="space-y-2">
                                <Label htmlFor="landmark">Landmark (Optional)</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="landmark"
                                        type="text"
                                        placeholder="Near XYZ Mall"
                                        className="pl-10"
                                        value={formData.landmark}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, landmark: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label>
                                    Location (Optional)
                                </Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleGetLocation}
                                        disabled={isGettingLocation}
                                    >
                                        <Navigation className="mr-2 h-4 w-4" />
                                        {isGettingLocation ? "Getting location..." : "Capture Location"}
                                    </Button>
                                </div>
                                {formData.latitude !== undefined && formData.longitude !== undefined && (
                                    <p className="text-xs text-muted-foreground">
                                        📍 Location captured: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" className="w-full gradient-hero border-0" disabled={isLoading}>
                                {isLoading ? "Completing profile..." : "Complete Profile"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
