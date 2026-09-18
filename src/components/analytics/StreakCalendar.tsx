import React from 'react';
import { useGameState } from '../../context/GameStateContext';

function toISODate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function getLastNDates(n: number): string[] {
  const out: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(toISODate(d));
  }
  return out;
}

export interface StreakCalendarProps {
  days?: number;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ days = 30 }) => {
  const { habits } = useGameState();
  const dates = getLastNDates(days);
  const todayStr = toISODate(new Date());

  return (
    <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-['Feather_Bold'] text-base sm:text-lg text-[var(--dark-blue)]">STREAK CALENDAR</h3>
        <span className="text-[11px] font-black uppercase tracking-widest text-[var(--gray-light)]">
          Last {days} days • {habits.length} habits
        </span>
      </div>

      <div className="section-label-light">Habit completion dots</div>

      {habits.length === 0 ? (
        <div className="text-center py-8 rounded-2xl bg-[#fafafa] border-2 border-dashed border-[#e5e5e5]">
          <span className="text-2xl block mb-2">🔥</span>
          <p className="text-sm font-bold text-[var(--gray-light)]">No habits yet</p>
          <p className="text-xs font-semibold text-[var(--gray-light)]">Create habits in Quests to see streaks here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-2">
            {dates.map((dateStr) => {
              const d = new Date(dateStr + 'T00:00:00');
              const isToday = dateStr === todayStr;
              const isFuture = d.getTime() > new Date(todayStr + 'T00:00:00').getTime();
              const completedHabits = habits.filter((h) =>
                (h.completedDates || []).includes(dateStr)
              );
              const completeCount = completedHabits.length;
              const totalCount = habits.length;
              const completionRatio = totalCount > 0 ? completeCount / totalCount : 0;

              let bg = 'bg-white';
              let border = 'border-[#e5e5e5]';
              if (completeCount === totalCount && totalCount > 0) {
                bg = 'bg-[#e8f8d8]';
                border = 'border-[#b7e986]';
              } else if (completeCount > 0) {
                bg = 'bg-[#fffbe6]';
                border = 'border-[#ffe58f]';
              } else if (isToday) {
                bg = 'bg-[#f7f7f7]';
                border = 'border-[var(--blue)]';
              }

              return (
                <div
                  key={dateStr}
                  title={`${dateStr}: ${completeCount}/${totalCount} habits`}
                  className={`relative rounded-2xl border-2 ${bg} ${border} p-2 flex flex-col items-center gap-1 min-h-[64px] ${isFuture ? 'opacity-40' : ''} ${isToday ? 'ring-2 ring-[var(--blue)] ring-offset-1' : ''}`}
                >
                  <span className="text-[10px] font-black text-[var(--gray-light)]">
                    {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <span className={`text-[10px] font-extrabold ${isToday ? 'text-[var(--blue)]' : 'text-[var(--gray-light)]'}`}>
                    {d.toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>

                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {habits.map((h) => {
                      const done = (h.completedDates || []).includes(dateStr);
                      return (
                        <span
                          key={`${dateStr}-${h.id}`}
                          className={`w-2 h-2 rounded-full ${done ? 'bg-[var(--green)]' : 'bg-[#e5e5e5]'}`}
                          title={`${h.title}: ${done ? 'done' : 'missed'}`}
                        />
                      );
                    })}
                  </div>

                  {completionRatio >= 1 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--green)] border-2 border-white flex items-center justify-center text-[10px] text-white font-black">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 text-[11px] font-bold text-[var(--gray-light)] flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--green)]" /> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#e5e5e5]" /> Missed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#e8f8d8] border border-[#b7e986]" /> Perfect day
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-[var(--blue)]" /> Today
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default StreakCalendar;
