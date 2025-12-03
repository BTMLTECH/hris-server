import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useSearchParams } from "react-router-dom";
import { CombinedProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import SetPassword from "./components/Auth/SetPassword";
import CreateComms from "./components/Report/CreateComms";
import CreateITReport from "./components/Report/CreateITReport";
import CreateOperations from "./components/Report/CreateOperations";
import CreateQuality from "./components/Report/CreateQuality";

const queryClient = new QueryClient();

const SetPasswordWithToken = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  return <SetPassword token={token || undefined} />;
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <TooltipProvider>
        <CombinedProvider>
          <Toaster />
          <Sonner />

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/set-password" element={<SetPasswordWithToken />} />

            {/* ✅ Create Report Routes */}
            <Route path="/quality/:companyId" element={<CreateQuality />} />
            <Route path="/operations/:companyId" element={<CreateOperations />} />
            <Route path="/comms/:companyId" element={<CreateComms />} />
            <Route path="/it/:companyId" element={<CreateITReport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CombinedProvider>
      </TooltipProvider>
    </PersistGate>
  </Provider>
);

export default App;
