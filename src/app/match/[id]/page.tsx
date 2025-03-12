"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { FaStar, FaRegStar, FaArrowLeft } from "react-icons/fa"
import { Match, MatchEvent } from "@/types/match"
import {
  getMatchDetails,
  addFavorite,
  removeFavorite,
  getFavorites,
} from "@/lib/api"
import Header from "@/components/Header"
import Link from "next/link"

export default function MatchDetail() {
  const { id } = useParams()
  const [match, setMatch] = useState<Match | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<"events" | "stats" | "odds">(
    "events"
  )

  const fetchMatch = useCallback(async () => {
    if (!id) return

    try {
      setIsRefreshing(true)
      const data = await getMatchDetails(id as string)
      setMatch(data)

      // 检查是否是收藏
      const favorites = getFavorites()
      setIsFavorite(favorites.includes(id as string))
    } catch (error) {
      console.error("获取比赛详情失败:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [id])

  useEffect(() => {
    fetchMatch()

    // 设置自动刷新
    const intervalId = setInterval(() => {
      fetchMatch()
    }, 30000) // 每30秒刷新一次

    return () => clearInterval(intervalId)
  }, [fetchMatch])

  const toggleFavorite = () => {
    if (!match) return

    if (isFavorite) {
      removeFavorite(match.id)
      setIsFavorite(false)
    } else {
      addFavorite(match.id)
      setIsFavorite(true)
    }
  }

  const formatMatchTime = (date: string) => {
    const matchDate = new Date(date)
    return format(matchDate, "yyyy-MM-dd HH:mm")
  }

  const renderEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <span className="text-green-600 text-xl">⚽</span>
      case "yellowCard":
        return <span className="bg-yellow-400 w-3 h-4 inline-block"></span>
      case "redCard":
        return <span className="bg-red-600 w-3 h-4 inline-block"></span>
      case "substitution":
        return <span className="text-blue-500">↔</span>
      case "penalty":
        return <span className="text-purple-600">P</span>
      default:
        return null
    }
  }

  const renderEventText = (event: MatchEvent) => {
    switch (event.type) {
      case "goal":
        return (
          <span>
            <strong>{event.playerName}</strong> 进球
            {event.assistPlayerName && ` (助攻: ${event.assistPlayerName})`}
          </span>
        )
      case "yellowCard":
        return (
          <span>
            <strong>{event.playerName}</strong> 黄牌
          </span>
        )
      case "redCard":
        return (
          <span>
            <strong>{event.playerName}</strong> 红牌
          </span>
        )
      case "substitution":
        return (
          <span>
            <strong>{event.playerName}</strong> 替换{" "}
            <strong>{event.assistPlayerName}</strong>
          </span>
        )
      case "penalty":
        return (
          <span>
            <strong>{event.playerName}</strong> 点球
          </span>
        )
      default:
        return null
    }
  }

  const renderEvents = () => {
    if (!match?.events || match.events.length === 0) {
      return <p className="text-center py-6 text-gray-500">暂无事件数据</p>
    }

    // 按时间排序
    const sortedEvents = [...match.events].sort((a, b) => a.minute - b.minute)

    return (
      <div className="space-y-3 py-4">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className={`flex items-center p-3 rounded-md ${
              event.team === "home"
                ? "bg-blue-50 dark:bg-blue-900/20"
                : "bg-red-50 dark:bg-red-900/20"
            }`}
          >
            <div className="w-10 text-center font-semibold">
              {event.minute}'
            </div>
            <div className="mx-3">{renderEventIcon(event.type)}</div>
            <div className="flex-1">{renderEventText(event)}</div>
            <div className="text-sm text-gray-500">
              {event.team === "home"
                ? match.homeTeam.name
                : match.awayTeam.name}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderStats = () => {
    if (!match?.statistics) {
      return <p className="text-center py-6 text-gray-500">暂无统计数据</p>
    }

    const stats = [
      {
        label: "控球率",
        home: match.statistics.possession.home,
        away: match.statistics.possession.away,
        unit: "%",
      },
      {
        label: "射门",
        home: match.statistics.shots.home,
        away: match.statistics.shots.away,
      },
      {
        label: "射正",
        home: match.statistics.shotsOnTarget.home,
        away: match.statistics.shotsOnTarget.away,
      },
      {
        label: "角球",
        home: match.statistics.corners.home,
        away: match.statistics.corners.away,
      },
      {
        label: "犯规",
        home: match.statistics.fouls.home,
        away: match.statistics.fouls.away,
      },
      {
        label: "黄牌",
        home: match.statistics.yellowCards.home,
        away: match.statistics.yellowCards.away,
      },
      {
        label: "红牌",
        home: match.statistics.redCards.home,
        away: match.statistics.redCards.away,
      },
    ]

    return (
      <div className="space-y-4 py-4">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                {stat.home}
                {stat.unit || ""}
              </span>
              <span>{stat.label}</span>
              <span>
                {stat.away}
                {stat.unit || ""}
              </span>
            </div>
            <div className="flex h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="bg-blue-500"
                style={{
                  width: `${(stat.home / (stat.home + stat.away)) * 100}%`,
                }}
              ></div>
              <div
                className="bg-red-500"
                style={{
                  width: `${(stat.away / (stat.home + stat.away)) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderOdds = () => {
    if (!match?.odds) {
      return <p className="text-center py-6 text-gray-500">暂无赔率数据</p>
    }

    return (
      <div className="grid grid-cols-3 gap-4 py-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            主胜
          </div>
          <div className="text-xl font-semibold">
            {match.odds.home.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {match.homeTeam.name}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            平局
          </div>
          <div className="text-xl font-semibold">
            {match.odds.draw.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">和局</div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            客胜
          </div>
          <div className="text-xl font-semibold">
            {match.odds.away.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {match.awayTeam.name}
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )
    }

    if (!match) {
      return (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">未找到比赛信息</p>
          <Link
            href="/"
            className="mt-4 inline-block text-primary-600 hover:underline"
          >
            返回首页
          </Link>
        </div>
      )
    }

    const isLive = [1, 2, 3, 9, 10].includes(match.status.code)

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              {match.leagueLogo && (
                <Image
                  src={match.leagueLogo}
                  alt={match.leagueName}
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
              )}
              <span className="font-medium">{match.leagueName}</span>
            </div>
            <div className="text-sm text-gray-500">
              {formatMatchTime(match.startTime)}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 text-center">
                {match.homeTeam.logo && (
                  <Image
                    src={match.homeTeam.logo}
                    alt={match.homeTeam.name}
                    width={64}
                    height={64}
                    className="mx-auto mb-2"
                  />
                )}
                <h3 className="font-semibold text-lg">{match.homeTeam.name}</h3>
              </div>

              <div className="mx-4 text-center">
                {isLive && match.currentMinute !== undefined && (
                  <div className="text-sm font-semibold text-red-600 mb-2 animate-pulse">
                    {match.currentMinute}'
                  </div>
                )}

                <div className="flex items-center justify-center">
                  {match.score ? (
                    <>
                      <span className="text-3xl font-bold">
                        {match.score.home}
                      </span>
                      <span className="text-xl mx-2 text-gray-400">-</span>
                      <span className="text-3xl font-bold">
                        {match.score.away}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-medium text-gray-500">
                      {match.status.description}
                    </span>
                  )}
                </div>

                {match.halfTimeScore && (
                  <div className="text-sm text-gray-500 mt-1">
                    半场: {match.halfTimeScore.home} -{" "}
                    {match.halfTimeScore.away}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center">
                {match.awayTeam.logo && (
                  <Image
                    src={match.awayTeam.logo}
                    alt={match.awayTeam.name}
                    width={64}
                    height={64}
                    className="mx-auto mb-2"
                  />
                )}
                <h3 className="font-semibold text-lg">{match.awayTeam.name}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b dark:border-gray-700">
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "events"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("events")}
            >
              比赛事件
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "stats"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("stats")}
            >
              数据统计
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "odds"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("odds")}
            >
              赔率
            </button>
          </div>

          <div className="p-4">
            {activeTab === "events" && renderEvents()}
            {activeTab === "stats" && renderStats()}
            {activeTab === "odds" && renderOdds()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        title={
          match
            ? `${match.homeTeam.name} vs ${match.awayTeam.name}`
            : "比赛详情"
        }
        onRefresh={fetchMatch}
        isRefreshing={isRefreshing}
      />

      <div className="container py-4">
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-primary-600"
          >
            <FaArrowLeft className="mr-2" />
            <span>返回</span>
          </Link>

          {match && (
            <button
              className="flex items-center text-gray-600 hover:text-yellow-500"
              onClick={toggleFavorite}
              aria-label={isFavorite ? "取消收藏" : "收藏"}
            >
              {isFavorite ? (
                <>
                  <FaStar className="text-yellow-500 mr-1" />
                  <span>已收藏</span>
                </>
              ) : (
                <>
                  <FaRegStar className="mr-1" />
                  <span>收藏</span>
                </>
              )}
            </button>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  )
}
