import { useState, useEffect, useCallback } from 'react'
import { Brain, BarChart2, Heart, Settings, Zap } from 'lucide-react'
import MoodCheckin from './components/MoodCheckin'
import InterventionPanel from './components/InterventionPanel'
import TodayOverview from './components/TodayOverview'
import MoodChart from './components/MoodChart'
import { getTodayMoods, getAllMoods, type MoodRecord } from './db'

type TabType = 'home' | 'chart' | 'checkin' | 'about'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [todayMoods, setTodayMoods] = useState<MoodRecord[]>([])
  const [allMoods, setAllMoods] = useState<MoodRecord[]>([])
  const [showCheckin, setShowCheckin] = useState(false)
  const [pendingIntervention, setPendingIntervention] = useState<MoodRecord | null>(null)
  const [chartDays, setChartDays] = useState<7 | 14 | 30>(7)

  const loadData = useCallback(async () => {
    const [today, all] = await Promise.all([getTodayMoods(), getAllMoods()])
    setTodayMoods(today)
    setAllMoods(all)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCheckinComplete = async (record: MoodRecord) => {
    setShowCheckin(false)
    await loadData()
    // 如果情绪分低，触发干预弹窗
    if (record.moodScore <= 2) {
      setTimeout(() => setPendingIntervention(record), 400)
    }
  }

  const handleInterventionClose = async (updatedRecord: MoodRecord) => {
    setPendingIntervention(null)
    await loadData()
    // 如果用户打完气后还是想继续，可以手动再触发
  }

  const tabs: { key: TabType; icon: React.ReactNode; label: string }[] = [
    { key: 'home', icon: <Heart size={20} />, label: '今日' },
    { key: 'chart', icon: <BarChart2 size={20} />, label: '趋势' },
    { key: 'about', icon: <Settings size={20} />, label: '关于' },
  ]

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col max-w-md mx-auto">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#1e3a5f] leading-none">ResearchMind</h1>
              <p className="text-xs text-gray-400 leading-none mt-0.5">科研情绪助手</p>
            </div>
          </div>
          {/* 快速打卡按钮 */}
          <button
            onClick={() => setShowCheckin(true)}
            className="flex items-center gap-1.5 bg-[#f0a500] hover:bg-[#e09500] text-white
              text-sm font-semibold px-3 py-2 rounded-lg transition-all active:scale-95"
          >
            <Zap size={14} />
            打卡
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        {/* 今日页 */}
        {activeTab === 'home' && (
          <div className="animate-slide-up">
            <TodayOverview
              todayMoods={todayMoods}
              onCheckinClick={() => setShowCheckin(true)}
            />
          </div>
        )}

        {/* 趋势页 */}
        {activeTab === 'chart' && (
          <div className="animate-slide-up">
            {/* 时间范围切换 */}
            <div className="flex gap-2 mb-4">
              {([7, 14, 30] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setChartDays(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${chartDays === d
                      ? 'bg-[#1e3a5f] text-white shadow-sm'
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                    }`}
                >
                  近{d}天
                </button>
              ))}
            </div>
            <MoodChart records={allMoods} days={chartDays} />
          </div>
        )}

        {/* 关于页 */}
        {activeTab === 'about' && (
          <div className="animate-slide-up space-y-4">
            {/* 应用说明 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
                  <Brain size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1e3a5f] text-lg">ResearchMind</h2>
                  <p className="text-xs text-gray-400">科研人员情绪管理助手 v1.0</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                专为科研工作者打造的情绪感知与状态调节工具。
                通过每天简单的情绪打卡，帮助你了解自己的状态规律，
                并在低谷时提供及时的心理支持。
              </p>
            </div>

            {/* 统计数据 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-4 text-sm">我的数据</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '总打卡次数', value: allMoods.length, unit: '次' },
                  {
                    label: '情绪均值',
                    value: allMoods.length
                      ? (allMoods.reduce((s, r) => s + r.moodScore, 0) / allMoods.length).toFixed(1)
                      : '—',
                    unit: '/5',
                  },
                  {
                    label: '干预使用',
                    value: allMoods.filter(r => r.interventionTriggered).length,
                    unit: '次',
                  },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-[#1e3a5f]">
                      {value}<span className="text-xs font-normal text-gray-400">{unit}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 隐私说明 */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
              <div className="flex items-start gap-2">
                <span className="text-lg">🔒</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">数据完全本地</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    你的所有情绪数据只存储在本设备的浏览器中，
                    不会上传到任何服务器。清除浏览器数据会同时删除记录。
                  </p>
                </div>
              </div>
            </div>

            {/* 即将上线 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm">即将上线 ✨</h3>
              <div className="space-y-2">
                {[
                  '🎵 本地音乐上传',
                  '📹 自定义激励视频',
                  '⌚ 可穿戴设备数据接入',
                  '🤖 AI 对话情绪分析',
                  '☁️ 多设备数据同步（可选）',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-2 z-40">
        <div className="flex justify-around">
          {tabs.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
                ${activeTab === key
                  ? 'text-[#1e3a5f]'
                  : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {icon}
              <span className="text-xs font-medium">{label}</span>
              {activeTab === key && (
                <div className="w-1 h-1 bg-[#1e3a5f] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* 打卡弹窗 */}
      {showCheckin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg animate-slide-up">
            <MoodCheckin onComplete={handleCheckinComplete} />
            <button
              onClick={() => setShowCheckin(false)}
              className="w-full mt-3 py-3 text-white/80 text-sm hover:text-white transition-colors"
            >
              稍后再说
            </button>
          </div>
        </div>
      )}

      {/* 干预弹窗 */}
      {pendingIntervention && (
        <InterventionPanel
          record={pendingIntervention}
          onClose={handleInterventionClose}
        />
      )}
    </div>
  )
}
