
import React, { useState, useEffect, useRef } from 'react';
import { Player, Formation } from './types';

interface TacticalFieldProps {
  players: Player[];
  formation: Formation;
  isAdmin: boolean;
  customPositions?: { top: string; left: string }[];
  onPositionsChange?: (newPositions: { top: string; left: string }[]) => void;
}

const TacticalField: React.FC<TacticalFieldProps> = ({ players, formation, isAdmin, customPositions, onPositionsChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<{ top: string; left: string }[]>([]);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const getDefaultPositions = (f: Formation) => {
    const pos: { top: string; left: string }[] = [];
    pos.push({ top: '88%', left: '50%' }); // GK
    if (f === '4-4-2') {
      pos.push({ top: '70%', left: '15%' }, { top: '75%', left: '38%' }, { top: '75%', left: '62%' }, { top: '70%', left: '85%' });
      pos.push({ top: '45%', left: '15%' }, { top: '50%', left: '38%' }, { top: '50%', left: '62%' }, { top: '45%', left: '85%' });
      pos.push({ top: '20%', left: '35%' }, { top: '20%', left: '65%' });
    }
    // ... simplificado para exemplo, adicione outras se precisar
    return pos.length === 11 ? pos : Array(11).fill({ top: '50%', left: '50%' });
  };

  useEffect(() => {
    setPositions(customPositions && customPositions.length > 0 ? customPositions : getDefaultPositions(formation));
  }, [formation, customPositions]);

  return (
    <div ref={containerRef} className="relative w-full aspect-[2/3] max-w-md mx-auto bg-emerald-900 rounded-2xl border-4 border-slate-800 overflow-hidden shadow-2xl">
      <div className="absolute inset-4 border-2 border-white/30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 -translate-y-1/2"></div>
      {players.slice(0, 11).map((player, idx) => (
        <div key={player.id} style={positions[idx]} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-emerald-400 flex items-center justify-center text-[10px] font-bold text-white">
            {player.number}
          </div>
          <span className="text-[7px] text-white font-bold uppercase bg-black/50 px-1 rounded">{player.nickname}</span>
        </div>
      ))}
    </div>
  );
};

export default TacticalField;
