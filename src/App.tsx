import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { SolarSkyBackground } from './components/layout/SolarSkyBackground';
import { SolarControllerDock } from './components/layout/SolarControllerDock';
import { QuickCaptureFAB } from './components/layout/QuickCaptureFAB';

import { LibraryView } from './components/views/LibraryView';
import { DashboardView } from './components/views/DashboardView';
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

import { NpcDialogModal } from './components/modals/NpcDialogModal';
import { AuthModal } from './components/modals/AuthModal';
import { VideoPlayerModal } from './components/modals/VideoPlayerModal';

const MainAppContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'library':
        return <LibraryView />;
      case 'dashboard':
        return <DashboardView />;
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
        return <LibraryView />;
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-500 relative selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Celestial Sun & Sky Background */}
      <SolarSkyBackground />

      {/* Glass Navigation Header */}
      <Header />

      {/* Main Workspace with Glass Transparency */}
      <div className="flex-1 flex overflow-hidden relative z-10 pb-16 md:pb-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-transparent relative z-10">
          {renderActiveView()}
        </main>
      </div>

      {/* Cross-Platform Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating Interactive Sun Controller Dock */}
      <SolarControllerDock />

      {/* Global Quick Capture FAB (Voice & AI Subject Organization) */}
      <QuickCaptureFAB />

      {/* Global Interactive Modals */}
      <NpcDialogModal />
      <AuthModal />
      <VideoPlayerModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 max-w-md glass-card border border-cyan-500/50 text-slate-900 dark:text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_10px_#38bdf8]" />
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
