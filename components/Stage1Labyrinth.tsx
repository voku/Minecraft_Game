import React, { useState, useEffect, useCallback } from 'react';
import { Player, Position, COLORS } from '../types';
import { Key, Lock, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  onWin: (winner: Player) => void;
  isActive: boolean;
}

// 0: Empty, 1: Wall, 2: Key Red, 3: Key Blue, 4: Key Yellow, 9: Exit
const GRID_SIZE = 11;
const INITIAL_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 2, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 3, 0, 0, 0, 0, 0, 0, 0, 4, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 9, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const Stage1Labyrinth: React.FC<Props> = ({ onWin, isActive }) => {
  const [p1Pos, setP1Pos] = useState<Position>({ x: 1, y: 1 });
  const [p2Pos, setP2Pos] = useState<Position>({ x: 1, y: 9 }); // Start lower left
  
  const [p1Keys, setP1Keys] = useState<number[]>([]);
  const [p2Keys, setP2Keys] = useState<number[]>([]);

  // Collect key types: 2, 3, 4
  const REQUIRED_KEYS = [2, 3, 4];

  const handleMove = useCallback((player: Player, dx: number, dy: number) => {
    const setPos = player === 'P1' ? setP1Pos : setP2Pos;
    const currentPos = player === 'P1' ? p1Pos : p2Pos;
    const currentKeys = player === 'P1' ? p1Keys : p2Keys;
    const setKeys = player === 'P1' ? setP1Keys : setP2Keys;

    const newX = currentPos.x + dx;
    const newY = currentPos.y + dy;

    // Boundary & Wall check
    if (
      newX < 0 || newX >= GRID_SIZE || 
      newY < 0 || newY >= GRID_SIZE || 
      INITIAL_MAP[newY][newX] === 1
    ) {
      return;
    }

    const cellContent = INITIAL_MAP[newY][newX];

    // Key Collection
    if ((cellContent === 2 || cellContent === 3 || cellContent === 4) && !currentKeys.includes(cellContent)) {
      setKeys([...currentKeys, cellContent]);
    }

    // Exit Logic
    if (cellContent === 9) {
      if (currentKeys.length === 3) {
        onWin(player);
      } else {
        // Must have keys message? Handled by UI feedback
      }
    }

    setPos({ x: newX, y: newY });
  }, [p1Pos, p2Pos, p1Keys, p2Keys, onWin]);

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

  const renderGrid = (player: Player) => {
    const pos = player === 'P1' ? p1Pos : p2Pos;
    const keys = player === 'P1' ? p1Keys : p2Keys;

    return (
      <div className="relative bg-stone-900 p-2 rounded-lg pixel-shadow pixel-border border-stone-600">
        <div className="grid grid-cols-11 gap-0.5 sm:gap-1">
          {INITIAL_MAP.map((row, y) => (
            row.map((cell, x) => {
              let content = null;
              let bgClass = 'bg-stone-800'; // Floor

              if (cell === 1) bgClass = 'bg-stone-600'; // Wall
              if (cell === 9) bgClass = 'bg-purple-900 border-2 border-purple-500'; // Exit

              // Items (if not collected)
              const isKeyCollected = keys.includes(cell);
              if (!isKeyCollected) {
                if (cell === 2) content = <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-red-500 shadow-[0_0_10px_red]" />;
                if (cell === 3) content = <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-blue-500 shadow-[0_0_10px_blue]" />;
                if (cell === 4) content = <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-yellow-400 shadow-[0_0_10px_yellow]" />;
              }

              // Player
              if (x === pos.x && y === pos.y) {
                 content = (
                   <div className={`w-full h-full ${player === 'P1' ? 'bg-blue-400' : 'bg-red-400'} border-2 border-white animate-pulse`}>
                     <div className="w-full h-1/3 bg-black opacity-20 mt-1"></div>
                   </div>
                 );
              }

              // Exit visualization
              if (cell === 9) {
                content = <Lock size={16} className={keys.length === 3 ? "text-green-400 animate-bounce" : "text-gray-500"} />;
              }

              return (
                <div key={`${x}-${y}`} className={`aspect-square flex items-center justify-center ${bgClass} rounded-sm`}>
                  {content}
                </div>
              );
            })
          ))}
        </div>
        
        {/* HUD */}
        <div className="mt-2 flex justify-between items-center bg-black/50 p-2 rounded">
           <div className="text-xs text-gray-300">KEYS:</div>
           <div className="flex gap-2">
              <Key size={16} className={keys.includes(2) ? "text-red-500" : "text-gray-700"} />
              <Key size={16} className={keys.includes(3) ? "text-blue-500" : "text-gray-700"} />
              <Key size={16} className={keys.includes(4) ? "text-yellow-400" : "text-gray-700"} />
           </div>
        </div>
      </div>
    );
  };

  const DPad = ({ player }: { player: Player }) => {
    const colorClass = player === 'P1' ? 'bg-blue-600 active:bg-blue-500' : 'bg-red-600 active:bg-red-500';
    const btnBase = `w-14 h-14 ${colorClass} rounded-lg shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform touch-none border-b-4 border-black active:border-b-0 active:translate-y-1`;
    
    return (
      <div className="flex flex-col items-center gap-2 mt-4 select-none">
         <button className={btnBase} onPointerDown={(e) => { e.preventDefault(); handleMove(player, 0, -1); }}>
           <ChevronUp size={32} />
         </button>
         <div className="flex gap-4">
           <button className={btnBase} onPointerDown={(e) => { e.preventDefault(); handleMove(player, -1, 0); }}>
             <ChevronLeft size={32} />
           </button>
           <button className={btnBase} onPointerDown={(e) => { e.preventDefault(); handleMove(player, 1, 0); }}>
             <ChevronRight size={32} />
           </button>
         </div>
         <button className={btnBase} onPointerDown={(e) => { e.preventDefault(); handleMove(player, 0, 1); }}>
           <ChevronDown size={32} />
         </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row w-full gap-4 md:gap-8 justify-center items-start">
      <div className="w-full max-w-sm flex flex-col items-center">
        <h3 className={`text-xl font-bold mb-2 ${COLORS.P1_TEXT} text-center`}>Spieler 1</h3>
        {renderGrid('P1')}
        <DPad player="P1" />
      </div>
      <div className="w-full max-w-sm flex flex-col items-center">
        <h3 className={`text-xl font-bold mb-2 ${COLORS.P2_TEXT} text-center`}>Spieler 2</h3>
        {renderGrid('P2')}
        <DPad player="P2" />
      </div>
    </div>
  );
};

export default Stage1Labyrinth;