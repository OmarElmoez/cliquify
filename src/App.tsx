import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Campaigns from "./pages/Campaigns";
import Connections from "./pages/Connections";
import Audiences from "./pages/Audiences";
import CreateCampaign from "./pages/CreateCampaign";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import OAuthCallback from "@/pages/OAuthCallback";
import MetaCallback from "@/pages/MetaCallback";
import HomePage from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfServices";
import Insights from "./pages/Insights";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-services" element={<TermsOfService />} />
          <Route path="/pages" element={<AppLayout><Insights /></AppLayout>} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/dashboard" element={
            <AppLayout>
              <Campaigns />
            </AppLayout>
          } />
          <Route path="/audiences" element={
            <AppLayout>
              <Audiences />
            </AppLayout>
          } />
          <Route path="/connections" element={
            <AppLayout>
              <Connections />
            </AppLayout>
          } />
          <Route path="/campaigns/create" element={<CreateCampaign />} />
          {/* <Route path="/campaigns" element={<Navigate to="/" replace />} /> */}
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/meta/callback" element={<MetaCallback />} />
          {/* <Route path="/campaigns" element={<Navigate to="/dashboard" replace />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
