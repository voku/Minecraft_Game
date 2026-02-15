import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Player, Position, COLORS } from '../types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gem } from 'lucide-react';

interface Props {
  onWin: (winner: Player) => void;
  isActive: boolean;
}

// Map IDs
// 0: Floor
// 1: Wall
// 8: Start
// 9: Goal (Obsidian Frame)
// 10: Blue Portal A
// 11: Blue Portal B
// 20: Orange Portal A
// 21: Orange Portal B

const MAP_SIZE = 9;
const LEVEL_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 8, 0, 1, 20, 0, 0, 0, 1], // (1,1) Start, (4,1) Orange A
  [1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 10, 0, 0, 0, 0, 1, 0, 1], // (1,3) Blue A
  [1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 21, 0, 0, 1, 0, 0, 0, 1], // (1,5) Orange B
  [1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 11, 0, 0, 0, 0, 9, 0, 1], // (1,7) Blue B, (7,7) Goal
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Logic:
// Start at (1,1). 
// Path to right is blocked. Go Down to (1,3) Blue A.
// Teleport -> Blue B (1,7).
// From (1,7), go right to (7,7) Goal? No, blocked at (6,7)? Wait map row 7 is clear 0s.
// Let's make it trickier. 
// Redefining Map for better puzzle flow.

const PUZZLE_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 8, 0, 0, 1, 0, 0, 11, 1], // (1,1) Start. (7,1) Blue B
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 10, 0, 0, 0, 0, 0, 20, 1], // (1,3) Blue A. (7,3) Orange A
  [1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 21, 0, 0, 0, 0, 1, 0, 1], // (1,5) Orange B
  [1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 9, 0, 0, 0, 0, 0, 0, 1], // (1,7) Goal
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];
// Flow:
// 1. Start (1,1). Blocked right. Go down to (1,3) Blue A.
// 2. Teleport to Blue B (7,1).
// 3. Move from (7,1) down to (7,3) Orange A.
// 4. Teleport to Orange B (1,5).
// 5. Move from (1,5) down to (1,7) Goal.

const Stage2Portal: React.FC<Props> = ({ onWin, isActive }) => {
  const [p1Pos, setP1Pos] = useState<Position>({ x: 1, y: 1 });
  const [p2Pos, setP2Pos] = useState<Position>({ x: 1, y: 1 });

  // Find portal coordinates for teleport lookup
  const portalCoords = useMemo(() => {
    const coords: Record<number, Position> = {};
    PUZZLE_MAP.forEach((row, y) => {
      row.forEach((cell, x) => {
        if ([10, 11, 20, 21].includes(cell)) {
          coords[cell] = { x, y };
        }
      });
    });
    return coords;
  }, []);

  const getPortalDestination = (cellId: number): Position | null => {
    if (cellId === 10) return portalCoords[11]; // Blue A -> Blue B
    if (cellId === 11) return portalCoords[10]; // Blue B -> Blue A
    if (cellId === 20) return portalCoords[21]; // Orange A -> Orange B
    if (cellId === 21) return portalCoords[20]; // Orange B -> Orange A
    return null;
  };

  const handleMove = useCallback((player: Player, dx: number, dy: number) => {
    const setPos = player === 'P1' ? setP1Pos : setP2Pos;
    const currentPos = player === 'P1' ? p1Pos : p2Pos;

    const newX = currentPos.x + dx;
    const newY = currentPos.y + dy;

    // Bounds & Wall check
    if (
      newX < 0 || newX >= MAP_SIZE || 
      newY < 0 || newY >= MAP_SIZE || 
      PUZZLE_MAP[newY][newX] === 1
    ) {
      return;
    }

    const cellContent = PUZZLE_MAP[newY][newX];
    
    // Check Goal
    if (cellContent === 9) {
      onWin(player);
      setPos({ x: newX, y: newY });
      return;
    }

    // Check Portal Teleport
    const dest = getPortalDestination(cellContent);
    if (dest) {
      // Teleport!
      // Add a small delay/animation frame if we wanted, but instant is fine for "Portal" feel
      setPos(dest);
    } else {
      // Normal Move
      setPos({ x: newX, y: newY });
    }

  }, [p1Pos, p2Pos, portalCoords, onWin]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // P1: WASD
      if (e.key === 'w') handleMove('P1', 0, -1);
      if (e.key === 's') handleMove('P1', 0, 1);
      if (e.key === 'a') handleMove('P1', -1, 0);
      if (e.key === 'd') handleMove('P1', 1, 0);

      // P2: Arrows
      if (e.key === 'ArrowUp') handleMove('P2', 0, -1);
      if (e.key === 'ArrowDown') handleMove('P2', 0, 1);
      if (e.key === 'ArrowLeft') handleMove('P2', -1, 0);
      if (e.key === 'ArrowRight') handleMove('P2', 1, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, isActive]);

  const renderMap = (player: Player) => {
    const pos = player === 'P1' ? p1Pos : p2Pos;
    
    return (
      <div className="relative bg-black p-2 rounded-lg pixel-shadow border-4 border-gray-700">
        <div className="grid grid-cols-9 gap-1">
          {PUZZLE_MAP.map((row, y) => (
            row.map((cell, x) => {
              let content = null;
              let bgClass = 'bg-stone-800'; // Floor

              if (cell === 1) bgClass = 'bg-stone-600'; // Wall
              if (cell === 8) bgClass = 'bg-green-900/50'; // Start

              // Portals
              if (cell === 10 || cell === 11) { // Blue
                content = <div className="w-full h-full rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] border-2 border-blue-200 animate-pulse" />;
              }
              if (cell === 20 || cell === 21) { // Orange
                content = <div className="w-full h-full rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] border-2 border-orange-200 animate-pulse" />;
              }

              // Goal
              if (cell === 9) {
                bgClass = 'bg-purple-900';
                content = (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="w-2/3 h-full border-x-4 border-purple-500 bg-purple-950 animate-pulse"></div>
                  </div>
                );
              }

              // Player
              if (x === pos.x && y === pos.y) {
                content = (
                   <div className={`w-full h-full ${player === 'P1' ? 'bg-blue-400' : 'bg-red-400'} border-2 border-white relative z-10`}>
                     <div className="w-full h-1/3 bg-black opacity-20 mt-1"></div>
                   </div>
                 );
              }

              return (
                <div key={`${x}-${y}`} className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center ${bgClass} rounded-sm`}>
                  {content}
                </div>
              );
            })
          ))}
        </div>
      </div>
    );
  };

  const DPad = ({ player }: { player: Player }) => {
    const colorClass = player === 'P1' ? 'bg-blue-600 active:bg-blue-500' : 'bg-red-600 active:bg-red-500';
    const btnBase = `w-12 h-12 sm:w-14 sm:h-14 ${colorClass} rounded-lg shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform touch-none border-b-4 border-black active:border-b-0 active:translate-y-1`;
    
    return (
      <div className="flex flex-col items-center gap-2 mt-4 select-none touch-none">
         <button className={btnBase} onPointerDown={(e) => { e.preventDefault(); handleMove(player, 0, -1); }}>
           <ChevronUp size={28} />
         </button>
         <div className="flex gap-4">
           <button className={btnBase} onPointerDown={(e) => { e.preventDefault(); handleMove(player, -1, 0); }}>
             <ChevronLeft size={28} />
           </button>
           <button className={btnBase} onPointerDown={(e) => { e.preventDefault(); handleMove(player, 1, 0); }}>
             <ChevronRight size={28} />
           </button>
         </div>
         <button className={btnBase} onPointerDown={(e) => { e.preventDefault(); handleMove(player, 0, 1); }}>
           <ChevronDown size={28} />
         </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full">
       <div className="bg-purple-900/30 p-2 sm:p-4 rounded-lg border border-purple-500 text-center w-full max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-300">PORTAL LABYRINTH</h2>
          <p className="text-gray-300 text-xs sm:text-sm">Betrete die Portale, um den Weg zum Ziel zu finden!</p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Blau zu Blau</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Orange zu Orange</div>
          </div>
       </div>

       <div className="flex flex-col md:flex-row gap-8 sm:gap-12 justify-center items-start w-full">
          <div className="flex flex-col items-center">
              <h3 className={`text-lg font-bold mb-2 ${COLORS.P1_TEXT}`}>Spieler 1</h3>
              {renderMap('P1')}
              <DPad player="P1" />
          </div>
          <div className="flex flex-col items-center">
              <h3 className={`text-lg font-bold mb-2 ${COLORS.P2_TEXT}`}>Spieler 2</h3>
              {renderMap('P2')}
              <DPad player="P2" />
          </div>
       </div>
    </div>
  );
};

export default Stage2Portal;
