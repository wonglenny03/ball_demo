export interface League {
  id: string
  name: string
  logo?: string
  countryName: string
  countryFlag?: string
}

export interface Country {
  name: string
  flag?: string
  leagues: League[]
}

export interface MatchFilter {
  leagues: string[] // League IDs
  countries: string[] // Country names
  statuses: number[] // Status codes
  dateRange?: {
    start: string
    end: string
  }
  favorites?: boolean
  liveOnly?: boolean
  upcomingOnly?: boolean
  finishedOnly?: boolean
}

export interface SortOption {
  field: "startTime" | "leagueName" | "countryName"
  direction: "asc" | "desc"
}

export interface DisplayOptions {
  showOdds: boolean
  showTime: boolean
  showHalfTimeScore: boolean
  showCorners: boolean
  showCards: boolean
  darkMode: boolean
  compactMode: boolean
}
