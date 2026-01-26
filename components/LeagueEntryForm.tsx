
import React, { useState, useRef, useEffect } from 'react';
import { LeagueEntry } from '../types';

interface LeagueEntryFormProps {
  onSave: (entry: Partial<LeagueEntry>) => void;
  initialData?: LeagueEntry;
}

const LeagueEntryForm: React.FC<LeagueEntryFormProps> = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<LeagueEntry>>(initialData || {
    teamName: '',
    logo: '',
    games: 0,
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    yellowCards: 0,
    redCards: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cálculos automáticos derivados do estado atual
  const calculatedGames = (formData.wins || 0) + (formData.draws || 0) + (formData.losses || 0);
  const calculatedPoints = ((formData.wins || 0) * 3) + (formData.draws || 0);
  const calculatedSG = (formData.goalsFor || 0) - (formData.goalsAgainst || 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNumberChange = (field: keyof LeagueEntry, value: string) => {
    setFormData({ ...formData, [field]: parseInt(value) || 0 });
  };

  const handleSubmit = () => {
    // Ao salvar, enviamos os dados com os cálculos automáticos garantidos
    onSave({
      ...formData,
      games: calculatedGames,
      points: calculatedPoints
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block w-full text-center">Escudo da Equipe</label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-24 h-24 bg-slate-800 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-all group overflow-hidden"
        >
          {formData.logo ? (
            <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2">
              <span className="text-2xl mb-1 block">🛡️</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase">Upload</span>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Nome da Equipe</label>
          <input 
            type="text" 
            value={formData.teamName}
            onChange={e => setFormData({...formData, teamName: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-white" 
            placeholder="Ex: Real Madrid FC"
          />
        </div>

        {/* Linha de Status (Calculada) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Jogos (J)</span>
            <span className="text-xl font-sport text-white">{calculatedGames}</span>
          </div>
          <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20 flex justify-between items-center">
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Pontos (Pts)</span>
            <span className="text-xl font-sport text-emerald-500">{calculatedPoints}</span>
          </div>
        </div>

        {/* Inputs de Performance */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="text-[8px] font-bold text-slate-500 uppercase mb-1 block">Vitórias (V)</label>
            <input type="number" value={formData.wins} onChange={e => handleNumberChange('wins', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-center text-white" />
          </div>
          <div className="col-span-1">
            <label className="text-[8px] font-bold text-slate-500 uppercase mb-1 block">Empates (E)</label>
            <input type="number" value={formData.draws} onChange={e => handleNumberChange('draws', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-center text-white" />
          </div>
          <div className="col-span-1">
            <label className="text-[8px] font-bold text-slate-500 uppercase mb-1 block">Derrotas (D)</label>
            <input type="number" value={formData.losses} onChange={e => handleNumberChange('losses', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-center text-white" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-800/50">
          <div className="col-span-1">
            <label className="text-[8px] font-bold text-slate-500 uppercase mb-1 block">Gols Pró</label>
            <input type="number" value={formData.goalsFor} onChange={e => handleNumberChange('goalsFor', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-center text-white" />
          </div>
          <div className="col-span-1">
            <label className="text-[8px] font-bold text-slate-500 uppercase mb-1 block">Gols Contra</label>
            <input type="number" value={formData.goalsAgainst} onChange={e => handleNumberChange('goalsAgainst', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-center text-white" />
          </div>
          <div className="col-span-2">
            <label className="text-[8px] font-bold text-slate-500 uppercase mb-1 block">Saldo de Gols (SG)</label>
            <div className={`w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-center font-bold ${calculatedSG > 0 ? 'text-emerald-500' : calculatedSG < 0 ? 'text-red-500' : 'text-slate-500'}`}>
              {calculatedSG > 0 ? `+${calculatedSG}` : calculatedSG}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[8px] font-bold text-slate-500 uppercase mb-1 block">Cartões Amarelos</label>
            <div className="flex items-center gap-2">
              <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>
              <input type="number" value={formData.yellowCards} onChange={e => handleNumberChange('yellowCards', e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded p-2 text-xs text-center text-white" />
            </div>
          </div>
          <div>
            <label className="text-[8px] font-bold text-slate-500 uppercase mb-1 block">Cartões Vermelhos</label>
            <div className="flex items-center gap-2">
              <div className="w-3 h-4 bg-red-600 rounded-sm"></div>
              <input type="number" value={formData.redCards} onChange={e => handleNumberChange('redCards', e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded p-2 text-xs text-center text-white" />
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSubmit}
        disabled={!formData.teamName}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95 text-white text-xs"
      >
        {initialData ? 'Atualizar Classificação' : 'Inserir Equipe na Tabela'}
      </button>
    </div>
  );
};

export default LeagueEntryForm;
