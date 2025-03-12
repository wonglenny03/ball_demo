import { ReactNode } from "react"
import type { Metadata } from "next"
import "@/styles/globals.scss"
import NavBar from "@/components/NavBar"

export const metadata: Metadata = {
  title: "足球比分直播",
  description: "实时足球比分直播、赛事数据和赔率信息",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="pb-16">{children}</main>
        <NavBar />
      </body>
    </html>
  )
}
