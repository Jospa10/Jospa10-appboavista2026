
import React, { useState, useMemo } from 'react';
import Layout from './Layout';
import PlayerCard from './PlayerCard';
import MatchCard from './MatchCard';
import TacticalField from './TacticalField';
import PresenceTab from './PresenceTab';
import LeagueTable from './LeagueTable';
import LeagueEntryForm from './LeagueEntryForm'; 
import Modal from './Modal';
import PlayerForm from './PlayerForm';
import MatchForm from './MatchForm';
import TransactionForm from './TransactionForm';
import TechnicalSheet from './TechnicalSheet';
import { INITIAL_PLAYERS, INITIAL_MATCHES, INITIAL_TRANSACTIONS } from './constants';
import { Player, Match, Transaction, MatchStatus, Formation, GalleryImage, LeagueEntry } from './types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [formation, setFormation] = useState<Formation>('4-4-2');
  const [customTacticalPositions, setCustomTacticalPositions] = useState<Record<Formation, { top: string; left: string }[]>>({
    '4-4-2': [], '4-3-3': [], '3-5-2': [], '2-2-1': [], '3-2-1': []
  });
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  
  const [teamName, setTeamName] = useState('Boa Vista FC');
  const [teamLogo, setTeamLogo] = useState<string | undefined>(undefined);
  const [leagueName, setLeagueName] = useState('Chave A');
  const [leagueEntries, setLeagueEntries] = useState<LeagueEntry[]>([
    { id: '1', teamName: 'Boa Vista F.C.', games: 7, points: 7, wins: 2, draws: 1, losses: 4, goalsFor: 15, goalsAgainst: 23, yellowCards: 2, redCards: 0 },
    { id: '2', teamName: 'Azurra', games: 7, points: 7, wins: 2, draws: 1, losses: 4, goalsFor: 16, goalsAgainst: 21, yellowCards: 1, redCards: 0 },
    { id: '3', teamName: 'Limp & Cia', games: 7, points: 18, wins: 6, draws: 0, losses: 1, goalsFor: 27, goalsAgainst: 11, yellowCards: 1, redCards: 0 },
    { id: '4', teamName: 'FJ Motors', games: 8, points: 12, wins: 4, draws: 0, losses: 4, goalsFor: 25, goalsAgainst: 25, yellowCards: 2, redCards: 1 },
    { id: '5', teamName: 'Águia F.C.', games: 7, points: 9, wins: 3, draws: 0, losses: 4, goalsFor: 17, goalsAgainst: 20, yellowCards: 3, redCards: 0 },
  ]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>(undefined);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | undefined>(undefined);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [viewingPhotoUrl, setViewingPhotoUrl] = useState<string | null>(null);
  const [technicalSheetMatch, setTechnicalSheetMatch] = useState<Match | null>(null);
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [editingLeagueEntry, setEditingLeagueEntry] = useState<LeagueEntry | undefined>(undefined);

  const userTeamCampaign = useMemo(() => {
    return leagueEntries.find(e => 
      e.teamName.toUpperCase().includes(teamName.toUpperCase().split(' ')[0])
    );
  }, [leagueEntries, teamName]);

  const balance = useMemo(() => transactions.reduce((acc, t) => acc + t.amount, 0), [transactions]);
  
  const lastMatch = useMemo(() => {
    return [...matches]
      .filter(m => m.status === MatchStatus.FINISHED)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [matches]);

  const nextMatch = useMemo(() => {
    return [...matches]
      .filter(m => m.status === MatchStatus.SCHEDULED)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [matches]);

  const statsData = players.map(p => ({
    name: p.nickname,
    gols: p.goals,
    assists: p.assists
  })).sort((a, b) => b.gols - a.gols);

  const handleAdminLogin = () => {
    if (passwordInput === '2024') {
      setIsAdmin(true);
      setIsLoginModalOpen(false);
      setPasswordInput('');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => setIsAdmin(false);

  const handleTogglePayment = (playerId: string) => {
    if (!isAdmin) return;
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, isPaid: !p.isPaid } : p));
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: teamName,
          text: `Acompanhe o ${teamName} na temporada 2026!`,
          url: window.location.href,
        });
      } catch (err) { console.error("Erro ao compartilhar", err); }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado!");
    }
  };

  const handleTogglePresence = (matchId: string, playerId: string, going: boolean) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const confirmed = new Set(m.playersConfirmed);
      const declined = new Set(m.playersDeclined || []);
      if (going) { confirmed.add(playerId); declined.delete(playerId); }
      else { confirmed.delete(playerId); declined.add(playerId); }
      return { ...m, playersConfirmed: Array.from(confirmed), playersDeclined: Array.from(declined) };
    }));
  };

  const handleSaveLeagueEntry = (entryData: Partial<LeagueEntry>) => {
    if (!isAdmin) return;
    const wins = entryData.wins || 0;
    const draws = entryData.draws || 0;
    const losses = entryData.losses || 0;
    const recalculatedPoints = (wins * 3) + draws;
    const recalculatedGames = wins + draws + losses;
    const finalEntryData = { ...entryData, points: recalculatedPoints, games: recalculatedGames };

    if (editingLeagueEntry) {
      setLeagueEntries(prev => prev.map(e => e.id === editingLeagueEntry.id ? { ...e, ...finalEntryData } as LeagueEntry : e));
    } else {
      const newEntry: LeagueEntry = {
        id: Math.random().toString(36).substr(2, 9),
        teamName: entryData.teamName || 'Nova Equipe',
        logo: entryData.logo,
        games: recalculatedGames,
        points: recalculatedPoints,
        wins: wins, draws: draws, losses: losses,
        goalsFor: entryData.goalsFor || 0,
        goalsAgainst: entryData.goalsAgainst || 0,
        yellowCards: entryData.yellowCards || 0,
        redCards: entryData.redCards || 0
      };
      setLeagueEntries(prev => [...prev, newEntry]);
    }
    setIsLeagueModalOpen(false);
    setEditingLeagueEntry(undefined);
  };

  const handleDeleteLeagueEntry = (id: string) => {
    if (!isAdmin) return;
    if (confirm('Deseja remover esta equipe?')) setLeagueEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateMatch = (updatedMatch: Match) => {
    if (!isAdmin) return;
    setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
    setTechnicalSheetMatch(updatedMatch);
  };

  const handleUpdateMatchStatus = (matchId: string, status: MatchStatus) => {
    if (!isAdmin) return;
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status, isCompleted: status === MatchStatus.FINISHED } : m));
  };

  const handleSaveMatch = (matchData: Partial<Match>) => {
    if (!isAdmin) return;
    const updatedStatus = matchData.status || MatchStatus.SCHEDULED;
    const isCompleted = updatedStatus === MatchStatus.FINISHED;
    if (editingMatch) {
      setMatches(prev => prev.map(m => m.id === editingMatch.id ? { ...m, ...matchData, isCompleted } as Match : m));
    } else {
      const newMatch: Match = {
        id: Math.random().toString(36).substr(2, 9),
        opponent: matchData.opponent || 'Adversário',
        opponentLogo: matchData.opponentLogo,
        date: matchData.date || new Date().toISOString(),
        location: matchData.location || 'Local a definir',
        status: updatedStatus,
        isCompleted: isCompleted,
        playersConfirmed: [],
        playersDeclined: [],
        scoreHome: matchData.scoreHome || 0,
        scoreAway: matchData.scoreAway || 0
      };
      setMatches(prev => [newMatch, ...prev]);
    }
    setIsMatchModalOpen(false);
    setEditingMatch(undefined);
  };

  const handleSavePlayer = (playerData: Partial<Player>) => {
    if (!isAdmin) return;
    if (editingPlayer) {
      setPlayers(prev => prev.map(p => p.id === editingPlayer.id ? { ...p, ...playerData } as Player : p));
    } else {
      const newPlayer: Player = {
        id: Math.random().toString(36).substr(2, 9),
        name: playerData.name || 'Novo Atleta',
        nickname: playerData.nickname || 'Atleta',
        number: playerData.number || 0,
        position: playerData.position || players[0]?.position,
        goals: 0, assists: 0, gamesPlayed: 0, rating: 6.0,
        photo: playerData.photo,
        isPaid: false
      };
      setPlayers(prev => [...prev, newPlayer]);
    }
    setIsPlayerModalOpen(false);
    setEditingPlayer(undefined);
  };

  const handleSaveTransaction = (transactionData: Partial<Transaction>) => {
    if (!isAdmin) return;
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: transactionData.description || 'Transação',
      amount: transactionData.amount || 0,
      date: transactionData.date || new Date().toISOString().split('T')[0],
      type: transactionData.type as 'income' | 'expense',
      category: transactionData.category || 'Geral'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setIsTransactionModalOpen(false);
  };

  const handleTacticalPositionChange = (newPositions: { top: string; left: string }[]) => {
    if (isAdmin) setCustomTacticalPositions(prev => ({ ...prev, [formation]: newPositions }));
  };

  const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(window.location.href)}&choe=UTF-8&chld=L|2`;

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      teamName={teamName} 
      teamLogo={teamLogo}
      isAdmin={isAdmin}
      onAdminClick={isAdmin ? handleLogout : () => setIsLoginModalOpen(true)}
    >
      {/* Modais e Conteúdo permanecem iguais, apenas garantindo que os componentes importados acima existam na raiz */}
      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="Acesso Administrativo">
        <div className="space-y-4">
          <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className={`w-full bg-slate-800 border ${loginError ? 'border-red-500' : 'border-slate-700'} rounded-xl p-4 text-center text-2xl tracking-widest outline-none text-white`} placeholder="****" onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} />
          <button onClick={handleAdminLogin} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl">ENTRAR</button>
        </div>
      </Modal>

      <Modal isOpen={isPlayerModalOpen} onClose={() => { setIsPlayerModalOpen(false); setEditingPlayer(undefined); }} title={editingPlayer ? "Editar Atleta" : "Novo Atleta"}>
        <PlayerForm onSave={handleSavePlayer} initialData={editingPlayer} />
      </Modal>

      <Modal isOpen={isMatchModalOpen} onClose={() => { setIsMatchModalOpen(false); setEditingMatch(undefined); }} title={editingMatch ? "Editar Jogo" : "Agendar Partida"}>
        <MatchForm onSave={handleSaveMatch} initialData={editingMatch} />
      </Modal>

      <Modal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} title="Novo Lançamento">
        <TransactionForm onSave={handleSaveTransaction} />
      </Modal>
      
      <Modal isOpen={isLeagueModalOpen} onClose={() => { setIsLeagueModalOpen(false); setEditingLeagueEntry(undefined); }} title={editingLeagueEntry ? "Editar Equipe" : "Nova Equipe na Liga"}>
        <LeagueEntryForm onSave={handleSaveLeagueEntry} initialData={editingLeagueEntry} />
      </Modal>

      <Modal isOpen={!!technicalSheetMatch} onClose={() => setTechnicalSheetMatch(null)} title="Ficha Técnica">
        {technicalSheetMatch && <TechnicalSheet match={technicalSheetMatch} players={players} isAdmin={isAdmin} onUpdateMatch={handleUpdateMatch} />}
      </Modal>

      <Modal isOpen={!!viewingPhotoUrl} onClose={() => setViewingPhotoUrl(null)} title="Imagem">
        <div className="flex justify-center">{viewingPhotoUrl && <img src={viewingPhotoUrl} alt="Ampliado" className="max-w-full rounded-2xl shadow-2xl border-4 border-slate-800" />}</div>
      </Modal>

      {activeTab === 'home' && (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mb-1">Seja bem-vindo</p>
            <h2 className="text-4xl font-sport tracking-wide uppercase">Painel {teamName}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">Atletas</p>
              <p className="text-3xl font-sport text-blue-500">{players.length}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">Campanha</p>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-sport text-emerald-500">{userTeamCampaign?.wins || 0}V</span>
                <span className="text-2xl font-sport text-slate-400">{userTeamCampaign?.draws || 0}E</span>
                <span className="text-2xl font-sport text-red-500">{userTeamCampaign?.losses || 0}D</span>
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">Confirmados Jogo</p>
              <p className="text-3xl font-sport text-yellow-500">{nextMatch?.playersConfirmed.length || 0}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Último Resultado</p>
              {lastMatch ? <MatchCard match={lastMatch} teamName={teamName} teamLogo={teamLogo} isAdmin={isAdmin} onEdit={(m) => { setEditingMatch(m); setIsMatchModalOpen(true); }} onOpenTechnicalSheet={setTechnicalSheetMatch} onUpdateStatus={handleUpdateMatchStatus} /> : <div className="bg-slate-900/50 p-10 text-center italic text-slate-600 text-sm">Nenhum jogo finalizado.</div>}
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Próximo Compromisso</p>
              {nextMatch ? <MatchCard match={nextMatch} teamName={teamName} teamLogo={teamLogo} isAdmin={isAdmin} onEdit={(m) => { setEditingMatch(m); setIsMatchModalOpen(true); }} onOpenTechnicalSheet={setTechnicalSheetMatch} onUpdateStatus={handleUpdateMatchStatus} /> : <div className="bg-slate-900/50 p-10 text-center italic text-slate-600 text-sm">Nenhum jogo agendado.</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'table' && <LeagueTable entries={leagueEntries} userTeamName={teamName} leagueName={leagueName} onLeagueNameChange={setLeagueName} isAdmin={isAdmin} onEdit={(e) => { setEditingLeagueEntry(e); setIsLeagueModalOpen(true); }} onDelete={handleDeleteLeagueEntry} onAddTeam={() => { setEditingLeagueEntry(undefined); setIsLeagueModalOpen(true); }} />}
      {activeTab === 'presence' && (nextMatch ? <PresenceTab match={nextMatch} players={players} onTogglePresence={handleTogglePresence} /> : <div className="p-20 text-center">Nenhum jogo agendado.</div>)}
      {activeTab === 'squad' && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{players.map(player => <PlayerCard key={player.id} player={player} isAdmin={isAdmin} onEdit={() => { setEditingPlayer(player); setIsPlayerModalOpen(true); }} onViewPhoto={(url) => setViewingPhotoUrl(url)} />)}</div>}
      {activeTab === 'matches' && <div className="max-w-2xl mx-auto space-y-6">{matches.map(match => <MatchCard key={match.id} match={match} teamName={teamName} teamLogo={teamLogo} isAdmin={isAdmin} onEdit={(m) => { setEditingMatch(m); setIsMatchModalOpen(true); }} onOpenTechnicalSheet={setTechnicalSheetMatch} onUpdateStatus={handleUpdateMatchStatus} />)}</div>}
      
      {activeTab === 'finance' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Saldo em Caixa</p>
               <p className={`text-3xl font-sport ${balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
             </div>
             <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl md:col-span-2">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Pagamento de Mensalidades (Mês Atual)</p>
               <div className="flex flex-wrap gap-2">
                 {players.map(p => (
                   <button 
                    key={p.id} 
                    onClick={() => handleTogglePayment(p.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border transition-all ${p.isPaid ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-red-500/5 border-red-900/30 text-red-400 opacity-60'}`}
                   >
                     {p.nickname} {p.isPaid ? '✓' : '✗'}
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </div>
      )}
      {/* ... outros conteúdos permanecem iguais ... */}
    </Layout>
  );
};

export default App;
