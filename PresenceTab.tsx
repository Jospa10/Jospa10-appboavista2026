
import React from 'react';
import { Player, Match } from './types';

interface PresenceTabProps {
  match: Match;
  players: Player[];
  onTogglePresence: (matchId: string, playerId: string, going: boolean) => void;
}

const PresenceTab: React.FC<PresenceTabProps> = ({ match, players, onTogglePresence }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h3 className="font-sport text-xl text-emerald-500 uppercase tracking-widest">Presença: vs {match.opponent}</h3>
        <p className="text-xs text-slate-500 font-bold uppercase">{match.location} • {new Date(match.date).toLocaleDateString()}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {players.map(player => (
          <div key={player.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-sm uppercase">{player.nickname}</span>
            <div className="flex gap-2">
              <button onClick={() => onTogglePresence(match.id, player.id, true)} className={`px-4 py-1 rounded-lg text-[10px] font-bold uppercase ${match.playersConfirmed.includes(player.id) ? 'bg-emerald-600' : 'bg-slate-800'}`}>Sim</button>
              <button onClick={() => onTogglePresence(match.id, player.id, false)} className={`px-4 py-1 rounded-lg text-[10px] font-bold uppercase ${match.playersDeclined?.includes(player.id) ? 'bg-red-600' : 'bg-slate-800'}`}>Não</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresenceTab;
