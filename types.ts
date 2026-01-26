
export enum Position {
  GK = 'Goleiro',
  DF = 'Defesa',
  MF = 'Meio-Campo',
  FW = 'Ataque'
}

export enum MatchStatus {
  SCHEDULED = 'Agendado',
  CANCELED = 'Cancelado',
  FINISHED = 'Finalizado'
}

export interface MatchEvent {
  id: string;
  playerId: string;
  type: 'goal' | 'yellow_card' | 'red_card';
  minute?: number;
}

export interface Player {
  id: string;
  name: string;
  nickname: string;
  number: number;
  position: Position;
  goals: number;
  assists: number;
  gamesPlayed: number;
  rating: number;
  photo?: string;
  isPaid?: boolean;
}

export interface Match {
  id: string;
  opponent: string;
  opponentLogo?: string;
  date: string;
  location: string;
  scoreHome?: number;
  scoreAway?: number;
  status: MatchStatus;
  isCompleted: boolean;
  playersConfirmed: string[];
  playersDeclined?: string[];
  events?: MatchEvent[];
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  date: string;
}

export interface LeagueEntry {
  id: string;
  teamName: string;
  logo?: string;
  games: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  yellowCards: number;
  redCards: number;
}

export type Formation = '4-4-2' | '4-3-3' | '3-5-2' | '2-2-1' | '3-2-1';
