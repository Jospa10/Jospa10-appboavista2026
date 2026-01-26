
import React from 'react';
import { Match, MatchStatus } from '../types';

interface MatchCardProps {
  match: Match;
  teamName: string;
  teamLogo?: string;
  isAdmin?: boolean;
  onEdit?: (match: Match) => void;
  onOpenTechnicalSheet?: (match: Match) => void;
  onUpdateStatus?: (matchId: string, status: MatchStatus) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, teamName, teamLogo, isAdmin, onEdit, onOpenTechnicalSheet, onUpdateStatus }) => {
  const isPast = match.status === MatchStatus.FINISHED;
  const isCanceled = match.status === MatchStatus.CANCELED;
  
  const date = new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const time = new Date(match.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const getStatusColor = () => {
    switch (match.status) {
      case MatchStatus.FINISHED: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case MatchStatus.CANCELED: return 'text-red-400 bg-red-500/10 border-red-500/20';
      case MatchStatus.SCHEDULED: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className={`bg-slate-900 p-5 rounded-xl border transition-all relative group ${isPast ? 'border-slate-800' : isCanceled ? 'border-red-900/30 opacity-75' : 'border-emerald-500/30 shadow-lg shadow-emerald-500/5'}`}>
      
      {isAdmin && (
        <button 
          onClick={() => onEdit?.(match)}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-emerald-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
          title="Editar Partida"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}

      <div className="flex justify-between items-center mb-4 pr-8">
        <div className="flex gap-2 items-center">
          <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${getStatusColor()}`}>
            {match.status}
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{date} • {time}</span>
      </div>
      
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden border border-emerald-500/20">
            {teamLogo ? (
              <img src={teamLogo} alt={teamName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">⚽</span>
            )}
          </div>
          <p className="text-[10px] font-bold truncate text-emerald-500 uppercase tracking-tighter">{teamName}</p>
        </div>

        <div className="flex items-center gap-3">
          {isPast ? (
            <div className="flex gap-3 items-center text-3xl font-sport tracking-widest text-white">
              <span>{match.scoreHome ?? 0}</span>
              <span className="text-slate-700 text-xl">-</span>
              <span>{match.scoreAway ?? 0}</span>
            </div>
          ) : (
            <div className="bg-slate-950 px-4 py-1.5 rounded-lg border border-slate-800 text-[10px] font-black text-slate-500 tracking-widest">VS</div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden border border-slate-800">
            {match.opponentLogo ? (
              <img src={match.opponentLogo} alt={match.opponent} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">🛡️</span>
            )}
          </div>
          <p className="text-[10px] font-bold truncate text-slate-400 uppercase tracking-tighter">{match.opponent}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
        <span className={`w-1.5 h-1.5 rounded-full ${isCanceled ? 'bg-red-600' : isPast ? 'bg-blue-600' : 'bg-emerald-600 animate-pulse'}`}></span>
        <span className="truncate">{match.location}</span>
      </div>

      <div className="mt-5 flex gap-2">
        {isPast ? (
          <button 
            onClick={() => onOpenTechnicalSheet?.(match)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition-all text-[10px] uppercase tracking-[0.2em] border border-slate-700"
          >
            Ficha Técnica
          </button>
        ) : !isCanceled ? (
          <>
            <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 text-[10px] uppercase tracking-[0.2em]">
              Confirmar Presença
            </button>
            {isAdmin && (
              <button 
                onClick={() => onUpdateStatus?.(match.id, MatchStatus.FINISHED)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl transition-all text-[10px] uppercase tracking-[0.2em]"
                title="Finalizar Jogo"
              >
                ✓
              </button>
            )}
          </>
        ) : (
           <div className="flex-1 bg-slate-800/50 text-slate-600 text-center py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] border border-slate-800">
             Partida Cancelada
           </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
