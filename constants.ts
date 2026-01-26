
import { Player, Position, Match, Transaction, MatchStatus } from './types';

export const INITIAL_PLAYERS: Player[] = [
  { id: '1', name: 'Ricardo Silva', nickname: 'Ricardinho', number: 10, position: Position.MF, goals: 12, assists: 8, gamesPlayed: 15, rating: 8.5, isPaid: true },
  { id: '2', name: 'Mateus Oliveira', nickname: 'Muralha', number: 1, position: Position.GK, goals: 0, assists: 1, gamesPlayed: 14, rating: 7.8, isPaid: true },
  { id: '3', name: 'Bruno Santos', nickname: 'Bruxo', number: 7, position: Position.FW, goals: 15, assists: 4, gamesPlayed: 12, rating: 9.1, isPaid: false },
  { id: '4', name: 'Carlos Ferreira', nickname: 'Carlão', number: 4, position: Position.DF, goals: 2, assists: 0, gamesPlayed: 15, rating: 7.2, isPaid: true },
  { id: '5', name: 'Felipe Diniz', nickname: 'Lipe', number: 8, position: Position.MF, goals: 5, assists: 10, gamesPlayed: 13, rating: 8.0, isPaid: true },
];

export const INITIAL_MATCHES: Match[] = [
  { 
    id: 'm1', 
    opponent: 'Os Galáticos FC', 
    date: '2024-05-20T19:00', 
    location: 'Arena Central', 
    scoreHome: 4, 
    scoreAway: 2, 
    status: MatchStatus.FINISHED,
    isCompleted: true, 
    playersConfirmed: ['1', '2', '3', '4', '5'],
    events: [
      { id: 'e1', playerId: '1', type: 'goal' },
      { id: 'e2', playerId: '3', type: 'goal' },
      { id: 'e3', playerId: '3', type: 'goal' },
      { id: 'e4', playerId: '1', type: 'yellow_card' }
    ]
  },
  { 
    id: 'm2', 
    opponent: 'Vila Real Amador', 
    date: '2024-06-15T20:30', 
    location: 'Campo do Zé', 
    status: MatchStatus.SCHEDULED,
    isCompleted: false, 
    playersConfirmed: ['1', '3', '5'] 
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', description: 'Mensalidade Junho', amount: 350, date: '2024-06-01', type: 'income', category: 'Mensalidade' },
  { id: 't2', description: 'Aluguel de Quadra', amount: -180, date: '2024-06-05', type: 'expense', category: 'Campo' },
  { id: 't3', description: 'Bolas Novas (2x)', amount: -240, date: '2024-06-10', type: 'expense', category: 'Material' },
  { id: 't4', description: 'Patrocínio Padaria Sol', amount: 500, date: '2024-06-12', type: 'income', category: 'Patrocínio' },
];
