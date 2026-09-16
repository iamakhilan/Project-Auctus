import React, { useMemo, useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { StreakCalendar } from './StreakCalendar';
import { DailySummaryModal } from './DailySummaryModal';

// ---------- helpers ----------
function toISODateLocal(d: Date): string {
  return d.toISOString().split('T')[0];
}

function getLastNDates(n: number): string[] {
  const out: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(toISODateLocal(d));
  }
  return out;
}

function shortDayLabel(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3);
}

// Pure SVG sparkline (no deps)
// values: numbers per day, width 100%, height configurable, shows dots + gradient fill
const Sparkline: React.FC<{
  values: number[];
  labels: string[];
  color?: string;
  fillColor?: string;
  emptyLabel?: string;
}> = ({ values, labels, color = '#58cc02', fillColor = '#e8f8d8', emptyLabel }) => {
  const hasData = values.some((v) => v > 0);
  const max = Math.max(...values, 1);
  const w = 320;
  const h = 112;
  const padL = 8;
  const padR = 8;
  const padT = 12;
  const padB = 24;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  if (!hasData) {
    return (
      <div className="w-full h-[112px] flex flex-col items-center justify-center rounded-2xl bg-[#fafafa] border-2 border-dashed border-[#e5e5e5]">
        <span className="text-sm font-bold text-[var(--gray-light)]">{emptyLabel ?? 'No data yet'}</span>
        <span className="text-xs font-semibold text-[var(--gray-light)]">Complete quests to see your trend.</span>
      </div>
    );
  }

  const stepX = innerW / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = padL + i * stepX;
    const y = padT + innerH - (v / max) * innerH;
    return { x, y, v };
  });

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  const areaD = `${lineD} L ${points[points.length - 1].x.toFixed(2)} ${(padT + innerH).toFixed(2)} L ${points[0].x.toFixed(2)} ${(padT + innerH).toFixed(2)} Z`;

  // grid lines
  const gridYs = [0.25, 0.5, 0.75].map((r) => padT + innerH * r);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[132px]" role="img" aria-label="Weekly XP sparkline">
        {/* grid */}
        {gridYs.map((y) => (
          <line key={y} x1={padL} x2={w - padR} y1={y} y2={y} stroke="#f0f0f0" strokeWidth={1} strokeDasharray="3 4" />
        ))}
        {/* area */}
        <path d={areaD} fill={fillColor} opacity={0.9} />
        {/* line */}
        <path d={lineD} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        {/* dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={6} fill="white" stroke={color} strokeWidth={2.5} />
            <circle cx={p.x} cy={p.y} r={2.5} fill={color} />
          </g>
        ))}
        {/* labels */}
        {points.map((p, i) => (
          <text key={`lbl-${i}`} x={p.x} y={h - 4} textAnchor="middle" fontSize="9" fontWeight={800} fill="#777">
            {labels[i]}
          </text>
        ))}
      </svg>
      <div className="flex items-center gap-1.5 justify-center mt-1">
        {values.map((v, i) => (
          <span key={i} className="text-[11px] font-black text-[var(--gray-light)]">
            {v}
            {i < values.length - 1 ? ' · ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

const BarChart: React.FC<{
  values: number[];
  labels: string[];
  color?: string;
  emptyLabel?: string;
}> = ({ values, labels, color = '#1cb0f6', emptyLabel }) => {
  const hasData = values.some((v) => v > 0);
  const max = Math.max(...values, 1);
  const w = 320;
  const h = 128;
  const padL = 8;
  const padR = 8;
  const padT = 8;
  const padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const barGap = 8;
  const barW = (innerW - barGap * (values.length - 1)) / values.length;

  if (!hasData) {
    return (
      <div className="w-full h-[128px] flex flex-col items-center justify-center rounded-2xl bg-[#fafafa] border-2 border-dashed border-[#e5e5e5]">
        <span className="text-sm font-bold text-[var(--gray-light)]">{emptyLabel ?? 'No focus sessions yet'}</span>
        <span className="text-xs font-semibold text-[var(--gray-light)]">Start a focus battle to populate this chart.</span>
      </div>
    );
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[148px]" role="img" aria-label="Focus minutes bars">
      {/* baseline */}
      <line x1={padL} x2={w - padR} y1={padT + innerH} y2={padT + innerH} stroke="#e5e5e5" strokeWidth={1.5} />
      {values.map((v, i) => {
        const barH = (v / max) * innerH;
        const x = padL + i * (barW + barGap);
        const y = padT + innerH - barH;
        const isZero = v === 0;
        return (
          <g key={i}>
            <rect
              x={x}
              y={isZero ? padT + innerH - 4 : y}
              width={barW}
              height={isZero ? 4 : barH}
              rx={8}
              fill={isZero ? '#f0f0f0' : color}
              opacity={isZero ? 1 : 0.95}
            />
            {!isZero && (
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="10" fontWeight={900} fill="#4b4b4b">
                {v}m
              </text>
            )}
            <text x={x + barW / 2} y={h - 8} textAnchor="middle" fontSize="9" fontWeight={800} fill="#777">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Economy area/line chart — cumulative coin balance
const EconomyChart: React.FC<{
  dates: string[];
  dailyNet: number[];
  cumulative: number[];
  labels: string[];
}> = ({ dates: _dates, dailyNet: _dailyNet, cumulative, labels }) => {
  const hasMovement = cumulative.some((_, i) => i > 0 && cumulative[i] !== cumulative[0]) || cumulative.some((v) => v !== 0);
  const w = 360;
  const h = 140;
  const padL = 10;
  const padR = 10;
  const padT = 16;
  const padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  if (cumulative.length === 0) {
    return (
      <div className="w-full h-[140px] flex flex-col items-center justify-center rounded-2xl bg-[#fafafa] border-2 border-dashed border-[#e5e5e5]">
        <span className="text-sm font-bold text-[var(--gray-light)]">No economy history yet</span>
        <span className="text-xs font-semibold text-[var(--gray-light)]">Complete quests or redeem rewards to see balance changes.</span>
      </div>
    );
  }

  // normalize cumulative to fit
  const min = Math.min(...cumulative);
  const max = Math.max(...cumulative);
  const span = Math.max(1, max - min);
  // add 10% padding
  const paddedMin = min - span * 0.08;
  const paddedMax = max + span * 0.08;
  const paddedSpan = paddedMax - paddedMin || 1;

  const stepX = innerW / Math.max(1, cumulative.length - 1);
  const points = cumulative.map((v, i) => {
    const x = padL + i * stepX;
    const y = padT + innerH - ((v - paddedMin) / paddedSpan) * innerH;
    return { x, y, v };
  });

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  const areaD = `${lineD} L ${points[points.length - 1].x.toFixed(2)} ${(padT + innerH).toFixed(2)} L ${points[0].x.toFixed(2)} ${(padT + innerH).toFixed(2)} Z`;

  const gridYs = [0.25, 0.5, 0.75].map((r) => padT + innerH * r);

  if (!hasMovement && cumulative.every((v) => v === cumulative[0])) {
    // flat line — still render but muted
  }

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[160px]" role="img" aria-label="Economy balance over time">
        {gridYs.map((y) => (
          <line key={y} x1={padL} x2={w - padR} y1={y} y2={y} stroke="#f0f0f0" strokeWidth={1} strokeDasharray="3 4" />
        ))}
        {/* area */}
        <path d={areaD} fill="#fffbe6" stroke="none" opacity={0.95} />
        <path d={areaD} fill="none" stroke="#ffe58f" strokeWidth={1} opacity={0.6} />
        {/* line */}
        <path d={lineD} fill="none" stroke="#d48806" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
        {/* dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="white" stroke="#d48806" strokeWidth={2} />
        ))}
        {/* labels sparse: show every 3rd */}
        {points.map((p, i) => {
          if (labels.length > 7 && i % 2 !== 0 && i !== labels.length - 1) return null;
          return (
            <text key={`elbl-${i}`} x={p.x} y={h - 6} textAnchor="middle" fontSize="8" fontWeight={800} fill="#777">
              {labels[i]}
            </text>
          );
        })}
      </svg>
      <div className="flex items-center justify-between text-[11px] font-bold text-[var(--gray-light)] px-1">
        <span>Min {Math.round(paddedMin)} 🟡</span>
        <span>Max {Math.round(paddedMax)} 🟡</span>
        <span className="font-black text-[#d48806]">Now {cumulative[cumulative.length - 1]} 🟡</span>
      </div>
    </div>
  );
};

// ---------- main dashboard ----------
export const AnalyticsDashboard: React.FC = () => {
  const { quests, habits, transactions, profile } = useGameState();
  const [showDailySummary, setShowDailySummary] = useState(false);

  const last7 = useMemo(() => getLastNDates(7), []);
  const last14 = useMemo(() => getLastNDates(14), []);
  const todayIso = toISODateLocal(new Date());

  // weekly XP + weekly coins derived from quests completedAt
  const { xpByDay, coinsByDay, labels7 } = useMemo(() => {
    const xpMap = new Map<string, number>();
    const coinsMap = new Map<string, number>();
    for (const d of last7) {
      xpMap.set(d, 0);
      coinsMap.set(d, 0);
    }
    for (const q of quests) {
      if (!q.isCompleted || !q.completedAt) continue;
      const day = q.completedAt.split('T')[0];
      if (xpMap.has(day)) {
        xpMap.set(day, (xpMap.get(day) ?? 0) + q.xpReward);
        coinsMap.set(day, (coinsMap.get(day) ?? 0) + q.coinsReward);
      }
    }
    // also count habit check-ins if lastCompletedDate falls in window
    // habit XP/coins already accounted via transactions, but include heuristic for visual completeness
    // we keep sparkline quest-only to avoid double-count; habit contribution shown via habit dots.

    const xpVals = last7.map((d) => xpMap.get(d) ?? 0);
    const coinsVals = last7.map((d) => coinsMap.get(d) ?? 0);
    const labels = last7.map((d) => shortDayLabel(d));
    return { xpByDay: xpVals, coinsByDay: coinsVals, labels7: labels };
  }, [quests, last7]);

  // Focus minutes last 7 days — parse from transactions reason "Focus Combat Victory (XXm)"
  const focusByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of last7) map.set(d, 0);
    const focusRe = /Focus.*?\( *(\d+)\s*m/i;
    for (const t of transactions) {
      const day = toISODateLocal(new Date(t.timestamp));
      if (!map.has(day)) continue;
      const m = t.reason.match(focusRe);
      if (m) {
        const mins = parseInt(m[1], 10);
        if (!Number.isNaN(mins)) map.set(day, (map.get(day) ?? 0) + mins);
      }
    }
    // fallback: if no focus transactions but profile.totalFocusMinutes >0, attribute remainder to today for visibility
    // only if all zeros and total >0 and we have at least some quest activity today — show subtle hint instead of fake distribution
    return last7.map((d) => map.get(d) ?? 0);
  }, [transactions, last7]);

  // Economy — net per day + cumulative ending at profile.coins
  const { dailyNetCoins, cumulativeCoins, labels14, totalXpWeek, totalFocusWeek } = useMemo(() => {
    const netMap = new Map<string, number>();
    for (const d of last14) netMap.set(d, 0);
    for (const t of transactions) {
      if (t.currency !== 'coins') continue;
      const day = toISODateLocal(new Date(t.timestamp));
      if (!netMap.has(day)) continue;
      const delta = t.type === 'earn' ? t.amount : -Math.abs(t.amount);
      netMap.set(day, (netMap.get(day) ?? 0) + delta);
    }
    const dailyNet = last14.map((d) => netMap.get(d) ?? 0);
    // cumulative: walk from oldest to newest ending at profile.coins
    const totalNetWindow = dailyNet.reduce((a, b) => a + b, 0);
    const startBalance = profile.coins - totalNetWindow;
    let run = startBalance;
    const cumulative = dailyNet.map((delta) => {
      run += delta;
      return Math.round(run);
    });
    const labels = last14.map((d) => {
      const dt = new Date(d + 'T00:00:00');
      return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });
    return {
      dailyNetCoins: dailyNet,
      cumulativeCoins: cumulative,
      labels14: labels,
      totalXpWeek: xpByDay.reduce((a, b) => a + b, 0),
      totalFocusWeek: focusByDay.reduce((a, b) => a + b, 0),
    };
  }, [transactions, last14, profile.coins, xpByDay, focusByDay]);

  const completedTodayCount = useMemo(() => {
    return quests.filter((q) => q.isCompleted && q.completedAt && q.completedAt.split('T')[0] === todayIso).length;
  }, [quests, todayIso]);

  const habitsDoneToday = useMemo(
    () => habits.filter((h) => h.lastCompletedDate === todayIso).length,
    [habits, todayIso]
  );

  const netCoinsWeek = useMemo(() => dailyNetCoins.slice(-7).reduce((a, b) => a + b, 0), [dailyNetCoins]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Feather_Bold'] text-2xl sm:text-3xl text-[var(--dark-blue)] tracking-wide">ANALYTICS</h1>
          <p className="text-sm font-bold text-[var(--gray-light)]">Weekly trends, focus depth, streaks & treasury — all from your local save.</p>
        </div>
        <button
          onClick={() => setShowDailySummary(true)}
          className="h-11 px-5 bg-[var(--dark-blue)] hover:bg-[#1a237e] text-white font-['Feather_Bold'] text-sm font-black uppercase rounded-2xl shadow-md active:translate-y-0.5 transition-all"
        >
          📊 Daily Summary →
        </button>
      </div>

      {/* Top KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-4 flex flex-col gap-1">
          <span className="text-[11px] font-black uppercase tracking-widest text-[var(--gray-light)]">Weekly XP</span>
          <span className="font-['Feather_Bold'] text-2xl font-black text-[var(--dark-blue)]">{totalXpWeek} ⚡</span>
          <span className="text-xs font-bold text-[var(--gray-light)]">{completedTodayCount} quests today</span>
        </div>
        <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-4 flex flex-col gap-1">
          <span className="text-[11px] font-black uppercase tracking-widest text-[var(--gray-light)]">Focus (7d)</span>
          <span className="font-['Feather_Bold'] text-2xl font-black text-[var(--dark-blue)]">{totalFocusWeek}m</span>
          <span className="text-xs font-bold text-[var(--gray-light)]">{profile.totalFocusMinutes} total minutes</span>
        </div>
        <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-4 flex flex-col gap-1">
          <span className="text-[11px] font-black uppercase tracking-widest text-[var(--gray-light)]">Habits</span>
          <span className="font-['Feather_Bold'] text-2xl font-black text-[var(--orange)]">
            {habitsDoneToday}/{habits.length} 🔥
          </span>
          <span className="text-xs font-bold text-[var(--gray-light)]">{profile.streakDays}d streak • done today</span>
        </div>
        <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-4 flex flex-col gap-1">
          <span className="text-[11px] font-black uppercase tracking-widest text-[var(--gray-light)]">Treasury (7d net)</span>
          <span className={`font-['Feather_Bold'] text-2xl font-black ${netCoinsWeek >= 0 ? 'text-[#d48806]' : 'text-[var(--red)]'}`}>
            {netCoinsWeek >= 0 ? '+' : ''}{netCoinsWeek} 🟡
          </span>
          <span className="text-xs font-bold text-[var(--gray-light)]">Balance {profile.coins} 🟡 • {profile.gems} 💎</span>
        </div>
      </div>

      {/* Weekly XP + Focus row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly XP Sparkline */}
        <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-['Feather_Bold'] text-base sm:text-lg text-[var(--dark-blue)]">WEEKLY XP</h3>
            <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#e8f8d8] border border-[#b7e986] text-[#4a7c00]">
              {totalXpWeek} XP / 7 days
            </span>
          </div>
          <div className="section-label-light">Sparkline (SVG, no chart lib)</div>
          <Sparkline values={xpByDay} labels={labels7} color="#58cc02" fillColor="#e8f8d8" emptyLabel="No XP this week" />
          {/* companion mini coins row */}
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {last7.map((d, i) => (
              <div key={d} className="text-center rounded-xl bg-[#fffbe6] border border-[#ffe58f] py-1.5">
                <div className="text-[10px] font-black text-[#d48806]">+{coinsByDay[i]} 🟡</div>
                <div className="text-[9px] font-bold text-[var(--gray-light)]">{labels7[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Focus Minutes Bars */}
        <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-['Feather_Bold'] text-base sm:text-lg text-[var(--dark-blue)]">FOCUS MINUTES</h3>
            <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#eef8ff] border border-[#b9e5fb] text-[var(--blue)]">
              Last 7 days
            </span>
          </div>
          <div className="section-label-light">Deep work bars (SVG)</div>
          <BarChart values={focusByDay} labels={labels7} color="#1cb0f6" emptyLabel="No focus sessions in last 7 days" />
          <p className="text-[11px] font-semibold text-[var(--gray-light)] mt-2 text-center">
            Total logged: {profile.totalFocusMinutes}m • Daily avg (7d): {Math.round(totalFocusWeek / 7)}m
          </p>
        </div>
      </div>

      {/* Streak Calendar */}
      <StreakCalendar days={30} />

      {/* Economy Balance over Time */}
      <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <h3 className="font-['Feather_Bold'] text-base sm:text-lg text-[var(--dark-blue)]">TREASURY BALANCE</h3>
          <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#fffbe6] border border-[#ffe58f] text-[#8c5a00]">
            Coins over last 14 days
          </span>
        </div>
        <div className="section-label-light">Economy trend from transactions</div>
        <EconomyChart dates={last14} dailyNet={dailyNetCoins} cumulative={cumulativeCoins} labels={labels14} />
        {/* legend chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-[var(--gray-light)]">Net per day:</span>
          {dailyNetCoins.slice(-7).map((v, i) => (
            <span
              key={last7[i]}
              className={`text-[11px] font-black px-2 py-1 rounded-full border ${v >= 0 ? 'bg-[#e8f8d8] border-[#b7e986] text-[#3a6b00]' : 'bg-[#ffeef0] border-[#ffccd2] text-[var(--red)]'}`}
            >
              {labels7[i]} {v >= 0 ? '+' : ''}{v}
            </span>
          ))}
        </div>
        {transactions.length === 0 && (
          <p className="text-xs font-semibold text-[var(--gray-light)] mt-2">No transactions yet — earn coins by completing quests to see your wealth grow.</p>
        )}
      </div>

      {/* Footer hint */}
      <p className="text-center text-[11px] font-bold text-[var(--gray-light)]">
        Data derived from local save (quests • habits • transactions • profile). Empty states handled gracefully.
      </p>

      <DailySummaryModal isOpen={showDailySummary} onClose={() => setShowDailySummary(false)} />
    </div>
  );
};

export default AnalyticsDashboard;
