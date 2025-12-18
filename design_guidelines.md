# Quantum Computing Dashboard Design Guidelines

## Design Approach

**Selected Framework:** Design System Approach - Hybrid of Fluent Design (Microsoft alignment with Azure Quantum) and Carbon Design (enterprise data applications)

**Rationale:** This is a utility-focused, information-dense scientific dashboard requiring stability, clarity, and efficient data consumption. The technical audience prioritizes functionality over visual flair.

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts CDN) - exceptional readability for data-heavy interfaces
- Monospace: JetBrains Mono - for numerical values, code snippets, and scientific notation

**Hierarchy:**
- Dashboard Title: text-2xl font-semibold
- Module Headers: text-xl font-semibold
- Section Titles: text-lg font-medium
- Data Labels: text-sm font-medium uppercase tracking-wide
- Values/Metrics: text-base font-normal
- Helper Text: text-sm text-opacity-70
- Monospace Values: Use JetBrains Mono for all numerical outputs, energy values, chemical formulas

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, space-y-8)
- Tight spacing (2): Within data groups, table cells
- Standard spacing (4): Between form elements, card padding
- Section spacing (6): Between subsections within modules
- Module spacing (8): Between major sections

**Grid Structure:**
- Sidebar: fixed w-64, full height
- Top Bar: h-16, full width
- Main Workspace: CSS Grid with responsive columns (grid-cols-1 lg:grid-cols-2 xl:grid-cols-3)
- Module Cards: Use grid for internal layouts where appropriate

## Component Library

### Navigation Components

**Left Sidebar:**
- Full-height fixed panel, w-64
- Qunova branding at top (p-6)
- 5 navigation items with icons (Heroicons - beaker, cpu-chip, chart-bar, cog, document-text)
- Each item: p-4, flex items-center gap-3
- Active state: border-l-4, slight background treatment
- Bottom section: System status indicator

**Top System Bar:**
- h-16, border-b
- Left: Dashboard title "Quantum NH₃ Research Platform"
- Center: Current module breadcrumb
- Right: Azure Quantum Elements badge, notification icon, help icon

### Data Display Components

**Metric Cards:**
- Compact rectangular cards (aspect ratio ~3:2)
- Structure: Label (top, small), Value (large, monospace), Unit (small, inline), Change indicator (optional, bottom right)
- Use for: Qubit count, circuit depth, shot count, energy values

**Data Tables:**
- Dense layout with alternating row backgrounds
- Header: text-sm font-medium uppercase
- Cells: p-3, text-sm
- Numerical columns: right-aligned, monospace font
- Use for: Atom lists, bond graphs, run history, cost analysis

**Visualization Panels:**
- Chart containers with consistent padding (p-6)
- Title bar with selector controls where needed
- Legend placement: bottom for line charts, right for complex charts
- Use for: Energy convergence logs, iteration trends, classical vs quantum comparisons

**Scientific Displays:**
- NH₃ Molecule Viewer: Prominent card (min-h-96) with 3D canvas placeholder and controls below
- Hamiltonian Terms: Equation-style list with proper mathematical formatting
- Circuit Preview: Monospace grid representation with gate symbols

### Form & Control Components

**Selectors:**
- Dropdown style with chevron icon
- Options list with radio indicators
- Use for: Basis set, ansatz, optimizer, Azure backend

**Parameter Sliders:**
- Label above with current value (monospace)
- Slider track with visible tick marks
- Min/max labels at ends
- Use for: Layers (1-10), step size (0.001-0.1)

**Action Buttons:**
- Primary actions: Large, prominent (px-6 py-3)
- Secondary actions: Medium (px-4 py-2)
- Destructive (Stop): Distinct visual treatment
- Export/Save: Utility style with icon
- No hover animations per UX requirements

**Input Fields:**
- Research notes: Textarea with min-h-32
- Clear placeholder text
- Character count if needed
- Consistent border treatment across all inputs

### Status & Feedback Components

**Status Indicators:**
- Execution status: Inline badge (idle/running/complete/error)
- Error estimates: Color-coded (not by hue - use text treatment)
- Live updates: Pulse indicator next to changing values (minimal, no animation)

**Data Output Panels:**
- Ground state energy: Large featured metric
- Eigenvalue history: Scrollable list with timestamps
- Iteration count: Live counter
- All use monospace font for precision

### Module-Specific Layouts

**Module 1 - Molecular Simulation:**
Grid layout: 
- Top row: NH₃ viewer (col-span-2), atom list table
- Middle row: Bond graph, Hamiltonian terms
- Bottom row: Controls (basis set, electron count), outputs (3 metrics side-by-side)

**Module 2 - Quantum Resources:**
Two-column layout:
- Left: Backend selector, resource metrics (4 cards in 2x2 grid)
- Right: Execution metrics, run history table (scrollable)

**Module 3 - Fertilizer Efficiency:**
Dashboard-style:
- Top: 4 key metrics in row
- Middle: Comparison table (classical vs quantum)
- Bottom: Iteration trend chart (full width)

**Module 4 - Algorithm Execution:**
Vertical flow:
- Controls section (ansatz, optimizer, parameters in horizontal layout)
- Action buttons (run/stop) centered
- Live convergence log (scrollable, monospace)
- Circuit preview below

**Module 5 - R&D Support:**
Summary layout:
- Summary cards (2x2 grid)
- Cost table
- Recommendation list (numbered, with priority indicators)
- Bottom: Research notes textarea + export button

## Accessibility & Quality Standards

- Consistent form implementation with visible labels
- Keyboard navigation: Tab order follows logical flow through modules
- Focus indicators: Visible outline on all interactive elements
- Semantic HTML: Proper heading hierarchy, ARIA labels for complex widgets
- Table accessibility: Caption, th scope attributes
- No motion effects as specified in requirements

## Images

**No hero images.** This is a functional dashboard, not a marketing page.

**Scientific Visualization Placeholders:**
- NH₃ molecule viewer: 3D ball-and-stick model placeholder (use placeholder service or canvas element comment)
- Circuit structure: Quantum circuit diagram placeholder in algorithm module
- Charts: Use chart library placeholders (Chart.js or similar) - NOT custom SVGs

All icons via Heroicons CDN - scientific/technical icon set (beaker, cpu-chip, chart-bar, cog, cube-transparent, bolt, clipboard-document-list).