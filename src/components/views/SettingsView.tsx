import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Globe,
  Bell,
  Calendar,
  Cloud,
  HardDrive,
  Trash2,
  RefreshCw,
  ShieldCheck,
  CheckCircle,
  Plus,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';
import { LanguageCode } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    theme,
    toggleTheme,
    solarPhase,
    sunHour,
    setSunHour,
    autoSunSync,
    setAutoSunSync,
    language,
    setLanguage,
    t,
    isOffline,
    toggleOfflineMode,
    cachedModulesCount,
    clearCache,
    syncOfflineCache,
    examDeadlines,
    addExamDeadline,
    deleteExamDeadline,
    exportStudyCalendarIcs,
    showToast,
  } = useApp();

  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamDate, setNewExamDate] = useState('2026-11-04');
  const [examAlertDays, setExamAlertDays] = useState(2);

  const formatSunTime = (h: number) => {
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim()) return;
    addExamDeadline({
      title: newExamTitle,
      subject: newExamSubject || 'AI Fundamentals',
      date: new Date(newExamDate).toISOString(),
      type: 'Exam',
      reminderDaysBefore: examAlertDays,
    });
    setNewExamTitle('');
    setNewExamSubject('');
    showToast('Upcoming exam deadline added to study schedule!');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="System Settings & Preferences"
        subtitle="Customize dynamic sun lighting themes, multilingual localization, offline cache sync, and calendar integrations."
        badge="Preferences"
      />

      {/* 1. Dynamic Sun Position & Solar Lighting Theme Engine */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Sun Position & Dynamic Lighting Theme</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The entire app's ambient lighting, celestial sky, and glass reflections change with the sun position.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-xl border border-cyan-500/30">
            {formatSunTime(sunHour)} • {solarPhase.toUpperCase()}
          </span>
        </div>

        {/* Sun Scrub Slider */}
        <div className="glass-panel p-4 rounded-2xl border border-white/20 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300 font-bold">
            <span className="flex items-center gap-1">🌅 06:00 Dawn</span>
            <span className="flex items-center gap-1">☀️ 12:00 Zenith</span>
            <span className="flex items-center gap-1">🌇 18:00 Sunset</span>
            <span className="flex items-center gap-1">🌙 24:00 Midnight</span>
          </div>
          <input
            type="range"
            min="0"
            max="23.9"
            step="0.25"
            value={sunHour}
            onChange={e => setSunHour(parseFloat(e.target.value))}
            aria-label="Solar position scrubber"
            className="w-full accent-cyan-500 h-2 bg-black/10 dark:bg-white/15 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Quick Presets & Real-time Auto-Sync */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: 'Dawn (06:30)', hour: 6.5, icon: <Sunrise className="w-4 h-4 text-rose-400" /> },
            { label: 'Midday Zenith (12:00)', hour: 12.0, icon: <Sun className="w-4 h-4 text-amber-400" /> },
            { label: 'Sunset (18:15)', hour: 18.25, icon: <Sunset className="w-4 h-4 text-orange-400" /> },
            { label: 'Midnight (23:30)', hour: 23.5, icon: <Moon className="w-4 h-4 text-indigo-400" /> },
          ].map(p => (
            <button
              key={p.label}
              onClick={() => setSunHour(p.hour)}
              className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                Math.abs(sunHour - p.hour) < 1.5
                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-200 border-cyan-400/50 shadow-sm'
                  : 'glass-button text-slate-700 dark:text-slate-300 hover:text-cyan-500'
              }`}
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Automatic Real-Time Sun Synchronization:</span>
          <button
            onClick={() => {
              const next = !autoSunSync;
              setAutoSunSync(next);
              if (next) {
                const now = new Date();
                setSunHour(now.getHours() + now.getMinutes() / 60);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              autoSunSync
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'glass-button text-slate-500 dark:text-slate-400'
            }`}
          >
            {autoSunSync ? '✓ Real-Time Tracking Active' : 'Manual Controller Active'}
          </button>
        </div>
      </div>

      {/* 2. Multi-Language Support */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Multi-Language Accessibility</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Translate UI controls and course headers across 8 global languages</p>
          </div>
          <Globe className="w-5 h-5 text-cyan-500" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { code: 'en', label: 'English (EN)' },
            { code: 'es', label: 'Español (ES)' },
            { code: 'hi', label: 'हिन्दी (HI)' },
            { code: 'bn', label: 'বাংলা (BN)' },
            { code: 'zh', label: '中文 (ZH)' },
            { code: 'ja', label: '日本語 (JA)' },
            { code: 'de', label: 'Deutsch (DE)' },
            { code: 'fr', label: 'Français (FR)' },
          ].map(l => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l.code as LanguageCode);
                showToast(`Language switched to ${l.label}`);
              }}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition cursor-pointer text-left ${
                language === l.code
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-400 shadow-md'
                  : 'glass-panel text-slate-700 dark:text-slate-300 hover:border-cyan-500/40'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Offline Mode & Local Storage Cache */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Offline Access & Cache Manager</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Store video transcripts and lecture notes locally for uninterrupted study</p>
          </div>
          <HardDrive className="w-5 h-5 text-teal-500" />
        </div>

        <div className="p-4 glass-panel border border-white/20 dark:border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Offline Mode Simulator:</span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  isOffline ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {isOffline ? 'OFFLINE ACTIVE' : 'ONLINE (CLOUD SYNCED)'}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Cached: {cachedModulesCount} study modules & 40 lecture notes (~18.4 MB in device storage)
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={syncOfflineCache}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-teal-600/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync All Offline</span>
            </button>
            <button
              onClick={clearCache}
              className="px-3.5 py-2 rounded-xl glass-button text-slate-600 dark:text-slate-400 hover:text-rose-500 font-bold text-xs transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Calendar Sync & Exam Deadlines */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Calendar Synchronization & Deadlines</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sync Europa exam milestones directly into Google Calendar, Apple, or Outlook</p>
          </div>
          <button
            onClick={exportStudyCalendarIcs}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <Calendar className="w-4 h-4" />
            <span>Export .ICS Calendar</span>
          </button>
        </div>

        {/* Existing exam deadlines list */}
        <div className="space-y-2">
          {examDeadlines.map(e => (
            <div
              key={e.id}
              className="p-3.5 rounded-2xl glass-panel border border-white/20 dark:border-white/10 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 dark:text-white text-sm">{e.title}</div>
                <div className="text-slate-500 dark:text-slate-400">
                  {e.subject} • Scheduled: {new Date(e.date).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20 font-bold">
                  Alert {e.reminderDaysBefore}d before
                </span>
                <button
                  onClick={() => deleteExamDeadline(e.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Exam Deadline Form */}
        <form onSubmit={handleAddExam} className="p-4 glass-panel rounded-2xl border border-white/20 dark:border-white/10 space-y-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Upcoming Exam / Capstone Milestone:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              value={newExamTitle}
              onChange={e => setNewExamTitle(e.target.value)}
              placeholder="Exam title..."
              className="glass-button border border-white/20 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-semibold"
            />
            <input
              type="text"
              value={newExamSubject}
              onChange={e => setNewExamSubject(e.target.value)}
              placeholder="Subject..."
              className="glass-button border border-white/20 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-semibold"
            />
            <input
              type="date"
              value={newExamDate}
              onChange={e => setNewExamDate(e.target.value)}
              className="glass-button border border-white/20 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-semibold"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-cyan-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Deadline</span>
            </button>
          </div>
        </form>
      </div>

      {/* 5. Cloud Backup & Data Security */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Automated Cloud Backup Status</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">All local study notes and badge telemetry backed up to Europa Cloud.</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <CheckCircle className="w-4 h-4" />
          <span>Synced 2m ago</span>
        </div>
      </div>
    </div>
  );
};
