"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { League, Country } from "@/types/filter"
import { getLeagues, getCountries } from "@/lib/api"
import Header from "@/components/Header"

export default function Leagues() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCountry, setActiveCountry] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [leaguesData, countriesData] = await Promise.all([
        getLeagues(),
        getCountries(),
      ])

      setLeagues(leaguesData)
      setCountries(countriesData)

      // 默认选中第一个国家
      if (countriesData.length > 0) {
        setActiveCountry(countriesData[0].name)
      }
    } catch (error) {
      console.error("获取联赛数据失败:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )
    }

    if (countries.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">暂无联赛数据</p>
        </div>
      )
    }

    const activeCountryData = countries.find(
      (country) => country.name === activeCountry
    )
    const countryLeagues = activeCountryData ? activeCountryData.leagues : []

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {countryLeagues.map((league) => (
          <Link
            href={`/?league=${league.id}`}
            key={league.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4 flex items-center">
              {league.logo && (
                <Image
                  src={league.logo}
                  alt={league.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
              )}
              <div>
                <h3 className="font-medium">{league.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {league.countryName}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="赛事" />

      <div className="container py-4">
        <div className="overflow-x-auto">
          <div className="flex space-x-2 pb-2 min-w-max">
            {countries.map((country) => (
              <button
                key={country.name}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCountry === country.name
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveCountry(country.name)}
              >
                {country.flag && (
                  <Image
                    src={country.flag}
                    alt={country.name}
                    width={16}
                    height={16}
                    className="inline-block mr-2 rounded-full"
                  />
                )}
                {country.name}
              </button>
            ))}
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  )
}
