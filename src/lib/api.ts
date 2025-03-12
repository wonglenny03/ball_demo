import { Match } from "@/types/match"
import { mockMatches, generateMoreMatches } from "./mockData"
import { League, Country, MatchFilter } from "@/types/filter"
import { mockLeagues, mockCountries } from "./mockData"

// 模拟的API延迟
const MOCK_DELAY = 500

// 辅助函数：延迟执行
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 获取所有比赛
export async function getMatches(): Promise<Match[]> {
  await delay(MOCK_DELAY)
  // 生成更多比赛以丰富数据
  const additionalMatches = generateMoreMatches(20)
  return [...mockMatches, ...additionalMatches]
}

// 获取筛选后的比赛
export async function getFilteredMatches(
  filter: MatchFilter
): Promise<Match[]> {
  await delay(MOCK_DELAY)

  let matches = [...mockMatches, ...generateMoreMatches(20)]

  // 过滤联赛
  if (filter.leagues.length > 0) {
    matches = matches.filter((match) => filter.leagues.includes(match.leagueId))
  }

  // 过滤国家
  if (filter.countries.length > 0) {
    matches = matches.filter((match) =>
      filter.countries.includes(match.countryName)
    )
  }

  // 过滤状态
  if (filter.statuses.length > 0) {
    matches = matches.filter((match) =>
      filter.statuses.includes(match.status.code)
    )
  }

  // 过滤日期范围
  if (filter.dateRange) {
    const startDate = new Date(filter.dateRange.start).getTime()
    const endDate = new Date(filter.dateRange.end).getTime()
    matches = matches.filter((match) => {
      const matchDate = new Date(match.startTime).getTime()
      return matchDate >= startDate && matchDate <= endDate
    })
  }

  // 仅展示收藏
  if (filter.favorites) {
    const favoriteIds = getFavorites()
    matches = matches.filter((match) => favoriteIds.includes(match.id))
  }

  // 仅展示直播
  if (filter.liveOnly) {
    matches = matches.filter((match) =>
      [1, 2, 3, 9, 10].includes(match.status.code)
    )
  }

  // 仅展示未开始
  if (filter.upcomingOnly) {
    matches = matches.filter((match) => match.status.code === 0)
  }

  // 仅展示已完成
  if (filter.finishedOnly) {
    matches = matches.filter((match) => match.status.code === 4)
  }

  return matches
}

// 获取单场比赛详情
export async function getMatchDetails(matchId: string): Promise<Match | null> {
  await delay(MOCK_DELAY)

  const allMatches = [...mockMatches, ...generateMoreMatches(20)]
  const match = allMatches.find((m) => m.id === matchId)

  return match || null
}

// 获取所有联赛
export async function getLeagues(): Promise<League[]> {
  await delay(MOCK_DELAY)
  return mockLeagues
}

// 获取所有国家
export async function getCountries(): Promise<Country[]> {
  await delay(MOCK_DELAY)
  return mockCountries
}

// 本地存储相关 - 收藏比赛
export function getFavorites(): string[] {
  if (typeof window === "undefined") return []

  const favorites = localStorage.getItem("favorites")
  return favorites ? JSON.parse(favorites) : []
}

export function addFavorite(matchId: string): void {
  if (typeof window === "undefined") return

  const favorites = getFavorites()
  if (!favorites.includes(matchId)) {
    favorites.push(matchId)
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }
}

export function removeFavorite(matchId: string): void {
  if (typeof window === "undefined") return

  const favorites = getFavorites()
  const index = favorites.indexOf(matchId)
  if (index !== -1) {
    favorites.splice(index, 1)
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }
}

// 用户设置相关
export interface UserSettings {
  darkMode: boolean
  compactMode: boolean
  showOdds: boolean
  showHalfTimeScore: boolean
  autoRefreshInterval: number // 秒
  soundAlerts: boolean
}

export function getUserSettings(): UserSettings {
  if (typeof window === "undefined") {
    return {
      darkMode: false,
      compactMode: false,
      showOdds: true,
      showHalfTimeScore: true,
      autoRefreshInterval: 60,
      soundAlerts: true,
    }
  }

  const settings = localStorage.getItem("userSettings")
  return settings
    ? JSON.parse(settings)
    : {
        darkMode: false,
        compactMode: false,
        showOdds: true,
        showHalfTimeScore: true,
        autoRefreshInterval: 60,
        soundAlerts: true,
      }
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === "undefined") return

  localStorage.setItem("userSettings", JSON.stringify(settings))
}
