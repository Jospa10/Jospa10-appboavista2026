
import React, { useState } from 'react';
import { Transaction } from '../types';

interface TransactionFormProps {
  onSave: (transaction: Partial<Transaction>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'income',
    category: 'Mensalidade'
  });

  const categories = ['Mensalidade', 'Campo', 'Material', 'Patrocínio', 'Arbitragem', 'Outros'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Descrição</label>
          <input 
            type="text" 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
            placeholder="Ex: Pagamento Mensalidade Junho"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Tipo</label>
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button 
                onClick={() => setFormData({...formData, type: 'income'})}
                className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase transition-all ${formData.type === 'income' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
              >
                Receita
              </button>
              <button 
                onClick={() => setFormData({...formData, type: 'expense'})}
                className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase transition-all ${formData.type === 'expense' ? 'bg-red-600 text-white' : 'text-slate-500'}`}
              >
                Despesa
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Valor (R$)</label>
            <input 
              type="number" 
              value={formData.amount === 0 ? '' : Math.abs(formData.amount || 0)}
              onChange={e => {
                const val = parseFloat(e.target.value) || 0;
                setFormData({...formData, amount: formData.type === 'expense' ? -val : val});
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Data</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Categoria</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onSave(formData)}
        disabled={!formData.description || !formData.amount}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
      >
        Lançar Transação
      </button>
    </div>
  );
};

export default TransactionForm;
