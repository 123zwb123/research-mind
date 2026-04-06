import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { MoodRecord } from "../db";
import { getMoodConfig } from "../data";

interface MoodChartProps {
  records: MoodRecord[];
  days?: 7 | 14 | 30;
}

interface DataPoint {
  date: string;
  mean: number | null;
  min: number | null;
  max: number | null;
  records: number;
}

const CHART_HEIGHT = 240;
const CHART_DOMAIN_MIN = 1;
const CHART_DOMAIN_MAX = 5;

// 这里不要直接拿整张容器高度，给绘图区留出顶部/底部与坐标轴空间
// 这是一个近似但稳定很多的做法
const PLOT_TOP_PADDING = 10;
const PLOT_BOTTOM_PADDING = 30;
const EFFECTIVE_PLOT_HEIGHT =
  CHART_HEIGHT - PLOT_TOP_PADDING - PLOT_BOTTOM_PADDING;

const formatDateKey = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric",
  });

const buildDateWindow = (days: number) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const start = new Date(today);
  start.setDate(today.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  return {
    startMs: start.getTime(),
    endMs: today.getTime(),
  };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  if (!d || d.mean == null) return null;

  const meanCfg = getMoodConfig(Math.round(d.mean));
  const minCfg = getMoodConfig(d.min);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm space-y-1">
      <p className="font-semibold text-gray-700">{label}</p>
      {d.min !== d.max ? (
        <>
          <p className="text-gray-500">
            情绪范围{" "}
            <span className="text-gray-700">
              {d.min} ~ {d.max}
            </span>
          </p>
          <p className="text-gray-500">
            日均分{" "}
            <span className={meanCfg.textColor}>
              {d.mean.toFixed(1)} {meanCfg.emoji}
            </span>
          </p>
        </>
      ) : (
        <p className="text-gray-500">
          情绪分{" "}
          <span className={minCfg.textColor}>
            {d.min} {minCfg.emoji}
          </span>
        </p>
      )}
      {d.records > 1 && (
        <p className="text-xs text-gray-400">共 {d.records} 条记录</p>
      )}
    </div>
  );
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null || payload == null || payload.mean == null) {
    return null;
  }

  const { min, max, mean } = payload;

  // 单次记录：只画一个点
  if (min == null || max == null || min === max) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#1e3a5f"
        stroke="white"
        strokeWidth={2}
      />
    );
  }

  // 基于“真实均值点 cy”做相对偏移
  const pxPerUnit =
    EFFECTIVE_PLOT_HEIGHT / (CHART_DOMAIN_MAX - CHART_DOMAIN_MIN);

  // 分数越高，y 越小；所以 value 比 mean 大时，要往上移动
  const yForValue = (value: number) => cy - (value - mean) * pxPerUnit;

  const yMax = yForValue(max);
  const yMin = yForValue(min);

  return (
    <g>
      {/* 情绪范围 */}
      <line
        x1={cx}
        y1={yMax}
        x2={cx}
        y2={yMin}
        stroke="#1e3a5f"
        strokeWidth={10}
        strokeLinecap="butt"
        opacity={0.12}
      />
      {/* 最高分 */}
      <line
        x1={cx - 8}
        y1={yMax}
        x2={cx + 8}
        y2={yMax}
        stroke="#1e3a5f"
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* 最低分 */}
      <line
        x1={cx - 8}
        y1={yMin}
        x2={cx + 8}
        y2={yMin}
        stroke="#1e3a5f"
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* 均值点 */}
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#1e3a5f"
        stroke="white"
        strokeWidth={2}
      />
    </g>
  );
};

export default function MoodChart({ records, days = 14 }: MoodChartProps) {
  const { startMs, endMs } = buildDateWindow(days);

  const dateMap: Record<string, MoodRecord[]> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endMs);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("zh-CN", {
      month: "numeric",
      day: "numeric",
    });
    dateMap[dateStr] = [];
  }

  const recentRecords = records.filter(
    (r) => r.timestamp >= startMs && r.timestamp <= endMs
  );

  recentRecords.forEach((r) => {
    const date = formatDateKey(r.timestamp);
    if (dateMap[date] !== undefined) {
      dateMap[date].push(r);
    }
  });

  const data: DataPoint[] = Object.entries(dateMap).map(([date, recs]) => {
    if (recs.length === 0) {
      return { date, mean: null, min: null, max: null, records: 0 };
    }
    const scores = recs.map((r) => r.moodScore);
    return {
      date,
      mean: scores.reduce((s, v) => s + v, 0) / scores.length,
      min: Math.min(...scores),
      max: Math.max(...scores),
      records: scores.length,
    };
  });

  const avgScore = recentRecords.length
    ? recentRecords.reduce((s, r) => s + r.moodScore, 0) / recentRecords.length
    : 0;
  const avgCfg = getMoodConfig(Math.round(avgScore || 3));

  const tagCount: Record<string, number> = {};
  recentRecords.forEach((r) =>
    r.emotionTags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] ?? 0) + 1;
    })
  );
  const topTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">情绪趋势</h3>
          <div className="flex items-center gap-3">
            <span className="text-lg">{avgCfg.emoji}</span>
            <span className="text-xs text-gray-400">
              近{days}天{" "}
              <span className={`font-bold ${avgCfg.textColor}`}>
                {avgScore.toFixed(1)}
              </span>
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 16, bottom: 0, left: 0 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              domain={[CHART_DOMAIN_MIN, CHART_DOMAIN_MAX]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              width={28}
            />
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              horizontal={true}
              vertical={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(30, 58, 95, 0.04)" }}
            />

            <Line
              type="monotone"
              dataKey="mean"
              stroke="#1e3a5f"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-center gap-6 text-xs text-gray-400 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-[#1e3a5f] rounded-full" />
            <span>日均值</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-5 bg-[#1e3a5f]/10 rounded-sm" />
            <span>当日情绪范围</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-px bg-[#1e3a5f]" />
            <span>最高/最低分</span>
          </div>
        </div>
      </div>

      {topTags.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            高频情绪标签
          </h3>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => {
              const cfg = getMoodConfig(parseInt(tag.split("-")[0]) || 3);
              return (
                <div
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                  style={{
                    backgroundColor: cfg.bgColor + "22",
                    color: cfg.textColor,
                  }}
                >
                  <span>{cfg.emoji}</span>
                  <span>{tag}</span>
                  <span className="text-gray-400">×{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
