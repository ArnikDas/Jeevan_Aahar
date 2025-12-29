import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { name: "Home", path: "/", roles: ["public"] },
  { name: "Donor Dashboard", path: "/donate-dashboard", roles: ["donor"] },
  { name: "Recipient Dashboard", path: "/request-dashboard", roles: ["recipient"] },
  { name: "Donate Food", path: "/donate", roles: ["donor"] },
  { name: "Admin", path: "/admin", roles: ["admin"] },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter navigation links based on user role
  const getVisibleLinks = () => {
    if (!user || !userProfile) {
      // Show only public links for non-authenticated users
      return navLinks.filter(link => link.roles.includes("public"));
    }

    // Show links appropriate for the user's role, but exclude Home
    return navLinks.filter(link => {
      // Hide Home link for authenticated users
      if (link.path === "/") {
        return false;
      }
      return link.roles.includes(userProfile.role) || link.roles.includes("public");
    });
  };

  const visibleLinks = getVisibleLinks();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-hero shadow-soft transition-transform group-hover:scale-105">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Jeevan <span className="text-primary">Aahar</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user && userProfile ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{userProfile.name}</span>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <Link to="/auth">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" className="gradient-hero border-0" asChild>
                  <Link to="/donate">Donate Now</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {visibleLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Auth */}
              <div className="border-t border-border mt-2 pt-4 px-4">
                {user && userProfile ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{userProfile.name}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" className="flex-1 gradient-hero border-0" asChild>
                      <Link to="/donate" onClick={() => setIsOpen(false)}>
                        Donate
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}