
import React from 'react';
import { LeagueEntry } from '../types';

interface LeagueTableProps {
  entries: LeagueEntry[];
  userTeamName: string;
  leagueName: string;
  onLeagueNameChange: (newName: string) => void;
  isAdmin?: boolean;
  onEdit?: (entry: LeagueEntry) => void;
  onDelete?: (id: string) => void;
  onAddTeam?: () => void;
}

const LeagueTable: React.FC<LeagueTableProps> = ({ 
  entries, 
  userTeamName, 
  leagueName,
  onLeagueNameChange,
  isAdmin, 
  onEdit, 
  onDelete, 
  onAddTeam 
}) => {
  // Ordena por pontos desc, vitórias desc, saldo de gols desc, cartões vermelhos asc, cartões amarelos asc
  const sortedEntries = [...entries].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    const sgA = a.goalsFor - a.goalsAgainst;
    const sgB = b.goalsFor - b.goalsAgainst;
    if (sgB !== sgA) return sgB - sgA;
    if (a.redCards !== b.redCards) return a.redCards - b.redCards;
    return a.yellowCards - b.yellowCards;
  });

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex-1 mr-4">
          {isAdmin ? (
            <input 
              type="text"
              value={leagueName}
              onChange={(e) => onLeagueNameChange(e.target.value)}
              className="bg-transparent border-b border-dashed border-slate-700 focus:border-emerald-500 outline-none text-2xl font-sport tracking-widest text-white uppercase w-full max-w-md transition-all"
              placeholder="Nome da Chave/Grupo"
            />
          ) : (
            <h3 className="text-2xl font-sport tracking-widest text-white uppercase">{leagueName}</h3>
          )}
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mt-1">Classificação Oficial do Campeonato</p>
        </div>
        {isAdmin && (
          <button 
            onClick={onAddTeam}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-4 py-2 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
          >
            + Nova Equipe
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 text-slate-500 text-[9px] font-black uppercase tracking-widest border-b border-slate-800">
              <th className="px-4 py-4 text-center">Pos</th>
              <th className="px-4 py-4">Equipe</th>
              <th className="px-4 py-4 text-center">J</th>
              <th className="px-4 py-4 text-center">Pts</th>
              <th className="px-4 py-4 text-center">V</th>
              <th className="px-4 py-4 text-center">E</th>
              <th className="px-4 py-4 text-center">D</th>
              <th className="px-4 py-4 text-center">GP</th>
              <th className="px-4 py-4 text-center">GC</th>
              <th className="px-4 py-4 text-center">SG</th>
              <th className="px-4 py-4 text-center">CA</th>
              <th className="px-4 py-4 text-center">CV</th>
              <th className="px-4 py-4 text-center">Aprov %</th>
              {isAdmin && <th className="px-4 py-4 text-center">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {sortedEntries.map((entry, index) => {
              const isUserTeam = entry.teamName.toUpperCase() === userTeamName.toUpperCase();
              const sg = entry.goalsFor - entry.goalsAgainst;
              const aproveitamento = entry.games > 0 ? Math.round((entry.points / (entry.games * 3)) * 100) : 0;
              
              return (
                <tr 
                  key={entry.id} 
                  className={`transition-colors hover:bg-slate-800/30 ${isUserTeam ? 'bg-emerald-500/5 border-l-4 border-l-emerald-500' : ''}`}
                >
                  <td className="px-4 py-4 text-center">
                    <span className={`text-xs font-bold ${index < 4 ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {index + 1}º
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-700">
                        {entry.logo ? (
                          <img src={entry.logo} alt={entry.teamName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm">🛡️</span>
                        )}
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-tighter truncate max-w-[120px] ${isUserTeam ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {entry.teamName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-xs text-slate-400 font-medium">{entry.games}</td>
                  <td className="px-4 py-4 text-center text-sm font-black text-white">{entry.points}</td>
                  <td className="px-4 py-4 text-center text-xs text-slate-400">{entry.wins}</td>
                  <td className="px-4 py-4 text-center text-xs text-slate-400">{entry.draws}</td>
                  <td className="px-4 py-4 text-center text-xs text-slate-400">{entry.losses}</td>
                  <td className="px-4 py-4 text-center text-xs text-slate-400">{entry.goalsFor}</td>
                  <td className="px-4 py-4 text-center text-xs text-slate-400">{entry.goalsAgainst}</td>
                  <td className={`px-4 py-4 text-center text-xs font-bold ${sg > 0 ? 'text-emerald-500' : sg < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                    {sg > 0 ? `+${sg}` : sg}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-block w-2.5 h-3.5 bg-yellow-400 rounded-sm"></span>
                    <span className="ml-1 text-[9px] font-bold text-slate-400">{entry.yellowCards}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-block w-2.5 h-3.5 bg-red-600 rounded-sm"></span>
                    <span className="ml-1 text-[9px] font-bold text-slate-400">{entry.redCards}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[10px] font-black text-slate-500">{aproveitamento}%</span>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onEdit?.(entry)}
                          className="text-slate-500 hover:text-emerald-500 transition-colors p-1"
                          title="Editar equipe"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => onDelete?.(entry.id)}
                          className="text-slate-500 hover:text-red-500 transition-colors p-1"
                          title="Remover equipe"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-950/20 flex gap-4 overflow-x-auto no-scrollbar border-t border-slate-800">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">G4 - Classificação</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Permanência</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">Critérios: Pts &gt; V &gt; SG &gt; CV &gt; CA</span>
        </div>
      </div>
    </div>
  );
};

export default LeagueTable;
