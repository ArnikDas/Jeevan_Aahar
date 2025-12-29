import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import DonateDashboardPage from "./pages/DonateDashboardPage";
import RequestDashboardPage from "./pages/RequestDashboardPage";
import DonatePage from "./pages/DonatePage";
import RequestsPage from "./pages/RequestsPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            <Route path="/auth" element={<AuthPage />} />


            <Route path="/" element={<Layout><LandingPage /></Layout>} />

            {/* Protected Donor Routes */}
            <Route
              path="/donate-dashboard"
              element={
                <ProtectedRoute requiredRole="donor">
                  <Layout><DonateDashboardPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/donate"
              element={
                <ProtectedRoute requiredRole="donor">
                  <Layout><DonatePage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Protected Recipient Routes */}
            <Route
              path="/request-dashboard"
              element={
                <ProtectedRoute requiredRole="recipient">
                  <Layout><RequestDashboardPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute requiredRole="recipient">
                  <Layout><RequestsPage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Route - Protected but no specific role */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout><AdminPage /></Layout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;