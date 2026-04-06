import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

// ─── 数据类型定义 ──────────────────────────────────────────────────────────────

/** 情绪记录 */
export interface MoodRecord {
  id: string
  timestamp: number                      // Unix 毫秒时间戳
  source: 'manual' | 'wearable' | 'ai_chat' | 'text_analysis' // 扩展预留
  moodScore: 1 | 2 | 3 | 4 | 5          // 1=极差 … 5=极好
  emotionTags: string[]                  // 情绪标签
  note: string                           // 备注
  // 以下字段为被动采集扩展预留（v2）
  energyLevel?: number                   // 精力值 1-5
  heartRate?: number                     // 心率
  sleepQuality?: number                  // 睡眠质量 1-5
  stressLevel?: number                   // 压力值
  interventionTriggered: boolean
  interventionType?: 'text' | 'music' | 'video' | null
  interventionFeedback?: 'better' | 'same' | 'worse' | null
}

/** 干预资源 */
export interface InterventionResource {
  id: string
  type: 'text' | 'music' | 'video'
  title: string
  content: string        // 文字内容 / 音乐URL / 视频URL
  tags: string[]         // 适用情绪标签
  author?: string
  duration?: number      // 秒（音乐/视频）
}

// ─── DB Schema ────────────────────────────────────────────────────────────────

interface ResearchMindDB extends DBSchema {
  moods: {
    key: string
    value: MoodRecord
    indexes: {
      'by-timestamp': number
      'by-date': string
    }
  }
  interventions: {
    key: string
    value: InterventionResource
    indexes: { 'by-type': string }
  }
}

// ─── 初始化 DB ─────────────────────────────────────────────────────────────────

let dbInstance: IDBPDatabase<ResearchMindDB> | null = null

export async function getDB(): Promise<IDBPDatabase<ResearchMindDB>> {
  if (dbInstance) return dbInstance
  dbInstance = await openDB<ResearchMindDB>('research-mind-db', 1, {
    upgrade(db) {
      // moods store
      const moodStore = db.createObjectStore('moods', { keyPath: 'id' })
      moodStore.createIndex('by-timestamp', 'timestamp')
      moodStore.createIndex('by-date', 'date')

      // interventions store
      const intStore = db.createObjectStore('interventions', { keyPath: 'id' })
      intStore.createIndex('by-type', 'type')
    },
  })
  return dbInstance
}

// ─── CRUD：情绪记录 ────────────────────────────────────────────────────────────

export async function saveMood(record: MoodRecord): Promise<void> {
  const db = await getDB()
  await db.put('moods', record)
}

export async function getAllMoods(): Promise<MoodRecord[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('moods', 'by-timestamp')
  return all.reverse() // 最新在前
}

export async function getMoodsByDateRange(
  startTs: number,
  endTs: number
): Promise<MoodRecord[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('moods', 'by-timestamp')
  return all
    .filter(r => r.timestamp >= startTs && r.timestamp <= endTs)
    .reverse()
}

export async function getTodayMoods(): Promise<MoodRecord[]> {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const endOfDay = startOfDay + 86400000
  return getMoodsByDateRange(startOfDay, endOfDay)
}

export async function deleteMood(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('moods', id)
}

// ─── 干预资源 ──────────────────────────────────────────────────────────────────

export async function saveIntervention(res: InterventionResource): Promise<void> {
  const db = await getDB()
  await db.put('interventions', res)
}

export async function getInterventionsByType(
  type: 'text' | 'music' | 'video'
): Promise<InterventionResource[]> {
  const db = await getDB()
  return db.getAllFromIndex('interventions', 'by-type', type)
}

// ─── 工具函数 ──────────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** 将时间戳格式化为 HH:MM */
export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** 将时间戳格式化为 M月D日 */
export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
  })
}

/** 获取最近 N 天的起始时间戳 */
export function getLastNDaysRange(n: number): { start: number; end: number } {
  const end = Date.now()
  const start = end - n * 86400000
  return { start, end }
}
