# Minecraft Challenge: Duo Adventure

A two-player Minecraft-themed mini-game collection built with React and TypeScript. Players compete through three exciting challenges: a labyrinth race, portal building, and TNT field navigation.

## 🎮 Features

- **Three Unique Mini-Games**: Labyrinth race, Portal building, and TNT field challenges
- **Two-Player Competition**: Simultaneous gameplay on keyboard or touch devices
- **Responsive Design**: Works on desktop and tablet devices
- **Real-time Score Tracking**: Keep track of each player's victories
- **Pixel Art Aesthetic**: Minecraft-inspired visual design

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/voku/Minecraft_Game.git
   cd Minecraft_Game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 📦 Build

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 How to Play

### Game Stages

1. **Labyrinth**: Navigate through the maze to reach the exit first
2. **Portal**: Build your portal by collecting the required blocks
3. **TNT Field**: Carefully navigate through the explosive field

### Controls

- **Player 1**: Touch buttons on the left side or keyboard arrows (W/A/S/D)
- **Player 2**: Touch buttons on the right side or keyboard arrows (Arrow Keys)

## 🤝 Contributing

Contributions are welcome! Visit the [project repository](https://github.com/voku/Minecraft_Game/) to report issues or submit pull requests.

## 📂 Key Files Detector

To understand the codebase structure, here are the key files:

- **`App.tsx`**: Main application component with game flow logic
- **`index.html`**: Entry point HTML file with game styling
- **`index.tsx`**: React application bootstrap
- **`types.ts`**: TypeScript type definitions for game entities
- **`components/Stage1Labyrinth.tsx`**: Labyrinth mini-game implementation
- **`components/Stage2Portal.tsx`**: Portal building mini-game
- **`components/Stage3TNT.tsx`**: TNT field mini-game
- **`vite.config.ts`**: Vite build configuration
- **`package.json`**: Project dependencies and scripts

## 📄 License

This project is open source and available under the MIT License.

## 🌐 Live Demo

Visit the live demo at: [https://voku.github.io/Minecraft_Game/](https://voku.github.io/Minecraft_Game/)
