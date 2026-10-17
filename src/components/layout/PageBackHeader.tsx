import React from 'react';
import { ArrowLeft, Compass, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';

interface PageBackHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: React.ReactNode;
}

export const PageBackHeader: React.FC<PageBackHeaderProps> = ({
  title,
  subtitle,
  badge,
  children,
}) => {
  const { goBack, navigationHistory, solarPhase, sunHour } = useApp();

  const previousTab = navigationHistory[0] || 'library';

  const getTabDisplayName = (tab: ActiveTab): string => {
    switch (tab) {
      case 'library':
        return '3D Voxel Library';
      case 'dashboard':
        return 'Dashboard';
      case 'analytics':
        return 'Analytics';
      case 'non-technical':
        return 'Non-Technical Track';
      case 'news':
        return 'Daily AI News';
      case 'forum':
        return 'Community Forum';
      case 'scan-transfer':
        return 'P2P Transfer';
      case 'summarizer':
        return 'AI Summarizer';
      case 'collaborative-doc':
        return 'Study Canvas';
      case 'profile':
        return 'Profile';
      case 'settings':
        return 'Settings';
      default:
        return 'Previous View';
    }
  };

  const formatSunTime = (h: number) => {
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getSolarIcon = () => {
    switch (solarPhase) {
      case 'dawn':
        return <Sunrise className="w-3.5 h-3.5 text-rose-400" />;
      case 'day':
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'sunset':
        return <Sunset className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full glass-card rounded-3xl p-4 sm:p-5 mb-6 border border-white/20 dark:border-white/10 shadow-lg relative overflow-hidden backdrop-blur-xl transition-all duration-300">
      {/* Subtle solar illumination edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Prominent Back Option & Title with Breadcrumbs */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          {/* Prominent Back Button */}
          <button
            onClick={goBack}
            title={`Back to ${getTabDisplayName(previousTab)}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-button text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-cyan-500 dark:hover:text-cyan-400 cursor-pointer shadow-sm transition-all group shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-500 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
            <span className="hidden xl:inline text-[10px] text-slate-500 dark:text-slate-400 font-normal">
              to {getTabDisplayName(previousTab)}
            </span>
          </button>

          {/* Title & Minimalist Breadcrumbs */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">Europa Ai</span>
              <span>/</span>
              <span className="truncate max-w-[200px]">{title}</span>
              {badge && (
                <span className="text-[10px] uppercase font-mono bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold ml-1">
                  {badge}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
              {title}
            </h1>

            {subtitle && (
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Custom View Controls & Solar Status Badge */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          {children}

          {/* Minimalist Solar Status Pill */}
          <div
            title={`Solar Lighting: ${solarPhase.toUpperCase()} (${formatSunTime(sunHour)})`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-button text-[11px] font-mono text-slate-700 dark:text-slate-300 select-none"
          >
            {getSolarIcon()}
            <span className="font-semibold capitalize">{solarPhase}</span>
            <span className="opacity-60">{formatSunTime(sunHour)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
