"use client"

import { useState, useEffect, useCallback } from "react"
import { Match } from "@/types/match"
import { MatchFilter as MatchFilterType } from "@/types/filter"
import { getFilteredMatches } from "@/lib/api"
import Header from "@/components/Header"
import MatchCard from "@/components/MatchCard"
import MatchFilter from "@/components/MatchFilter"

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filter, setFilter] = useState<MatchFilterType>({
    leagues: [],
    countries: [],
    statuses: [],
  })

  const fetchMatches = useCallback(async () => {
    try {
      setIsRefreshing(true)
      const data = await getFilteredMatches(filter)
      setMatches(data)
    } catch (error) {
      console.error("获取比赛数据失败:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [filter])

  useEffect(() => {
    fetchMatches()

    // 设置自动刷新
    const intervalId = setInterval(() => {
      fetchMatches()
    }, 60000) // 每分钟刷新一次

    return () => clearInterval(intervalId)
  }, [fetchMatches])

  const handleFilterChange = (newFilter: MatchFilterType) => {
    setFilter(newFilter)
  }

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
          <p className="text-gray-500 dark:text-gray-400">
            没有找到符合条件的比赛
          </p>
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
        title="足球比分直播"
        onRefresh={fetchMatches}
        isRefreshing={isRefreshing}
      />

      <div className="container py-4">
        <MatchFilter filter={filter} onFilterChange={handleFilterChange} />
        {renderContent()}
      </div>
    </div>
  )
}
