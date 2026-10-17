import React from 'react';
import { ArrowLeft, Compass, Sun, Sunrise, Sunset, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PageHeaderWithBackProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: React.ReactNode;
}

export const PageHeaderWithBack: React.FC<PageHeaderWithBackProps> = ({
  title,
  subtitle,
  badge,
  children,
}) => {
  const { goBack, solarPhase } = useApp();

  const getSolarBadge = () => {
    switch (solarPhase) {
      case 'dawn':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase bg-rose-500/10 text-rose-500 dark:text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-bold">
            <Sunrise className="w-3 h-3" /> Dawn Atmosphere
          </span>
        );
      case 'day':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/30 px-2.5 py-0.5 rounded-full font-bold">
            <Sun className="w-3 h-3" /> Solar Zenith
          </span>
        );
      case 'sunset':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
            <Sunset className="w-3 h-3" /> Twilight Dusk
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
            <Moon className="w-3 h-3" /> Midnight Sky
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 select-none">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          {/* Universal Back Button */}
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 cursor-pointer shadow-sm transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          {badge && (
            <span className="text-[10px] font-mono uppercase bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {badge}
            </span>
          )}

          {getSolarBadge()}
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {children && <div className="flex items-center gap-2 self-start sm:self-auto">{children}</div>}
    </div>
  );
};
