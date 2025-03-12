import { useState, useEffect } from "react"
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { League, Country, MatchFilter as MatchFilterType } from "@/types/filter"
import { getLeagues, getCountries } from "@/lib/api"
import { matchStatuses } from "@/lib/mockData"
import styles from "./MatchFilter.module.scss"

interface MatchFilterProps {
  filter: MatchFilterType
  onFilterChange: (filter: MatchFilterType) => void
}

function MatchFilter({
  filter,
  onFilterChange,
}: MatchFilterProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const [leagues, setLeagues] = useState<League[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [leaguesData, countriesData] = await Promise.all([
        getLeagues(),
        getCountries(),
      ])

      setLeagues(leaguesData)
      setCountries(countriesData)
    }

    fetchData()
  }, [])

  const toggleFilter = () => {
    setIsOpen(!isOpen)
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const toggleLeague = (leagueId: string) => {
    const newLeagues = filter.leagues.includes(leagueId)
      ? filter.leagues.filter((id) => id !== leagueId)
      : [...filter.leagues, leagueId]

    onFilterChange({
      ...filter,
      leagues: newLeagues,
    })
  }

  const toggleCountry = (countryName: string) => {
    const newCountries = filter.countries.includes(countryName)
      ? filter.countries.filter((name) => name !== countryName)
      : [...filter.countries, countryName]

    onFilterChange({
      ...filter,
      countries: newCountries,
    })
  }

  const toggleStatus = (statusCode: number) => {
    const newStatuses = filter.statuses.includes(statusCode)
      ? filter.statuses.filter((code) => code !== statusCode)
      : [...filter.statuses, statusCode]

    onFilterChange({
      ...filter,
      statuses: newStatuses,
    })
  }

  const toggleOption = (
    option: "liveOnly" | "upcomingOnly" | "finishedOnly" | "favorites"
  ) => {
    onFilterChange({
      ...filter,
      [option]: !filter[option],
    })
  }

  const clearFilter = () => {
    onFilterChange({
      leagues: [],
      countries: [],
      statuses: [],
      favorites: false,
      liveOnly: false,
      upcomingOnly: false,
      finishedOnly: false,
    })
  }

  const hasActiveFilters = () => {
    return (
      filter.leagues.length > 0 ||
      filter.countries.length > 0 ||
      filter.statuses.length > 0 ||
      filter.favorites ||
      filter.liveOnly ||
      filter.upcomingOnly ||
      filter.finishedOnly
    )
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <button
          className={styles.filterToggle}
          onClick={toggleFilter}
          aria-expanded={isOpen}
          aria-controls="filter-panel"
        >
          <FaFilter />
          <span>筛选</span>
          {hasActiveFilters() && <span className={styles.activeFilterBadge} />}
        </button>

        {hasActiveFilters() && (
          <button
            className={styles.clearFilter}
            onClick={clearFilter}
            aria-label="清除筛选"
          >
            <FaTimes />
            <span>清除</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div id="filter-panel" className={styles.filterPanel}>
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("quick")}
              aria-expanded={activeSection === "quick"}
            >
              <span>快速筛选</span>
              {activeSection === "quick" ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {activeSection === "quick" && (
              <div className={styles.sectionContent}>
                <div className={styles.quickOptions}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filter.liveOnly || false}
                      onChange={() => toggleOption("liveOnly")}
                    />
                    <span>进行中</span>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filter.upcomingOnly || false}
                      onChange={() => toggleOption("upcomingOnly")}
                    />
                    <span>未开始</span>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filter.finishedOnly || false}
                      onChange={() => toggleOption("finishedOnly")}
                    />
                    <span>已完成</span>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filter.favorites || false}
                      onChange={() => toggleOption("favorites")}
                    />
                    <span>我的收藏</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("status")}
              aria-expanded={activeSection === "status"}
            >
              <span>比赛状态</span>
              {activeSection === "status" ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {activeSection === "status" && (
              <div className={styles.sectionContent}>
                <div className={styles.statusOptions}>
                  {Object.values(matchStatuses).map((status) => (
                    <label key={status.code} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={filter.statuses.includes(status.code)}
                        onChange={() => toggleStatus(status.code)}
                      />
                      <span>{status.description}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("country")}
              aria-expanded={activeSection === "country"}
            >
              <span>国家/地区</span>
              {activeSection === "country" ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </button>

            {activeSection === "country" && (
              <div className={styles.sectionContent}>
                <div className={styles.countryOptions}>
                  {countries.map((country) => (
                    <label key={country.name} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={filter.countries.includes(country.name)}
                        onChange={() => toggleCountry(country.name)}
                      />
                      <span>{country.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("league")}
              aria-expanded={activeSection === "league"}
            >
              <span>联赛</span>
              {activeSection === "league" ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {activeSection === "league" && (
              <div className={styles.sectionContent}>
                <div className={styles.leagueOptions}>
                  {leagues.map((league) => (
                    <label key={league.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={filter.leagues.includes(league.id)}
                        onChange={() => toggleLeague(league.id)}
                      />
                      <span>{league.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchFilter
