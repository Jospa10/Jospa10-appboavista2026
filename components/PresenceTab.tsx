
import React from 'react';
import { Player, Match } from '../types';

interface PresenceTabProps {
  match: Match;
  players: Player[];
  onTogglePresence: (matchId: string, playerId: string, going: boolean) => void;
}

const PresenceTab: React.FC<PresenceTabProps> = ({ match, players, onTogglePresence }) => {
  const confirmedCount = match.playersConfirmed.length;
  const declinedCount = match.playersDeclined?.length || 0;
  
  const confirmedPlayers = players.filter(p => match.playersConfirmed.includes(p.id));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Resumo do Próximo Jogo */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-3xl border border-emerald-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] block mb-1">Próxima Batalha</span>
            <h3 className="text-2xl font-sport text-white tracking-widest uppercase">vs {match.opponent}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase mt-1">{match.location} • {new Date(match.date).toLocaleDateString()}</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 text-center min-w-[100px]">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Confirmados</p>
              <p className="text-2xl font-sport text-white">{confirmedCount}</p>
            </div>
            <div className="bg-red-500/10 px-4 py-2 rounded-2xl border border-red-500/20 text-center min-w-[100px]">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Ausentes</p>
              <p className="text-2xl font-sport text-white">{declinedCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800/50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Lista de Confirmados:</p>
          <div className="flex flex-wrap gap-2">
            {confirmedPlayers.length > 0 ? confirmedPlayers.map(p => (
              <span key={p.id} className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-700 uppercase">
                {p.nickname}
              </span>
            )) : (
              <p className="text-slate-600 italic text-[10px] uppercase">Ninguém confirmou ainda...</p>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Jogadores para Votação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map(player => {
          const isConfirmed = match.playersConfirmed.includes(player.id);
          const isDeclined = match.playersDeclined?.includes(player.id);

          return (
            <div 
              key={player.id} 
              className={`bg-slate-900 p-4 rounded-2xl border transition-all ${
                isConfirmed ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/5' : 
                isDeclined ? 'border-red-500/30 opacity-60' : 
                'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden border border-slate-700">
                  {player.photo ? (
                    <img src={player.photo} alt={player.nickname} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-sport text-slate-600">{player.number}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase">{player.nickname}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{player.position}</p>
                </div>
                <div className="ml-auto">
                   {isConfirmed && <span className="text-emerald-500 text-xl">✅</span>}
                   {isDeclined && <span className="text-red-500 text-xl">❌</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onTogglePresence(match.id, player.id, true)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isConfirmed ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-emerald-600/20 hover:text-emerald-500'
                  }`}
                >
                  Vou
                </button>
                <button 
                  onClick={() => onTogglePresence(match.id, player.id, false)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isDeclined ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-red-600/20 hover:text-red-500'
                  }`}
                >
                  Não Vou
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PresenceTab;
