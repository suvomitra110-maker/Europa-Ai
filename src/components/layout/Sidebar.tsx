import React from 'react';
import {
  Box,
  LayoutDashboard,
  BarChart3,
  Briefcase,
  Newspaper,
  MessageSquare,
  QrCode,
  FileText,
  Users,
  User,
  Settings,
  Flame,
  Trophy,
  TrendingUp,
  Gamepad2,
} from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, t, badges, user, quantStrategies } = useApp();

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const completedQuantCount = quantStrategies.filter(q => q.completed).length;

  const navItems: { id: ActiveTab; labelKey: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'library', labelKey: 'library', icon: <Box className="w-4 h-4" />, badge: '3D Voxel' },
    { id: 'dashboard', labelKey: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'quant-trading', labelKey: 'quantTrading', icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, badge: `${completedQuantCount}/${quantStrategies.length}` },
    { id: 'games', labelKey: 'aiGames', icon: <Gamepad2 className="w-4 h-4 text-rose-500" />, badge: '2D & 3D' },
    { id: 'analytics', labelKey: 'analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'non-technical', labelKey: 'nonTechnical', icon: <Briefcase className="w-4 h-4" />, badge: 'No-Code' },
    { id: 'news', labelKey: 'aiNews', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'contests', labelKey: 'aiContests', icon: <Trophy className="w-4 h-4 text-amber-500" />, badge: '🇮🇳 & Global' },
    { id: 'forum', labelKey: 'forum', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'scan-transfer', labelKey: 'scanTransfer', icon: <QrCode className="w-4 h-4" />, badge: 'P2P' },
    { id: 'summarizer', labelKey: 'aiSummarizer', icon: <FileText className="w-4 h-4" /> },
    { id: 'collaborative-doc', labelKey: 'collaborativeDoc', icon: <Users className="w-4 h-4" /> },
    { id: 'profile', labelKey: 'profile', icon: <User className="w-4 h-4" />, badge: `${unlockedCount}/${badges.length}` },
    { id: 'settings', labelKey: 'settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-white/10 dark:border-white/10 glass-panel hidden md:flex flex-col justify-between p-3.5 select-none shrink-0 overflow-y-auto transition-colors z-20">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
          Study Modules
        </div>

        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer group ${
                isActive
                  ? 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 shadow-sm backdrop-blur-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/30 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? 'text-cyan-500 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>
                  {item.icon}
                </span>
                <span>{t(item.labelKey)}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-200 border border-cyan-400/30'
                      : 'bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Study Status Box in Translucent Minimalist Glass */}
      <div className="pt-3 mt-3 border-t border-white/10">
        <div className="glass-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase font-bold tracking-wider">
              Study Sprint
            </span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-white">Daily Target: 45m / 60m</div>
          <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-cyan-400 h-full w-[75%]" />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
            <span>Streak: {user.streakDays}d</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">+60 XP</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
