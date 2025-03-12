"use client"

import { useState, useEffect } from "react"
import {
  FiMoon,
  FiSun,
  FiRefreshCw,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi"
import { getUserSettings, saveUserSettings, UserSettings } from "@/lib/api"
import Header from "@/components/Header"

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    compactMode: false,
    showOdds: true,
    showHalfTimeScore: true,
    autoRefreshInterval: 60,
    soundAlerts: true,
  })

  useEffect(() => {
    const userSettings = getUserSettings()
    setSettings(userSettings)

    // 应用深色模式
    if (userSettings.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const handleToggle = (key: keyof UserSettings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    }

    setSettings(newSettings)
    saveUserSettings(newSettings)

    // 如果是深色模式，立即应用
    if (key === "darkMode") {
      if (newSettings.darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  const handleRefreshIntervalChange = (value: number) => {
    const newSettings = {
      ...settings,
      autoRefreshInterval: value,
    }

    setSettings(newSettings)
    saveUserSettings(newSettings)
  }

  return (
    <div className="min-h-screen">
      <Header title="设置" />

      <div className="container py-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold">显示设置</h2>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">深色模式</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  切换深色主题
                </p>
              </div>
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.darkMode ? "bg-primary-600" : "bg-gray-300"
                }`}
                onClick={() => handleToggle("darkMode")}
                aria-label={settings.darkMode ? "关闭深色模式" : "开启深色模式"}
              >
                <div
                  className={`bg-white rounded-full w-4 h-4 transition-transform ${
                    settings.darkMode ? "translate-x-6" : ""
                  } flex items-center justify-center text-xs`}
                >
                  {settings.darkMode ? (
                    <FiMoon className="text-primary-600" />
                  ) : (
                    <FiSun className="text-yellow-500" />
                  )}
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">紧凑模式</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  减小卡片大小，显示更多内容
                </p>
              </div>
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.compactMode ? "bg-primary-600" : "bg-gray-300"
                }`}
                onClick={() => handleToggle("compactMode")}
                aria-label={
                  settings.compactMode ? "关闭紧凑模式" : "开启紧凑模式"
                }
              >
                <div
                  className={`bg-white rounded-full w-4 h-4 transition-transform ${
                    settings.compactMode ? "translate-x-6" : ""
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">显示赔率</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  在比赛卡片中显示赔率信息
                </p>
              </div>
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.showOdds ? "bg-primary-600" : "bg-gray-300"
                }`}
                onClick={() => handleToggle("showOdds")}
                aria-label={settings.showOdds ? "隐藏赔率" : "显示赔率"}
              >
                <div
                  className={`bg-white rounded-full w-4 h-4 transition-transform ${
                    settings.showOdds ? "translate-x-6" : ""
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">显示半场比分</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  在比赛卡片中显示半场比分
                </p>
              </div>
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.showHalfTimeScore ? "bg-primary-600" : "bg-gray-300"
                }`}
                onClick={() => handleToggle("showHalfTimeScore")}
                aria-label={
                  settings.showHalfTimeScore ? "隐藏半场比分" : "显示半场比分"
                }
              >
                <div
                  className={`bg-white rounded-full w-4 h-4 transition-transform ${
                    settings.showHalfTimeScore ? "translate-x-6" : ""
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mt-6">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold">通知设置</h2>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">声音提醒</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  进球、红牌等重要事件时播放声音
                </p>
              </div>
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.soundAlerts ? "bg-primary-600" : "bg-gray-300"
                }`}
                onClick={() => handleToggle("soundAlerts")}
                aria-label={
                  settings.soundAlerts ? "关闭声音提醒" : "开启声音提醒"
                }
              >
                <div
                  className={`bg-white rounded-full w-4 h-4 transition-transform ${
                    settings.soundAlerts ? "translate-x-6" : ""
                  } flex items-center justify-center text-xs`}
                >
                  {settings.soundAlerts ? (
                    <FiVolume2 className="text-primary-600" />
                  ) : (
                    <FiVolumeX className="text-gray-500" />
                  )}
                </div>
              </button>
            </div>

            <div>
              <h3 className="font-medium mb-2">自动刷新间隔</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                设置数据自动刷新的时间间隔
              </p>
              <div className="flex items-center">
                <FiRefreshCw className="text-gray-500 mr-2" />
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={settings.autoRefreshInterval}
                  onChange={(e) =>
                    handleRefreshIntervalChange(Number(e.target.value))
                  }
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="ml-2 text-sm font-medium">
                  {settings.autoRefreshInterval}秒
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>足球比分直播 v1.0.0</p>
          <p className="mt-1">© 2023 All Rights Reserved</p>
        </div>
      </div>
    </div>
  )
}
