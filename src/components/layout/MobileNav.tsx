import React from 'react';
import { Home, Box, LayoutDashboard, Gamepad2, TrendingUp, User } from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const mobileItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'library', label: t('library'), icon: <Box className="w-5 h-5" /> },
    { id: 'dashboard', label: t('dashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'quant-trading', label: 'Quant', icon: <TrendingUp className="w-5 h-5 text-emerald-400" /> },
    { id: 'games', label: 'Games', icon: <Gamepad2 className="w-5 h-5 text-rose-400" /> },
    { id: 'profile', label: t('profile'), icon: <User className="w-5 h-5" /> },
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
            <span className="text-[10px] font-medium mt-1 truncate max-w-[56px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
