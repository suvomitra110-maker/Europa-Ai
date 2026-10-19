import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ALL_WINDOW_MENU_OPTIONS,
  filterWindowMenuOptions,
} from '../../utils/futuristicEarthAsset';

interface HeaderProps {
  externalMenuOpen?: boolean;
  onExternalMenuChange?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  externalMenuOpen,
  onExternalMenuChange,
}) => {
  const { activeTab, setActiveTab, goBack } = useApp();
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isMenuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen;
  const setMenuOpen = (val: boolean) => {
    setInternalMenuOpen(val);
    if (onExternalMenuChange) onExternalMenuChange(val);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeWindowOption =
    ALL_WINDOW_MENU_OPTIONS.find(opt => opt.id === activeTab) || ALL_WINDOW_MENU_OPTIONS[0];

  const filteredOptions = filterWindowMenuOptions(menuSearch);
  const isHome = activeTab === 'home';

  return (
    <header
      className={
        isHome
          ? 'fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 pointer-events-none select-none'
          : 'relative h-16 border-b border-white/15 bg-slate-950 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-50 select-none'
      }
    >
      {/* Left Upper Side: "Select Workspace Station" Drop-Down */}
      <div
        className="relative z-10 flex items-center gap-3 shrink-0 pointer-events-auto"
        ref={dropdownRef}
      >
        <button
          type="button"
          data-testid="top-left-workspace-station-dropdown-btn"
          onClick={() => setMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          aria-label="Select Workspace Station"
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-white border border-cyan-400/50 shadow-xl backdrop-blur-md transition cursor-pointer whitespace-nowrap shrink-0"
        >
          <span className="text-xs font-bold tracking-tight text-white">
            Select Workspace Station
          </span>
          <span aria-hidden="true" className="text-slate-500 hidden sm:inline">
            ·
          </span>
          <span className="text-xs font-semibold text-cyan-300 max-w-[160px] truncate hidden sm:inline">
            {activeWindowOption.title}
          </span>
          <span className="text-[10px] font-mono text-cyan-300 ml-0.5">
            {isMenuOpen ? '▲' : '▼'}
          </span>
        </button>

        {!isHome && (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="text-sm sm:text-base font-extrabold tracking-tight text-white hover:text-cyan-300 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              Europa Ai
            </button>

            <button
              type="button"
              onClick={goBack}
              title="Go Back"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Back</span>
            </button>
          </>
        )}

        {/* Drop-Down Panel from Left Upper Side */}
        {isMenuOpen && (
          <div
            role="menu"
            data-testid="top-left-workspace-station-menu"
            aria-label="Select Workspace Station Menu"
            className="absolute left-0 top-full mt-2.5 w-[92vw] max-w-[740px] rounded-2xl bg-slate-950/98 border border-cyan-500/45 shadow-2xl p-4 sm:p-5 text-slate-100 z-50 backdrop-blur-2xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-white/10">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Select Workspace Station ({ALL_WINDOW_MENU_OPTIONS.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Choose any workspace station from the left upper drop-down menu
                </p>
              </div>

              <div className="relative w-full sm:w-60">
                <input
                  type="text"
                  value={menuSearch}
                  onChange={e => setMenuSearch(e.target.value)}
                  placeholder="Filter workspace stations..."
                  aria-label="Filter workspace stations"
                  className="w-full bg-slate-900 border border-white/15 rounded-xl py-1.5 px-3 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[70vh] overflow-y-auto pr-1">
              {filteredOptions.map((option, idx) => {
                const isSelected = activeTab === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setActiveTab(option.id);
                      setMenuOpen(false);
                      setMenuSearch('');
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                        : 'bg-slate-900/80 hover:bg-slate-800/95 border-white/10 text-slate-200'
                    }`}
                  >
                    <span className="text-[11px] font-mono font-bold text-cyan-400 shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{option.title}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {option.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right side button only on non-home workspaces */}
      {!isHome && (
        <div className="relative z-10 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer whitespace-nowrap shrink-0"
          >
            Home Page
          </button>
        </div>
      )}
    </header>
  );
};
