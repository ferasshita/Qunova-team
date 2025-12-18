import { z } from "zod";

// Molecular Simulation Types
export interface Atom {
  id: number;
  element: string;
  symbol: string;
  x: number;
  y: number;
  z: number;
  charge: number;
}

export interface Bond {
  id: number;
  atom1: number;
  atom2: number;
  type: "single" | "double" | "triple";
  length: number;
}

export interface HamiltonianTerm {
  id: number;
  type: string;
  coefficient: number;
  operator: string;
}

export interface MolecularData {
  molecule: string;
  formula: string;
  atoms: Atom[];
  bonds: Bond[];
  hamiltonianTerms: HamiltonianTerm[];
  basisSets: string[];
  selectedBasisSet: string;
  electronCount: number;
  groundStateEnergy: number;
  eigenvalueHistory: { iteration: number; energy: number }[];
  iterationCount: number;
}

// Quantum Resources Types
export interface QuantumBackend {
  id: string;
  name: string;
  provider: string;
  status: "online" | "offline" | "busy";
}

export interface RunHistoryEntry {
  id: number;
  timestamp: string;
  backend: string;
  qubits: number;
  depth: number;
  shots: number;
  executionTime: number;
  status: "completed" | "failed" | "running";
}

export interface QuantumResourceData {
  backends: QuantumBackend[];
  selectedBackend: string;
  logicalQubits: number;
  circuitDepth: number;
  shotCount: number;
  errorEstimate: number;
  executionTimePerRun: number;
  runHistory: RunHistoryEntry[];
}

// Fertilizer Efficiency Types
export interface ClassicalQuantumComparison {
  metric: string;
  classical: number;
  quantum: number;
  unit: string;
  improvement: number;
}

export interface IterationTrendPoint {
  iteration: number;
  energy: number;
  efficiency: number;
}

export interface FertilizerMetricsData {
  energyPerMole: number;
  nitrogenFixationScore: number;
  reactionEfficiencyIndex: number;
  emissionProxyScore: number;
  comparisonTable: ClassicalQuantumComparison[];
  iterationTrend: IterationTrendPoint[];
}

// VQE Execution Types
export interface AnsatzOption {
  id: string;
  name: string;
  description: string;
}

export interface OptimizerOption {
  id: string;
  name: string;
  description: string;
}

export interface ConvergenceLogEntry {
  timestamp: string;
  iteration: number;
  energy: number;
  gradient: number;
  message: string;
}

export interface CircuitGate {
  type: string;
  qubit: number;
  control?: number;
  parameter?: number;
}

export interface VQEExecutionData {
  algorithm: string;
  ansatzOptions: AnsatzOption[];
  selectedAnsatz: string;
  optimizerOptions: OptimizerOption[];
  selectedOptimizer: string;
  layers: number;
  stepSize: number;
  minLayers: number;
  maxLayers: number;
  minStepSize: number;
  maxStepSize: number;
  status: "idle" | "running" | "completed" | "error";
  convergenceLog: ConvergenceLogEntry[];
  circuitStructure: CircuitGate[][];
}

// R&D Decision Support Types
export interface ResourceSummary {
  label: string;
  value: number;
  unit: string;
  change?: number;
}

export interface CostProxyEntry {
  resource: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface Recommendation {
  id: number;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: string;
}

export interface DecisionSupportData {
  energyReductionSummary: ResourceSummary;
  resourceUsageSummary: ResourceSummary[];
  costProxyTable: CostProxyEntry[];
  recommendations: Recommendation[];
  researchNotes: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// VQE Run Request
export const vqeRunRequestSchema = z.object({
  ansatz: z.string(),
  optimizer: z.string(),
  layers: z.number().min(1).max(10),
  stepSize: z.number().min(0.001).max(0.1),
});

export type VQERunRequest = z.infer<typeof vqeRunRequestSchema>;

// Research Notes Update
export const researchNotesSchema = z.object({
  notes: z.string().max(5000),
});

export type ResearchNotesUpdate = z.infer<typeof researchNotesSchema>;
