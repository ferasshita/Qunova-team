import { useLocation } from "wouter";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, Bell } from "lucide-react";

const moduleNames: Record<string, string> = {
  "/": "Molecular Simulation",
  "/resources": "Quantum Resources",
  "/efficiency": "Fertilizer Efficiency",
  "/execution": "Algorithm Execution",
  "/decisions": "R&D Decision Support",
};

export function TopBar() {
  const [location] = useLocation();
  const currentModule = moduleNames[location] || "Dashboard";

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b px-4 bg-background">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold" data-testid="text-page-title">
            Quantum NH₃ Research Platform
          </h2>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground" data-testid="text-current-module">
            {currentModule}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono text-xs" data-testid="badge-backend">
          Azure Quantum Elements
        </Badge>
        <Button variant="ghost" size="icon" data-testid="button-notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" data-testid="button-help">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
