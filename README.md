# Logic Gates Puzzle Game 🎮

A production-ready educational puzzle game about digital logic circuits, built for the Computer Science Society of Nottingham.

![CS Society Logo](assets/CSS_logo_purple_bg.PNG)

## 🚀 Features

- **Interactive Circuit Building**: Drag and drop logic gates (AND, OR, XOR, NOT) to build circuits
- **Progressive Difficulty**: 10+ levels from basic gates to complex circuits like multiplexers
- **Real-time Simulation**: Visual flow animations showing signal propagation
- **Truth Table Verification**: Automatic checking against target outputs
- **Sandbox Mode**: Free-play environment for experimentation
- **Mobile Responsive**: Optimized for both desktop and mobile browsers
- **Beautiful UI**: Computer Science Society themed with glassmorphism effects

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Circuit Visualization**: React Flow
- **State Management**: Zustand
- **Logic Engine**: Pure TypeScript (DAG-based evaluation)
- **Deployment**: Vercel

## 📦 Installation

### Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/your-repo/logic-gates-puzzle.git
cd logic-gates-puzzle
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

Or use the Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with default settings

### Manual Build

```bash
npm run build
npm run start
```

## 🎮 How to Play

1. **Objective**: Build circuits that match the required truth table output
2. **Controls**:
   - Drag gates from the palette onto the board
   - Connect gates by clicking and dragging between connection points
   - Signals flow left to right only
   - Click "Simulate" to test your circuit

3. **Scoring**:
   - ⭐⭐⭐ Complete under time limit with minimal gates
   - ⭐⭐ Complete the level
   - ⭐ Complete with hints

## 📚 Game Concepts

### Logic Gates
- **AND**: Outputs 1 only if both inputs are 1
- **OR**: Outputs 1 if at least one input is 1  
- **XOR**: Outputs 1 if inputs are different
- **NOT**: Inverts the input signal

### Circuit Rules
- All circuits must have a single output (Lamp)
- Wires must flow from left to right
- No cycles allowed (DAG structure enforced)
- All gates must connect to the output

## 🏗️ Project Structure

```
/app                    # Next.js 14 App Router pages
  /level/[id]          # Dynamic level pages
  /sandbox             # Sandbox mode
  page.tsx             # Home/level selection
/components            # React components
  /nodes              # React Flow custom nodes
  Board.tsx           # Main circuit board
  GatePalette.tsx     # Draggable gates panel
  TruthTable.tsx      # Truth table display
/lib                   # Core logic
  /logic              # Circuit evaluation engine
  /levels             # Level definitions
/store                # Zustand state management
/styles              # Global CSS
```

## 🧪 Testing

```bash
npm test              # Run tests
npm run test:ui       # Run tests with UI
```

## 🎯 Educational Goals

This game teaches:
- Boolean algebra fundamentals
- Digital logic circuit design
- Truth tables and logical operations
- Problem-solving and debugging skills
- Computer science fundamentals

## 🤝 Contributing

Built with ❤️ for the Computer Science Society of Nottingham by Shahjalal Mosharof.

## 📝 License

MIT License - Free for educational use.

## 🌟 Credits

Developed as an fun game for CS Fair.

---

**Computer Science Society of Nottingham**  
*Building bytes and creating bonds*
