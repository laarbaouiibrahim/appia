import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/Sidebar";
import Deliverability from "@/pages/Deliverability";
import Campaign from "@/pages/Campaign";
import Settings from "@/pages/Settings";
import Account from "@/pages/Account";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Switch>
          <Route path="/" component={Deliverability} />
          <Route path="/deliverability" component={Deliverability} />
          <Route path="/campaign" component={Campaign} />
          <Route path="/settings" component={Settings} />
          <Route path="/account" component={Account} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
