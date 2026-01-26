
import React from 'react';
import { Player } from './types';

interface PlayerCardProps {
  player: Player;
  isAdmin?: boolean;
  onEdit?: () => void;
  onViewPhoto?: (url: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isAdmin, onEdit, onViewPhoto }) => {
  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all group relative shadow-xl">
      <div 
        className={`relative h-40 bg-slate-800 flex items-center justify-center overflow-hidden ${player.photo ? 'cursor-zoom-in' : ''}`}
        onClick={() => player.photo && onViewPhoto?.(player.photo)}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
        <span className="text-7xl font-sport text-slate-700 select-none group-hover:scale-110 transition-transform">{player.number}</span>
        {player.photo && <img src={player.photo} alt={player.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />}
        
        {/* Badge de Pagamento */}
        <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-lg z-10 ${player.isPaid ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white animate-pulse'}`}>
          {player.isPaid ? 'Mensalidade OK' : 'Débito'}
        </div>

        {isAdmin && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="absolute top-2 right-2 p-2 bg-emerald-600 rounded-xl text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"
            title="Editar Atleta"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-sport text-xl tracking-wider text-white uppercase">{player.nickname}</h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em]">{player.position}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5 tracking-tighter">Rating</p>
            <span className="bg-slate-800 text-white text-xs font-black px-2 py-1 rounded-lg border border-slate-700">
              {player.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5 text-center border-t border-slate-800/50 pt-4">
          <div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Gols</p>
            <p className="font-sport text-lg text-white">{player.goals}</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Assists</p>
            <p className="font-sport text-lg text-white">{player.assists}</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Jogos</p>
            <p className="font-sport text-lg text-white">{player.gamesPlayed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
