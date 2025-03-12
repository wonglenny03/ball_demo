import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"
import { format } from "date-fns"
import { Match } from "@/types/match"
import { FaStar } from "react-icons/fa"
import { addFavorite, removeFavorite, getFavorites } from "@/lib/api"
import styles from "./MatchCard.module.scss"

interface MatchCardProps {
  match: Match
  showHalfTimeScore?: boolean
  showOdds?: boolean
  compact?: boolean
}

function MatchCard({
  match,
  showHalfTimeScore = true,
  showOdds = true,
  compact = false,
}: MatchCardProps): React.ReactElement {
  const isLive = [1, 2, 3, 9, 10].includes(match.status.code)
  const isFinished = match.status.code === 4
  const isUpcoming = match.status.code === 0

  const favorites = useMemo(() => getFavorites(), [])
  const isFavorite = favorites.includes(match.id)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorite) {
      removeFavorite(match.id)
    } else {
      addFavorite(match.id)
    }
  }

  const formatMatchTime = (date: string) => {
    const matchDate = new Date(date)
    return format(matchDate, "HH:mm")
  }

  const renderScore = () => {
    if (match.score) {
      return (
        <div className={styles.score}>
          <span className={styles.scoreValue}>{match.score.home}</span>
          <span className={styles.scoreSeparator}>-</span>
          <span className={styles.scoreValue}>{match.score.away}</span>
        </div>
      )
    }

    if (isUpcoming) {
      return (
        <div className={styles.time}>{formatMatchTime(match.startTime)}</div>
      )
    }

    return <div className={styles.status}>{match.status.description}</div>
  }

  return (
    <Link href={`/match/${match.id}`} className={styles.matchCardLink}>
      <div
        className={classNames(styles.matchCard, {
          [styles.live]: isLive,
          [styles.finished]: isFinished,
          [styles.upcoming]: isUpcoming,
          [styles.compact]: compact,
        })}
      >
        <div className={styles.header}>
          <div className={styles.league}>
            {match.leagueLogo && (
              <Image
                src={match.leagueLogo}
                alt={match.leagueName}
                width={16}
                height={16}
                className={styles.leagueLogo}
              />
            )}
            <span className={styles.leagueName}>{match.leagueName}</span>
          </div>

          <button
            className={classNames(styles.favoriteBtn, {
              [styles.isFavorite]: isFavorite,
            })}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "取消收藏" : "收藏"}
          >
            <FaStar />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.team}>
            <div className={styles.teamInfo}>
              {match.homeTeam.logo && (
                <Image
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  width={24}
                  height={24}
                  className={styles.teamLogo}
                />
              )}
              <span className={styles.teamName}>{match.homeTeam.name}</span>
            </div>
          </div>

          <div className={styles.matchInfo}>
            {isLive && match.currentMinute !== undefined && (
              <div className={styles.minute}>{match.currentMinute}'</div>
            )}

            {renderScore()}

            {showHalfTimeScore && match.halfTimeScore && (
              <div className={styles.halfTimeScore}>
                ({match.halfTimeScore.home}-{match.halfTimeScore.away})
              </div>
            )}
          </div>

          <div className={styles.team}>
            <div className={styles.teamInfo}>
              {match.awayTeam.logo && (
                <Image
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  width={24}
                  height={24}
                  className={styles.teamLogo}
                />
              )}
              <span className={styles.teamName}>{match.awayTeam.name}</span>
            </div>
          </div>
        </div>

        {showOdds && match.odds && (
          <div className={styles.footer}>
            <div className={styles.odds}>
              <div className={styles.oddsItem}>
                <span className={styles.oddsLabel}>主胜</span>
                <span className={styles.oddsValue}>
                  {match.odds.home.toFixed(2)}
                </span>
              </div>
              <div className={styles.oddsItem}>
                <span className={styles.oddsLabel}>平局</span>
                <span className={styles.oddsValue}>
                  {match.odds.draw.toFixed(2)}
                </span>
              </div>
              <div className={styles.oddsItem}>
                <span className={styles.oddsLabel}>客胜</span>
                <span className={styles.oddsValue}>
                  {match.odds.away.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

export default MatchCard
