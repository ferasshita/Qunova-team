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
import { Atom, Link2, Zap, Hash } from "lucide-react";
import type { MolecularData, ApiResponse } from "@shared/schema";
import { useState } from "react";

function NH3Viewer() {
  return (
    <div className="relative h-80 w-full rounded-md bg-muted flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-chart-2/5" />
      <svg viewBox="0 0 200 200" className="w-64 h-64">
        <circle cx="100" cy="80" r="24" fill="hsl(var(--chart-3))" opacity="0.9" />
        <text x="100" y="85" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">N</text>
        
        <line x1="100" y1="104" x2="100" y2="140" stroke="hsl(var(--muted-foreground))" strokeWidth="3" />
        <circle cx="100" cy="155" r="16" fill="hsl(var(--chart-1))" opacity="0.9" />
        <text x="100" y="160" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">H</text>
        
        <line x1="80" y1="68" x2="50" y2="45" stroke="hsl(var(--muted-foreground))" strokeWidth="3" />
        <circle cx="40" cy="38" r="16" fill="hsl(var(--chart-1))" opacity="0.9" />
        <text x="40" y="43" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">H</text>
        
        <line x1="120" y1="68" x2="150" y2="45" stroke="hsl(var(--muted-foreground))" strokeWidth="3" />
        <circle cx="160" cy="38" r="16" fill="hsl(var(--chart-1))" opacity="0.9" />
        <text x="160" y="43" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">H</text>
      </svg>
      <div className="absolute bottom-4 left-4 flex gap-2">
        <Badge variant="secondary" data-testid="badge-molecule">NH₃</Badge>
        <Badge variant="outline" data-testid="badge-molecule-name">Ammonia</Badge>
      </div>
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  unit, 
  icon: Icon,
  testId 
}: { 
  label: string; 
  value: string | number; 
  unit?: string;
  icon?: React.ElementType;
  testId: string;
}) {
  return (
    <Card>
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

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
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

export default function MolecularSimulation() {
  const [selectedBasisSet, setSelectedBasisSet] = useState("STO-3G");
  
  const { data: response, isLoading, error } = useQuery<ApiResponse<MolecularData>>({
    queryKey: ["/api/molecular"],
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !response?.success) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Failed to load molecular data</p>
      </div>
    );
  }

  const data = response.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Atom className="h-5 w-5" />
              NH₃ Molecule Viewer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NH3Viewer />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Atom List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[340px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs uppercase">Element</TableHead>
                    <TableHead className="text-right text-xs uppercase font-mono">X</TableHead>
                    <TableHead className="text-right text-xs uppercase font-mono">Y</TableHead>
                    <TableHead className="text-right text-xs uppercase font-mono">Z</TableHead>
                    <TableHead className="text-right text-xs uppercase font-mono">Charge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.atoms.map((atom) => (
                    <TableRow key={atom.id} data-testid={`row-atom-${atom.id}`}>
                      <TableCell className="font-medium">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-chart-1" />
                          {atom.symbol}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{atom.x.toFixed(3)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{atom.y.toFixed(3)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{atom.z.toFixed(3)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{atom.charge.toFixed(3)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Link2 className="h-4 w-4" />
              Bond Graph
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase">Bond</TableHead>
                  <TableHead className="text-xs uppercase">Type</TableHead>
                  <TableHead className="text-right text-xs uppercase font-mono">Length (Å)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.bonds.map((bond) => (
                  <TableRow key={bond.id} data-testid={`row-bond-${bond.id}`}>
                    <TableCell className="font-medium font-mono">
                      {data.atoms.find(a => a.id === bond.atom1)?.symbol}-
                      {data.atoms.find(a => a.id === bond.atom2)?.symbol}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{bond.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{bond.length.toFixed(3)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4" />
              Hamiltonian Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {data.hamiltonianTerms.map((term) => (
                  <div
                    key={term.id}
                    className="flex items-center justify-between rounded-md bg-muted p-3"
                    data-testid={`term-hamiltonian-${term.id}`}
                  >
                    <div>
                      <p className="text-sm font-medium">{term.type}</p>
                      <p className="font-mono text-xs text-muted-foreground">{term.operator}</p>
                    </div>
                    <span className="font-mono text-sm font-semibold">
                      {term.coefficient > 0 ? "+" : ""}{term.coefficient.toFixed(5)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Basis Set
            </p>
            <Select
              value={selectedBasisSet}
              onValueChange={setSelectedBasisSet}
            >
              <SelectTrigger data-testid="select-basis-set">
                <SelectValue placeholder="Select basis set" />
              </SelectTrigger>
              <SelectContent>
                {data.basisSets.map((basis) => (
                  <SelectItem key={basis} value={basis}>
                    {basis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <MetricCard
          label="Electron Count"
          value={data.electronCount}
          icon={Hash}
          testId="metric-electron-count"
        />

        <MetricCard
          label="Ground State Energy"
          value={data.groundStateEnergy.toFixed(5)}
          unit="Ha"
          icon={Zap}
          testId="metric-ground-state-energy"
        />

        <MetricCard
          label="Iteration Count"
          value={data.iterationCount}
          testId="metric-iteration-count"
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Eigenvalue History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <svg viewBox="0 0 600 180" className="w-full h-full">
              <defs>
                <linearGradient id="energyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="50"
                  y1={20 + i * 35}
                  x2="580"
                  y2={20 + i * 35}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />
              ))}
              
              <path
                d={`M50,${160 - ((data.eigenvalueHistory[0]?.energy + 60) / 10) * 140} ` +
                  data.eigenvalueHistory.slice(1).map((point, i) => 
                    `L${50 + ((i + 1) * 53)},${160 - ((point.energy + 60) / 10) * 140}`
                  ).join(" ") +
                  ` L${50 + (data.eigenvalueHistory.length - 1) * 53},160 L50,160 Z`}
                fill="url(#energyGradient)"
              />
              
              <path
                d={`M50,${160 - ((data.eigenvalueHistory[0]?.energy + 60) / 10) * 140} ` +
                  data.eigenvalueHistory.slice(1).map((point, i) => 
                    `L${50 + ((i + 1) * 53)},${160 - ((point.energy + 60) / 10) * 140}`
                  ).join(" ")}
                fill="none"
                stroke="hsl(var(--chart-1))"
                strokeWidth="2"
              />
              
              {data.eigenvalueHistory.map((point, i) => (
                <circle
                  key={i}
                  cx={50 + i * 53}
                  cy={160 - ((point.energy + 60) / 10) * 140}
                  r="4"
                  fill="hsl(var(--chart-1))"
                />
              ))}
              
              {data.eigenvalueHistory.map((point, i) => (
                <text
                  key={i}
                  x={50 + i * 53}
                  y={175}
                  textAnchor="middle"
                  className="text-[10px] fill-muted-foreground font-mono"
                >
                  {point.iteration}
                </text>
              ))}
              
              <text x="30" y="165" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">-52</text>
              <text x="30" y="130" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">-54</text>
              <text x="30" y="95" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">-55</text>
              <text x="30" y="60" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">-56</text>
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
