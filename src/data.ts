import type { InterventionResource } from './db'

// ─── 激励文字库 ────────────────────────────────────────────────────────────────

export const motivationalTexts: InterventionResource[] = [
  {
    id: 'txt-001',
    type: 'text',
    title: '每一次失败都是数据',
    content: '科研的本质是在黑暗中摸索。\n\n爱迪生发明灯泡时，被记者问："你失败了一万次，有什么感受？"\n他回答："我没有失败一万次，我只是找到了一万种行不通的方法。"\n\n你今天遇到的障碍，正是你独一无二的科研路径的一部分。\n坐下来，继续。',
    tags: ['焦虑', '挫败', '迷茫'],
    author: '爱迪生',
  },
  {
    id: 'txt-002',
    type: 'text',
    title: '你比你想象的更强',
    content: '居里夫人在发现镭之前，整整四年在简陋的棚屋里工作。\n没有暖气，没有足够的设备，没有人相信她。\n\n但她每天出现，每天工作，每天相信那个还未被证明的假设。\n\n你今天出现了。这就是胜利的开始。',
    tags: ['疲惫', '焦虑', '低落'],
    author: '居里夫人',
  },
  {
    id: 'txt-003',
    type: 'text',
    title: '慢即是快',
    content: '感觉今天效率很低？\n\n科学研究表明，深度休息与高质量工作是一个系统。\n世界上最顶尖的研究者，平均每天专注工作不超过4小时。\n\n今天放慢脚步，明天才能全力冲刺。\n允许自己此刻喘口气。',
    tags: ['疲惫', '倦怠'],
    author: 'ResearchMind',
  },
  {
    id: 'txt-004',
    type: 'text',
    title: '组会只是一个检查点',
    content: '组会结束了，也许不够完美。\n\n但请记住：导师的批评是他们仍然在关注你的证明。\n每一个被指出的问题，都是下一步前进的方向。\n\n把今天的批评列成清单，逐一解决。\n三个月后，你会感谢今天的这场对话。',
    tags: ['焦虑', '挫败', '压力'],
    author: 'ResearchMind',
  },
  {
    id: 'txt-005',
    type: 'text',
    title: '大问题需要时间',
    content: '你正在研究的问题，可能是人类从未解答过的。\n\n这不是一周、一个月能解决的事。\n达尔文酝酿《物种起源》花了二十年。\n沃森和克里克发现DNA双螺旋之前，失败了无数次。\n\n你处在一个漫长征程的某个节点上。\n今天的困惑，是这段旅程中必然的风景。',
    tags: ['迷茫', '焦虑', '低落'],
    author: 'ResearchMind',
  },
  {
    id: 'txt-006',
    type: 'text',
    title: '今天你做到了什么？',
    content: '暂停一下，想想今天你做到了什么——\n\n不是"应该做完但没做完"的事，\n而是"今天实际完成的，哪怕一小步"。\n\n也许是读完了一篇论文，\n也许是调试通了一个报错，\n也许只是——今天，你坚持来了。\n\n这些都算数。你在积累。',
    tags: ['低落', '倦怠', '迷茫'],
    author: 'ResearchMind',
  },
  {
    id: 'txt-007',
    type: 'text',
    title: '压力是你重视这件事的证明',
    content: '你感到压力，是因为你在乎。\n在乎你的研究，在乎自己的成长，\n在乎那个你想成为的科学家。\n\n一个对一切无所谓的人，不会感到压力。\n所以，你的压力本身就证明了你值得走在这条路上。\n\n深呼吸。这份压力，是动力的另一面。',
    tags: ['压力', '焦虑'],
    author: 'ResearchMind',
  },
  {
    id: 'txt-008',
    type: 'text',
    title: '享受此刻的不确定性',
    content: '"科学中最令人兴奋的词，不是\'我发现了！\'，\n而是\'这很奇怪……\'" \n\n                               — 艾萨克·阿西莫夫\n\n你现在的困惑和不确定，\n正是科学中最珍贵的起点。\n\n没有人在这条路上是确定的。\n你不孤单。',
    tags: ['迷茫', '焦虑', '困惑'],
    author: '阿西莫夫',
  },
]

// ─── 音乐资源库（嵌入式播放 / 外链） ──────────────────────────────────────────

export const musicResources: InterventionResource[] = [
  {
    id: 'music-001',
    type: 'music',
    title: '深度专注 · Lo-fi Study Beats',
    content: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1',
    tags: ['专注', '工作'],
    duration: 10800,
  },
  {
    id: 'music-002',
    type: 'music',
    title: '平静放松 · 古典钢琴',
    content: 'https://www.youtube.com/embed/4vIiKo0y9KY?autoplay=1',
    tags: ['放松', '焦虑', '压力'],
    duration: 3600,
  },
  {
    id: 'music-003',
    type: 'music',
    title: '能量激励 · 史诗纯音乐',
    content: 'https://www.youtube.com/embed/UF-nHVAl4wU?autoplay=1',
    tags: ['低落', '疲惫', '激励'],
    duration: 3600,
  },
  {
    id: 'music-004',
    type: 'music',
    title: '自然白噪音 · 雨声森林',
    content: 'https://www.youtube.com/embed/q76bMs-NwRk?autoplay=1',
    tags: ['放松', '疲惫', '倦怠'],
    duration: 7200,
  },
  {
    id: 'music-005',
    type: 'music',
    title: '专注心流 · Binaural Beats',
    content: 'https://www.youtube.com/embed/WPni755-Krg?autoplay=1',
    tags: ['专注', '迷茫'],
    duration: 3600,
  },
]

// ─── 视频资源库 ────────────────────────────────────────────────────────────────

export const videoResources: InterventionResource[] = [
  {
    id: 'video-001',
    type: 'video',
    title: '科学家的失败与坚持',
    content: 'https://www.youtube.com/embed/ITY5LHEJ4b0',
    tags: ['挫败', '迷茫', '低落'],
    duration: 180,
    author: 'TED',
  },
  {
    id: 'video-002',
    type: 'video',
    title: '每天进步1%的力量',
    content: 'https://www.youtube.com/embed/mNeXuCYiE0U',
    tags: ['低落', '焦虑', '激励'],
    duration: 240,
    author: 'TED',
  },
  {
    id: 'video-003',
    type: 'video',
    title: '地球从太空看起来的样子',
    content: 'https://www.youtube.com/embed/FG0fTKAqZ5g',
    tags: ['压力', '焦虑', '放松'],
    duration: 120,
    author: 'NASA',
  },
  {
    id: 'video-004',
    type: 'video',
    title: '4-7-8 呼吸放松法',
    content: 'https://www.youtube.com/embed/gz4G31LGyog',
    tags: ['焦虑', '压力', '疲惫'],
    duration: 300,
    author: '冥想引导',
  },
  {
    id: 'video-005',
    type: 'video',
    title: '科研路上的孤独与意义',
    content: 'https://www.youtube.com/embed/xSN4x8YFHEA',
    tags: ['迷茫', '倦怠', '低落'],
    duration: 420,
    author: 'TED',
  },
]

// ─── 情绪标签配置 ──────────────────────────────────────────────────────────────

export const EMOTION_TAGS = [
  { label: '焦虑', color: 'bg-orange-100 text-orange-700' },
  { label: '疲惫', color: 'bg-gray-100 text-gray-600' },
  { label: '迷茫', color: 'bg-purple-100 text-purple-700' },
  { label: '压力', color: 'bg-red-100 text-red-700' },
  { label: '挫败', color: 'bg-red-100 text-red-600' },
  { label: '倦怠', color: 'bg-yellow-100 text-yellow-700' },
  { label: '平静', color: 'bg-blue-100 text-blue-600' },
  { label: '专注', color: 'bg-teal-100 text-teal-700' },
  { label: '兴奋', color: 'bg-amber-100 text-amber-700' },
  { label: '满足', color: 'bg-green-100 text-green-700' },
  { label: '困惑', color: 'bg-purple-100 text-purple-600' },
  { label: '充实', color: 'bg-emerald-100 text-emerald-700' },
]

// ─── 情绪分值配置 ──────────────────────────────────────────────────────────────

export const MOOD_CONFIG = [
  { score: 1, emoji: '😫', label: '很差', color: '#ef4444', bgColor: 'bg-red-50', textColor: 'text-red-500' },
  { score: 2, emoji: '😔', label: '较差', color: '#f97316', bgColor: 'bg-orange-50', textColor: 'text-orange-500' },
  { score: 3, emoji: '😐', label: '一般', color: '#eab308', bgColor: 'bg-yellow-50', textColor: 'text-yellow-500' },
  { score: 4, emoji: '🙂', label: '不错', color: '#22c55e', bgColor: 'bg-green-50', textColor: 'text-green-500' },
  { score: 5, emoji: '😄', label: '很好', color: '#10b981', bgColor: 'bg-emerald-50', textColor: 'text-emerald-500' },
]

export function getMoodConfig(score: number) {
  return MOOD_CONFIG.find(m => m.score === score) ?? MOOD_CONFIG[2]
}

/** 根据情绪标签智能推荐干预内容 */
export function getRecommendedContent(
  type: 'text' | 'music' | 'video',
  tags: string[]
): InterventionResource[] {
  const pool = type === 'text' ? motivationalTexts
    : type === 'music' ? musicResources
    : videoResources

  // 按标签匹配度排序
  const scored = pool.map(item => ({
    item,
    score: item.tags.filter(t => tags.includes(t)).length,
  }))
  scored.sort((a, b) => b.score - a.score)

  // 如果没有匹配，随机返回
  const matched = scored.filter(s => s.score > 0)
  if (matched.length === 0) {
    return [pool[Math.floor(Math.random() * pool.length)]]
  }
  return matched.slice(0, 3).map(s => s.item)
}
