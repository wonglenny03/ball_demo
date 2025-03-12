"use client"

import { useState, useEffect, useCallback } from "react"
import { FiSearch } from "react-icons/fi"
import { Match } from "@/types/match"
import { getFilteredMatches } from "@/lib/api"
import Header from "@/components/Header"
import MatchCard from "@/components/MatchCard"

export default function Search() {
  const [query, setQuery] = useState("")
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  const fetchMatches = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getFilteredMatches({
        leagues: [],
        countries: [],
        statuses: [],
      })
      setMatches(data)
      setFilteredMatches([])
    } catch (error) {
      console.error("获取比赛数据失败:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMatches()
  }, [fetchMatches])

  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredMatches([])
      return
    }

    setIsSearching(true)

    // 简单的搜索逻辑，可以根据需要扩展
    const searchResults = matches.filter((match) => {
      const searchTerms = query.toLowerCase().split(" ")

      const matchText = `
        ${match.homeTeam.name.toLowerCase()} 
        ${match.awayTeam.name.toLowerCase()} 
        ${match.leagueName.toLowerCase()} 
        ${match.countryName.toLowerCase()}
      `

      return searchTerms.every((term) => matchText.includes(term))
    })

    setFilteredMatches(searchResults)
    setIsSearching(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )
    }

    if (query && filteredMatches.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">
            没有找到符合"{query}"的比赛
          </p>
        </div>
      )
    }

    if (!query) {
      return (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">请输入搜索关键词</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            可以搜索球队名称、联赛名称或国家/地区
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-3 mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          找到 {filteredMatches.length} 场符合"{query}"的比赛
        </p>
        {filteredMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="搜索比赛" />

      <div className="container py-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索球队、联赛或国家/地区..."
            className="w-full px-4 py-3 pl-10 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? "搜索中..." : "搜索"}
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  )
}
