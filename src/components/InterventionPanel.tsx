import { useState } from 'react'
import { X, BookOpen, Music, Video, ThumbsUp, Minus, ThumbsDown, RefreshCw } from 'lucide-react'
import { getRecommendedContent, getMoodConfig } from '../data'
import type { MoodRecord, InterventionResource } from '../db'
import { saveMood } from '../db'

interface InterventionPanelProps {
  record: MoodRecord
  onClose: (updatedRecord: MoodRecord) => void
}

type InterventionTab = 'text' | 'music' | 'video'

export default function InterventionPanel({ record, onClose }: InterventionPanelProps) {
  const [activeTab, setActiveTab] = useState<InterventionTab>('text')
  const [currentContent, setCurrentContent] = useState<InterventionResource>(
    getRecommendedContent('text', record.emotionTags)[0]
  )
  const [feedbackDone, setFeedbackDone] = useState(false)
  const moodCfg = getMoodConfig(record.moodScore)

  const handleTabChange = (tab: InterventionTab) => {
    setActiveTab(tab)
    const recommendations = getRecommendedContent(tab, record.emotionTags)
    setCurrentContent(recommendations[0])
  }

  const handleRefresh = () => {
    const recs = getRecommendedContent(activeTab, record.emotionTags)
    // 随机换一个不一样的
    const others = recs.filter(r => r.id !== currentContent.id)
    if (others.length > 0) {
      setCurrentContent(others[Math.floor(Math.random() * others.length)])
    } else {
      setCurrentContent(recs[0])
    }
  }

  const handleFeedback = async (feedback: 'better' | 'same' | 'worse') => {
    const updated: MoodRecord = {
      ...record,
      interventionType: activeTab,
      interventionFeedback: feedback,
    }
    await saveMood(updated)
    setFeedbackDone(true)
    setTimeout(() => onClose(updated), 1200)
  }

  const tabs: { key: InterventionTab; icon: React.ReactNode; label: string }[] = [
    { key: 'text', icon: <BookOpen size={16} />, label: '激励文字' },
    { key: 'music', icon: <Music size={16} />, label: '充能音乐' },
    { key: 'video', icon: <Video size={16} />, label: '视频片段' },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up">
        {/* 头部 */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">来自 ResearchMind</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {moodCfg.emoji} 感觉有点 {moodCfg.label}？来充个电吧
            </h3>
            {record.note && (
              <p className="text-sm text-gray-400 mt-1 italic">"{record.note}"</p>
            )}
          </div>
          <button
            onClick={() => onClose(record)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-1 p-3 border-b border-gray-100 bg-gray-50">
          {tabs.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium flex-1 justify-center transition-all
                ${activeTab === key
                  ? 'bg-white text-[#1e3a5f] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="p-5">
          {/* 激励文字 */}
          {activeTab === 'text' && currentContent && (
            <div className="animate-slide-up">
              <div className="bg-gradient-to-br from-[#1e3a5f]/5 to-[#f0a500]/5 rounded-xl p-5 mb-4">
                <h4 className="font-semibold text-[#1e3a5f] mb-3">{currentContent.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {currentContent.content}
                </p>
                {currentContent.author && (
                  <p className="text-xs text-gray-400 mt-3 text-right">—— {currentContent.author}</p>
                )}
              </div>
            </div>
          )}

          {/* 音乐 */}
          {activeTab === 'music' && currentContent && (
            <div className="animate-slide-up">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                    <Music size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{currentContent.title}</p>
                    {currentContent.duration && (
                      <p className="text-xs text-gray-400">
                        时长约 {Math.floor(currentContent.duration / 60)} 分钟
                      </p>
                    )}
                  </div>
                </div>
                {/* YouTube 嵌入式播放 */}
                <div className="rounded-lg overflow-hidden aspect-video">
                  <iframe
                    src={currentContent.content}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentContent.title}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  💡 如无法加载，可能需要网络访问 YouTube
                </p>
              </div>
            </div>
          )}

          {/* 视频 */}
          {activeTab === 'video' && currentContent && (
            <div className="animate-slide-up">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#4caf87] rounded-lg flex items-center justify-center">
                    <Video size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{currentContent.title}</p>
                    <p className="text-xs text-gray-400">
                      {currentContent.author} · 约 {currentContent.duration ? Math.ceil(currentContent.duration / 60) : 3} 分钟
                    </p>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden aspect-video">
                  <iframe
                    src={currentContent.content}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentContent.title}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  💡 如无法加载，可能需要网络访问 YouTube
                </p>
              </div>
            </div>
          )}

          {/* 换一个 */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors"
          >
            <RefreshCw size={14} />
            换一个
          </button>

          {/* 反馈 */}
          {!feedbackDone ? (
            <div>
              <p className="text-sm text-gray-500 mb-3 text-center">看完感觉怎么样？</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleFeedback('better')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  <ThumbsUp size={16} />
                  好多了
                </button>
                <button
                  onClick={() => handleFeedback('same')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  <Minus size={16} />
                  差不多
                </button>
                <button
                  onClick={() => handleFeedback('worse')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors text-sm font-medium"
                >
                  <ThumbsDown size={16} />
                  还是很差
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-3 animate-slide-up">
              <p className="text-green-600 font-medium">✓ 已记录，感谢反馈！</p>
              <p className="text-sm text-gray-400 mt-1">ResearchMind 会记住你的偏好</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
