import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ParkingProvider } from "./context/ParkingContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ParkingMap from "./components/ParkingMap";
import AllocateSlot from "./pages/AllocateSlot";
import EntryPage from "./pages/EntryPage";
import PaymentPortal from "./pages/PaymentPortal";
import FindMyCar from "./pages/FindMyCar";
import ThankYou from "./pages/ThankYou";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ParkingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EntryPage/>} /> 
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/ParkingMap" element={<ParkingMap occupied={[]} /> } />
            <Route path="/EntryPage" element={<EntryPage />} />
            <Route path="/AllocateSlot" element={<AllocateSlot />} />
            <Route path="/PaymentPortal" element={<PaymentPortal />} />
            <Route path="/FindMyCar" element={<FindMyCar />} />
            <Route path="/ThankYou" element={<ThankYou />} />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ParkingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
