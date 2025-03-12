export interface Team {
  id: string
  name: string
  logo?: string
  shortName?: string
}

export interface Score {
  home: number
  away: number
}

export interface HalfTimeScore {
  home: number
  away: number
}

export interface MatchEvent {
  id: string
  type: "goal" | "yellowCard" | "redCard" | "substitution" | "penalty"
  minute: number
  team: "home" | "away"
  playerId: string
  playerName: string
  assistPlayerId?: string
  assistPlayerName?: string
}

export interface MatchStatus {
  code: number
  description: string
}

export interface Match {
  id: string
  leagueId: string
  leagueName: string
  leagueLogo?: string
  countryName: string
  countryFlag?: string
  homeTeam: Team
  awayTeam: Team
  startTime: string
  status: MatchStatus
  currentMinute?: number
  score?: Score
  halfTimeScore?: HalfTimeScore
  events?: MatchEvent[]
  odds?: {
    home: number
    draw: number
    away: number
  }
  statistics?: {
    possession: {
      home: number
      away: number
    }
    shots: {
      home: number
      away: number
    }
    shotsOnTarget: {
      home: number
      away: number
    }
    corners: {
      home: number
      away: number
    }
    fouls: {
      home: number
      away: number
    }
    yellowCards: {
      home: number
      away: number
    }
    redCards: {
      home: number
      away: number
    }
  }
}
