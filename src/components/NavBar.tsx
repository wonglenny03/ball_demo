"use client"
import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome, FaFootballBall, FaStar, FaCog, FaSearch } from "react-icons/fa"
import styles from "./NavBar.module.scss"

function NavBar(): React.ReactElement {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // 返回占位符避免服务器/客户端不匹配的问题
    return <nav className={styles.navbar}></nav>
  }

  const links = [
    { href: "/", icon: <FaHome />, label: "首页" },
    { href: "/leagues", icon: <FaFootballBall />, label: "赛事" },
    { href: "/favorites", icon: <FaStar />, label: "收藏" },
    { href: "/search", icon: <FaSearch />, label: "搜索" },
    { href: "/settings", icon: <FaCog />, label: "设置" },
  ]

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        {links.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className={`${styles.navItem} ${
              pathname === link.href ? styles.active : ""
            }`}
          >
            <span className={styles.navIcon}>{link.icon}</span>
            <span className={styles.navLabel}>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default NavBar
