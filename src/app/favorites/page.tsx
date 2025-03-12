"use client"

import { useState, useEffect, useCallback } from "react"
import { Match } from "@/types/match"
import { getFilteredMatches, getFavorites } from "@/lib/api"
import Header from "@/components/Header"
import MatchCard from "@/components/MatchCard"
import { FaRegStar } from "react-icons/fa"
import Link from "next/link"

export default function Favorites() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchFavorites = useCallback(async () => {
    try {
      setIsRefreshing(true)
      const favoriteIds = getFavorites()

      if (favoriteIds.length === 0) {
        setMatches([])
        setIsLoading(false)
        setIsRefreshing(false)
        return
      }

      const allMatches = await getFilteredMatches({
        leagues: [],
        countries: [],
        statuses: [],
      })

      const favoriteMatches = allMatches.filter((match) =>
        favoriteIds.includes(match.id)
      )
      setMatches(favoriteMatches)
    } catch (error) {
      console.error("获取收藏比赛失败:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchFavorites()

    // 设置自动刷新
    const intervalId = setInterval(() => {
      fetchFavorites()
    }, 60000) // 每分钟刷新一次

    return () => clearInterval(intervalId)
  }, [fetchFavorites])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )
    }

    if (matches.length === 0) {
      return (
        <div className="text-center py-20">
          <FaRegStar className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            您还没有收藏任何比赛
          </p>
          <Link href="/" className="btn btn-primary">
            浏览比赛
          </Link>
        </div>
      )
    }

    // 按状态分组
    const liveMatches = matches.filter((match) =>
      [1, 2, 3, 9, 10].includes(match.status.code)
    )
    const upcomingMatches = matches.filter((match) => match.status.code === 0)
    const finishedMatches = matches.filter((match) => match.status.code === 4)

    return (
      <div className="space-y-6">
        {liveMatches.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-500">
              进行中 ({liveMatches.length})
            </h2>
            <div className="space-y-3">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {upcomingMatches.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-500">
              即将开始 ({upcomingMatches.length})
            </h2>
            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {finishedMatches.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600 dark:text-gray-400">
              已结束 ({finishedMatches.length})
            </h2>
            <div className="space-y-3">
              {finishedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        title="我的收藏"
        onRefresh={fetchFavorites}
        isRefreshing={isRefreshing}
      />

      <div className="container py-4">{renderContent()}</div>
    </div>
  )
}
