
import React, { useState, useRef } from 'react';
import { Match, MatchStatus } from '../types';

interface MatchFormProps {
  onSave: (match: Partial<Match>) => void;
  initialData?: Match;
}

const MatchForm: React.FC<MatchFormProps> = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Match>>(initialData || {
    opponent: '',
    opponentLogo: '',
    date: '',
    location: '',
    status: MatchStatus.SCHEDULED,
    scoreHome: 0,
    scoreAway: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, opponentLogo: reader.result as string });
      };
      reader.readAsDataURL(file as Blob);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block w-full text-center">Escudo do Adversário</label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-32 h-32 bg-slate-800 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-all group overflow-hidden"
        >
          {formData.opponentLogo ? (
            <img src={formData.opponentLogo} alt="Logo Adversário" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-4">
              <span className="text-3xl mb-1 block">🛡️</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase">Clique para Upload</span>
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
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Nome do Adversário</label>
          <input 
            type="text" 
            value={formData.opponent}
            onChange={e => setFormData({...formData, opponent: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-white" 
            placeholder="Ex: Amigos do Morro FC"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Data e Hora</label>
            <input 
              type="datetime-local" 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-white" 
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Local</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-white" 
              placeholder="Ex: Arena Soccer 10"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Status da Partida</label>
          <select 
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value as MatchStatus})}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-white"
          >
            {Object.values(MatchStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {(formData.status === MatchStatus.FINISHED || initialData) && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Placar Casa</label>
              <input 
                type="number" 
                value={formData.scoreHome}
                onChange={e => setFormData({...formData, scoreHome: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-white" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Placar Visitante</label>
              <input 
                type="number" 
                value={formData.scoreAway}
                onChange={e => setFormData({...formData, scoreAway: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-white" 
              />
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={() => onSave(formData)}
        disabled={!formData.opponent || !formData.date}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95 text-white"
      >
        {initialData ? 'Confirmar Alterações' : 'Agendar Jogo'}
      </button>
    </div>
  );
};

export default MatchForm;
