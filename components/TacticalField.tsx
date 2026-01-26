
import React, { useState, useEffect, useRef } from 'react';
import { Player, Formation } from '../types';

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
    } else if (f === '4-3-3') {
      pos.push({ top: '70%', left: '15%' }, { top: '75%', left: '38%' }, { top: '75%', left: '62%' }, { top: '70%', left: '85%' });
      pos.push({ top: '48%', left: '25%' }, { top: '52%', left: '50%' }, { top: '48%', left: '75%' });
      pos.push({ top: '20%', left: '15%' }, { top: '15%', left: '50%' }, { top: '20%', left: '85%' });
    } else if (f === '3-5-2') {
      pos.push({ top: '72%', left: '25%' }, { top: '78%', left: '50%' }, { top: '72%', left: '75%' });
      pos.push({ top: '50%', left: '12%' }, { top: '45%', left: '32%' }, { top: '52%', left: '50%' }, { top: '45%', left: '68%' }, { top: '50%', left: '88%' });
      pos.push({ top: '20%', left: '35%' }, { top: '20%', left: '65%' });
    } else if (f === '2-2-1') {
      pos.push({ top: '72%', left: '30%' }, { top: '72%', left: '70%' });
      pos.push({ top: '45%', left: '30%' }, { top: '45%', left: '70%' });
      pos.push({ top: '18%', left: '50%' });
    } else {
      // 3-2-1
      pos.push({ top: '75%', left: '25%' }, { top: '78%', left: '50%' }, { top: '75%', left: '75%' });
      pos.push({ top: '45%', left: '35%' }, { top: '45%', left: '65%' });
      pos.push({ top: '20%', left: '50%' });
    }
    return pos;
  };

  useEffect(() => {
    if (customPositions && customPositions.length > 0) {
      setPositions(customPositions);
    } else {
      setPositions(getDefaultPositions(formation));
    }
  }, [formation, customPositions]);

  const handleMouseDown = (idx: number) => {
    if (isAdmin) setDraggingIdx(idx);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingIdx === null || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const newPositions = [...positions];
    newPositions[draggingIdx] = {
      top: `${Math.max(0, Math.min(100, y))}%`,
      left: `${Math.max(0, Math.min(100, x))}%`
    };
    setPositions(newPositions);
  };

  const handleMouseUp = () => {
    if (draggingIdx !== null && onPositionsChange) {
      onPositionsChange(positions);
    }
    setDraggingIdx(null);
  };

  const limit = formation === '2-2-1' ? 6 : 11;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      className="relative w-full aspect-[2/3] max-w-md mx-auto bg-emerald-900 rounded-2xl border-4 border-slate-800 overflow-hidden shadow-2xl select-none"
    >
      {/* Pitch Lines */}
      <div className="absolute inset-4 border-2 border-white/30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Penalty Areas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-t-0 border-white/30"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-b-0 border-white/30"></div>

      {/* Players */}
      {players.slice(0, limit).map((player, idx) => {
        const style = positions[idx] || { top: '50%', left: '50%' };
        return (
          <div 
            key={player.id}
            style={style}
            onMouseDown={() => handleMouseDown(idx)}
            onTouchStart={() => handleMouseDown(idx)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 ${isAdmin ? 'cursor-move' : 'cursor-default'}`}
          >
            <div className={`w-10 h-10 rounded-full bg-slate-900 border-2 ${draggingIdx === idx ? 'border-yellow-400 scale-125' : 'border-emerald-400'} flex items-center justify-center text-xs font-bold text-white shadow-lg transition-transform`}>
              {player.number}
            </div>
            <div className="mt-1 bg-slate-900/90 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold whitespace-nowrap uppercase border border-white/10 text-white">
              {player.nickname}
            </div>
          </div>
        );
      })}

      {isAdmin && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-[8px] text-white font-bold uppercase tracking-widest pointer-events-none">
          Arraste os jogadores para ajustar
        </div>
      )}
    </div>
  );
};

export default TacticalField;
