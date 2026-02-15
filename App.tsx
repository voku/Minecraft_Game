import React, { useState } from 'react';
import { GameStage, Player, Score, COLORS } from './types';
import Stage1Labyrinth from './components/Stage1Labyrinth';
import Stage2Portal from './components/Stage2Portal';
import Stage3TNT from './components/Stage3TNT';
import { Trophy, Play, RefreshCw, Gamepad2, Tablet } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<GameStage>('menu');
  const [score, setScore] = useState<Score>({ P1: 0, P2: 0 });
  const [winner, setWinner] = useState<Player | null>(null);

  const startGame = () => {
    setScore({ P1: 0, P2: 0 });
    setWinner(null);
    setStage('labyrinth');
  };

  const handleStageWin = (stageWinner: Player) => {
    const newScore = { ...score, [stageWinner]: score[stageWinner] + 1 };
    setScore(newScore);

    // Progression Logic
    if (stage === 'labyrinth') {
      // Show brief interstitial? For now, instant jump
      alert(`${stageWinner === 'P1' ? 'Spieler 1' : 'Spieler 2'} gewinnt das Labyrinth!`);
      setStage('portal');
    } else if (stage === 'portal') {
      alert(`${stageWinner === 'P1' ? 'Spieler 1' : 'Spieler 2'} hat das Portal gebaut!`);
      setStage('tnt');
    } else if (stage === 'tnt') {
      // Game Over
      setStage('winner');
      // Determine overall winner
      if (newScore.P1 > newScore.P2) setWinner('P1');
      else if (newScore.P2 > newScore.P1) setWinner('P2');
      else setWinner(null); // Tie, handle if needed, or just show scores
    }
  };

  const renderContent = () => {
    switch (stage) {
      case 'menu':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen space-y-8 bg-[url('https://picsum.photos/id/237/200/300')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-black/80"></div>
            <div className="z-10 text-center space-y-6 max-w-2xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold text-green-500 tracking-tighter drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                MINECRAFT CHALLENGE
              </h1>
              <p className="text-gray-300 text-lg">Das ultimative Duell auf dem Tablet!</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-gray-900/80 p-6 rounded-xl border border-gray-700">
                <div className="space-y-2">
                  <h3 className="text-blue-400 font-bold text-xl flex items-center gap-2">
                    <Tablet size={24} /> Spieler 1
                  </h3>
                  <ul className="text-sm text-gray-300 list-disc list-inside">
                    <li>Benutze die Touch-Buttons links</li>
                    <li>Tippe schnell auf den Screen!</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-red-400 font-bold text-xl flex items-center gap-2">
                    <Tablet size={24} /> Spieler 2
                  </h3>
                  <ul className="text-sm text-gray-300 list-disc list-inside">
                    <li>Benutze die Touch-Buttons rechts</li>
                    <li>Tippe schnell auf den Screen!</li>
                  </ul>
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                (Tastatur funktioniert weiterhin für PC-Spieler)
              </div>

              <button 
                onClick={startGame}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-12 rounded-none pixel-border pixel-shadow text-2xl transition-transform active:scale-95 flex items-center gap-4 mx-auto mt-4"
              >
                <Play fill="white" /> START
              </button>

              <div className="mt-6">
                <a 
                  href="https://github.com/voku/Minecraft_Game/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm underline"
                >
                  🌟 Contribute on GitHub
                </a>
              </div>
            </div>
          </div>
        );

      case 'winner':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white space-y-8 p-4 text-center">
            <Trophy size={80} className="text-yellow-400 animate-bounce" />
            <h1 className="text-5xl font-bold">SPIEL VORBEI!</h1>
            
            <div className="text-3xl space-y-2">
              <div className={score.P1 > score.P2 ? "text-green-400 font-bold" : "text-gray-400"}>
                Spieler 1: {score.P1} Punkte
              </div>
              <div className={score.P2 > score.P1 ? "text-green-400 font-bold" : "text-gray-400"}>
                Spieler 2: {score.P2} Punkte
              </div>
            </div>

            <div className="text-2xl mt-8">
              {score.P1 === score.P2 ? (
                <span className="text-yellow-200">UNENTSCHIEDEN!</span>
              ) : (
                <span className={score.P1 > score.P2 ? "text-blue-400" : "text-red-400"}>
                  {score.P1 > score.P2 ? "SPIELER 1" : "SPIELER 2"} GEWINNT!
                </span>
              )}
            </div>

            <button 
              onClick={() => setStage('menu')}
              className="mt-8 bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded pixel-shadow font-bold flex items-center gap-2"
            >
              <RefreshCw /> ZURÜCK ZUM MENÜ
            </button>
          </div>
        );

      default:
        // Game HUD Wrapper
        return (
          <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Header/Scoreboard */}
            <div className="bg-slate-900 border-b-4 border-slate-800 p-2 sm:p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
               <div className={`flex flex-col ${COLORS.P1_TEXT} font-bold text-sm sm:text-base`}>
                 <span>SPIELER 1</span>
                 <span className="text-xl sm:text-2xl">{score.P1} 🏆</span>
               </div>

               <div className="bg-slate-800 px-4 py-1 sm:px-6 sm:py-2 rounded-lg border-2 border-slate-600 text-center">
                  <span className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest block mb-1">Level</span>
                  <span className="text-sm sm:text-xl font-bold text-white whitespace-nowrap">
                    {stage === 'labyrinth' && "1. LABYRINTH"}
                    {stage === 'portal' && "2. PORTAL"}
                    {stage === 'tnt' && "3. TNT FELD"}
                  </span>
               </div>

               <div className={`flex flex-col ${COLORS.P2_TEXT} font-bold text-right text-sm sm:text-base`}>
                 <span>SPIELER 2</span>
                 <span className="text-xl sm:text-2xl">{score.P2} 🏆</span>
               </div>
            </div>

            {/* Game Content */}
            <div className="flex-grow flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
              {stage === 'labyrinth' && <Stage1Labyrinth onWin={handleStageWin} isActive={true} />}
              {stage === 'portal' && <Stage2Portal onWin={handleStageWin} isActive={true} />}
              {stage === 'tnt' && <Stage3TNT onWin={handleStageWin} isActive={true} />}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="font-mono">
      {renderContent()}
    </div>
  );
};

export default App;