import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { SolarSkyBackground } from './components/layout/SolarSkyBackground';

import { WelcomeHomeView } from './components/views/WelcomeHomeView';
import { LibraryView } from './components/views/LibraryView';
import { DashboardView } from './components/views/DashboardView';
import { QuantTradingView } from './components/views/QuantTradingView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { NonTechnicalTrackView } from './components/views/NonTechnicalTrackView';
import { NewsView } from './components/views/NewsView';
import { ContestsView } from './components/views/ContestsView';
import { ForumView } from './components/views/ForumView';
import { ScanTransferView } from './components/views/ScanTransferView';
import { AiSummarizerView } from './components/views/AiSummarizerView';
import { CollaborativeDocView } from './components/views/CollaborativeDocView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';
import { GameArenaView } from './components/views/GameArenaView';

import { NpcDialogModal } from './components/modals/NpcDialogModal';
import { AuthModal } from './components/modals/AuthModal';
import { VideoPlayerModal } from './components/modals/VideoPlayerModal';

const MainAppContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();
  const [isTopLeftMenuOpen, setIsTopLeftMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <WelcomeHomeView onOpenTopLeftMenu={() => setIsTopLeftMenuOpen(true)} />;
      case 'library':
        return <LibraryView />;
      case 'dashboard':
        return <DashboardView />;
      case 'quant-trading':
        return <QuantTradingView />;
      case 'games':
        return <GameArenaView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'non-technical':
        return <NonTechnicalTrackView />;
      case 'news':
        return <NewsView />;
      case 'contests':
        return <ContestsView />;
      case 'forum':
        return <ForumView />;
      case 'scan-transfer':
        return <ScanTransferView />;
      case 'summarizer':
        return <AiSummarizerView />;
      case 'collaborative-doc':
        return <CollaborativeDocView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <WelcomeHomeView onOpenTopLeftMenu={() => setIsTopLeftMenuOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-500 relative selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Celestial Sun & Sky Background */}
      <SolarSkyBackground />

      {/* Futuristic Earth Header with Top-Left All-Windows Dropdown Menu */}
      {activeTab !== 'games' && (
        <Header
          externalMenuOpen={isTopLeftMenuOpen}
          onExternalMenuChange={setIsTopLeftMenuOpen}
        />
      )}

      {/* Clean Full-Width Workspace (Widget-Free, Navigated via Top-Left Menu) */}
      <div className="flex-1 flex overflow-hidden relative z-10 pb-16 md:pb-0">
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-transparent relative z-10">
          {renderActiveView()}
        </main>
      </div>

      {/* Cross-Platform Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Interactive Modals */}
      <NpcDialogModal />
      <AuthModal />
      <VideoPlayerModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 max-w-md glass-card border border-cyan-500/50 text-slate-900 dark:text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-300">
          <p className="text-xs font-semibold leading-snug">{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
