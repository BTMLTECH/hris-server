
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useSearchParams } from "react-router-dom";
import { CombinedProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Provider } from "react-redux";
import { persistor, store} from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import SetPassword from "./components/Auth/SetPassword";

const queryClient = new QueryClient();

// ✅ TEMP: Clear persisted Redux state (e.g., old types like 'personal')
// persistor.purge().then(() => {
//   console.log("Redux Persist store purged");
// });

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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CombinedProvider>
      </TooltipProvider>
    </PersistGate>
  </Provider>
);

export default App;
