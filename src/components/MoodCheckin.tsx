import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { saveMood, generateId, type MoodRecord } from '../db'
import { MOOD_CONFIG, EMOTION_TAGS } from '../data'

interface MoodCheckinProps {
  onComplete: (record: MoodRecord) => void
}

export default function MoodCheckin({ onComplete }: MoodCheckinProps) {
  const [step, setStep] = useState<'mood' | 'tags' | 'note'>('mood')
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  // ── 情绪选择（可随时重新选择）─────────────────────────────────────────────
  const handleMoodSelect = (score: number) => {
    setSelectedMood(score)
    if (step === 'mood') {
      setStep('tags')
    }
  }

  // ── 预置标签切换 ──────────────────────────────────────────────────────────
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  // ── 自定义标签添加 ────────────────────────────────────────────────────────
  const addCustomTag = () => {
    const trimmed = customTag.trim()
    if (!trimmed || selectedTags.includes(trimmed)) {
      setCustomTag('')
      return
    }
    setSelectedTags(prev => [...prev, trimmed])
    setCustomTag('')
  }

  // ── 提交 ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedMood) return
    setSaving(true)

    const record: MoodRecord = {
      id: generateId(),
      timestamp: Date.now(),
      source: 'manual',
      moodScore: selectedMood as 1 | 2 | 3 | 4 | 5,
      emotionTags: selectedTags,
      note: note.trim(),
      interventionTriggered: selectedMood <= 2,
      interventionType: null,
      interventionFeedback: null,
    }

    await saveMood(record)
    setSaving(false)
    onComplete(record)
  }

  const selectedConfig = selectedMood ? MOOD_CONFIG.find(m => m.score === selectedMood) : null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg mx-auto">
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">情绪打卡</h2>
        <p className="text-sm text-gray-400 mt-1">
          {new Date().toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* 步骤1：选择情绪（始终可点击重新选） */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-4">
          ✦ 现在感觉怎么样？
          {selectedMood && (
            <span className="ml-2 text-xs text-gray-400 font-normal">
              当前：{selectedConfig?.emoji} {selectedConfig?.label}（点击可重新选择）
            </span>
          )}
        </p>
        <div className="flex justify-between gap-2 mb-2">
          {MOOD_CONFIG.map(({ score, emoji, label }) => (
            <button
              key={score}
              onClick={() => handleMoodSelect(score)}
              className={`mood-btn flex flex-col items-center gap-1 p-3 rounded-xl flex-1 border-2 transition-all cursor-pointer
                ${selectedMood === score
                  ? 'border-amber-400 bg-amber-50 selected'
                  : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                }`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-gray-500 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 步骤2：情绪标签 */}
      {(step === 'tags' || step === 'note') && (
        <div className="mt-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">✦ 主要是什么感受？（可多选）</p>
            {/* 返回修改情绪按钮 */}
            <button
              onClick={() => setStep('mood')}
              className="text-xs text-blue-400 hover:text-blue-600 font-medium"
            >
              修改情绪
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {EMOTION_TAGS.map(({ label, color }) => (
              <button
                key={label}
                onClick={() => toggleTag(label)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border
                  ${selectedTags.includes(label)
                    ? `${color} border-current scale-105`
                    : 'bg-gray-50 text-gray-500 border-transparent hover:border-gray-200'
                  }`}
              >
                {label}
              </button>
            ))}
            {/* 已选自定义标签 */}
            {selectedTags
              .filter(t => !EMOTION_TAGS.find(e => e.label === t))
              .map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-violet-100 text-violet-700 border border-violet-200 scale-105"
                >
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-1.5 text-violet-400 hover:text-violet-600 text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>

          {/* 自定义感受输入 */}
          <div className="flex gap-2 mb-2">
            <input
              value={customTag}
              onChange={e => setCustomTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomTag()}
              placeholder="添加自定义感受…"
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder:text-gray-300"
            />
            <button
              onClick={addCustomTag}
              disabled={!customTag.trim()}
              className="px-4 py-2 rounded-xl bg-violet-100 text-violet-600 text-sm font-semibold
                hover:bg-violet-200 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              添加
            </button>
          </div>

          <button
            onClick={() => setStep('note')}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700 font-medium"
          >
            继续 →
          </button>
        </div>
      )}

      {/* 步骤3：备注 */}
      {step === 'note' && (
        <div className="mt-5 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">✦ 一句话记录（可跳过）</p>
            <button
              onClick={() => setStep('tags')}
              className="text-xs text-blue-400 hover:text-blue-600 font-medium"
            >
              返回标签
            </button>
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="今天遇到了什么？卡在哪里了？有什么好消息？"
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
          />

          {/* 低情绪提示 */}
          {selectedMood !== null && selectedMood <= 2 && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
              💛 感觉不太好？打卡完成后我会给你一些支持。
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 bg-[#1e3a5f] text-white font-semibold py-3 rounded-xl
                hover:bg-[#2a4f7c] active:scale-[0.98] transition-all flex items-center justify-center gap-2
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="animate-pulse-soft">正在保存…</span>
              ) : (
                <>
                  <CheckCircle size={18} />
                  完成打卡
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
