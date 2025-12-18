import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import MolecularSimulation from "@/pages/molecular-simulation";
import QuantumResources from "@/pages/quantum-resources";
import FertilizerEfficiency from "@/pages/fertilizer-efficiency";
import AlgorithmExecution from "@/pages/algorithm-execution";
import DecisionSupport from "@/pages/decision-support";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MolecularSimulation} />
      <Route path="/resources" component={QuantumResources} />
      <Route path="/efficiency" component={FertilizerEfficiency} />
      <Route path="/execution" component={AlgorithmExecution} />
      <Route path="/decisions" component={DecisionSupport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function DashboardLayout() {
  const sidebarStyle = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <ScrollArea className="flex-1">
            <main className="p-6">
              <Router />
            </main>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <DashboardLayout />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
