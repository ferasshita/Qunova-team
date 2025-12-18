import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Square, Settings, Cpu, Activity, Zap } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { VQEExecutionData, ApiResponse } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    idle: { variant: "secondary", label: "Idle" },
    running: { variant: "default", label: "Running" },
    completed: { variant: "outline", label: "Completed" },
    error: { variant: "destructive", label: "Error" },
  };
  const config = variants[status] || variants.idle;
  return <Badge variant={config.variant} data-testid="badge-execution-status">{config.label}</Badge>;
}

function CircuitPreview() {
  const gates = [
    ["H", "Ry", "CNOT", "Ry", "CNOT", "Ry"],
    ["H", "Ry", "X", "Ry", "X", "Ry"],
    ["H", "Ry", "CNOT", "Ry", "CNOT", "Ry"],
    ["H", "Ry", "X", "Ry", "X", "Ry"],
    ["H", "Ry", "CNOT", "Ry", "CNOT", "Ry"],
    ["H", "Ry", "X", "Ry", "X", "Ry"],
    ["H", "Ry", "CNOT", "Ry", "CNOT", "Ry"],
    ["H", "Ry", "X", "Ry", "X", "Ry"],
  ];

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="grid gap-1">
          {gates.map((row, qIdx) => (
            <div key={qIdx} className="flex items-center gap-1">
              <span className="w-8 font-mono text-xs text-muted-foreground">q{qIdx}</span>
              <div className="flex-1 h-8 bg-muted/50 rounded flex items-center">
                <div className="h-px flex-1 bg-muted-foreground/30" />
              </div>
              {row.map((gate, gIdx) => (
                <div
                  key={gIdx}
                  className={`flex h-8 w-12 items-center justify-center rounded border text-xs font-mono ${
                    gate === "CNOT" || gate === "X"
                      ? "border-chart-2 bg-chart-2/10 text-chart-2"
                      : gate === "Ry"
                      ? "border-chart-3 bg-chart-3/10 text-chart-3"
                      : "border-chart-1 bg-chart-1/10 text-chart-1"
                  }`}
                >
                  {gate}
                </div>
              ))}
              <div className="flex-1 h-8 bg-muted/50 rounded flex items-center">
                <div className="h-px flex-1 bg-muted-foreground/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AlgorithmExecution() {
  const { toast } = useToast();
  const [layers, setLayers] = useState(4);
  const [stepSize, setStepSize] = useState(0.01);
  const [selectedAnsatz, setSelectedAnsatz] = useState("uccsd");
  const [selectedOptimizer, setSelectedOptimizer] = useState("cobyla");

  const { data: response, isLoading, error } = useQuery<ApiResponse<VQEExecutionData>>({
    queryKey: ["/api/vqe-execution"],
  });

  const runMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/vqe-execution/run", {
        ansatz: selectedAnsatz,
        optimizer: selectedOptimizer,
        layers,
        stepSize,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vqe-execution"] });
      toast({
        title: "VQE Execution Started",
        description: "The quantum simulation is now running.",
      });
    },
    onError: () => {
      toast({
        title: "Execution Failed",
        description: "Failed to start VQE execution.",
        variant: "destructive",
      });
    },
  });

  const stopMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/vqe-execution/stop", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vqe-execution"] });
      toast({
        title: "Execution Stopped",
        description: "The quantum simulation has been stopped.",
      });
    },
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !response?.success) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Failed to load VQE execution data</p>
      </div>
    );
  }

  const data = response.data;

  const handleLayersChange = (value: number[]) => {
    setLayers(value[0]);
  };

  const handleStepSizeChange = (value: number[]) => {
    setStepSize(value[0]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Variational Quantum Eigensolver (VQE)</CardTitle>
              <p className="text-sm text-muted-foreground">Quantum-classical hybrid algorithm for ground state energy</p>
            </div>
          </div>
          <StatusBadge status={data.status} />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Ansatz
              </label>
              <Select
                value={selectedAnsatz}
                onValueChange={setSelectedAnsatz}
              >
                <SelectTrigger data-testid="select-ansatz">
                  <SelectValue placeholder="Select ansatz" />
                </SelectTrigger>
                <SelectContent>
                  {data.ansatzOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      <div>
                        <p>{option.name}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Optimizer
              </label>
              <Select
                value={selectedOptimizer}
                onValueChange={setSelectedOptimizer}
              >
                <SelectTrigger data-testid="select-optimizer">
                  <SelectValue placeholder="Select optimizer" />
                </SelectTrigger>
                <SelectContent>
                  {data.optimizerOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      <div>
                        <p>{option.name}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Layers
                </label>
                <span className="font-mono text-sm" data-testid="value-layers">{layers}</span>
              </div>
              <Slider
                value={[layers]}
                onValueChange={handleLayersChange}
                min={data.minLayers}
                max={data.maxLayers}
                step={1}
                className="w-full"
                data-testid="slider-layers"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{data.minLayers}</span>
                <span>{data.maxLayers}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Step Size
                </label>
                <span className="font-mono text-sm" data-testid="value-step-size">{stepSize.toFixed(3)}</span>
              </div>
              <Slider
                value={[stepSize]}
                onValueChange={handleStepSizeChange}
                min={data.minStepSize}
                max={data.maxStepSize}
                step={0.001}
                className="w-full"
                data-testid="slider-step-size"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{data.minStepSize}</span>
                <span>{data.maxStepSize}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => runMutation.mutate()}
              disabled={data.status === "running" || runMutation.isPending}
              className="gap-2"
              data-testid="button-run"
            >
              <Play className="h-4 w-4" />
              {runMutation.isPending ? "Starting..." : "Run Execution"}
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={() => stopMutation.mutate()}
              disabled={data.status !== "running" || stopMutation.isPending}
              className="gap-2"
              data-testid="button-stop"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" />
              Live Energy Convergence Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[360px]">
              <div className="p-4 font-mono text-sm">
                {data.convergenceLog.map((entry, index) => (
                  <div
                    key={index}
                    className="flex gap-3 border-b border-dashed py-2 last:border-0"
                    data-testid={`log-entry-${index}`}
                  >
                    <span className="text-muted-foreground">{entry.timestamp}</span>
                    <span className="text-chart-3">#{entry.iteration.toString().padStart(2, "0")}</span>
                    <span className="flex-1">
                      E = <span className="text-chart-1">{entry.energy.toFixed(5)}</span> Ha
                    </span>
                    <span className="text-muted-foreground">
                      grad: {entry.gradient.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Circuit Structure Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[360px]">
              <CircuitPreview />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-chart-1" />
              <div>
                <p className="text-xs text-muted-foreground">Final Energy</p>
                <p className="font-mono text-lg font-semibold" data-testid="metric-final-energy">
                  {data.convergenceLog[data.convergenceLog.length - 1]?.energy.toFixed(5)} Ha
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-chart-2" />
              <div>
                <p className="text-xs text-muted-foreground">Iterations</p>
                <p className="font-mono text-lg font-semibold" data-testid="metric-iterations">
                  {data.convergenceLog.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-chart-3" />
              <div>
                <p className="text-xs text-muted-foreground">Final Gradient</p>
                <p className="font-mono text-lg font-semibold" data-testid="metric-final-gradient">
                  {data.convergenceLog[data.convergenceLog.length - 1]?.gradient.toFixed(4)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Cpu className="h-5 w-5 text-chart-4" />
              <div>
                <p className="text-xs text-muted-foreground">Algorithm</p>
                <p className="font-mono text-lg font-semibold" data-testid="metric-algorithm">VQE</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
