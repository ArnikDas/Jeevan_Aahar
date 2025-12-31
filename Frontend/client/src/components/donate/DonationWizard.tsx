import { useState, useRef } from "react";
import { Check, ChevronLeft, ChevronRight, MapPin, Clock, Package, Utensils, User, Phone, Send, CheckCircle2, Camera, X, Image, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createDonation, convertImageToBase64 } from "@/services/donationService";
import { useQueryClient } from "@tanstack/react-query";

const steps = [
  { id: 1, title: "Food Type", icon: Utensils },
  { id: 2, title: "Details", icon: Package },
  { id: 3, title: "Pickup", icon: MapPin },
  { id: 4, title: "Contact", icon: User },
];

const foodTypes = [
  { id: "cooked", label: "Cooked Food", icon: "🍛", description: "Ready-to-eat meals" },
  { id: "raw", label: "Raw Ingredients", icon: "🥬", description: "Fresh vegetables, grains" },
  { id: "packaged", label: "Packaged Items", icon: "📦", description: "Sealed food products" },
  { id: "beverages", label: "Beverages", icon: "🥤", description: "Drinks & refreshments" },
  { id: "bakery", label: "Bakery Items", icon: "🍞", description: "Bread, cakes, pastries" },
  { id: "dairy", label: "Dairy Products", icon: "🥛", description: "Milk, cheese, yogurt" },
];

interface FormData {
  foodType: string;
  name: string;
  quantity: string;
  address: string;
  landmark: string;
  pickupDate: string;
  pickupTime: string;
  contactName: string;
  phone: string;
  email: string;
  additionalNote: string;
  latitude: number | undefined;
  longitude: number | undefined;
}

export function DonationWizard() {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    foodType: "",
    name: "",
    quantity: "",
    address: "",
    landmark: "",
    pickupDate: "",
    pickupTime: "",
    contactName: "",
    phone: "",
    email: "",
    additionalNote: "",
    latitude: undefined,
    longitude: undefined,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

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
          description: "Please enable location access in your browser.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      }
    );
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    console.debug("DonationWizard: handleSubmit invoked", { formData, images });

    try {
      // Validate required fields
      if (!formData.name || !formData.quantity || !formData.address || !formData.phone || !formData.pickupDate || !formData.pickupTime) {
        toast({
          title: "Missing Required Fields",
          description: "Please fill in all required fields before submitting.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Validate that at least one image is uploaded
      if (images.length === 0) {
        toast({
          title: "Image Required",
          description: "Please upload at least one photo of the food.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Combine date and time for pickup
      const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);

      // Prepare donation data
      const donationData = {
        name: formData.name,
        quantity: parseFloat(formData.quantity) || 0,
        foodType: formData.foodType,
        email: formData.email || userProfile?.email || "",
        phone: formData.phone,
        address: formData.address,
        preparedAt: new Date(), // Use current date/time as prepared time
        picture: images[0], // Use first image as primary picture
        additionalNote: formData.additionalNote,
        landmark: formData.landmark,
        pickupTime: pickupDateTime,
        pickupDate: new Date(formData.pickupDate),
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      // Submit to backend
      console.debug("DonationWizard: calling createDonation");
      await createDonation(donationData);
      console.debug("DonationWizard: createDonation resolved");

      // Invalidate donations query to refresh dashboards
      queryClient.invalidateQueries({ queryKey: ["donations"] });

      setIsSubmitted(true);
      toast({
        title: "Donation Submitted! 🎉",
        description: "Thank you for your generosity. We'll contact you shortly for pickup.",
      });
    } catch (error: any) {
      console.error("Error submitting donation:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-6 animate-scale-in max-w-md">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-success/10 mx-auto">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <h2 className="text-3xl font-bold">Thank You! 🫶</h2>
          <p className="text-muted-foreground">
            Your donation has been submitted successfully. Our team will contact you
            within 30 minutes to arrange pickup.
          </p>
          <div className="bg-secondary/50 rounded-xl p-4 text-left">
            <h4 className="font-semibold mb-2">Donation Summary</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Food:</span> {formData.name}</p>
              <p><span className="font-medium text-foreground">Quantity:</span> {formData.quantity}</p>
              <p><span className="font-medium text-foreground">Location:</span> {formData.address}</p>
            </div>
          </div>
          <Button onClick={() => { setIsSubmitted(false); setCurrentStep(1); setImages([]); setFormData({ foodType: "", name: "", quantity: "", address: "", landmark: "", pickupDate: "", pickupTime: "", contactName: "", phone: "", email: "", additionalNote: "", latitude: undefined, longitude: undefined }); }} className="gradient-hero border-0">
            Donate More Food
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${currentStep > step.id
                  ? "bg-primary border-primary"
                  : currentStep === step.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background"
                  }`}>
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <step.icon className={`h-5 w-5 ${currentStep === step.id ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-0.5 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-border"}`} style={{ width: "60px" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-border shadow-soft">
        <CardContent className="p-6 md:p-8">
          {/* Step 1: Food Type */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-semibold mb-2">What type of food are you donating?</h3>
                <p className="text-muted-foreground">Select the category that best describes your donation.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {foodTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => updateFormData("foodType", type.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${formData.foodType === type.id
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border hover:border-primary/50"
                      }`}
                  >
                    <span className="text-3xl block mb-2">{type.icon}</span>
                    <span className="font-medium block">{type.label}</span>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Food Details */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-semibold mb-2">Tell us about the food</h3>
                <p className="text-muted-foreground">Provide details to help us match your donation with recipients.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Food Name / Description *</Label>
                  <div className="relative">
                    <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="e.g., Vegetable Biryani"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="quantity"
                      placeholder="e.g., 10 kg or 50 packets"
                      className="pl-10"
                      value={formData.quantity}
                      onChange={(e) => updateFormData("quantity", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalNote">Additional Notes</Label>
                <Textarea
                  id="additionalNote"
                  placeholder="Any dietary information, allergens, or special instructions..."
                  className="min-h-[80px]"
                  value={formData.additionalNote}
                  onChange={(e) => updateFormData("additionalNote", e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Food Images *</Label>
                <p className="text-xs text-muted-foreground mb-2">Upload photos of the food to help recipients</p>
                <div className="flex flex-wrap gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                      <img src={img} alt={`Food ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 transition-colors"
                  >
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pickup Location */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-semibold mb-2">Pickup Location</h3>
                <p className="text-muted-foreground">Where should our volunteer pick up the food?</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      placeholder="Enter complete address including building name, street, area..."
                      className="pl-10 min-h-[100px]"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark">Nearby Landmark</Label>
                  <Input
                    id="landmark"
                    placeholder="e.g., Near City Mall, Opposite Metro Station"
                    value={formData.landmark}
                    onChange={(e) => updateFormData("landmark", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Preferred Pickup Date *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pickupDate"
                      type="date"
                      className="pl-10"
                      value={formData.pickupDate}
                      onChange={(e) => updateFormData("pickupDate", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupTime">Preferred Pickup Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pickupTime"
                      type="time"
                      className="pl-10"
                      value={formData.pickupTime}
                      onChange={(e) => updateFormData("pickupTime", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location Coordinates</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Capture your current location to help volunteers find you easily
                  </p>
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
                      📍 {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact Details */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                <p className="text-muted-foreground">How can our volunteer reach you for pickup?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Your Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactName"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={formData.contactName}
                      onChange={(e) => updateFormData("contactName", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-secondary/50 rounded-xl p-4 mt-6">
                <h4 className="font-semibold mb-3">Donation Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Food Type:</span>
                    <p className="font-medium capitalize">{formData.foodType || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Food:</span>
                    <p className="font-medium">{formData.name || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <p className="font-medium">{formData.quantity || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pickup:</span>
                    <p className="font-medium truncate">{formData.address?.split(",")[0] || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                className="gap-2 gradient-hero border-0"
                disabled={currentStep === 1 && !formData.foodType}
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="gap-2 gradient-hero border-0"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
                {isLoading ? "Submitting..." : "Submit Donation"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div >
  );
}