import { Match, MatchStatus } from "@/types/match"
import { League, Country } from "@/types/filter"

// 比赛状态
export const matchStatuses: Record<string, MatchStatus> = {
  notStarted: { code: 0, description: "未开始" },
  firstHalf: { code: 1, description: "上半场" },
  halfTime: { code: 2, description: "中场休息" },
  secondHalf: { code: 3, description: "下半场" },
  finished: { code: 4, description: "完场" },
  postponed: { code: 5, description: "延期" },
  canceled: { code: 6, description: "取消" },
  interrupted: { code: 7, description: "中断" },
  suspended: { code: 8, description: "暂停" },
  extraTime: { code: 9, description: "加时" },
  penaltyShootout: { code: 10, description: "点球" },
}

// 联赛数据
export const mockLeagues: League[] = [
  {
    id: "1",
    name: "英超",
    logo: "https://via.placeholder.com/30",
    countryName: "英格兰",
    countryFlag: "https://via.placeholder.com/20",
  },
  {
    id: "2",
    name: "西甲",
    logo: "https://via.placeholder.com/30",
    countryName: "西班牙",
    countryFlag: "https://via.placeholder.com/20",
  },
  {
    id: "3",
    name: "德甲",
    logo: "https://via.placeholder.com/30",
    countryName: "德国",
    countryFlag: "https://via.placeholder.com/20",
  },
  {
    id: "4",
    name: "意甲",
    logo: "https://via.placeholder.com/30",
    countryName: "意大利",
    countryFlag: "https://via.placeholder.com/20",
  },
  {
    id: "5",
    name: "法甲",
    logo: "https://via.placeholder.com/30",
    countryName: "法国",
    countryFlag: "https://via.placeholder.com/20",
  },
  {
    id: "6",
    name: "中超",
    logo: "https://via.placeholder.com/30",
    countryName: "中国",
    countryFlag: "https://via.placeholder.com/20",
  },
]

// 国家数据
export const mockCountries: Country[] = [
  {
    name: "英格兰",
    flag: "https://via.placeholder.com/20",
    leagues: mockLeagues.filter((league) => league.countryName === "英格兰"),
  },
  {
    name: "西班牙",
    flag: "https://via.placeholder.com/20",
    leagues: mockLeagues.filter((league) => league.countryName === "西班牙"),
  },
  {
    name: "德国",
    flag: "https://via.placeholder.com/20",
    leagues: mockLeagues.filter((league) => league.countryName === "德国"),
  },
  {
    name: "意大利",
    flag: "https://via.placeholder.com/20",
    leagues: mockLeagues.filter((league) => league.countryName === "意大利"),
  },
  {
    name: "法国",
    flag: "https://via.placeholder.com/20",
    leagues: mockLeagues.filter((league) => league.countryName === "法国"),
  },
  {
    name: "中国",
    flag: "https://via.placeholder.com/20",
    leagues: mockLeagues.filter((league) => league.countryName === "中国"),
  },
]

// 比赛数据
export const mockMatches: Match[] = [
  // 进行中的比赛
  {
    id: "1",
    leagueId: "1",
    leagueName: "英超",
    leagueLogo: "https://via.placeholder.com/30",
    countryName: "英格兰",
    countryFlag: "https://via.placeholder.com/20",
    homeTeam: {
      id: "101",
      name: "曼联",
      logo: "https://via.placeholder.com/40",
      shortName: "MUN",
    },
    awayTeam: {
      id: "102",
      name: "利物浦",
      logo: "https://via.placeholder.com/40",
      shortName: "LIV",
    },
    startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: matchStatuses.firstHalf,
    currentMinute: 35,
    score: {
      home: 1,
      away: 0,
    },
    halfTimeScore: {
      home: 0,
      away: 0,
    },
    events: [
      {
        id: "1001",
        type: "goal",
        minute: 23,
        team: "home",
        playerId: "1001",
        playerName: "拉什福德",
      },
      {
        id: "1002",
        type: "yellowCard",
        minute: 15,
        team: "away",
        playerId: "2001",
        playerName: "范迪克",
      },
    ],
    odds: {
      home: 2.5,
      draw: 3.4,
      away: 2.7,
    },
    statistics: {
      possession: {
        home: 45,
        away: 55,
      },
      shots: {
        home: 6,
        away: 8,
      },
      shotsOnTarget: {
        home: 3,
        away: 2,
      },
      corners: {
        home: 3,
        away: 5,
      },
      fouls: {
        home: 5,
        away: 7,
      },
      yellowCards: {
        home: 0,
        away: 1,
      },
      redCards: {
        home: 0,
        away: 0,
      },
    },
  },
  // 即将开始的比赛
  {
    id: "2",
    leagueId: "1",
    leagueName: "英超",
    leagueLogo: "https://via.placeholder.com/30",
    countryName: "英格兰",
    countryFlag: "https://via.placeholder.com/20",
    homeTeam: {
      id: "103",
      name: "切尔西",
      logo: "https://via.placeholder.com/40",
      shortName: "CHE",
    },
    awayTeam: {
      id: "104",
      name: "阿森纳",
      logo: "https://via.placeholder.com/40",
      shortName: "ARS",
    },
    startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: matchStatuses.notStarted,
    odds: {
      home: 2.2,
      draw: 3.1,
      away: 3.2,
    },
  },
  // 已完成的比赛
  {
    id: "3",
    leagueId: "2",
    leagueName: "西甲",
    leagueLogo: "https://via.placeholder.com/30",
    countryName: "西班牙",
    countryFlag: "https://via.placeholder.com/20",
    homeTeam: {
      id: "201",
      name: "巴塞罗那",
      logo: "https://via.placeholder.com/40",
      shortName: "BAR",
    },
    awayTeam: {
      id: "202",
      name: "皇家马德里",
      logo: "https://via.placeholder.com/40",
      shortName: "RMA",
    },
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: matchStatuses.finished,
    score: {
      home: 2,
      away: 2,
    },
    halfTimeScore: {
      home: 1,
      away: 0,
    },
    events: [
      {
        id: "2001",
        type: "goal",
        minute: 23,
        team: "home",
        playerId: "3001",
        playerName: "莱万多夫斯基",
      },
      {
        id: "2002",
        type: "goal",
        minute: 56,
        team: "away",
        playerId: "4001",
        playerName: "本泽马",
      },
      {
        id: "2003",
        type: "goal",
        minute: 65,
        team: "home",
        playerId: "3001",
        playerName: "莱万多夫斯基",
      },
      {
        id: "2004",
        type: "goal",
        minute: 89,
        team: "away",
        playerId: "4002",
        playerName: "维尼修斯",
      },
    ],
    statistics: {
      possession: {
        home: 58,
        away: 42,
      },
      shots: {
        home: 12,
        away: 10,
      },
      shotsOnTarget: {
        home: 6,
        away: 4,
      },
      corners: {
        home: 7,
        away: 4,
      },
      fouls: {
        home: 9,
        away: 12,
      },
      yellowCards: {
        home: 2,
        away: 3,
      },
      redCards: {
        home: 0,
        away: 0,
      },
    },
  },
  // 中超比赛
  {
    id: "4",
    leagueId: "6",
    leagueName: "中超",
    leagueLogo: "https://via.placeholder.com/30",
    countryName: "中国",
    countryFlag: "https://via.placeholder.com/20",
    homeTeam: {
      id: "601",
      name: "上海海港",
      logo: "https://via.placeholder.com/40",
      shortName: "SHH",
    },
    awayTeam: {
      id: "602",
      name: "北京国安",
      logo: "https://via.placeholder.com/40",
      shortName: "BJG",
    },
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: matchStatuses.secondHalf,
    currentMinute: 65,
    score: {
      home: 1,
      away: 1,
    },
    halfTimeScore: {
      home: 0,
      away: 1,
    },
    events: [
      {
        id: "6001",
        type: "goal",
        minute: 35,
        team: "away",
        playerId: "6001",
        playerName: "张玉宁",
      },
      {
        id: "6002",
        type: "goal",
        minute: 50,
        team: "home",
        playerId: "6002",
        playerName: "武磊",
      },
    ],
    statistics: {
      possession: {
        home: 55,
        away: 45,
      },
      shots: {
        home: 10,
        away: 6,
      },
      shotsOnTarget: {
        home: 5,
        away: 3,
      },
      corners: {
        home: 6,
        away: 2,
      },
      fouls: {
        home: 8,
        away: 10,
      },
      yellowCards: {
        home: 1,
        away: 2,
      },
      redCards: {
        home: 0,
        away: 0,
      },
    },
  },
]

// 生成更多比赛数据
export function generateMoreMatches(count: number): Match[] {
  const result: Match[] = []

  for (let i = 0; i < count; i++) {
    const leagueIndex = Math.floor(Math.random() * mockLeagues.length)
    const league = mockLeagues[leagueIndex]

    const homeTeamId = `${i}01`
    const awayTeamId = `${i}02`

    const isLive = Math.random() > 0.7
    const isFinished = !isLive && Math.random() > 0.5

    let status = matchStatuses.notStarted
    let startTime = new Date()
    let currentMinute: number | undefined = undefined
    let score: { home: number; away: number } | undefined = undefined
    let halfTimeScore: { home: number; away: number } | undefined = undefined

    if (isLive) {
      status =
        Math.random() > 0.5 ? matchStatuses.firstHalf : matchStatuses.secondHalf
      startTime = new Date(Date.now() - Math.random() * 60 * 60 * 1000)
      currentMinute =
        status.code === 1
          ? Math.floor(Math.random() * 45) + 1
          : Math.floor(Math.random() * 45) + 46
      score = {
        home: Math.floor(Math.random() * 3),
        away: Math.floor(Math.random() * 3),
      }
      halfTimeScore = {
        home:
          status.code === 1
            ? 0
            : score.home > 0
            ? Math.min(score.home - 1, 0)
            : 0,
        away:
          status.code === 1
            ? 0
            : score.away > 0
            ? Math.min(score.away - 1, 0)
            : 0,
      }
    } else if (isFinished) {
      status = matchStatuses.finished
      startTime = new Date(
        Date.now() - (Math.random() * 10 + 2) * 60 * 60 * 1000
      )
      score = {
        home: Math.floor(Math.random() * 4),
        away: Math.floor(Math.random() * 4),
      }
      halfTimeScore = {
        home: score.home > 0 ? Math.min(score.home - 1, 0) : 0,
        away: score.away > 0 ? Math.min(score.away - 1, 0) : 0,
      }
    } else {
      startTime = new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000)
    }

    result.push({
      id: `mock-${i + 100}`,
      leagueId: league.id,
      leagueName: league.name,
      leagueLogo: league.logo,
      countryName: league.countryName,
      countryFlag: league.countryFlag,
      homeTeam: {
        id: homeTeamId,
        name: `主队${i + 1}`,
        logo: "https://via.placeholder.com/40",
        shortName: `H${i + 1}`,
      },
      awayTeam: {
        id: awayTeamId,
        name: `客队${i + 1}`,
        logo: "https://via.placeholder.com/40",
        shortName: `A${i + 1}`,
      },
      startTime: startTime.toISOString(),
      status,
      currentMinute,
      score,
      halfTimeScore,
      odds: {
        home: 2 + Math.random(),
        draw: 3 + Math.random(),
        away: 2 + Math.random(),
      },
    })
  }

  return result
}
