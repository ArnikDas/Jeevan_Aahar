import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Home, Navigation, User, Camera, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/services/userService";

export default function ProfilePage() {
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

    // Load existing profile data
    useEffect(() => {
        if (userProfile) {
            setFormData({
                phone: userProfile.phone || "",
                address: userProfile.address || "",
                landmark: userProfile.landmark || "",
                latitude: userProfile.latitude,
                longitude: userProfile.longitude,
                avatar: userProfile.avatar || "",
            });
        }
    }, [userProfile]);

    const handleGetLocation = () => {
        setIsGettingLocation(true);

        if (!navigator.geolocation) {
            toast({
                title: "Geolocation not supported",
                description: "Your browser doesn't support geolocation.",
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
                    description: "Your location has been successfully updated.",
                });
                setIsGettingLocation(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast({
                    title: "Location access denied",
                    description: "Please enable location access.",
                    variant: "destructive",
                });
                setIsGettingLocation(false);
            }
        );
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please select an image smaller than 2MB.",
                variant: "destructive",
            });
            return;
        }

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
                description: "Please fill in all required fields.",
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

            await refreshUserProfile();

            toast({
                title: "Profile updated! ✅",
                description: "Your profile has been successfully updated.",
            });

            // Navigate back to dashboard
            const redirectPath = userProfile?.role === "donor" ? "/donate-dashboard" : "/request-dashboard";
            navigate(redirectPath);
        } catch (error: any) {
            toast({
                title: "Update failed",
                description: error.message || "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        const redirectPath = userProfile?.role === "donor" ? "/donate-dashboard" : "/request-dashboard";
        navigate(redirectPath);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background p-4">
            <div className="max-w-2xl mx-auto py-8">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>

                <Card className="border-border shadow-card">
                    <CardHeader>
                        <CardTitle className="text-2xl">Edit Profile</CardTitle>
                        <CardDescription>
                            Update your profile information
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
                            </div>

                            {/* Read-Only Account Information */}
                            <div className="bg-secondary/30 rounded-lg p-4 space-y-3 border border-border">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Account Information (Read-Only)</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Full Name</Label>
                                        <p className="text-sm font-medium">{userProfile?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Email</Label>
                                        <p className="text-sm font-medium">{userProfile?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">User ID</Label>
                                        <p className="text-sm font-medium font-mono text-xs">{userProfile?.uid || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Role</Label>
                                        <p className="text-sm font-medium capitalize">{userProfile?.role || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Editable Fields Section */}
                            <div className="pt-2">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Editable Information</h3>
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
                                <Label>Location</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleGetLocation}
                                        disabled={isGettingLocation}
                                    >
                                        <Navigation className="mr-2 h-4 w-4" />
                                        {isGettingLocation ? "Getting location..." : "Update Location"}
                                    </Button>
                                </div>
                                {formData.latitude !== undefined && formData.longitude !== undefined && (
                                    <p className="text-xs text-muted-foreground">
                                        📍 {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleBack}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 gradient-hero border-0" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                    <Save className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
