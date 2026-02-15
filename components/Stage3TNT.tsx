import React, { useState, useEffect } from 'react';
import { Player, COLORS } from '../types';
import { Gem, Bomb, Pickaxe } from 'lucide-react';

interface Props {
  onWin: (winner: Player) => void;
  isActive: boolean;
}

interface Cell {
  id: number;
  type: 'empty' | 'gem' | 'tnt';
  revealedP1: boolean;
  revealedP2: boolean;
}

const GRID_W = 5;
const GRID_H = 5;
const TOTAL_GEMS = 5;

const Stage3TNT: React.FC<Props> = ({ onWin, isActive }) => {
  const [gridP1, setGridP1] = useState<Cell[]>([]);
  const [gridP2, setGridP2] = useState<Cell[]>([]);
  
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  
  const [stunP1, setStunP1] = useState(0); // Time remaining in ms
  const [stunP2, setStunP2] = useState(0);

  // Generate a random grid
  const generateGrid = () => {
    const cells: Cell[] = [];
    // Initialize empty
    for (let i = 0; i < GRID_W * GRID_H; i++) {
      cells.push({ id: i, type: 'empty', revealedP1: false, revealedP2: false });
    }
    
    // Place Gems
    let placedGems = 0;
    while (placedGems < TOTAL_GEMS) {
      const idx = Math.floor(Math.random() * cells.length);
      if (cells[idx].type === 'empty') {
        cells[idx].type = 'gem';
        placedGems++;
      }
    }
    
    // Place TNT (approx 6-8)
    let placedTNT = 0;
    while (placedTNT < 7) {
      const idx = Math.floor(Math.random() * cells.length);
      if (cells[idx].type === 'empty') {
        cells[idx].type = 'tnt';
        placedTNT++;
      }
    }
    return cells;
  };

  useEffect(() => {
    setGridP1(generateGrid());
    setGridP2(generateGrid()); 
  }, []);

  // Timer for stuns
  useEffect(() => {
    const interval = setInterval(() => {
      setStunP1(prev => Math.max(0, prev - 100));
      setStunP2(prev => Math.max(0, prev - 100));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Check Win
  useEffect(() => {
    if (scoreP1 >= 3) onWin('P1');
    if (scoreP2 >= 3) onWin('P2');
  }, [scoreP1, scoreP2, onWin]);

  const handleDig = (player: Player, index: number) => {
    if (player === 'P1') {
      if (stunP1 > 0 || gridP1[index].revealedP1) return;
      
      const newGrid = [...gridP1];
      newGrid[index].revealedP1 = true;
      setGridP1(newGrid);

      if (newGrid[index].type === 'gem') setScoreP1(prev => prev + 1);
      if (newGrid[index].type === 'tnt') setStunP1(2000); // 2s stun
    } else {
      if (stunP2 > 0 || gridP2[index].revealedP2) return;
      
      const newGrid = [...gridP2];
      newGrid[index].revealedP2 = true;
      setGridP2(newGrid);

      if (newGrid[index].type === 'gem') setScoreP2(prev => prev + 1);
      if (newGrid[index].type === 'tnt') setStunP2(2000); // 2s stun
    }
  };
  
  // Navigation for keyboard support (Hybrid)
  const [cursorP1, setCursorP1] = useState(0);
  const [cursorP2, setCursorP2] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // P1: WASD + Space
      if (stunP1 === 0) {
          if (e.key === 'w' && cursorP1 >= GRID_W) setCursorP1(c => c - GRID_W);
          if (e.key === 's' && cursorP1 < GRID_W * (GRID_H - 1)) setCursorP1(c => c + GRID_W);
          if (e.key === 'a' && cursorP1 % GRID_W !== 0) setCursorP1(c => c - 1);
          if (e.key === 'd' && (cursorP1 + 1) % GRID_W !== 0) setCursorP1(c => c + 1);
          if (e.code === 'Space' || e.key === 'e') handleDig('P1', cursorP1);
      }

      // P2: Arrows + Enter
      if (stunP2 === 0) {
          if (e.key === 'ArrowUp' && cursorP2 >= GRID_W) setCursorP2(c => c - GRID_W);
          if (e.key === 'ArrowDown' && cursorP2 < GRID_W * (GRID_H - 1)) setCursorP2(c => c + GRID_W);
          if (e.key === 'ArrowLeft' && cursorP2 % GRID_W !== 0) setCursorP2(c => c - 1);
          if (e.key === 'ArrowRight' && (cursorP2 + 1) % GRID_W !== 0) setCursorP2(c => c + 1);
          if (e.key === 'Enter') handleDig('P2', cursorP2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorP1, cursorP2, stunP1, stunP2, gridP1, gridP2, isActive]);

  const renderField = (player: Player) => {
    const grid = player === 'P1' ? gridP1 : gridP2;
    const cursor = player === 'P1' ? cursorP1 : cursorP2;
    const stun = player === 'P1' ? stunP1 : stunP2;
    const revealedKey = player === 'P1' ? 'revealedP1' : 'revealedP2';

    return (
      <div className={`relative bg-amber-900 p-2 rounded pixel-border ${stun > 0 ? 'animate-shake opacity-50' : ''}`}>
        {stun > 0 && (
           <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 text-red-500 font-bold text-2xl animate-pulse rounded">
             BOOM! ({(stun/1000).toFixed(1)}s)
           </div>
        )}
        <div className="grid grid-cols-5 gap-1.5">
          {grid.map((cell, idx) => {
            const isRevealed = (cell as any)[revealedKey];
            const isCursor = cursor === idx;
            
            let content = null;
            let bg = 'bg-amber-700'; // Grass/Dirt top

            if (isRevealed) {
              bg = 'bg-amber-950'; // Dug dirt
              if (cell.type === 'gem') content = <Gem className="text-emerald-400 animate-bounce w-6 h-6 sm:w-8 sm:h-8" />;
              if (cell.type === 'tnt') content = <Bomb className="text-red-500 w-6 h-6 sm:w-8 sm:h-8" />;
            }

            return (
              <div 
                key={idx}
                className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center ${bg} 
                  ${!isRevealed ? 'active:brightness-110' : ''}
                  ${isCursor && !isRevealed ? 'border-4 border-white' : 'border border-amber-900'}
                  rounded-sm transition-colors cursor-pointer select-none touch-manipulation`}
                onClick={() => handleDig(player, idx)}
              >
                {content}
                {!isRevealed && isCursor && <Pickaxe size={16} className="text-gray-300 opacity-50" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center max-w-4xl">
       <div className="text-center bg-amber-900/50 p-2 sm:p-4 rounded-lg border border-amber-600 w-full">
         <h2 className="text-xl sm:text-2xl font-bold text-amber-200">TNT MINESWEEPER</h2>
         <p className="text-amber-100 text-xs sm:text-sm">Tippe auf ein Feld, um zu graben! Finde 3 Smaragde!</p>
       </div>

       <div className="flex flex-row gap-4 sm:gap-12 justify-center w-full">
          <div className="flex flex-col items-center">
             <h3 className={`${COLORS.P1_TEXT} font-bold mb-2`}>Spieler 1 ({scoreP1}/3)</h3>
             {renderField('P1')}
          </div>
          <div className="flex flex-col items-center">
             <h3 className={`${COLORS.P2_TEXT} font-bold mb-2`}>Spieler 2 ({scoreP2}/3)</h3>
             {renderField('P2')}
          </div>
       </div>
    </div>
  );
};

export default Stage3TNT;