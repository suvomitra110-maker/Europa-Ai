import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Box,
  Briefcase,
  ChevronDown,
  FileText,
  Gamepad2,
  Home,
  LayoutDashboard,
  LayoutGrid,
  MessageSquare,
  Newspaper,
  QrCode,
  Search,
  Settings,
  TrendingUp,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  ALL_WINDOW_MENU_OPTIONS,
  filterWindowMenuOptions,
  FUTURISTIC_EARTH_HEADER_DATA_URI,
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

  const getWindowIcon = (id: ActiveTab) => {
    switch (id) {
      case 'home':
        return <Home className="w-4 h-4 text-cyan-400" />;
      case 'library':
        return <Box className="w-4 h-4 text-cyan-400" />;
      case 'dashboard':
        return <LayoutDashboard className="w-4 h-4 text-sky-400" />;
      case 'quant-trading':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'games':
        return <Gamepad2 className="w-4 h-4 text-rose-400" />;
      case 'analytics':
        return <BarChart3 className="w-4 h-4 text-indigo-400" />;
      case 'non-technical':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'news':
        return <Newspaper className="w-4 h-4 text-cyan-400" />;
      case 'contests':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'forum':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'scan-transfer':
        return <QrCode className="w-4 h-4 text-teal-400" />;
      case 'summarizer':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'collaborative-doc':
        return <Users className="w-4 h-4 text-pink-400" />;
      case 'profile':
        return <User className="w-4 h-4 text-cyan-400" />;
      case 'settings':
        return <Settings className="w-4 h-4 text-slate-300" />;
      default:
        return <Home className="w-4 h-4 text-cyan-400" />;
    }
  };

  const activeWindowOption =
    ALL_WINDOW_MENU_OPTIONS.find(opt => opt.id === activeTab) || ALL_WINDOW_MENU_OPTIONS[0];

  const filteredOptions = filterWindowMenuOptions(menuSearch);

  return (
    <header className="relative h-16 sm:h-20 border-b border-white/15 bg-slate-950 px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-6 sticky top-0 z-50 select-none">
      {/* Futuristic Earth Picture Backdrop in Header */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={FUTURISTIC_EARTH_HEADER_DATA_URI}
          alt="Futuristic Earth Orbital Header Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/90" />
      </div>

      {/* Zone 1 (Top-Left): All Windows Dropdown Menu + Clean Brand Wordmark */}
      <div className="relative z-10 flex items-center gap-2 sm:gap-3 shrink-0" ref={dropdownRef}>
        {/* Top-Left Dropdown Trigger containing ALL Windows Options */}
        <button
          type="button"
          onClick={() => setMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          aria-label="Open All Windows Menu"
          className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/95 text-white border border-cyan-400/40 shadow-lg transition cursor-pointer whitespace-nowrap shrink-0"
        >
          <LayoutGrid className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold tracking-tight">Windows Menu</span>
          <span aria-hidden="true" className="text-slate-500 hidden sm:inline">
            ·
          </span>
          <span className="text-xs font-medium text-cyan-300 max-w-[140px] truncate hidden sm:inline">
            {activeWindowOption.title}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-cyan-300 transition-transform duration-200 ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Clean Single-Line Brand Wordmark */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="text-sm sm:text-lg font-extrabold tracking-tight text-white hover:text-cyan-300 transition cursor-pointer whitespace-nowrap shrink-0"
        >
          Europa Ai
        </button>

        {activeTab !== 'home' && (
          <button
            type="button"
            onClick={goBack}
            title="Go Back"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Back</span>
          </button>
        )}

        {/* Top-Left Dropdown Panel: Keeps ALL 15 Windows Options in Menu */}
        {isMenuOpen && (
          <div
            role="menu"
            aria-label="All Windows Navigation Menu"
            className="absolute left-0 top-full mt-2.5 w-[92vw] max-w-[760px] rounded-2xl bg-slate-950/98 border border-cyan-500/35 shadow-2xl p-4 sm:p-5 text-slate-100 z-50 backdrop-blur-2xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-white/10">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">
                  All Windows & Workspaces ({ALL_WINDOW_MENU_OPTIONS.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Select any window option below to switch workspaces immediately
                </p>
              </div>

              {/* Instant Filter Input inside Dropdown */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={e => setMenuSearch(e.target.value)}
                  placeholder="Filter windows..."
                  aria-label="Filter windows in menu"
                  className="w-full bg-slate-900 border border-white/15 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Grid of All 15 Windows Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[70vh] overflow-y-auto pr-1">
              {filteredOptions.map(option => {
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
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                        : 'bg-slate-900/75 hover:bg-slate-800/90 border-white/10 text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-950/90 border border-white/10 shrink-0 mt-0.5">
                      {getWindowIcon(option.id)}
                    </div>
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

      {/* Zone 2 (Center): Framed Futuristic Earth Picture in Header */}
      <div
        onClick={() => setActiveTab('home')}
        className="relative z-10 hidden md:flex items-center gap-3.5 px-3 py-1.5 rounded-2xl bg-slate-950/75 border border-cyan-400/30 cursor-pointer hover:border-cyan-300/60 transition group"
      >
        <div className="w-24 h-11 rounded-xl overflow-hidden border border-cyan-400/40 shrink-0 bg-slate-950">
          <img
            src={FUTURISTIC_EARTH_HEADER_DATA_URI}
            alt="Futuristic Earth in Header"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="pr-1">
          <div className="text-xs font-bold text-white tracking-tight whitespace-nowrap">
            Futuristic Earth · Orbital Sanctuary
          </div>
          <div className="text-[11px] text-cyan-300 font-medium whitespace-nowrap">
            Planetary Horizon 3026 · Home View
          </div>
        </div>
      </div>

      {/* Zone 3 (Right): Single Clean Primary Action */}
      <div className="relative z-10 flex items-center gap-2 shrink-0">
        {activeTab !== 'home' ? (
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer whitespace-nowrap shrink-0"
          >
            Welcome Home
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs transition cursor-pointer whitespace-nowrap shrink-0"
          >
            Theme Studio
          </button>
        )}
      </div>
    </header>
  );
};
