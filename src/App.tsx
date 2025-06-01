
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
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
          <Route path="/campaigns" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
