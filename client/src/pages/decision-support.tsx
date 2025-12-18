import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, TrendingDown, Cpu, DollarSign, Lightbulb, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { DecisionSupportData, ApiResponse } from "@shared/schema";

function PriorityIcon({ priority }: { priority: string }) {
  switch (priority) {
    case "high":
      return <AlertTriangle className="h-4 w-4 text-status-busy" />;
    case "medium":
      return <Info className="h-4 w-4 text-status-away" />;
    case "low":
      return <CheckCircle2 className="h-4 w-4 text-status-online" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
}

function SummaryCard({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  change,
  color,
  testId 
}: { 
  label: string; 
  value: number; 
  unit: string;
  icon: React.ElementType;
  change?: number;
  color: string;
  testId: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className={`rounded-md p-2 ${color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
            </div>
            <p className="mt-3 font-mono text-2xl font-bold" data-testid={testId}>
              {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
            </p>
          </div>
          {change !== undefined && (
            <Badge 
              variant={change > 0 ? "default" : "secondary"}
              className={change > 0 ? "bg-status-online/10 text-status-online" : ""}
            >
              {change > 0 ? "+" : ""}{change.toFixed(1)}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DecisionSupport() {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");

  const { data: response, isLoading, error } = useQuery<ApiResponse<DecisionSupportData>>({
    queryKey: ["/api/decision-support"],
  });

  const notesMutation = useMutation({
    mutationFn: async (notesText: string) => {
      return apiRequest("POST", "/api/decision-support/notes", { notes: notesText });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/decision-support"] });
      toast({
        title: "Notes Saved",
        description: "Your research notes have been saved.",
      });
    },
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !response?.success) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Failed to load decision support data</p>
      </div>
    );
  }

  const data = response.data;
  const totalCost = data.costProxyTable.reduce((sum, item) => sum + item.totalCost, 0);

  const handleExportCSV = () => {
    const headers = ["Metric", "Value", "Unit"];
    const rows = [
      ["Energy Reduction", data.energyReductionSummary.value, data.energyReductionSummary.unit],
      ...data.resourceUsageSummary.map(r => [r.label, r.value, r.unit]),
      ["Total Cost", totalCost.toFixed(2), "USD"],
      ...data.costProxyTable.map(c => [c.resource, c.totalCost.toFixed(2), "USD"]),
    ];
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qunova-nh3-results-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Results have been exported to CSV.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Energy Reduction"
          value={data.energyReductionSummary.value}
          unit={data.energyReductionSummary.unit}
          icon={TrendingDown}
          change={data.energyReductionSummary.change}
          color="bg-chart-1"
          testId="metric-energy-reduction"
        />
        {data.resourceUsageSummary.slice(0, 3).map((resource, index) => (
          <SummaryCard
            key={index}
            label={resource.label}
            value={resource.value}
            unit={resource.unit}
            icon={index === 0 ? Cpu : index === 1 ? FileText : DollarSign}
            change={resource.change !== 0 ? resource.change : undefined}
            color={index === 0 ? "bg-chart-2" : index === 1 ? "bg-chart-3" : "bg-chart-4"}
            testId={`metric-resource-${index}`}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4" />
              Cost Proxy Table
            </CardTitle>
            <Badge variant="outline" className="font-mono" data-testid="badge-total-cost">
              Total: ${totalCost.toFixed(2)}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase">Resource</TableHead>
                  <TableHead className="text-right text-xs uppercase font-mono">Quantity</TableHead>
                  <TableHead className="text-right text-xs uppercase font-mono">Unit Cost</TableHead>
                  <TableHead className="text-right text-xs uppercase font-mono">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.costProxyTable.map((item, index) => (
                  <TableRow key={index} data-testid={`row-cost-${index}`}>
                    <TableCell className="font-medium">{item.resource}</TableCell>
                    <TableCell className="text-right font-mono">{item.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">${item.unitCost.toFixed(3)}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">${item.totalCost.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="font-semibold">Total Estimated Cost</TableCell>
                  <TableCell className="text-right font-mono font-bold text-chart-1">${totalCost.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[280px]">
              <div className="space-y-3 p-4">
                {data.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="rounded-md border p-4"
                    data-testid={`recommendation-${rec.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <PriorityIcon priority={rec.priority} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{rec.title}</p>
                          <Badge
                            variant="outline"
                            className={`capitalize text-xs ${
                              rec.priority === "high"
                                ? "border-status-busy text-status-busy"
                                : rec.priority === "medium"
                                ? "border-status-away text-status-away"
                                : "border-status-online text-status-online"
                            }`}
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                        <p className="mt-2 text-xs font-medium text-chart-2">Impact: {rec.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Research Notes
          </CardTitle>
          <Button onClick={handleExportCSV} className="gap-2" data-testid="button-export-csv">
            <Download className="h-4 w-4" />
            Export Results to CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add your research notes, observations, and conclusions here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => notes && notesMutation.mutate(notes)}
            className="min-h-32 font-mono text-sm"
            data-testid="textarea-research-notes"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {notes.length}/5000 characters
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Molecule</p>
              <p className="mt-2 font-mono text-3xl font-bold" data-testid="summary-molecule">NH₃</p>
              <p className="mt-1 text-sm text-muted-foreground">Ammonia</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Algorithm</p>
              <p className="mt-2 font-mono text-3xl font-bold" data-testid="summary-algorithm">VQE</p>
              <p className="mt-1 text-sm text-muted-foreground">UCCSD Ansatz</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Backend</p>
              <p className="mt-2 font-mono text-3xl font-bold" data-testid="summary-backend">Azure</p>
              <p className="mt-1 text-sm text-muted-foreground">Quantum Elements</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
