import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "donor" | "recipient";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { user, userProfile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (requiredRole && userProfile?.role !== requiredRole) {
        // Redirect to appropriate dashboard if user has wrong role
        const redirectPath = userProfile?.role === "donor" ? "/donate-dashboard" : "/request-dashboard";
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
}
