
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/theme/theme-provider";
import { AuthProvider } from "./context/AuthContext";
import { BankProvider } from "./context/BankContext";
import { APP_ROUTES } from "./config/constants";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="bank-theme">
        <TooltipProvider>
          <ShadcnToaster />
          <Sonner position="top-right" closeButton />
          <BrowserRouter>
            <AuthProvider>
              <BankProvider>
                <Routes>
                  <Route path={APP_ROUTES.HOME} element={<Login />} />
                  <Route path={APP_ROUTES.LOGIN} element={<Login />} />
                  <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path={APP_ROUTES.NOT_FOUND} element={<NotFound />} />
                </Routes>
              </BankProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
