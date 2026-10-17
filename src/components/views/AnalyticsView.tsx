import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Brain,
  CheckCircle,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';

export const AnalyticsView: React.FC = () => {
  const { user } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const weeklyData = [
    { day: 'Mon', minutes: 45, target: 45, completed: true },
    { day: 'Tue', minutes: 60, target: 45, completed: true },
    { day: 'Wed', minutes: 50, target: 45, completed: true },
    { day: 'Thu', minutes: 75, target: 45, completed: true },
    { day: 'Fri', minutes: 65, target: 45, completed: true },
    { day: 'Sat', minutes: 40, target: 45, completed: false },
    { day: 'Sun', minutes: 30, target: 45, completed: false },
  ];

  const skillMastery = [
    { skill: 'Transformer Self-Attention', level: 92, color: '#8b5cf6' },
    { skill: 'LoRA & PEFT Fine-Tuning', level: 85, color: '#06b6d4' },
    { skill: 'RLHF & Alignment Guardrails', level: 68, color: '#f43f5e' },
    { skill: 'ROS2 & 3D LiDAR Perception', level: 55, color: '#10b981' },
    { skill: 'Robotic Manipulator Kinematics', level: 48, color: '#f59e0b' },
    { skill: 'Non-Technical AI Strategy', level: 88, color: '#3b82f6' },
  ];

  const totalMinutes = weeklyData.reduce((acc, curr) => acc + curr.minutes, 0);
  const targetMinutes = 45 * 7;
  const attainmentPercent = Math.round((totalMinutes / targetMinutes) * 100);

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="Learning Analytics & Attainment"
        subtitle="Quantitative assessment of study sprints, cognitive retention, and topic mastery."
        badge="Performance Intelligence"
      >
        {/* Time Filter Tabs */}
        <div className="glass-panel border border-white/20 dark:border-white/10 p-1 rounded-2xl flex items-center">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              timeRange === 'week' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              timeRange === 'month' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Past 30 Days
          </button>
        </div>
      </PageBackHeader>

      {/* Top 4 KPI Metrics in Translucent Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card border border-white/20 dark:border-white/10 p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Study Hours</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{(totalMinutes / 60).toFixed(1)} hrs</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">+18% vs last week</div>
          </div>
        </div>

        <div className="glass-card border border-white/20 dark:border-white/10 p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Goal Attainment</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{attainmentPercent}%</div>
            <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">365 / 315 min target</div>
          </div>
        </div>

        <div className="glass-card border border-white/20 dark:border-white/10 p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Retention Index</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">94.2%</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Spaced repetition score</div>
          </div>
        </div>

        <div className="glass-card border border-white/20 dark:border-white/10 p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quiz Checkpoints</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">18 / 20</div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">90% accuracy</div>
          </div>
        </div>
      </div>

      {/* Main Weekly Goal Attainment Bar Chart */}
      <div className="glass-card border border-white/20 dark:border-white/10 p-6 sm:p-7 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Study Minutes vs Target</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Target: 45 minutes / day</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-gradient-to-t from-cyan-600 to-indigo-500 inline-block shadow-sm" />
              <span>Minutes Studied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-400 dark:bg-slate-600 inline-block" />
              <span>Daily Goal (45m)</span>
            </div>
          </div>
        </div>

        {/* Interactive Custom SVG / HTML Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-4 border-b border-black/10 dark:border-white/10">
          {weeklyData.map((d, i) => {
            const maxMins = 80;
            const barHeightPct = Math.min(Math.round((d.minutes / maxMins) * 100), 100);
            const targetLinePct = Math.round((45 / maxMins) * 100);

            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity glass-card border border-white/20 dark:border-white/10 text-slate-900 dark:text-white text-[11px] font-mono px-2 py-1 rounded-xl shadow-lg pointer-events-none whitespace-nowrap z-10">
                  {d.day}: {d.minutes} mins {d.minutes >= 45 ? '✓ Target Met' : 'Below Target'}
                </div>

                {/* Target marker dashed line indicator */}
                <div
                  className="w-full absolute left-0 right-0 border-b border-dashed border-slate-400/50 dark:border-slate-600/60 pointer-events-none"
                  style={{ bottom: `${targetLinePct}%` }}
                />

                {/* Bar */}
                <div
                  className={`w-full max-w-[42px] rounded-t-xl transition-all duration-700 group-hover:brightness-110 cursor-pointer ${
                    d.minutes >= 45
                      ? 'bg-gradient-to-t from-cyan-600 to-indigo-500 shadow-md shadow-cyan-500/20'
                      : 'bg-gradient-to-t from-slate-400 to-slate-500 dark:from-slate-700 dark:to-slate-600'
                  }`}
                  style={{ height: `${barHeightPct}%` }}
                />

                {/* Day label */}
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mt-3 group-hover:text-cyan-500 transition">
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain Skill Mastery Breakdown */}
      <div className="glass-card border border-white/20 dark:border-white/10 p-6 sm:p-7 rounded-3xl shadow-xl space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Domain Competency & Skill Mastery</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Continuous skill evaluation based on quiz submissions and lecture completions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skillMastery.map((item, idx) => (
            <div key={idx} className="glass-panel border border-white/20 dark:border-white/10 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200">{item.skill}</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">{item.level}%</span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.level}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
