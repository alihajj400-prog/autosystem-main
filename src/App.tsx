import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PublicLayout } from "@/components/layout/PublicLayout";
import HomePage from "./pages/HomePage";
import InventoryPage from "./pages/InventoryPage";
import CarDetailPage from "./pages/CarDetailPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import PartsPage from "./pages/PartsPage";
import PartDetailPage from "./pages/PartDetailPage";
import AuthPage from "./pages/AuthPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCarsPage from "./pages/admin/AdminCarsPage";
import CarFormPage from "./pages/admin/CarFormPage";
import AdminRequestsPage from "./pages/admin/AdminRequestsPage";
import AdminPartsPage from "./pages/admin/AdminPartsPage";
import PartFormPage from "./pages/admin/PartFormPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Analytics />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/inventory/:id" element={<CarDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/parts" element={<PartsPage />} />
              <Route path="/parts/:id" element={<PartDetailPage />} />
            </Route>
            
            {/* Auth Route */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="cars" element={<AdminCarsPage />} />
              <Route path="cars/new" element={<CarFormPage />} />
              <Route path="cars/:id" element={<CarFormPage />} />
              <Route path="requests" element={<AdminRequestsPage />} />
              <Route path="parts" element={<AdminPartsPage />} />
              <Route path="parts/new" element={<PartFormPage />} />
              <Route path="parts/:id" element={<PartFormPage />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
