"use client";

import { BattleCard, GameResult, CompetitiveTier } from '../../types/battle/core';

export interface TournamentPlayer {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  tier: CompetitiveTier;
  deck: BattleCard[];
  stats: PlayerStats;
  registrationTime: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  averageGameDuration: number;
  favoriteElement: string;
  totalDamageDealt: number;
  perfectGames: number; // Games won without taking damage
  fastestWin: number; // Fastest win time in seconds
  longestGame: number; // Longest game duration
  comboCount: number;
  cardPlayRate: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: TournamentType;
  format: TournamentFormat;
  maxPlayers: number;
  entryFee: number;
  prizePool: TournamentPrize[];
  status: TournamentStatus;
  startTime: number;
  endTime?: number;
  registrationDeadline: number;
  players: TournamentPlayer[];
  brackets: TournamentBracket[];
  currentRound: number;
  maxRounds: number;
  rules: TournamentRules;
  host: string;
  spectators: string[];
}

export enum TournamentType {
  SINGLE_ELIMINATION = 'single_elimination',
  DOUBLE_ELIMINATION = 'double_elimination',
  ROUND_ROBIN = 'round_robin',
  SWISS = 'swiss',
  LADDER = 'ladder',
  SEASONAL = 'seasonal'
}

export enum TournamentFormat {
  STANDARD = 'standard',
  DRAFT = 'draft',
  SEALED = 'sealed',
  CONSTRUCTED = 'constructed',
  ARENA = 'arena'
}

export enum TournamentStatus {
  REGISTRATION = 'registration',
  STARTING = 'starting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  CANCELLED = 'cancelled'
}

export interface TournamentRules {
  deckSize: { min: number; max: number };
  allowedElements: string[];
  bannedCards: string[];
  timeLimit: number; // seconds per turn
  maxGameDuration: number; // seconds per game
  bestOf: number; // best of X games
}

export interface TournamentBracket {
  roundNumber: number;
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  player1: TournamentPlayer;
  player2: TournamentPlayer;
  winner?: string;
  gameResults: GameResult[];
  status: 'pending' | 'in_progress' | 'completed' | 'forfeit';
  startTime?: number;
  endTime?: number;
  spectators: string[];
}

export interface TournamentPrize {
  position: number;
  type: 'currency' | 'cards' | 'title' | 'cosmetic';
  amount: number;
  description: string;
  rarity?: string;
}

export interface SeasonData {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  status: 'upcoming' | 'active' | 'ended';
  leaderboard: PlayerRanking[];
  rewards: SeasonReward[];
  specialEvents: string[];
}

export interface PlayerRanking {
  playerId: string;
  playerName: string;
  rating: number;
  tier: CompetitiveTier;
  position: number;
  gamesPlayed: number;
  winRate: number;
  streak: number; // Current win/loss streak
  peakRating: number;
  lastActive: number;
}

export interface SeasonReward {
  tier: CompetitiveTier;
  minRating: number;
  rewards: {
    currency: number;
    cards: string[];
    titles: string[];
    cosmetics: string[];
  };
}

class TournamentManager {
  private tournaments: Map<string, Tournament> = new Map();
  private playerRankings: Map<string, PlayerRanking> = new Map();
  private currentSeason: SeasonData | null = null;
  private ratingSystem: RatingSystem;

  constructor() {
    this.ratingSystem = new RatingSystem();
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tournamentData');
      if (saved) {
        const data = JSON.parse(saved);
        this.currentSeason = data.currentSeason;
        if (data.rankings) {
          this.playerRankings = new Map(data.rankings);
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tournamentData', JSON.stringify({
        currentSeason: this.currentSeason,
        rankings: Array.from(this.playerRankings.entries())
      }));
    }
  }

  // Tournament Creation and Management
  createTournament(config: {
    name: string;
    description: string;
    type: TournamentType;
    format: TournamentFormat;
    maxPlayers: number;
    entryFee: number;
    prizePool: TournamentPrize[];
    rules: TournamentRules;
    host: string;
    registrationDeadline: number;
  }): Tournament {
    const tournament: Tournament = {
      id: `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...config,
      status: TournamentStatus.REGISTRATION,
      startTime: Date.now() + (config.registrationDeadline - Date.now()),
      players: [],
      brackets: [],
      currentRound: 0,
      maxRounds: this.calculateMaxRounds(config.type, config.maxPlayers),
      spectators: []
    };

    this.tournaments.set(tournament.id, tournament);
    return tournament;
  }

  private calculateMaxRounds(type: TournamentType, maxPlayers: number): number {
    switch (type) {
      case TournamentType.SINGLE_ELIMINATION:
        return Math.ceil(Math.log2(maxPlayers));
      case TournamentType.DOUBLE_ELIMINATION:
        return Math.ceil(Math.log2(maxPlayers)) * 2 - 1;
      case TournamentType.ROUND_ROBIN:
        return maxPlayers - 1;
      case TournamentType.SWISS:
        return Math.ceil(Math.log2(maxPlayers));
      default:
        return 1;
    }
  }

  registerPlayer(tournamentId: string, player: TournamentPlayer): boolean {
    const tournament = this.tournaments.get(tournamentId);
    
    if (!tournament || tournament.status !== TournamentStatus.REGISTRATION) {
      return false;
    }

    if (tournament.players.length >= tournament.maxPlayers) {
      return false;
    }

    if (Date.now() > tournament.registrationDeadline) {
      return false;
    }

    // Check if player already registered
    if (tournament.players.some(p => p.id === player.id)) {
      return false;
    }

    tournament.players.push({
      ...player,
      registrationTime: Date.now()
    });

    // Auto-start if tournament is full
    if (tournament.players.length === tournament.maxPlayers) {
      this.startTournament(tournamentId);
    }

    return true;
  }

  startTournament(tournamentId: string): boolean {
    const tournament = this.tournaments.get(tournamentId);
    
    if (!tournament || tournament.status !== TournamentStatus.REGISTRATION) {
      return false;
    }

    if (tournament.players.length < 2) {
      return false;
    }

    tournament.status = TournamentStatus.STARTING;
    tournament.startTime = Date.now();

    // Generate initial brackets
    this.generateBrackets(tournament);
    
    tournament.status = TournamentStatus.IN_PROGRESS;
    tournament.currentRound = 1;

    return true;
  }

  private generateBrackets(tournament: Tournament) {
    switch (tournament.type) {
      case TournamentType.SINGLE_ELIMINATION:
        this.generateSingleEliminationBrackets(tournament);
        break;
      case TournamentType.ROUND_ROBIN:
        this.generateRoundRobinBrackets(tournament);
        break;
      case TournamentType.SWISS:
        this.generateSwissBrackets(tournament);
        break;
      default:
        this.generateSingleEliminationBrackets(tournament);
    }
  }

  private generateSingleEliminationBrackets(tournament: Tournament) {
    const players = [...tournament.players];
    this.shuffleArray(players);

    // Create first round matches
    const matches: TournamentMatch[] = [];
    
    for (let i = 0; i < players.length; i += 2) {
      if (i + 1 < players.length) {
        matches.push({
          id: `match_${tournament.id}_r1_${i/2}`,
          player1: players[i],
          player2: players[i + 1],
          gameResults: [],
          status: 'pending',
          spectators: []
        });
      }
    }

    tournament.brackets.push({
      roundNumber: 1,
      matches
    });
  }

  private generateRoundRobinBrackets(tournament: Tournament) {
    const players = tournament.players;
    const rounds = players.length - 1;
    
    for (let round = 1; round <= rounds; round++) {
      const matches: TournamentMatch[] = [];
      
      for (let i = 0; i < players.length / 2; i++) {
        const player1Index = i;
        const player2Index = players.length - 1 - i;
        
        if (player1Index !== player2Index) {
          matches.push({
            id: `match_${tournament.id}_r${round}_${i}`,
            player1: players[player1Index],
            player2: players[player2Index],
            gameResults: [],
            status: 'pending',
            spectators: []
          });
        }
      }

      tournament.brackets.push({
        roundNumber: round,
        matches
      });

      // Rotate players for next round (except first player)
      if (round < rounds) {
        const lastPlayer = players.pop()!;
        players.splice(1, 0, lastPlayer);
      }
    }
  }

  private generateSwissBrackets(tournament: Tournament) {
    // Swiss pairing for first round (random)
    const players = [...tournament.players];
    this.shuffleArray(players);

    const matches: TournamentMatch[] = [];
    for (let i = 0; i < players.length; i += 2) {
      if (i + 1 < players.length) {
        matches.push({
          id: `match_${tournament.id}_r1_${i/2}`,
          player1: players[i],
          player2: players[i + 1],
          gameResults: [],
          status: 'pending',
          spectators: []
        });
      }
    }

    tournament.brackets.push({
      roundNumber: 1,
      matches
    });
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Match Management
  reportMatchResult(tournamentId: string, matchId: string, result: GameResult): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;

    const currentBracket = tournament.brackets[tournament.currentRound - 1];
    const match = currentBracket.matches.find(m => m.id === matchId);
    
    if (!match || match.status === 'completed') return false;

    match.gameResults.push(result);
    match.status = 'completed';
    match.winner = result.winner === 'player' ? match.player1.id : match.player2.id;
    match.endTime = Date.now();

    // Update player ratings
    this.updatePlayerRatings(match, result);

    // Check if round is complete
    if (this.isRoundComplete(currentBracket)) {
      this.advanceToNextRound(tournament);
    }

    return true;
  }

  private updatePlayerRatings(match: TournamentMatch, result: GameResult) {
    const player1Rating = this.playerRankings.get(match.player1.id);
    const player2Rating = this.playerRankings.get(match.player2.id);

    if (player1Rating && player2Rating) {
      const newRatings = this.ratingSystem.calculateNewRatings(
        player1Rating.rating,
        player2Rating.rating,
        result.winner === 'player' ? 1 : 0
      );

      player1Rating.rating = newRatings.player1Rating;
      player2Rating.rating = newRatings.player2Rating;
      player1Rating.gamesPlayed++;
      player2Rating.gamesPlayed++;

      if (result.winner === 'player') {
        player1Rating.streak = Math.max(0, player1Rating.streak + 1);
        player2Rating.streak = Math.min(0, player2Rating.streak - 1);
      } else {
        player1Rating.streak = Math.min(0, player1Rating.streak - 1);
        player2Rating.streak = Math.max(0, player2Rating.streak + 1);
      }

      // Update tiers
      player1Rating.tier = this.ratingSystem.getRankFromRating(player1Rating.rating);
      player2Rating.tier = this.ratingSystem.getRankFromRating(player2Rating.rating);

      this.saveToStorage();
    }
  }

  private isRoundComplete(bracket: TournamentBracket): boolean {
    return bracket.matches.every(match => match.status === 'completed');
  }

  private advanceToNextRound(tournament: Tournament) {
    if (tournament.currentRound >= tournament.maxRounds) {
      this.finishTournament(tournament);
      return;
    }

    tournament.currentRound++;
    
    // Generate next round based on tournament type
    if (tournament.type === TournamentType.SINGLE_ELIMINATION) {
      this.generateNextEliminationRound(tournament);
    } else if (tournament.type === TournamentType.SWISS) {
      this.generateNextSwissRound(tournament);
    }
  }

  private generateNextEliminationRound(tournament: Tournament) {
    const previousBracket = tournament.brackets[tournament.currentRound - 2];
    const winners: TournamentPlayer[] = [];

    previousBracket.matches.forEach(match => {
      if (match.winner === match.player1.id) {
        winners.push(match.player1);
      } else {
        winners.push(match.player2);
      }
    });

    const matches: TournamentMatch[] = [];
    for (let i = 0; i < winners.length; i += 2) {
      if (i + 1 < winners.length) {
        matches.push({
          id: `match_${tournament.id}_r${tournament.currentRound}_${i/2}`,
          player1: winners[i],
          player2: winners[i + 1],
          gameResults: [],
          status: 'pending',
          spectators: []
        });
      }
    }

    tournament.brackets.push({
      roundNumber: tournament.currentRound,
      matches
    });
  }

  private generateNextSwissRound(tournament: Tournament) {
    // Swiss pairing based on current standings
    const players = [...tournament.players];
    
    // Sort by current tournament score
    players.sort((a, b) => this.getTournamentScore(tournament, b.id) - this.getTournamentScore(tournament, a.id));

    const matches: TournamentMatch[] = [];
    const paired: Set<string> = new Set();

    for (let i = 0; i < players.length; i++) {
      if (paired.has(players[i].id)) continue;

      // Find best opponent with similar score
      for (let j = i + 1; j < players.length; j++) {
        if (paired.has(players[j].id)) continue;
        
        // Check if they haven't played before
        if (!this.havePlayedBefore(tournament, players[i].id, players[j].id)) {
          matches.push({
            id: `match_${tournament.id}_r${tournament.currentRound}_${matches.length}`,
            player1: players[i],
            player2: players[j],
            gameResults: [],
            status: 'pending',
            spectators: []
          });
          
          paired.add(players[i].id);
          paired.add(players[j].id);
          break;
        }
      }
    }

    tournament.brackets.push({
      roundNumber: tournament.currentRound,
      matches
    });
  }

  private getTournamentScore(tournament: Tournament, playerId: string): number {
    let score = 0;
    tournament.brackets.forEach(bracket => {
      bracket.matches.forEach(match => {
        if (match.winner === playerId) {
          score += 3; // 3 points for win
        } else if ((match.player1.id === playerId || match.player2.id === playerId) && match.status === 'completed') {
          score += 1; // 1 point for participation
        }
      });
    });
    return score;
  }

  private havePlayedBefore(tournament: Tournament, player1Id: string, player2Id: string): boolean {
    return tournament.brackets.some(bracket =>
      bracket.matches.some(match =>
        (match.player1.id === player1Id && match.player2.id === player2Id) ||
        (match.player1.id === player2Id && match.player2.id === player1Id)
      )
    );
  }

  private finishTournament(tournament: Tournament) {
    tournament.status = TournamentStatus.FINISHED;
    tournament.endTime = Date.now();

    // Calculate final standings and distribute prizes
    const standings = this.calculateFinalStandings(tournament);
    this.distributePrizes(tournament, standings);
  }

  private calculateFinalStandings(tournament: Tournament): TournamentPlayer[] {
    const standings = [...tournament.players];
    
    standings.sort((a, b) => {
      const scoreA = this.getTournamentScore(tournament, a.id);
      const scoreB = this.getTournamentScore(tournament, b.id);
      return scoreB - scoreA;
    });

    return standings;
  }

  private distributePrizes(tournament: Tournament, standings: TournamentPlayer[]) {
    tournament.prizePool.forEach(prize => {
      if (prize.position <= standings.length) {
        const winner = standings[prize.position - 1];
        console.log(`Prize distributed: ${winner.name} received ${prize.description}`);
        // Here you would integrate with the actual currency/item system
      }
    });
  }

  // Public API
  getTournament(id: string): Tournament | undefined {
    return this.tournaments.get(id);
  }

  getActiveTournaments(): Tournament[] {
    return Array.from(this.tournaments.values()).filter(t => 
      t.status === TournamentStatus.REGISTRATION || t.status === TournamentStatus.IN_PROGRESS
    );
  }

  getPlayerRanking(playerId: string): PlayerRanking | undefined {
    return this.playerRankings.get(playerId);
  }

  getLeaderboard(limit = 100): PlayerRanking[] {
    return Array.from(this.playerRankings.values())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getCurrentSeason(): SeasonData | null {
    return this.currentSeason;
  }
}

// ELO-based Rating System
class RatingSystem {
  private kFactor = 32;

  calculateNewRatings(rating1: number, rating2: number, score1: number): {
    player1Rating: number;
    player2Rating: number;
  } {
    const expectedScore1 = this.getExpectedScore(rating1, rating2);
    const expectedScore2 = this.getExpectedScore(rating2, rating1);

    const newRating1 = Math.round(rating1 + this.kFactor * (score1 - expectedScore1));
    const newRating2 = Math.round(rating2 + this.kFactor * ((1 - score1) - expectedScore2));

    return {
      player1Rating: Math.max(100, newRating1), // Minimum rating of 100
      player2Rating: Math.max(100, newRating2)
    };
  }

  private getExpectedScore(rating1: number, rating2: number): number {
    return 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
  }

  getRankFromRating(rating: number): CompetitiveTier {
    if (rating >= 2500) return CompetitiveTier.GRANDMASTER;
    if (rating >= 2200) return CompetitiveTier.MASTER;
    if (rating >= 1900) return CompetitiveTier.DIAMOND;
    if (rating >= 1600) return CompetitiveTier.PLATINUM;
    if (rating >= 1300) return CompetitiveTier.GOLD;
    if (rating >= 1000) return CompetitiveTier.SILVER;
    return CompetitiveTier.BRONZE;
  }
}

// Global tournament manager instance
export const tournamentManager = new TournamentManager();

// React hook for tournament functionality
export function useTournament() {
  const createTournament = (config: any) => {
    return tournamentManager.createTournament(config);
  };

  const registerForTournament = (tournamentId: string, player: TournamentPlayer) => {
    return tournamentManager.registerPlayer(tournamentId, player);
  };

  const getActiveTournaments = () => {
    return tournamentManager.getActiveTournaments();
  };

  const getLeaderboard = (limit?: number) => {
    return tournamentManager.getLeaderboard(limit);
  };

  const getPlayerRanking = (playerId: string) => {
    return tournamentManager.getPlayerRanking(playerId);
  };

  return {
    createTournament,
    registerForTournament,
    getActiveTournaments,
    getLeaderboard,
    getPlayerRanking,
    currentSeason: tournamentManager.getCurrentSeason()
  };
}

export default tournamentManager;