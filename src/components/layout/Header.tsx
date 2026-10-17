import React, { useState } from 'react';
import {
  Flame,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Wifi,
  WifiOff,
  User as UserIcon,
  Globe,
  Calendar,
  ArrowLeft,
  Sliders,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types';

export const Header: React.FC = () => {
  const {
    user,
    theme,
    toggleTheme,
    solarPhase,
    sunHour,
    autoSunSync,
    setSunHour,
    setAutoSunSync,
    language,
    setLanguage,
    t,
    isOffline,
    toggleOfflineMode,
    setShowAuthModal,
    activeTab,
    setActiveTab,
    goBack,
    exportStudyCalendarIcs,
  } = useApp();

  const [showSolarPopover, setShowSolarPopover] = useState(false);
  const xpPercent = Math.min(Math.round((user.xp / user.nextLevelXp) * 100), 100);

  const formatSunTime = (h: number) => {
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getSolarIcon = () => {
    switch (solarPhase) {
      case 'dawn':
        return <Sunrise className="w-4 h-4 text-rose-400" />;
      case 'day':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'sunset':
        return <Sunset className="w-4 h-4 text-orange-400" />;
      default:
        return <Moon className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getSolarLabel = () => {
    switch (solarPhase) {
      case 'dawn':
        return 'Solar Dawn';
      case 'day':
        return 'Solar Zenith';
      case 'sunset':
        return 'Golden Sunset';
      default:
        return 'Midnight Sky';
    }
  };

  return (
    <header className="h-16 border-b border-white/10 dark:border-white/10 glass-panel px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors select-none">
      {/* Brand logo & Universal Back button */}
      <div className="flex items-center gap-3">
        {/* Universal Back button on Every Page */}
        <button
          onClick={goBack}
          title="Go Back to Previous Page"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-cyan-500 dark:hover:text-cyan-400 cursor-pointer shadow-sm transition group"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-500 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back</span>
        </button>

        <div
          onClick={() => setActiveTab('library')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-lg tracking-tighter font-mono">E</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition">
                Europa Ai
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-indigo-950/60 text-indigo-300 border border-indigo-700/40 px-2 py-0.5 rounded-full font-semibold">
                v2.4
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center status items: Sun Position Theme Widget, Streak, Offline Indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dynamic Sun Position Widget (Changes theme based on Sun) */}
        <div className="relative">
          <button
            onClick={() => setShowSolarPopover(!showSolarPopover)}
            title="Sun Position & Dynamic Solar Lighting Engine"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-sm hover:border-cyan-500/50 transition"
          >
            {getSolarIcon()}
            <span className="hidden md:inline font-mono text-[11px] font-bold">{formatSunTime(sunHour)}</span>
            <span className="hidden lg:inline text-[11px] opacity-80 capitalize">({getSolarLabel()})</span>
          </button>

          {/* Sun Control Popover */}
          {showSolarPopover && (
            <div className="absolute right-0 top-12 w-72 glass-card p-4 rounded-2xl shadow-2xl z-50 text-slate-800 dark:text-slate-100 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {getSolarIcon()}
                  <div>
                    <h4 className="text-xs font-bold">{getSolarLabel()}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Sun Position Theme Controller</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-500 dark:text-cyan-400">
                  {formatSunTime(sunHour)}
                </span>
              </div>

              {/* Sun Hour Scrubber Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>🌅 06:00</span>
                  <span>☀️ 12:00</span>
                  <span>🌇 18:00</span>
                  <span>🌙 24:00</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="23.9"
                  step="0.25"
                  value={sunHour}
                  onChange={e => setSunHour(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Real-time Sun Position Auto Sync */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-600 dark:text-slate-400">Auto Sun Position Sync</span>
                <button
                  onClick={() => {
                    setAutoSunSync(!autoSunSync);
                    if (!autoSunSync) {
                      const now = new Date();
                      setSunHour(now.getHours() + now.getMinutes() / 60);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                    autoSunSync
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent'
                  }`}
                >
                  {autoSunSync && <Check className="w-3 h-3" />}
                  <span>{autoSunSync ? 'Real-Time Active' : 'Manual Slider'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Streak Pill */}
        <div
          onClick={() => setActiveTab('dashboard')}
          title="Daily Study Streak"
          className="flex items-center gap-1.5 glass-button text-amber-500 dark:text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer hover:border-amber-500/40 transition shadow-sm"
        >
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span>{user.streakDays}</span>
          <span className="hidden sm:inline text-[11px] font-medium opacity-80">{t('streak')}</span>
        </div>

        {/* Offline Mode Pill */}
        <button
          onClick={toggleOfflineMode}
          title={isOffline ? 'Offline Mode Active' : 'Online Sync Active'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
            isOffline
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
          }`}
        >
          {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{isOffline ? t('offlineMode') : t('onlineMode')}</span>
        </button>

        {/* Quick Calendar Sync */}
        <button
          onClick={exportStudyCalendarIcs}
          title={t('syncCalendar')}
          className="p-2 rounded-xl glass-button text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition cursor-pointer hidden sm:flex items-center justify-center"
        >
          <Calendar className="w-4 h-4 text-cyan-500" />
        </button>

        {/* Multi-language Selector */}
        <div className="relative">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as LanguageCode)}
            aria-label="Language selector"
            className="appearance-none glass-button text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl py-1.5 pl-7 pr-3 focus:outline-none cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="hi">HI</option>
            <option value="bn">BN</option>
            <option value="zh">ZH</option>
            <option value="ja">JA</option>
            <option value="de">DE</option>
            <option value="fr">FR</option>
          </select>
          <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dark/Light mode manual toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl glass-button text-slate-700 dark:text-slate-300 hover:text-amber-400 transition cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* User Auth Profile Trigger */}
        {user.provider === 'guest' ? (
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow cursor-pointer transition flex items-center gap-1.5"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{t('signIn')}</span>
          </button>
        ) : (
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full ring-2 ring-indigo-500/50 object-cover group-hover:scale-105 transition"
            />
          </div>
        )}
      </div>
    </header>
  );
};
