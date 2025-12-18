import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Cpu, Layers, Hash, Target, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { QuantumResourceData, ApiResponse } from "@shared/schema";

function MetricCard({ 
  label, 
  value, 
  unit, 
  icon: Icon,
  highlight,
  testId 
}: { 
  label: string; 
  value: string | number; 
  unit?: string;
  icon?: React.ElementType;
  highlight?: boolean;
  testId: string;
}) {
  return (
    <Card className={highlight ? "border-chart-1" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold" data-testid={testId}>
              {value}
              {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
            </p>
          </div>
          {Icon && (
            <div className="rounded-md bg-muted p-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-status-online" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-status-busy" />;
    case "running":
      return <Loader2 className="h-4 w-4 text-status-away animate-spin" />;
    default:
      return null;
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QuantumResources() {
  const [selectedBackend, setSelectedBackend] = useState("ionq-aria");
  
  const { data: response, isLoading, error } = useQuery<ApiResponse<QuantumResourceData>>({
    queryKey: ["/api/quantum-resources"],
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !response?.success) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Failed to load quantum resources data</p>
      </div>
    );
  }

  const data = response.data;
  const selectedBackendInfo = data.backends.find((b) => b.id === selectedBackend);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Azure Quantum Elements Backend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedBackend}
              onValueChange={setSelectedBackend}
            >
              <SelectTrigger data-testid="select-backend">
                <SelectValue placeholder="Select backend" />
              </SelectTrigger>
              <SelectContent>
                {data.backends.map((backend) => (
                  <SelectItem key={backend.id} value={backend.id} disabled={backend.status === "offline"}>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          backend.status === "online"
                            ? "bg-status-online"
                            : backend.status === "busy"
                            ? "bg-status-away"
                            : "bg-status-offline"
                        }`}
                      />
                      {backend.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedBackendInfo && (
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium" data-testid="text-selected-backend">{selectedBackendInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedBackendInfo.provider}</p>
                  </div>
                  <Badge
                    variant={selectedBackendInfo.status === "online" ? "default" : "secondary"}
                    className="capitalize"
                    data-testid="badge-backend-status"
                  >
                    {selectedBackendInfo.status}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="Logical Qubits"
            value={data.logicalQubits}
            icon={Cpu}
            testId="metric-logical-qubits"
          />
          <MetricCard
            label="Circuit Depth"
            value={data.circuitDepth}
            icon={Layers}
            testId="metric-circuit-depth"
          />
          <MetricCard
            label="Shot Count"
            value={data.shotCount.toLocaleString()}
            icon={Hash}
            testId="metric-shot-count"
          />
          <MetricCard
            label="Error Estimate"
            value={data.errorEstimate.toFixed(4)}
            icon={Target}
            highlight={data.errorEstimate > 0.05}
            testId="metric-error-estimate"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-chart-1/10 p-4">
                <Clock className="h-6 w-6 text-chart-1" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Execution Time / Run
                </p>
                <p className="font-mono text-3xl font-bold" data-testid="metric-execution-time">
                  {data.executionTimePerRun.toFixed(2)}
                  <span className="ml-1 text-lg font-normal text-muted-foreground">sec</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Runs</p>
                <p className="font-mono text-2xl font-semibold" data-testid="metric-total-runs">{data.runHistory.length}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Completed</p>
                <p className="font-mono text-2xl font-semibold text-status-online" data-testid="metric-completed-runs">
                  {data.runHistory.filter((r) => r.status === "completed").length}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Failed</p>
                <p className="font-mono text-2xl font-semibold text-status-busy" data-testid="metric-failed-runs">
                  {data.runHistory.filter((r) => r.status === "failed").length}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Avg Time</p>
                <p className="font-mono text-2xl font-semibold" data-testid="metric-avg-time">
                  {(data.runHistory.reduce((a, b) => a + b.executionTime, 0) / data.runHistory.length).toFixed(2)}s
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Run History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase">Status</TableHead>
                  <TableHead className="text-xs uppercase">Timestamp</TableHead>
                  <TableHead className="text-xs uppercase">Backend</TableHead>
                  <TableHead className="text-right text-xs uppercase font-mono">Qubits</TableHead>
                  <TableHead className="text-right text-xs uppercase font-mono">Depth</TableHead>
                  <TableHead className="text-right text-xs uppercase font-mono">Shots</TableHead>
                  <TableHead className="text-right text-xs uppercase font-mono">Time (s)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.runHistory.map((run) => (
                  <TableRow key={run.id} data-testid={`row-run-${run.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={run.status} />
                        <span className="capitalize text-sm">{run.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{run.timestamp}</TableCell>
                    <TableCell className="text-sm">{run.backend}</TableCell>
                    <TableCell className="text-right font-mono">{run.qubits}</TableCell>
                    <TableCell className="text-right font-mono">{run.depth}</TableCell>
                    <TableCell className="text-right font-mono">{run.shots.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{run.executionTime.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
