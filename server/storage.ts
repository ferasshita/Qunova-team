import type {
  MolecularData,
  QuantumResourceData,
  FertilizerMetricsData,
  VQEExecutionData,
  DecisionSupportData,
} from "@shared/schema";

export interface IStorage {
  getMolecularData(): Promise<MolecularData>;
  getQuantumResources(): Promise<QuantumResourceData>;
  getFertilizerMetrics(): Promise<FertilizerMetricsData>;
  getVQEExecution(): Promise<VQEExecutionData>;
  getDecisionSupport(): Promise<DecisionSupportData>;
  updateResearchNotes(notes: string): Promise<void>;
  updateVQEStatus(status: "idle" | "running" | "completed" | "error"): Promise<void>;
}

export class MemStorage implements IStorage {
  private researchNotes: string = "";
  private vqeStatus: "idle" | "running" | "completed" | "error" = "completed";

  async getMolecularData(): Promise<MolecularData> {
    return {
      molecule: "NH3",
      formula: "NH₃",
      atoms: [
        { id: 1, element: "Nitrogen", symbol: "N", x: 0, y: 0, z: 0.117, charge: -0.945 },
        { id: 2, element: "Hydrogen", symbol: "H", x: 0.938, y: 0, z: -0.274, charge: 0.315 },
        { id: 3, element: "Hydrogen", symbol: "H", x: -0.469, y: 0.812, z: -0.274, charge: 0.315 },
        { id: 4, element: "Hydrogen", symbol: "H", x: -0.469, y: -0.812, z: -0.274, charge: 0.315 },
      ],
      bonds: [
        { id: 1, atom1: 1, atom2: 2, type: "single", length: 1.012 },
        { id: 2, atom1: 1, atom2: 3, type: "single", length: 1.012 },
        { id: 3, atom1: 1, atom2: 4, type: "single", length: 1.012 },
      ],
      hamiltonianTerms: [
        { id: 1, type: "One-electron", coefficient: -9.82743, operator: "h_pq a†_p a_q" },
        { id: 2, type: "Two-electron", coefficient: 0.67445, operator: "g_pqrs a†_p a†_r a_s a_q" },
        { id: 3, type: "Nuclear", coefficient: 11.24456, operator: "V_nuc" },
        { id: 4, type: "Core", coefficient: -2.14329, operator: "E_core" },
      ],
      basisSets: ["STO-3G", "6-31G", "6-31G*", "cc-pVDZ", "cc-pVTZ"],
      selectedBasisSet: "STO-3G",
      electronCount: 10,
      groundStateEnergy: -56.21954,
      eigenvalueHistory: [
        { iteration: 1, energy: -52.145 },
        { iteration: 2, energy: -54.321 },
        { iteration: 3, energy: -55.467 },
        { iteration: 4, energy: -55.892 },
        { iteration: 5, energy: -56.089 },
        { iteration: 6, energy: -56.175 },
        { iteration: 7, energy: -56.204 },
        { iteration: 8, energy: -56.215 },
        { iteration: 9, energy: -56.219 },
        { iteration: 10, energy: -56.21954 },
      ],
      iterationCount: 10,
    };
  }

  async getQuantumResources(): Promise<QuantumResourceData> {
    return {
      backends: [
        { id: "ionq-aria", name: "IonQ Aria", provider: "Azure Quantum Elements", status: "online" },
        { id: "ionq-harmony", name: "IonQ Harmony", provider: "Azure Quantum Elements", status: "online" },
        { id: "quantinuum-h1", name: "Quantinuum H1-1", provider: "Azure Quantum Elements", status: "busy" },
        { id: "rigetti-aspen", name: "Rigetti Aspen-M-3", provider: "Azure Quantum Elements", status: "offline" },
      ],
      selectedBackend: "ionq-aria",
      logicalQubits: 8,
      circuitDepth: 42,
      shotCount: 10000,
      errorEstimate: 0.0234,
      executionTimePerRun: 2.47,
      runHistory: [
        { id: 1, timestamp: "2024-12-17 14:32:15", backend: "IonQ Aria", qubits: 8, depth: 42, shots: 10000, executionTime: 2.47, status: "completed" },
        { id: 2, timestamp: "2024-12-17 14:28:45", backend: "IonQ Aria", qubits: 8, depth: 38, shots: 8000, executionTime: 2.12, status: "completed" },
        { id: 3, timestamp: "2024-12-17 14:21:03", backend: "IonQ Aria", qubits: 8, depth: 35, shots: 5000, executionTime: 1.89, status: "completed" },
        { id: 4, timestamp: "2024-12-17 14:15:22", backend: "IonQ Harmony", qubits: 6, depth: 28, shots: 5000, executionTime: 1.45, status: "completed" },
        { id: 5, timestamp: "2024-12-17 14:08:11", backend: "Quantinuum H1-1", qubits: 8, depth: 42, shots: 10000, executionTime: 3.21, status: "failed" },
        { id: 6, timestamp: "2024-12-17 13:55:48", backend: "IonQ Aria", qubits: 8, depth: 40, shots: 8000, executionTime: 2.35, status: "completed" },
      ],
    };
  }

  async getFertilizerMetrics(): Promise<FertilizerMetricsData> {
    return {
      energyPerMole: 45.8,
      nitrogenFixationScore: 87.3,
      reactionEfficiencyIndex: 0.924,
      emissionProxyScore: 12.4,
      comparisonTable: [
        { metric: "Ground State Energy", classical: -56.089, quantum: -56.21954, unit: "Ha", improvement: 0.23 },
        { metric: "Computation Time", classical: 3600, quantum: 2.47, unit: "sec", improvement: 99.9 },
        { metric: "Accuracy (correlation)", classical: 0.89, quantum: 0.99, unit: "", improvement: 11.2 },
        { metric: "Energy per Mole", classical: 52.3, quantum: 45.8, unit: "kJ/mol", improvement: 12.4 },
        { metric: "N₂ Fixation Efficiency", classical: 72.1, quantum: 87.3, unit: "%", improvement: 21.1 },
        { metric: "CO₂ Emission Proxy", classical: 18.7, quantum: 12.4, unit: "kg CO₂/kg NH₃", improvement: 33.7 },
      ],
      iterationTrend: [
        { iteration: 1, energy: -52.145, efficiency: 0.65 },
        { iteration: 2, energy: -54.321, efficiency: 0.72 },
        { iteration: 3, energy: -55.467, efficiency: 0.78 },
        { iteration: 4, energy: -55.892, efficiency: 0.84 },
        { iteration: 5, energy: -56.089, efficiency: 0.88 },
        { iteration: 6, energy: -56.175, efficiency: 0.90 },
        { iteration: 7, energy: -56.204, efficiency: 0.91 },
        { iteration: 8, energy: -56.215, efficiency: 0.92 },
        { iteration: 9, energy: -56.219, efficiency: 0.923 },
        { iteration: 10, energy: -56.21954, efficiency: 0.924 },
      ],
    };
  }

  async getVQEExecution(): Promise<VQEExecutionData> {
    return {
      algorithm: "VQE",
      ansatzOptions: [
        { id: "uccsd", name: "UCCSD", description: "Unitary Coupled Cluster Singles and Doubles" },
        { id: "hardware-efficient", name: "Hardware Efficient", description: "Optimized for NISQ devices" },
        { id: "symmetry-preserving", name: "Symmetry Preserving", description: "Maintains molecular symmetries" },
      ],
      selectedAnsatz: "uccsd",
      optimizerOptions: [
        { id: "cobyla", name: "COBYLA", description: "Constrained Optimization BY Linear Approximation" },
        { id: "spsa", name: "SPSA", description: "Simultaneous Perturbation Stochastic Approximation" },
        { id: "adam", name: "ADAM", description: "Adaptive Moment Estimation" },
        { id: "l-bfgs-b", name: "L-BFGS-B", description: "Limited-memory BFGS with bounds" },
      ],
      selectedOptimizer: "cobyla",
      layers: 4,
      stepSize: 0.01,
      minLayers: 1,
      maxLayers: 10,
      minStepSize: 0.001,
      maxStepSize: 0.1,
      status: this.vqeStatus,
      convergenceLog: [
        { timestamp: "14:32:00", iteration: 1, energy: -52.145, gradient: 2.341, message: "Optimization started" },
        { timestamp: "14:32:05", iteration: 2, energy: -54.321, gradient: 1.876, message: "Gradient descent step" },
        { timestamp: "14:32:11", iteration: 3, energy: -55.467, gradient: 1.234, message: "Gradient descent step" },
        { timestamp: "14:32:18", iteration: 4, energy: -55.892, gradient: 0.872, message: "Gradient descent step" },
        { timestamp: "14:32:24", iteration: 5, energy: -56.089, gradient: 0.543, message: "Gradient descent step" },
        { timestamp: "14:32:31", iteration: 6, energy: -56.175, gradient: 0.321, message: "Gradient descent step" },
        { timestamp: "14:32:38", iteration: 7, energy: -56.204, gradient: 0.187, message: "Gradient descent step" },
        { timestamp: "14:32:45", iteration: 8, energy: -56.215, gradient: 0.098, message: "Gradient descent step" },
        { timestamp: "14:32:52", iteration: 9, energy: -56.219, gradient: 0.042, message: "Near convergence" },
        { timestamp: "14:32:59", iteration: 10, energy: -56.21954, gradient: 0.0012, message: "Converged!" },
      ],
      circuitStructure: [],
    };
  }

  async getDecisionSupport(): Promise<DecisionSupportData> {
    return {
      energyReductionSummary: {
        label: "Energy Reduction",
        value: 12.4,
        unit: "%",
        change: 12.4,
      },
      resourceUsageSummary: [
        { label: "Qubits Used", value: 8, unit: "logical", change: 0 },
        { label: "Circuit Depth", value: 42, unit: "gates", change: -15 },
        { label: "Total Shots", value: 56000, unit: "shots", change: 0 },
        { label: "Compute Time", value: 14.8, unit: "sec", change: -35 },
      ],
      costProxyTable: [
        { resource: "Azure Quantum Credits", quantity: 847, unitCost: 0.01, totalCost: 8.47 },
        { resource: "IonQ Aria QPU Time", quantity: 14.8, unitCost: 0.50, totalCost: 7.40 },
        { resource: "Classical Compute", quantity: 2.3, unitCost: 0.10, totalCost: 0.23 },
        { resource: "Data Transfer", quantity: 125, unitCost: 0.001, totalCost: 0.13 },
      ],
      recommendations: [
        {
          id: 1,
          priority: "high",
          title: "Increase shot count for production",
          description: "Current 10,000 shots provide good estimates but production runs should use 100,000+ for chemical accuracy.",
          impact: "Improves energy precision to 0.001 Ha",
        },
        {
          id: 2,
          priority: "high",
          title: "Consider cc-pVTZ basis set",
          description: "STO-3G is computationally efficient but cc-pVTZ provides better correlation energy for NH3.",
          impact: "Expected 15-20% accuracy improvement",
        },
        {
          id: 3,
          priority: "medium",
          title: "Optimize ansatz depth",
          description: "Current 4-layer UCCSD may be over-parameterized. Testing 2-3 layers could reduce circuit depth.",
          impact: "Reduces error rate by ~8%",
        },
        {
          id: 4,
          priority: "medium",
          title: "Schedule runs during off-peak hours",
          description: "Azure Quantum Elements offers reduced pricing during 00:00-06:00 UTC.",
          impact: "Cost reduction of 25-30%",
        },
        {
          id: 5,
          priority: "low",
          title: "Archive historical run data",
          description: "Consider exporting and archiving older run history to reduce dashboard load times.",
          impact: "Faster dashboard performance",
        },
      ],
      researchNotes: this.researchNotes,
    };
  }

  async updateResearchNotes(notes: string): Promise<void> {
    this.researchNotes = notes;
  }

  async updateVQEStatus(status: "idle" | "running" | "completed" | "error"): Promise<void> {
    this.vqeStatus = status;
  }
}

export const storage = new MemStorage();
