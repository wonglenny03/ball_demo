import { useState, useEffect } from "react"
import Link from "next/link"
import { FiSun, FiMoon, FiRefreshCw } from "react-icons/fi"
import { getUserSettings, saveUserSettings } from "@/lib/api"
import styles from "./Header.module.scss"

interface HeaderProps {
  title: string
  onRefresh?: () => void
  isRefreshing?: boolean
}

function Header({
  title,
  onRefresh,
  isRefreshing = false,
}: HeaderProps): React.ReactElement {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const settings = getUserSettings()
    setDarkMode(settings.darkMode)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    const settings = getUserSettings()
    saveUserSettings({
      ...settings,
      darkMode: newDarkMode,
    })

    // 更新文档类以应用深色模式
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>{title}</span>
        </Link>

        <div className={styles.actions}>
          {onRefresh && (
            <button
              className={`${styles.actionBtn} ${
                isRefreshing ? styles.refreshing : ""
              }`}
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="刷新"
              title="刷新数据"
            >
              <FiRefreshCw />
            </button>
          )}

          <button
            className={styles.actionBtn}
            onClick={toggleDarkMode}
            aria-label={darkMode ? "切换到亮色模式" : "切换到暗色模式"}
            title={darkMode ? "切换到亮色模式" : "切换到暗色模式"}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
