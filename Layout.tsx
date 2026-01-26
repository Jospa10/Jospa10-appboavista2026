
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  teamName: string;
  teamLogo?: string;
  isAdmin: boolean;
  onAdminClick: () => void;
}

const TeamShield = ({ className, logo }: { className?: string, logo?: string }) => (
  <div className={`relative ${className} flex items-center justify-center overflow-hidden rounded-xl`}>
    {logo ? (
      <img src={logo} alt="Escudo" className="w-full h-full object-cover" />
    ) : (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <path d="M50 5 L90 20 L90 50 C90 75 50 95 50 95 C50 95 10 75 10 50 L10 20 Z" fill="#10b981" />
        <text x="50" y="55" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" className="font-sport">BV</text>
      </svg>
    )}
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, teamName, teamLogo, isAdmin, onAdminClick }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: '🏠' },
    { id: 'table', label: 'Tabela', icon: '🏆' },
    { id: 'presence', label: 'Presença', icon: '✅' },
    { id: 'squad', label: 'Elenco', icon: '👥' },
    { id: 'tactic', label: 'Tática', icon: '📋' },
    { id: 'matches', label: 'Jogos', icon: '⚽' },
    { id: 'gallery', label: 'Galeria', icon: '🖼️' },
    { id: 'finance', label: 'Financeiro', icon: '💰' },
    { id: 'stats', label: 'Estatísticas', icon: '📊' },
    { id: 'settings', label: 'Clube', icon: '⚙️' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24 md:pb-0 md:pl-64">
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-10">
          <TeamShield className="w-10 h-10" logo={teamLogo} />
          <h1 className="text-xl font-sport text-white tracking-wider truncate uppercase">{teamName}</h1>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-800 text-slate-400'}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-800">
          <button onClick={onAdminClick} className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border transition-all ${isAdmin ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-500' : 'border-slate-800 text-slate-500'}`}>
            <span className="text-[10px] font-bold uppercase">{isAdmin ? 'MODO ADMIN' : 'ACESSO ADM'}</span>
            <span>{isAdmin ? '🔓' : '🔒'}</span>
          </button>
        </div>
      </aside>

      <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3"><TeamShield className="w-8 h-8" logo={teamLogo} /><h1 className="text-xl font-sport text-emerald-500 uppercase truncate max-w-[150px]">{teamName}</h1></div>
        <button onClick={onAdminClick} className="p-2 bg-slate-800 rounded-lg">{isAdmin ? '🔓' : '🔒'}</button>
      </header>

      <main className="flex-1 p-4 md:p-8 animate-fadeIn">{children}</main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-between px-2 py-3 z-50 overflow-x-auto no-scrollbar backdrop-blur-lg">
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 min-w-[60px] transition-all ${activeTab === item.id ? 'text-emerald-500 scale-110' : 'text-slate-500'}`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] font-bold uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
