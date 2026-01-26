
import React from 'react';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  isAdmin?: boolean;
  onEdit?: () => void;
  onViewPhoto?: (url: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isAdmin, onEdit, onViewPhoto }) => {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all group relative">
      <div 
        className={`relative h-32 bg-slate-800 flex items-center justify-center overflow-hidden ${player.photo ? 'cursor-zoom-in' : ''}`}
        onClick={() => player.photo && onViewPhoto?.(player.photo)}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
        <span className="text-6xl font-sport text-slate-700 select-none group-hover:scale-110 transition-transform">{player.number}</span>
        {player.photo && <img src={player.photo} alt={player.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />}
        
        {isAdmin && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="absolute top-2 right-2 p-2 bg-emerald-600 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Editar Atleta"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg leading-tight">{player.nickname}</h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest">{player.position}</p>
          </div>
          <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-2 py-1 rounded">
            Nota: {player.rating}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center border-t border-slate-800 pt-4">
          <div>
            <p className="text-[10px] text-slate-500 uppercase">Gols</p>
            <p className="font-bold">{player.goals}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase">Assists</p>
            <p className="font-bold">{player.assists}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase">Jogos</p>
            <p className="font-bold">{player.gamesPlayed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
