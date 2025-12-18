# Quantum Agriculture Dashboard - Ammonia Fertilizer Research

## Project Overview
A web-based dashboard for quantum computing applications in ammonia (NH3) fertilizer research. This platform enables quantum engineers and chemical researchers to simulate NH3 molecular properties using quantum algorithms, specifically focusing on the Variational Quantum Eigensolver (VQE) method with Azure Quantum Elements as the backend.

## Primary Focus
- Molecular simulation of NH3 (ammonia)
- Integration with Azure Quantum Elements backend
- Implementation of Variational Quantum Eigensolver (VQE) algorithm

## Target Users
- Quantum engineers
- Chemical researchers
- Fertilizer R&D teams

## Technology Stack
- Frontend: React with TypeScript
- Backend: Node.js with Express
- API: REST architecture
- Data: Deterministic mock data only
- Architecture: Single-page application
- Authentication: No login required

## System Architecture

### Global Layout
- Left sidebar for navigation between modules
- Top system bar for global controls and status
- Main grid workspace for module content

## Module Specifications

### Module 1: Molecular and Chemical Simulation
- NH3 molecule 3D viewer
- Atom list table with element properties
- Bond graph visualization panel
- Hamiltonian term list with coefficients
- Basis set selector dropdown
- Electron count display
- Output values panel:
  - Ground state energy
  - Eigenvalue history chart
  - Iteration count display

### Module 2: Quantum Resource and Hardware Metrics
- Azure Quantum Elements backend selector
- Logical qubit count display
- Circuit depth value
- Shot count configuration
- Error estimate calculation
- Execution time per run
- Run history table with timestamped results

### Module 3: Fertilizer Efficiency and Catalysis
- Energy per mole of NH3 calculation
- Nitrogen fixation proxy score
- Reaction efficiency index
- Emission proxy score
- Classical vs quantum comparison table
- Iteration trend chart showing convergence

### Module 4: Quantum Algorithm Execution
- Algorithm: Fixed to VQE (Variational Quantum Eigensolver)
- Ansatz configuration selector
- Optimizer algorithm selector (COBYLA, SPSA, etc.)
- Parameter sliders:
  - Number of layers
  - Step size
- Run execution button
- Stop execution button
- Live energy convergence log
- Quantum circuit structure preview

### Module 5: R&D Decision Support
- Energy reduction summary
- Resource usage summary
- Cost proxy table (classical vs quantum)
- Recommendation list for next steps
- Export results to CSV functionality
- Research notes text input area

## Data Management Rules
- All outputs are deterministic mock data
- Separate JSON data file for each module
- Reusable data services for consistency
- No persistent database storage

## User Experience Rules
- Clear, descriptive labels for all controls
- No motion effects or animations
- Full keyboard navigation support
- Responsive CSS grid layout
- Consistent color coding throughout

## Setup Instructions

### Prerequisites
- Node.js 16.0 or higher
- npm 8.0 or higher
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd quantum-agriculture-dashboard
```

2. Install backend dependencies:
```
cd backend
npm install
```

3. Install frontend dependencies:
```
cd ../frontend
npm install
```

### Development Environment

1. Start the backend server (from backend directory):
```
npm run dev
```
Server runs on http://localhost:5000

2. Start the frontend development server (from frontend directory):
```
npm start
```
Application runs on http://localhost:3000

### Production Build

1. Build the frontend:
```
cd frontend
npm run build
```

2. Start the production server:
```
cd ../backend
npm start
```


## API Endpoints

### Backend Routes
- GET /api/module1 - Molecular simulation data
- GET /api/module2 - Quantum resource metrics
- GET /api/module3 - Fertilizer efficiency data
- POST /api/module4/run-vqe - Execute VQE simulation
- GET /api/module5 - Decision support data
- POST /api/export/csv - Export data to CSV

## Mock Data Structure

Each module has a corresponding JSON file with the following pattern:

```json
{
  "metadata": {
    "module": "Module Name",
    "lastUpdated": "timestamp",
    "molecule": "NH3"
  },
  "data": {
    // Module-specific data structure
  },
  "simulationResults": {
    // Deterministic mock results
  }
}
```

## Key Features Implementation

### VQE Simulation Flow
1. User configures ansatz and optimizer in Module 4
2. Parameters are sent to backend via POST request
3. Backend processes deterministic mock algorithm
4. Results are returned and displayed in convergence log
5. Updated values propagate to all relevant modules

### NH3 Molecule Fixed Parameters
- Molecule: NH3 (ammonia)
- Atoms: 1 Nitrogen, 3 Hydrogen
- Bonds: 3 N-H bonds
- Electron count: 10 total electrons
- Basis sets: STO-3G, 6-31G, cc-pVDZ

### Azure Quantum Elements Integration
- Mock interface showing backend selection
- Simulated resource metrics
- Estimated execution times based on circuit complexity

## Acceptance Criteria Verification

1. All five modules load without JavaScript errors
2. VQE simulation flow completes from parameter input to output display
3. Azure Quantum Elements is displayed as the quantum backend
4. NH3 is consistently shown as the target molecule across all modules
5. Responsive design works on desktop and tablet viewports
6. All interactive elements respond to keyboard navigation
7. Data export functionality generates valid CSV files

## Testing

### Manual Testing Checklist
- [ ] Navigation between all modules works
- [ ] All data displays load correctly
- [ ] VQE execution produces mock results
- [ ] Parameter sliders update values
- [ ] Export functionality works
- [ ] Responsive design at different screen sizes

### Automated Tests
Run test suite with:
```
cd frontend
npm test
```

## Deployment

### Build for Production
```
cd frontend
npm run build
cd ../backend
npm run build
```

### Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
```

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Requirements
- Initial load time under 3 seconds
- Module switching under 1 second
- VQE mock execution under 2 seconds
- Export generation under 1 second

## Maintenance

### Updating Mock Data
Edit JSON files in `backend/src/data/` directory. Restart backend server for changes to take effect.

### Adding New Features
1. Create new component in appropriate module directory
2. Add route to backend if needed
3. Update navigation in sidebar component
4. Test functionality across all modules


## Acknowledgments
This dashboard was developed specifically for ammonia fertilizer research using quantum computing methods. All molecular simulations are based on NH3 properties, and all quantum algorithms are focused on VQE implementation for chemical simulation.
