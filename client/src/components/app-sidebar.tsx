import { useLocation, Link } from "wouter";
import { Atom, Cpu, BarChart3, Play, FileText, Activity } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Molecular Simulation",
    url: "/",
    icon: Atom,
    description: "NH3 structure & Hamiltonian",
  },
  {
    title: "Quantum Resources",
    url: "/resources",
    icon: Cpu,
    description: "Azure backend & metrics",
  },
  {
    title: "Fertilizer Efficiency",
    url: "/efficiency",
    icon: BarChart3,
    description: "Catalysis & comparison",
  },
  {
    title: "Algorithm Execution",
    url: "/execution",
    icon: Play,
    description: "VQE configuration & run",
  },
  {
    title: "R&D Decision Support",
    url: "/decisions",
    icon: FileText,
    description: "Analysis & export",
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Atom className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold" data-testid="text-logo">Qunova</h1>
            <p className="text-xs text-muted-foreground">Quantum Research</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
            Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-auto py-3"
                    >
                      <Link href={item.url} data-testid={`link-nav-${item.url.replace("/", "") || "molecular"}`}>
                        <item.icon className="h-4 w-4" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-status-online" />
          <span className="text-muted-foreground">System Status:</span>
          <Badge variant="secondary" className="text-xs" data-testid="badge-system-status">
            Online
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
