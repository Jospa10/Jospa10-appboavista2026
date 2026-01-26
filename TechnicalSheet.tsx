
import React, { useState } from 'react';
import { Player, Match, MatchEvent } from './types';

interface TechnicalSheetProps {
  match: Match;
  players: Player[];
  isAdmin: boolean;
  onUpdateMatch: (match: Match) => void;
}

const TechnicalSheet: React.FC<TechnicalSheetProps> = ({ match, players, isAdmin, onUpdateMatch }) => {
  const [activeEventTab, setActiveEventTab] = useState<'goal' | 'yellow_card' | 'red_card'>('goal');
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const handleAddEvent = () => {
    if (!selectedPlayer) return;
    const newEvent: MatchEvent = { id: Math.random().toString(36).substr(2, 9), playerId: selectedPlayer, type: activeEventTab, minute: 0 };
    const updatedEvents = [...(match.events || []), newEvent];
    const updatedMatch = { ...match, events: updatedEvents };
    if (activeEventTab === 'goal') updatedMatch.scoreHome = (updatedMatch.scoreHome || 0) + 1;
    onUpdateMatch(updatedMatch);
    setSelectedPlayer('');
  };

  const removeEvent = (eventId: string) => {
    if (!isAdmin) return;
    const eventToRemove = match.events?.find(e => e.id === eventId);
    const updatedEvents = match.events?.filter(e => e.id !== eventId) || [];
    const updatedMatch = { ...match, events: updatedEvents };
    if (eventToRemove?.type === 'goal') updatedMatch.scoreHome = Math.max(0, (updatedMatch.scoreHome || 0) - 1);
    onUpdateMatch(updatedMatch);
  };

  const getPlayerName = (id: string) => players.find(p => p.id === id)?.nickname || 'Atleta';

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-8 py-6 bg-slate-950/50 rounded-2xl border border-slate-800">
        <div className="text-center"><p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Mandante</p><p className="text-4xl font-sport text-emerald-500">{match.scoreHome || 0}</p></div>
        <div className="text-slate-700 text-2xl font-sport">X</div>
        <div className="text-center"><p className="text-[10px] text-slate-500 font-bold uppercase mb-1">{match.opponent}</p><p className="text-4xl font-sport text-white">{match.scoreAway || 0}</p></div>
      </div>
      {isAdmin && (
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <div className="flex flex-col gap-3">
            <div className="flex gap-1">
              {(['goal', 'yellow_card', 'red_card'] as const).map(type => (
                <button key={type} onClick={() => setActiveEventTab(type)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase ${activeEventTab === type ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500'}`}>{type === 'goal' ? '⚽ GOL' : type === 'yellow_card' ? '🟨 Amarelo' : '🟥 Vermelho'}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Selecionar Atleta...</option>
                {players.map(p => <option key={p.id} value={p.id}>{p.nickname} (#{p.number})</option>)}
              </select>
              <button onClick={handleAddEvent} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all">OK</button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {match.events?.length ? match.events.map(event => (
          <div key={event.id} className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 group">
            <div className="flex items-center gap-3">
              <span className="text-xl">{event.type === 'goal' ? '⚽' : event.type === 'yellow_card' ? '🟨' : '🟥'}</span>
              <div><p className="text-sm font-bold text-white uppercase">{getPlayerName(event.playerId)}</p></div>
            </div>
            {isAdmin && <button onClick={() => removeEvent(event.id)} className="opacity-0 group-hover:opacity-100 text-red-500 p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
          </div>
        )) : <p className="text-center py-4 text-slate-600 text-xs italic">Nenhum evento registrado.</p>}
      </div>
    </div>
  );
};

export default TechnicalSheet;
