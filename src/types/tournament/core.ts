// Tournament and Ranking System Types
// Version: 1.0.0 - Competitive Gaming Infrastructure

export enum TournamentType {
  SINGLE_ELIMINATION = 'single_elimination',
  DOUBLE_ELIMINATION = 'double_elimination',
  ROUND_ROBIN = 'round_robin',
  SWISS = 'swiss',
  BATTLE_ROYALE = 'battle_royale'
}

export enum TournamentStatus {
  REGISTRATION = 'registration',
  READY = 'ready',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  CANCELLED = 'cancelled'
}

export enum TournamentFormat {
  STANDARD = 'standard',
  WILD = 'wild',
  CLASSIC = 'classic',
  DRAFT = 'draft',
  SEALED = 'sealed'
}

export enum RankTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
  MASTER = 'master',
  GRANDMASTER = 'grandmaster',
  LEGEND = 'legend'
}

export interface TournamentParticipant {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  rank: RankTier;
  rating: number;
  deck: {
    id: string;
    name: string;
    format: TournamentFormat;
    cardCount: number;
  };
  registrationTime: number;
  checkedIn: boolean;
  eliminated: boolean;
  currentPosition: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  round: number;
  participant1: TournamentParticipant;
  participant2: TournamentParticipant;
  winner?: TournamentParticipant;
  result?: {
    player1Score: number;
    player2Score: number;
    gameTime: number;
    endReason: 'victory' | 'forfeit' | 'timeout' | 'disqualification';
  };
  status: 'waiting' | 'in_progress' | 'finished';
  startTime?: number;
  endTime?: number;
  gameId?: string;
  spectatorCount: number;
}

export interface TournamentBracket {
  type: TournamentType;
  rounds: TournamentRound[];
  currentRound: number;
  winnersAdvance: number;
  losersAdvance?: number; // For double elimination
}

export interface TournamentRound {
  roundNumber: number;
  name: string;
  matches: TournamentMatch[];
  isComplete: boolean;
  startTime?: number;
  endTime?: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  organizerName: string;
  
  // Tournament Configuration
  type: TournamentType;
  format: TournamentFormat;
  status: TournamentStatus;
  
  // Capacity & Registration
  maxParticipants: number;
  minParticipants: number;
  currentParticipants: number;
  participants: TournamentParticipant[];
  waitingList: TournamentParticipant[];
  
  // Scheduling
  registrationStart: number;
  registrationEnd: number;
  tournamentStart: number;
  estimatedEnd: number;
  actualEnd?: number;
  
  // Requirements
  requirements: {
    minRank?: RankTier;
    maxRank?: RankTier;
    minRating?: number;
    maxRating?: number;
    verifiedAccount: boolean;
    deckFormat: TournamentFormat;
  };
  
  // Prize Pool
  prizePool: {
    totalValue: number;
    currency: 'diamonds' | 'cards' | 'titles';
    distribution: Array<{
      position: number;
      reward: any;
      amount: number;
    }>;
  };
  
  // Tournament Structure
  bracket: TournamentBracket;
  
  // Rules & Settings
  rules: {
    matchFormat: 'best_of_1' | 'best_of_3' | 'best_of_5';
    timeLimit: number; // seconds per match
    banList?: string[];
    allowSpectators: boolean;
    maxSpectators: number;
    chatEnabled: boolean;
  };
  
  // Statistics
  stats: {
    totalMatches: number;
    completedMatches: number;
    averageMatchTime: number;
    spectatorPeak: number;
    totalViewTime: number;
  };
  
  // Meta
  createdAt: number;
  updatedAt: number;
  tags: string[];
  isOfficial: boolean;
  seasonId?: string;
}

export interface Season {
  id: string;
  name: string;
  description: string;
  
  // Timing
  startDate: number;
  endDate: number;
  isActive: boolean;
  
  // Rewards
  rewards: {
    rankRewards: Array<{
      rank: RankTier;
      diamonds: number;
      cards: string[];
      titles: string[];
    }>;
    leaderboardRewards: Array<{
      position: number;
      diamonds: number;
      specialCards: string[];
      titles: string[];
    }>;
  };
  
  // Statistics
  stats: {
    totalParticipants: number;
    totalTournaments: number;
    totalMatches: number;
    totalPrizePool: number;
  };
}

export interface PlayerRanking {
  userId: string;
  username: string;
  avatar?: string;
  
  // Current Stats
  currentRank: RankTier;
  currentRating: number;
  currentDivision: number;
  
  // Season Stats
  seasonWins: number;
  seasonLosses: number;
  seasonDraws: number;
  winRate: number;
  winStreak: number;
  bestWinStreak: number;
  
  // Tournament Performance
  tournamentsEntered: number;
  tournamentsWon: number;
  finalReaches: number;
  averagePlacement: number;
  
  // Recent Performance
  recentMatches: Array<{
    opponent: string;
    result: 'win' | 'loss' | 'draw';
    ratingChange: number;
    timestamp: number;
  }>;
  
  // Achievements
  titles: string[];
  badges: string[];
  
  // Meta
  lastActive: number;
  peakRating: number;
  peakRank: RankTier;
  totalPlayTime: number;
}

export interface Leaderboard {
  type: 'global' | 'regional' | 'seasonal';
  category: 'rating' | 'tournaments_won' | 'win_rate';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'all_time';
  
  entries: Array<{
    position: number;
    previousPosition?: number;
    player: PlayerRanking;
    value: number;
    change: number;
  }>;
  
  lastUpdated: number;
  nextUpdate: number;
}

export interface TournamentInvitation {
  id: string;
  tournamentId: string;
  inviterId: string;
  inviterName: string;
  inviteeId: string;
  inviteeName: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: number;
  expiresAt: number;
}

export interface MatchReport {
  matchId: string;
  tournamentId: string;
  reporterId: string;
  reason: 'cheating' | 'toxicity' | 'disconnection' | 'technical_issue' | 'other';
  description: string;
  evidence?: {
    screenshots: string[];
    gameReplay?: string;
    chatLogs?: string[];
  };
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: number;
  resolvedAt?: number;
  moderatorNotes?: string;
}

// Utility Types
export interface TournamentFilter {
  type?: TournamentType[];
  format?: TournamentFormat[];
  status?: TournamentStatus[];
  minPrizePool?: number;
  maxParticipants?: number;
  startTimeRange?: {
    from: number;
    to: number;
  };
  requirements?: {
    rankRange?: {
      min: RankTier;
      max: RankTier;
    };
    ratingRange?: {
      min: number;
      max: number;
    };
  };
}

export interface TournamentCreationData {
  name: string;
  description: string;
  type: TournamentType;
  format: TournamentFormat;
  maxParticipants: number;
  minParticipants: number;
  registrationEnd: number;
  tournamentStart: number;
  requirements: Tournament['requirements'];
  prizePool: Tournament['prizePool'];
  rules: Tournament['rules'];
  tags: string[];
}

export interface RatingCalculation {
  oldRating: number;
  newRating: number;
  change: number;
  kFactor: number;
  opponentRating: number;
  result: 'win' | 'loss' | 'draw';
}