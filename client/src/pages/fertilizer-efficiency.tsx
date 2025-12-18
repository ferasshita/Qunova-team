import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Leaf, Activity, Wind, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { FertilizerMetricsData, ApiResponse } from "@shared/schema";

function MetricCard({ 
  label, 
  value, 
  unit, 
  icon: Icon,
  color,
  description,
  testId 
}: { 
  label: string; 
  value: string | number; 
  unit?: string;
  icon?: React.ElementType;
  color?: string;
  description?: string;
  testId: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 font-mono text-3xl font-bold" data-testid={testId}>
              {value}
              {unit && <span className="ml-1 text-lg font-normal text-muted-foreground">{unit}</span>}
            </p>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {Icon && (
            <div className={`rounded-full p-3 ${color || "bg-muted"}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ImprovementBadge({ value }: { value: number }) {
  if (value > 0) {
    return (
      <Badge variant="default" className="bg-status-online/10 text-status-online">
        <TrendingUp className="mr-1 h-3 w-3" />
        +{value.toFixed(1)}%
      </Badge>
    );
  } else if (value < 0) {
    return (
      <Badge variant="default" className="bg-status-busy/10 text-status-busy">
        <TrendingDown className="mr-1 h-3 w-3" />
        {value.toFixed(1)}%
      </Badge>
    );
  }
  return (
    <Badge variant="secondary">
      <Minus className="mr-1 h-3 w-3" />
      0%
    </Badge>
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
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function FertilizerEfficiency() {
  const { data: response, isLoading, error } = useQuery<ApiResponse<FertilizerMetricsData>>({
    queryKey: ["/api/fertilizer-metrics"],
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !response?.success) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Failed to load fertilizer metrics data</p>
      </div>
    );
  }

  const data = response.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Energy per Mole"
          value={data.energyPerMole.toFixed(1)}
          unit="kJ/mol"
          icon={Zap}
          color="bg-chart-1"
          description="NH₃ synthesis energy"
          testId="metric-energy-per-mole"
        />
        <MetricCard
          label="N₂ Fixation Score"
          value={data.nitrogenFixationScore.toFixed(1)}
          unit="%"
          icon={Leaf}
          color="bg-chart-2"
          description="Nitrogen conversion rate"
          testId="metric-nitrogen-fixation"
        />
        <MetricCard
          label="Reaction Efficiency"
          value={data.reactionEfficiencyIndex.toFixed(3)}
          icon={Activity}
          color="bg-chart-3"
          description="Catalysis index"
          testId="metric-reaction-efficiency"
        />
        <MetricCard
          label="Emission Score"
          value={data.emissionProxyScore.toFixed(1)}
          unit="kg CO₂"
          icon={Wind}
          color="bg-chart-4"
          description="Per kg NH₃ produced"
          testId="metric-emission-score"
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Classical vs Quantum Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs uppercase">Metric</TableHead>
                <TableHead className="text-right text-xs uppercase font-mono">Classical</TableHead>
                <TableHead className="text-right text-xs uppercase font-mono">Quantum</TableHead>
                <TableHead className="text-xs uppercase">Unit</TableHead>
                <TableHead className="text-right text-xs uppercase">Improvement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.comparisonTable.map((row, index) => (
                <TableRow key={index} data-testid={`row-comparison-${index}`}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  <TableCell className="text-right font-mono">
                    {typeof row.classical === "number" 
                      ? row.classical.toLocaleString(undefined, { maximumFractionDigits: 5 })
                      : row.classical}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-chart-1">
                    {typeof row.quantum === "number" 
                      ? row.quantum.toLocaleString(undefined, { maximumFractionDigits: 5 })
                      : row.quantum}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.unit}</TableCell>
                  <TableCell className="text-right">
                    <ImprovementBadge value={row.improvement} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Iteration Trend - Energy & Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <svg viewBox="0 0 700 240" className="w-full h-full">
              <defs>
                <linearGradient id="energyGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="efficiencyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="60"
                  y1={20 + i * 36}
                  x2="680"
                  y2={20 + i * 36}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />
              ))}
              
              <path
                d={`M60,${200 - ((data.iterationTrend[0]?.energy + 60) / 10) * 180} ` +
                  data.iterationTrend.slice(1).map((point, i) => 
                    `L${60 + ((i + 1) * 62)},${200 - ((point.energy + 60) / 10) * 180}`
                  ).join(" ")}
                fill="none"
                stroke="hsl(var(--chart-1))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              <path
                d={`M60,${200 - (data.iterationTrend[0]?.efficiency * 180)} ` +
                  data.iterationTrend.slice(1).map((point, i) => 
                    `L${60 + ((i + 1) * 62)},${200 - (point.efficiency * 180)}`
                  ).join(" ")}
                fill="none"
                stroke="hsl(var(--chart-2))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8,4"
              />
              
              {data.iterationTrend.map((point, i) => (
                <g key={`energy-${i}`}>
                  <circle
                    cx={60 + i * 62}
                    cy={200 - ((point.energy + 60) / 10) * 180}
                    r="5"
                    fill="hsl(var(--chart-1))"
                  />
                </g>
              ))}
              
              {data.iterationTrend.map((point, i) => (
                <g key={`efficiency-${i}`}>
                  <circle
                    cx={60 + i * 62}
                    cy={200 - (point.efficiency * 180)}
                    r="5"
                    fill="hsl(var(--chart-2))"
                  />
                </g>
              ))}
              
              {data.iterationTrend.map((point, i) => (
                <text
                  key={i}
                  x={60 + i * 62}
                  y={225}
                  textAnchor="middle"
                  className="text-[10px] fill-muted-foreground font-mono"
                >
                  {point.iteration}
                </text>
              ))}
              
              <text x="40" y="205" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">-52</text>
              <text x="40" y="165" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">-54</text>
              <text x="40" y="125" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">-55</text>
              <text x="40" y="85" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">-56</text>
              <text x="40" y="45" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">-57</text>
              
              <g transform="translate(550, 10)">
                <rect x="0" y="0" width="140" height="50" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                <line x1="10" y1="18" x2="30" y2="18" stroke="hsl(var(--chart-1))" strokeWidth="3" />
                <text x="38" y="22" className="text-[11px] fill-foreground">Energy (Ha)</text>
                <line x1="10" y1="36" x2="30" y2="36" stroke="hsl(var(--chart-2))" strokeWidth="3" strokeDasharray="8,4" />
                <text x="38" y="40" className="text-[11px] fill-foreground">Efficiency</text>
              </g>
            </svg>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Best Ground State</p>
                <p className="font-mono text-2xl font-bold" data-testid="metric-best-ground-state">
                  {data.iterationTrend[data.iterationTrend.length - 1].energy.toFixed(5)} Ha
                </p>
              </div>
              <Badge variant="secondary">Final</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Peak Efficiency</p>
                <p className="font-mono text-2xl font-bold" data-testid="metric-peak-efficiency">
                  {(data.iterationTrend[data.iterationTrend.length - 1].efficiency * 100).toFixed(1)}%
                </p>
              </div>
              <Badge variant="default">Optimal</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Convergence Rate</p>
                <p className="font-mono text-2xl font-bold" data-testid="metric-convergence-rate">
                  10 iterations
                </p>
              </div>
              <Badge variant="secondary">VQE</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
