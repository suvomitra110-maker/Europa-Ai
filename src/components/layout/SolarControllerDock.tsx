import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SolarControllerDock: React.FC = () => {
  const {
    sunHour,
    solarPhase,
    setSunHour,
    autoSunSync,
    setAutoSunSync,
    theme,
    toggleTheme,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (h: number) => {
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const presets = [
    { label: 'Dawn', icon: <Sunrise className="w-3.5 h-3.5 text-rose-400" />, hour: 6.5, phase: 'dawn' },
    { label: 'Zenith', icon: <Sun className="w-3.5 h-3.5 text-amber-400" />, hour: 12.0, phase: 'day' },
    { label: 'Sunset', icon: <Sunset className="w-3.5 h-3.5 text-orange-400" />, hour: 18.25, phase: 'sunset' },
    { label: 'Midnight', icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />, hour: 23.5, phase: 'night' },
  ];

  const getPhaseName = () => {
    switch (solarPhase) {
      case 'dawn':
        return 'Solar Dawn';
      case 'day':
        return 'Solar Zenith (Day)';
      case 'sunset':
        return 'Golden Sunset';
      default:
        return 'Cosmic Midnight';
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-6 z-40 select-none">
      {/* Expanded Sun Controller Glass Card */}
      {isExpanded && (
        <div className="mb-2 w-80 glass-card p-4 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-2xl text-slate-800 dark:text-slate-100 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/15 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white shadow-md">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-tight">{getPhaseName()}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Theme shifts with Sun trajectory
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-black text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-500/20 px-2 py-0.5 rounded-lg border border-cyan-500/30">
              {formatTime(sunHour)}
            </span>
          </div>

          {/* Interactive Sun Scrub Slider */}
          <div className="py-3 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span>00:00 Night</span>
              <span>12:00 Noon</span>
              <span>24:00</span>
            </div>
            <input
              type="range"
              min="0"
              max="23.9"
              step="0.25"
              value={sunHour}
              onChange={e => setSunHour(parseFloat(e.target.value))}
              aria-label="Sun position scrubber"
              className="w-full accent-cyan-500 h-1.5 bg-black/10 dark:bg-white/15 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Instant Preset Buttons */}
          <div className="grid grid-cols-4 gap-1.5 pb-3">
            {presets.map(p => {
              const isActive = Math.abs(sunHour - p.hour) < 1.5;
              return (
                <button
                  key={p.label}
                  onClick={() => setSunHour(p.hour)}
                  className={`flex flex-col items-center gap-1 py-1.5 px-1 rounded-xl text-[10px] font-bold transition cursor-pointer border ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-200 border-cyan-400/50 shadow-sm'
                      : 'glass-button text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Real-time Sun Position Auto Sync */}
          <div className="pt-2.5 border-t border-white/15 dark:border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              Auto Local Sun Sync
            </span>
            <button
              onClick={() => {
                const next = !autoSunSync;
                setAutoSunSync(next);
                if (next) {
                  const now = new Date();
                  setSunHour(now.getHours() + now.getMinutes() / 60);
                }
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                autoSunSync
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'glass-button text-slate-500 dark:text-slate-400'
              }`}
            >
              {autoSunSync && <Check className="w-3 h-3 text-emerald-500" />}
              <span>{autoSunSync ? 'Real-Time Active' : 'Manual Mode'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        title="Sun Position & Dynamic Theme Controller"
        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-card border border-white/20 dark:border-white/10 shadow-xl text-slate-800 dark:text-slate-100 hover:border-cyan-500/50 transition cursor-pointer backdrop-blur-xl group"
      >
        <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:rotate-45 transition-transform duration-300">
          <Sun className="w-3 h-3" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-bold leading-none flex items-center gap-1">
            <span>Sun: {formatTime(sunHour)}</span>
            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-mono">
              {solarPhase}
            </span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>
    </div>
  );
};
