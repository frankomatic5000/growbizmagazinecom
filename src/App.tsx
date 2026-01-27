import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/hooks/useAuth";

// News portal pages
import NewsHome from "./pages/NewsHome";
import NewsArticle from "./pages/NewsArticle";
import NewsCategory from "./pages/NewsCategory";
import NewsSearch from "./pages/NewsSearch";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArticleEditor from "./pages/admin/AdminArticleEditor";

// Other pages
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public news portal routes */}
            <Route path="/" element={<NewsHome />} />
            <Route path="/article/:id" element={<NewsArticle />} />
            <Route path="/category/:category" element={<NewsCategory />} />
            <Route path="/search" element={<NewsSearch />} />
            
            {/* Static pages */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutUs />} />
            
            {/* Hidden Admin routes - secure path */}
            <Route path="/secure-content-editor-2026/login" element={<AdminLogin />} />
            <Route path="/secure-content-editor-2026" element={<AdminDashboard />} />
            <Route path="/secure-content-editor-2026/novo" element={<AdminArticleEditor />} />
            <Route path="/secure-content-editor-2026/editar/:id" element={<AdminArticleEditor />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
