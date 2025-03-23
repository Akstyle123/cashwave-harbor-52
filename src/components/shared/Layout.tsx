
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  ArrowRightLeft, 
  PlusCircle, 
  MinusCircle, 
  AlertTriangle, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { APP_ROUTES, BANK_NAME } from "@/config/constants";
import { Button } from "@/components/ui/button";
import ProfileButton from "./ProfileButton";
import BrandLogo from "./BrandLogo";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, path, isActive, onClick }: NavItemProps) => (
  <Button
    variant="ghost"
    className={cn(
      "w-full justify-start gap-3 pl-3 mb-1 transition-all duration-200",
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "hover:bg-secondary hover:text-primary"
    )}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
  </Button>
);

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation items
  const navItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      label: "Dashboard", 
      path: APP_ROUTES.DASHBOARD 
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      label: "Accounts", 
      path: APP_ROUTES.ACCOUNTS 
    },
    { 
      icon: <ArrowRightLeft className="h-5 w-5" />, 
      label: "Transactions", 
      path: APP_ROUTES.TRANSACTIONS 
    },
    { 
      icon: <PlusCircle className="h-5 w-5" />, 
      label: "Deposit", 
      path: APP_ROUTES.DEPOSIT 
    },
    { 
      icon: <MinusCircle className="h-5 w-5" />, 
      label: "Withdraw", 
      path: APP_ROUTES.WITHDRAW 
    },
    { 
      icon: <AlertTriangle className="h-5 w-5" />, 
      label: "Penalties", 
      path: APP_ROUTES.PENALTIES 
    },
    { 
      icon: <FileText className="h-5 w-5" />, 
      label: "Reports", 
      path: APP_ROUTES.REPORTS 
    },
    { 
      icon: <Settings className="h-5 w-5" />, 
      label: "Settings", 
      path: APP_ROUTES.SETTINGS 
    },
  ];

  // Check if user is authenticated on initial load and on route changes
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== APP_ROUTES.LOGIN) {
      navigate(APP_ROUTES.LOGIN);
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isAuthenticated && location.pathname !== APP_ROUTES.LOGIN) {
    return null; // Don't render layout if not authenticated
  }

  // Only show sidebar on authenticated routes (not login)
  const showSidebar = isAuthenticated && location.pathname !== APP_ROUTES.LOGIN;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2">
            {showSidebar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="md:hidden"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            <BrandLogo />
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <ProfileButton />
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        {showSidebar && (
          <aside className="hidden md:flex md:w-64 lg:w-72 border-r bg-background flex-col py-4 px-2">
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isActive={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                />
              ))}
            </nav>
            
            <div className="mt-auto pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 pl-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </aside>
        )}

        {/* Mobile Sidebar */}
        {showSidebar && isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-background/80 backdrop-blur-sm">
            <aside className="fixed top-16 left-0 bottom-0 w-3/4 max-w-xs border-r bg-background py-4 px-2 overflow-auto animate-slide-right">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    isActive={location.pathname === item.path}
                    onClick={() => handleNavigation(item.path)}
                  />
                ))}
              </nav>
              
              <div className="mt-auto pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 pl-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </div>
            </aside>
            <div 
              className="fixed inset-0 z-[-1]" 
              onClick={toggleMobileMenu}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
