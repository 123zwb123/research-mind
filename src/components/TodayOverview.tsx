import { TrendingUp, TrendingDown, Minus, Clock, Zap } from 'lucide-react'
import type { MoodRecord } from '../db'
import { getMoodConfig } from '../data'
import { formatTime } from '../db'

interface TodayOverviewProps {
  todayMoods: MoodRecord[]
  onCheckinClick: () => void
}

export default function TodayOverview({ todayMoods, onCheckinClick }: TodayOverviewProps) {
  const latest = todayMoods[0] ?? null
  const avg = todayMoods.length
    ? Math.round(todayMoods.reduce((s, r) => s + r.moodScore, 0) / todayMoods.length)
    : null

  // 趋势计算
  const getTrend = () => {
    if (todayMoods.length < 2) return 'neutral'
    const recent = todayMoods.slice(0, 2)
    if (recent[0].moodScore > recent[1].moodScore) return 'up'
    if (recent[0].moodScore < recent[1].moodScore) return 'down'
    return 'neutral'
  }
  const trend = getTrend()

  // 今日打卡时段提示
  const getNextCheckinHint = () => {
    const hour = new Date().getHours()
    if (hour < 9) return '建议晨间打卡（9:00）'
    if (hour < 14) return '建议午间打卡（14:00）'
    if (hour < 18) return '建议傍晚打卡（18:00）'
    return '今晚也别忘了回顾一天'
  }

  const moodCfg = latest ? getMoodConfig(latest.moodScore) : null
  const avgCfg = avg ? getMoodConfig(avg) : null

  // 获取当前时段问候
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 6) return '深夜了，注意休息'
    if (hour < 12) return '早上好'
    if (hour < 14) return '午安'
    if (hour < 18) return '下午好'
    if (hour < 22) return '晚上好'
    return '夜深了，注意休息'
  }

  return (
    <div className="space-y-4">
      {/* 顶部状态卡 */}
      <div className={`rounded-2xl p-5 ${
        moodCfg ? `${moodCfg.bgColor}` : 'bg-gradient-to-br from-[#1e3a5f] to-[#2a5298]'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-medium mb-1 ${moodCfg ? 'text-gray-500' : 'text-blue-200'}`}>
              {getGreeting()}
            </p>
            {latest ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{moodCfg?.emoji}</span>
                  <div>
                    <p className={`text-xl font-bold ${moodCfg?.textColor}`}>
                      {moodCfg?.label}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {trend === 'up' && <TrendingUp size={14} className="text-green-500" />}
                      {trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
                      {trend === 'neutral' && <Minus size={14} className="text-gray-400" />}
                      <span className="text-xs text-gray-400">
                        {trend === 'up' ? '情绪上升中' : trend === 'down' ? '情绪在下滑' : '情绪平稳'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock size={12} />
                  最近打卡于 {formatTime(latest.timestamp)}
                </p>
              </>
            ) : (
              <div>
                <p className="text-3xl font-bold text-white mb-1">今天还没打卡</p>
                <p className="text-blue-200 text-sm">{getNextCheckinHint()}</p>
              </div>
            )}
          </div>

          {/* 右侧统计 */}
          {latest && (
            <div className="text-right">
              <div className="bg-white/60 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-1">今日均值</p>
                <p className="text-2xl font-bold" style={{ color: avgCfg?.color }}>
                  {avgCfg?.emoji}
                </p>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  共 {todayMoods.length} 次打卡
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 今日打卡记录 */}
      {todayMoods.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">今日记录</h3>
          <div className="space-y-2">
            {todayMoods.map(record => {
              const cfg = getMoodConfig(record.moodScore)
              return (
                <div
                  key={record.id}
                  className={`flex items-start gap-3 p-3 rounded-xl ${cfg.bgColor}`}
                >
                  <span className="text-xl mt-0.5">{cfg.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${cfg.textColor}`}>{cfg.label}</span>
                      <span className="text-xs text-gray-400">{formatTime(record.timestamp)}</span>
                    </div>
                    {record.emotionTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {record.emotionTags.map(tag => (
                          <span key={tag} className="text-xs bg-white/70 text-gray-500 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {record.note && (
                      <p className="text-xs text-gray-500 mt-1 truncate italic">"{record.note}"</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 打卡入口按钮 */}
      <button
        onClick={onCheckinClick}
        className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#2a4f7c]
          text-white font-semibold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-md
          hover:shadow-lg"
      >
        <Zap size={18} />
        {todayMoods.length === 0 ? '开始今日第一次打卡' : '再次打卡'}
      </button>
    </div>
  )
}
