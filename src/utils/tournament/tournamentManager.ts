import { 
  Tournament, 
  TournamentType, 
  TournamentMatch, 
  TournamentParticipant, 
  TournamentBracket,
  TournamentRound,
  RankTier,
  TournamentStatus
} from '../../types/tournament/core';

export class TournamentManager {
  
  // Bracket Generation
  static generateBracket(participants: TournamentParticipant[], type: TournamentType): TournamentBracket {
    switch (type) {
      case TournamentType.SINGLE_ELIMINATION:
        return this.generateSingleEliminationBracket(participants);
      case TournamentType.DOUBLE_ELIMINATION:
        return this.generateDoubleEliminationBracket(participants);
      case TournamentType.ROUND_ROBIN:
        return this.generateRoundRobinBracket(participants);
      case TournamentType.SWISS:
        return this.generateSwissBracket(participants);
      default:
        throw new Error(`Unsupported tournament type: ${type}`);
    }
  }

  private static generateSingleEliminationBracket(participants: TournamentParticipant[]): TournamentBracket {
    const seededParticipants = this.seedParticipants(participants);
    const rounds: TournamentRound[] = [];
    
    // Calculate number of rounds needed
    const roundCount = Math.ceil(Math.log2(seededParticipants.length));
    let currentParticipants = [...seededParticipants];
    
    // Pad to next power of 2 with byes
    const targetSize = Math.pow(2, roundCount);
    while (currentParticipants.length < targetSize) {
      currentParticipants.push(this.createByeParticipant());
    }
    
    for (let round = 1; round <= roundCount; round++) {
      const matches: TournamentMatch[] = [];
      const roundName = this.getRoundName(round, roundCount);
      
      // Create matches for this round
      for (let i = 0; i < currentParticipants.length; i += 2) {
        const participant1 = currentParticipants[i];
        const participant2 = currentParticipants[i + 1];
        
        if (!participant2 || participant2.id === 'bye') {
          // Bye - participant1 advances automatically
          continue;
        }
        
        matches.push({
          id: `match_${round}_${Math.floor(i / 2) + 1}`,
          tournamentId: '',
          round,
          participant1,
          participant2,
          status: 'waiting',
          spectatorCount: 0
        });
      }
      
      rounds.push({
        roundNumber: round,
        name: roundName,
        matches,
        isComplete: false
      });
      
      // Prepare for next round (winners only)
      currentParticipants = currentParticipants.filter((_, index) => index % 2 === 0);
    }
    
    return {
      type: TournamentType.SINGLE_ELIMINATION,
      rounds,
      currentRound: 1,
      winnersAdvance: 1
    };
  }

  private static generateDoubleEliminationBracket(participants: TournamentParticipant[]): TournamentBracket {
    // Double elimination has winners bracket and losers bracket
    const seededParticipants = this.seedParticipants(participants);
    const rounds: TournamentRound[] = [];
    
    // Winners bracket rounds
    const winnersRounds = Math.ceil(Math.log2(seededParticipants.length));
    
    // Losers bracket has (winnersRounds * 2 - 1) rounds
    const losersRounds = winnersRounds * 2 - 1;
    
    // Generate winners bracket
    let currentWinners = [...seededParticipants];
    for (let round = 1; round <= winnersRounds; round++) {
      const matches: TournamentMatch[] = [];
      
      for (let i = 0; i < currentWinners.length; i += 2) {
        if (i + 1 < currentWinners.length) {
          matches.push({
            id: `wb_r${round}_m${Math.floor(i / 2) + 1}`,
            tournamentId: '',
            round,
            participant1: currentWinners[i],
            participant2: currentWinners[i + 1],
            status: 'waiting',
            spectatorCount: 0
          });
        }
      }
      
      rounds.push({
        roundNumber: round,
        name: `Winners Round ${round}`,
        matches,
        isComplete: false
      });
      
      currentWinners = currentWinners.filter((_, index) => index % 2 === 0);
    }
    
    // Generate losers bracket (simplified)
    for (let round = 1; round <= losersRounds; round++) {
      rounds.push({
        roundNumber: winnersRounds + round,
        name: `Losers Round ${round}`,
        matches: [],
        isComplete: false
      });
    }
    
    // Grand Finals
    rounds.push({
      roundNumber: winnersRounds + losersRounds + 1,
      name: 'Grand Finals',
      matches: [],
      isComplete: false
    });
    
    return {
      type: TournamentType.DOUBLE_ELIMINATION,
      rounds,
      currentRound: 1,
      winnersAdvance: 1,
      losersAdvance: 0
    };
  }

  private static generateRoundRobinBracket(participants: TournamentParticipant[]): TournamentBracket {
    const rounds: TournamentRound[] = [];
    const numParticipants = participants.length;
    
    // In round robin, each participant plays every other participant once
    const totalRounds = numParticipants % 2 === 0 ? numParticipants - 1 : numParticipants;
    
    for (let round = 1; round <= totalRounds; round++) {
      const matches: TournamentMatch[] = [];
      const roundParticipants = [...participants];
      
      // Algorithm to pair participants for round robin
      if (roundParticipants.length % 2 === 1) {
        roundParticipants.push(this.createByeParticipant());
      }
      
      const half = roundParticipants.length / 2;
      const firstHalf = roundParticipants.slice(0, half);
      const secondHalf = roundParticipants.slice(half).reverse();
      
      for (let i = 0; i < half; i++) {
        const participant1 = firstHalf[i];
        const participant2 = secondHalf[i];
        
        if (participant1.id !== 'bye' && participant2.id !== 'bye') {
          matches.push({
            id: `rr_r${round}_m${i + 1}`,
            tournamentId: '',
            round,
            participant1,
            participant2,
            status: 'waiting',
            spectatorCount: 0
          });
        }
      }
      
      rounds.push({
        roundNumber: round,
        name: `Round ${round}`,
        matches,
        isComplete: false
      });
      
      // Rotate participants for next round (except first one)
      if (roundParticipants.length > 2) {
        const temp = roundParticipants[1];
        for (let i = 1; i < roundParticipants.length - 1; i++) {
          roundParticipants[i] = roundParticipants[i + 1];
        }
        roundParticipants[roundParticipants.length - 1] = temp;
      }
    }
    
    return {
      type: TournamentType.ROUND_ROBIN,
      rounds,
      currentRound: 1,
      winnersAdvance: numParticipants // All advance, ranking by wins
    };
  }

  private static generateSwissBracket(participants: TournamentParticipant[]): TournamentBracket {
    const rounds: TournamentRound[] = [];
    const numRounds = Math.ceil(Math.log2(participants.length)) + 1;
    
    // Swiss system pairs players with similar records
    for (let round = 1; round <= numRounds; round++) {
      rounds.push({
        roundNumber: round,
        name: `Round ${round}`,
        matches: [],
        isComplete: false
      });
    }
    
    return {
      type: TournamentType.SWISS,
      rounds,
      currentRound: 1,
      winnersAdvance: Math.ceil(participants.length / 4) // Top 25% advance
    };
  }

  // Participant seeding based on rating/rank
  private static seedParticipants(participants: TournamentParticipant[]): TournamentParticipant[] {
    return [...participants].sort((a, b) => {
      // Primary sort by rating
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      // Secondary sort by rank tier
      const rankOrder = {
        [RankTier.LEGEND]: 8,
        [RankTier.GRANDMASTER]: 7,
        [RankTier.MASTER]: 6,
        [RankTier.DIAMOND]: 5,
        [RankTier.PLATINUM]: 4,
        [RankTier.GOLD]: 3,
        [RankTier.SILVER]: 2,
        [RankTier.BRONZE]: 1
      };
      return rankOrder[b.rank] - rankOrder[a.rank];
    });
  }

  private static createByeParticipant(): TournamentParticipant {
    return {
      id: 'bye',
      userId: 'bye',
      username: 'BYE',
      rank: RankTier.BRONZE,
      rating: 0,
      deck: {
        id: 'bye',
        name: 'BYE',
        format: 'standard' as any,
        cardCount: 0
      },
      registrationTime: Date.now(),
      checkedIn: true,
      eliminated: false,
      currentPosition: 999,
      wins: 0,
      losses: 0,
      draws: 0
    };
  }

  private static getRoundName(round: number, totalRounds: number): string {
    const roundsFromEnd = totalRounds - round + 1;
    
    if (roundsFromEnd === 1) return 'Finals';
    if (roundsFromEnd === 2) return 'Semi-Finals';
    if (roundsFromEnd === 3) return 'Quarter-Finals';
    if (roundsFromEnd === 4) return 'Round of 16';
    if (roundsFromEnd === 5) return 'Round of 32';
    
    return `Round ${round}`;
  }

  // Match Management
  static advanceWinner(match: TournamentMatch, winner: TournamentParticipant): void {
    match.winner = winner;
    match.status = 'finished';
    match.endTime = Date.now();
    
    // Update participant records
    if (winner.id === match.participant1.id) {
      match.participant1.wins++;
      match.participant2.losses++;
    } else {
      match.participant2.wins++;
      match.participant1.losses++;
    }
  }

  static canStartMatch(match: TournamentMatch): boolean {
    return match.status === 'waiting' && 
           match.participant1.checkedIn && 
           match.participant2.checkedIn &&
           match.participant1.id !== 'bye' &&
           match.participant2.id !== 'bye';
  }

  // Tournament state management
  static canStartTournament(tournament: Tournament): boolean {
    return tournament.status === TournamentStatus.READY &&
           tournament.currentParticipants >= tournament.minParticipants &&
           Date.now() >= tournament.tournamentStart;
  }

  static calculateTournamentProgress(tournament: Tournament): number {
    const totalMatches = tournament.bracket.rounds.reduce(
      (sum, round) => sum + round.matches.length, 0
    );
    const completedMatches = tournament.bracket.rounds.reduce(
      (sum, round) => sum + round.matches.filter(match => match.status === 'finished').length, 0
    );
    
    return totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;
  }

  static getNextMatches(tournament: Tournament): TournamentMatch[] {
    const currentRound = tournament.bracket.rounds[tournament.bracket.currentRound - 1];
    if (!currentRound) return [];
    
    return currentRound.matches.filter(match => 
      match.status === 'waiting' && this.canStartMatch(match)
    );
  }

  static isRoundComplete(round: TournamentRound): boolean {
    return round.matches.every(match => match.status === 'finished');
  }

  static advanceToNextRound(tournament: Tournament): boolean {
    const currentRound = tournament.bracket.rounds[tournament.bracket.currentRound - 1];
    
    if (!currentRound || !this.isRoundComplete(currentRound)) {
      return false;
    }
    
    currentRound.isComplete = true;
    currentRound.endTime = Date.now();
    
    // Check if tournament is complete
    if (tournament.bracket.currentRound >= tournament.bracket.rounds.length) {
      tournament.status = TournamentStatus.FINISHED;
      tournament.actualEnd = Date.now();
      return true;
    }
    
    // Advance to next round
    tournament.bracket.currentRound++;
    
    // Populate next round matches with winners
    const nextRound = tournament.bracket.rounds[tournament.bracket.currentRound - 1];
    if (nextRound && tournament.type === TournamentType.SINGLE_ELIMINATION) {
      this.populateNextRoundMatches(currentRound, nextRound);
    }
    
    return true;
  }

  private static populateNextRoundMatches(currentRound: TournamentRound, nextRound: TournamentRound): void {
    const winners = currentRound.matches.map(match => match.winner).filter(Boolean) as TournamentParticipant[];
    
    // Create matches for next round
    for (let i = 0; i < winners.length; i += 2) {
      if (i + 1 < winners.length) {
        const matchIndex = Math.floor(i / 2);
        if (nextRound.matches[matchIndex]) {
          nextRound.matches[matchIndex].participant1 = winners[i];
          nextRound.matches[matchIndex].participant2 = winners[i + 1];
        }
      }
    }
  }

  // Prize distribution
  static calculatePrizes(tournament: Tournament): Array<{ participant: TournamentParticipant, prize: any }> {
    const standings = this.getFinalStandings(tournament);
    const prizes: Array<{ participant: TournamentParticipant, prize: any }> = [];
    
    tournament.prizePool.distribution.forEach(prizeEntry => {
      const participant = standings[prizeEntry.position - 1];
      if (participant) {
        prizes.push({
          participant,
          prize: {
            type: tournament.prizePool.currency,
            amount: prizeEntry.amount,
            items: prizeEntry.reward
          }
        });
      }
    });
    
    return prizes;
  }

  static getFinalStandings(tournament: Tournament): TournamentParticipant[] {
    // Sort participants by performance
    return tournament.participants
      .filter(p => !p.eliminated)
      .sort((a, b) => {
        // Primary sort by wins
        if (a.wins !== b.wins) {
          return b.wins - a.wins;
        }
        // Secondary sort by losses (fewer is better)
        if (a.losses !== b.losses) {
          return a.losses - b.losses;
        }
        // Tertiary sort by rating
        return b.rating - a.rating;
      });
  }
}

// Rating calculation utilities
export class RatingCalculator {
  private static readonly K_FACTOR_BASE = 32;
  
  static calculateNewRating(
    playerRating: number,
    opponentRating: number,
    result: 'win' | 'loss' | 'draw',
    playerRank: RankTier
  ): { newRating: number; change: number } {
    const kFactor = this.getKFactor(playerRating, playerRank);
    const expectedScore = this.getExpectedScore(playerRating, opponentRating);
    
    let actualScore: number;
    switch (result) {
      case 'win':
        actualScore = 1;
        break;
      case 'loss':
        actualScore = 0;
        break;
      case 'draw':
        actualScore = 0.5;
        break;
    }
    
    const change = Math.round(kFactor * (actualScore - expectedScore));
    const newRating = Math.max(0, playerRating + change);
    
    return { newRating, change };
  }
  
  private static getKFactor(rating: number, rank: RankTier): number {
    // Higher K-factor for lower-rated players for faster progression
    if (rating < 1200) return 40;
    if (rating < 1600) return 32;
    if (rating < 2000) return 24;
    if (rank === RankTier.GRANDMASTER || rank === RankTier.LEGEND) return 16;
    return 20;
  }
  
  private static getExpectedScore(playerRating: number, opponentRating: number): number {
    const ratingDiff = opponentRating - playerRating;
    return 1 / (1 + Math.pow(10, ratingDiff / 400));
  }
  
  static getRankFromRating(rating: number): RankTier {
    if (rating >= 2400) return RankTier.LEGEND;
    if (rating >= 2200) return RankTier.GRANDMASTER;
    if (rating >= 2000) return RankTier.MASTER;
    if (rating >= 1800) return RankTier.DIAMOND;
    if (rating >= 1500) return RankTier.PLATINUM;
    if (rating >= 1200) return RankTier.GOLD;
    if (rating >= 900) return RankTier.SILVER;
    return RankTier.BRONZE;
  }
  
  static getDivisionFromRating(rating: number, rank: RankTier): number {
    const baseRating = this.getBaseRatingForRank(rank);
    const nextRankRating = this.getBaseRatingForRank(this.getNextRank(rank));
    const ratingRange = nextRankRating - baseRating;
    const divisionSize = ratingRange / 3;
    
    const ratingInRank = rating - baseRating;
    return Math.min(3, Math.max(1, Math.ceil(ratingInRank / divisionSize)));
  }
  
  private static getBaseRatingForRank(rank: RankTier): number {
    const baseRatings = {
      [RankTier.BRONZE]: 0,
      [RankTier.SILVER]: 900,
      [RankTier.GOLD]: 1200,
      [RankTier.PLATINUM]: 1500,
      [RankTier.DIAMOND]: 1800,
      [RankTier.MASTER]: 2000,
      [RankTier.GRANDMASTER]: 2200,
      [RankTier.LEGEND]: 2400
    };
    return baseRatings[rank];
  }
  
  private static getNextRank(rank: RankTier): RankTier {
    const progression = {
      [RankTier.BRONZE]: RankTier.SILVER,
      [RankTier.SILVER]: RankTier.GOLD,
      [RankTier.GOLD]: RankTier.PLATINUM,
      [RankTier.PLATINUM]: RankTier.DIAMOND,
      [RankTier.DIAMOND]: RankTier.MASTER,
      [RankTier.MASTER]: RankTier.GRANDMASTER,
      [RankTier.GRANDMASTER]: RankTier.LEGEND,
      [RankTier.LEGEND]: RankTier.LEGEND
    };
    return progression[rank];
  }
}