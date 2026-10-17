import React from 'react';
import { Box, LayoutDashboard, Newspaper, Trophy, FileText, User } from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const mobileItems: { id: ActiveTab; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'library', labelKey: 'library', icon: <Box className="w-5 h-5" /> },
    { id: 'dashboard', labelKey: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'contests', labelKey: 'aiContests', icon: <Trophy className="w-5 h-5 text-amber-400" /> },
    { id: 'news', labelKey: 'aiNews', icon: <Newspaper className="w-5 h-5" /> },
    { id: 'summarizer', labelKey: 'aiSummarizer', icon: <FileText className="w-5 h-5" /> },
    { id: 'profile', labelKey: 'profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 border-t border-slate-800 backdrop-blur-lg flex items-center justify-around px-2 z-40 select-none">
      {mobileItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition cursor-pointer ${
              isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium mt-1 truncate max-w-[56px]">{t(item.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
};
