import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Badge,
  ContestItem,
  CourseModule,
  DailyNewsItem,
  ExamDeadline,
  ForumPost,
  LanguageCode,
  NpcInfo,
  PeerMessage,
  QuantStrategyItem,
  SolarPhase,
  StepWiseLearningItem,
  StudyNote,
  UserProfile,
  VideoLecture,
} from '../types';
import {
  courseModules as initialModules,
  dailyNews as initialNews,
  examDeadlines as initialExams,
  initialBadges,
  initialContests,
  initialForumPosts,
  initialNotes,
  initialProfile,
  initialQuantStrategies,
  initialStepWisePlans,
  npcList,
} from '../data/initialData';
import { translations } from '../i18n/translations';
import {
  AchievementMilestoneProgress,
  applyXpGain,
  DESIGN_THEMES,
  DesignThemeConfig,
  DesignThemeId,
  evaluateAchievementMilestones,
  resolveDesignTheme,
  resolveSolarPreset,
} from '../utils/progressionLogic';

export type ActiveTab =
  | 'home'
  | 'library'
  | 'dashboard'
  | 'quant-trading'
  | 'games'
  | 'ai-guide'
  | 'analytics'
  | 'non-technical'
  | 'news'
  | 'contests'
  | 'forum'
  | 'scan-transfer'
  | 'summarizer'
  | 'collaborative-doc'
  | 'profile'
  | 'settings';

export interface GameStats {
  highScore2D: number;
  highScore3D: number;
  gamesPlayed: number;
  totalOrbsCollected: number;
  totalGameXpEarned: number;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  goBack: () => void;
  navigationHistory: ActiveTab[];
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  designTheme: DesignThemeId;
  previewDesignTheme: DesignThemeId | null;
  activeDesignThemeConfig: DesignThemeConfig;
  setDesignTheme: (themeId: DesignThemeId) => void;
  setPreviewDesignTheme: (themeId: DesignThemeId | null) => void;
  solarPhase: SolarPhase;
  sunHour: number;
  autoSunSync: boolean;
  setSunHour: (hour: number) => void;
  setAutoSunSync: (val: boolean) => void;
  setSolarPreset: (preset: SolarPhase) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isOffline: boolean;
  toggleOfflineMode: () => void;
  cachedModulesCount: number;
  clearCache: () => void;
  syncOfflineCache: () => void;
  badges: Badge[];
  unlockBadge: (badgeId: string) => void;
  achievementMilestones: AchievementMilestoneProgress[];
  modules: CourseModule[];
  completeLesson: (moduleId: string, lectureId: string) => void;
  quantStrategies: QuantStrategyItem[];
  toggleQuantStrategyComplete: (strategyId: string) => void;
  activeLecture: VideoLecture | null;
  setActiveLecture: (lecture: VideoLecture | null) => void;
  news: DailyNewsItem[];
  toggleBookmarkNews: (newsId: string) => void;
  forumPosts: ForumPost[];
  addForumPost: (title: string, content: string, category: ForumPost['category'], tags: string[]) => void;
  toggleUpvotePost: (postId: string) => void;
  addCommentToPost: (postId: string, content: string) => void;
  toggleFollowUser: (userId: string) => void;
  notes: StudyNote[];
  addNote: (title: string, content: string, category: string, tags: string[], takeaways: string[]) => void;
  deleteNote: (id: string) => void;
  examDeadlines: ExamDeadline[];
  addExamDeadline: (exam: Omit<ExamDeadline, 'id'>) => void;
  deleteExamDeadline: (id: string) => void;
  peerMessages: PeerMessage[];
  sendPeerMessage: (text: string, attachedNoteId?: string) => void;
  activeNpc: NpcInfo | null;
  setActiveNpc: (npc: NpcInfo | null) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  loginWithProvider: (provider: 'gmail' | 'github') => void;
  logout: () => void;
  recordStudySession: (durationMinutes: number) => void;
  exportStudyCalendarIcs: () => void;
  contests: ContestItem[];
  registerForContest: (contestId: string) => void;
  stepWisePlans: StepWiseLearningItem[];
  toggleStepComplete: (stepId: string) => void;
  selectedTrackPlan: 'technical' | 'non-technical';
  setSelectedTrackPlan: (track: 'technical' | 'non-technical') => void;
  isQuickCaptureOpen: boolean;
  setIsQuickCaptureOpen: (open: boolean) => void;
  quickCaptureNote: (text: string, userTitle?: string, manualCategory?: string) => StudyNote;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  gameStats: GameStats;
  activeGameMode: '2d' | '3d';
  setActiveGameMode: (mode: '2d' | '3d') => void;
  recordGameRun: (mode: '2d' | '3d', score: number, orbsCollected: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper: Calculate solar phase from current hour (0-24)
export const computeSolarPhase = (hour: number): SolarPhase => {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'sunset';
  return 'night';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as ActiveTab | null;
      if (tabParam) return tabParam;
      if (params.get('autostart') === '1') return 'games';
    } catch {}
    return 'home';
  });
  const [navigationHistory, setNavigationHistory] = useState<ActiveTab[]>(['home']);

  const [activeGameMode, setActiveGameMode] = useState<'2d' | '3d'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('game') === '2d') return '2d';
    } catch {}
    return '3d';
  });

  const [gameStats, setGameStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('europa_game_stats');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      highScore2D: 840,
      highScore3D: 1280,
      gamesPlayed: 3,
      totalOrbsCollected: 28,
      totalGameXpEarned: 420,
    };
  });

  // Solar Theme System
  const [autoSunSync, setAutoSunSync] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('europa_auto_sun');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  const [sunHour, setSunHourState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('europa_sun_hour');
      if (saved !== null) return parseFloat(saved);
    } catch {}
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  });

  const [solarPhase, setSolarPhase] = useState<SolarPhase>(() => computeSolarPhase(sunHour));

  const [designTheme, setDesignThemeState] = useState<DesignThemeId>(() => {
    try {
      const saved = localStorage.getItem('europa_design_theme') as DesignThemeId | null;
      if (saved && DESIGN_THEMES.some(t => t.id === saved)) return saved;
    } catch {}
    return 'europa-night';
  });

  const [previewDesignTheme, setPreviewDesignThemeState] = useState<DesignThemeId | null>(null);

  const activeDesignThemeConfig = resolveDesignTheme(previewDesignTheme || designTheme);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('europa_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    const phase = computeSolarPhase(sunHour);
    return phase === 'day' ? 'light' : 'dark';
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('europa_lang') as LanguageCode;
      if (saved && translations[saved]) return saved;
    } catch {}
    return 'en';
  });

  const [isOffline, setIsOffline] = useState<boolean>(() => {
    try {
      return localStorage.getItem('europa_offline') === 'true';
    } catch {
      return false;
    }
  });

  const [cachedModulesCount, setCachedModulesCount] = useState<number>(4);

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('europa_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialProfile;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem('europa_badges');
      if (saved) {
        const parsed: Badge[] = JSON.parse(saved);
        const savedMap = new Map(parsed.map(b => [b.id, b]));
        return initialBadges.map(initB => {
          const existing = savedMap.get(initB.id);
          return existing ? { ...initB, unlocked: existing.unlocked, unlockedAt: existing.unlockedAt } : initB;
        });
      }
    } catch {}
    return initialBadges;
  });

  const [modules, setModules] = useState<CourseModule[]>(() => {
    try {
      const saved = localStorage.getItem('europa_modules');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialModules;
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    try {
      const saved = localStorage.getItem('europa_notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialNotes;
  });

  const [news, setNews] = useState<DailyNewsItem[]>(() => {
    try {
      const saved = localStorage.getItem('europa_news');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialNews;
  });

  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    try {
      const saved = localStorage.getItem('europa_forum');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialForumPosts;
  });

  const [examList, setExamList] = useState<ExamDeadline[]>(() => {
    try {
      const saved = localStorage.getItem('europa_exams');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialExams;
  });

  const [peerMessages, setPeerMessages] = useState<PeerMessage[]>([
    {
      id: 'msg-1',
      senderId: 'usr-elena',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
      text: 'Hey Suvo! Just joined the Europa P2P study room. Are you reviewing the ROS2 kinematics formulas?',
      timestamp: '10:42 AM',
    },
    {
      id: 'msg-2',
      senderId: 'usr-alex',
      senderName: 'Alex Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
      text: 'I just scanned your QR code and downloaded your Transformer Attention notes. Amazing summary!',
      timestamp: '10:45 AM',
      attachedNoteId: 'note-1',
    },
  ]);

  const [activeLecture, setActiveLecture] = useState<VideoLecture | null>(null);
  const [activeNpc, setActiveNpc] = useState<NpcInfo | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState<boolean>(false);

  const [contests, setContests] = useState<ContestItem[]>(() => {
    try {
      const saved = localStorage.getItem('europa_contests');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialContests;
  });

  const [selectedTrackPlan, setSelectedTrackPlan] = useState<'technical' | 'non-technical'>(() => {
    try {
      const saved = localStorage.getItem('europa_selected_track_plan');
      if (saved === 'technical' || saved === 'non-technical') return saved;
    } catch {}
    return 'non-technical';
  });

  const [stepWisePlans, setStepWisePlans] = useState<StepWiseLearningItem[]>(() => {
    try {
      const saved = localStorage.getItem('europa_stepwise_plans');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialStepWisePlans;
  });

  const [quantStrategies, setQuantStrategies] = useState<QuantStrategyItem[]>(() => {
    try {
      const saved = localStorage.getItem('europa_quant_strategies');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialQuantStrategies;
  });

  // Real-time solar clock sync
  useEffect(() => {
    if (!autoSunSync) return;

    const updateSolarTime = () => {
      const now = new Date();
      const currentH = now.getHours() + now.getMinutes() / 60;
      setSunHourState(currentH);
      const phase = computeSolarPhase(currentH);
      setSolarPhase(phase);
      if (phase === 'day') {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    };

    updateSolarTime();
    const interval = setInterval(updateSolarTime, 60000);
    return () => clearInterval(interval);
  }, [autoSunSync]);

  // Sync solar attribute to document
  useEffect(() => {
    const phase = computeSolarPhase(sunHour);
    setSolarPhase(phase);
    document.documentElement.setAttribute('data-solar', phase);
  }, [sunHour]);

  // Sync theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('europa_theme', theme);
    } catch {}
  }, [theme]);

  // Navigation with history tracking
  const setActiveTab = (newTab: ActiveTab) => {
    if (newTab === activeTab) return;
    setNavigationHistory(prev => [activeTab, ...prev.filter(t => t !== newTab)]);
    setActiveTabState(newTab);
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[0];
      setNavigationHistory(prev => prev.slice(1));
      setActiveTabState(previous || 'home');
    } else {
      setActiveTabState('home');
    }
  };

  const setSunHour = (h: number) => {
    setSunHourState(h);
    setAutoSunSync(false);
    const phase = computeSolarPhase(h);
    setSolarPhase(phase);
    document.documentElement.setAttribute('data-solar', phase);
    setTheme(phase === 'day' ? 'light' : 'dark');
    try {
      localStorage.setItem('europa_sun_hour', h.toString());
      localStorage.setItem('europa_auto_sun', 'false');
    } catch {}
  };

  // Sync active design theme CSS variables to root document
  useEffect(() => {
    const cfg = activeDesignThemeConfig;
    document.documentElement.setAttribute('data-design-theme', cfg.id);
    document.documentElement.style.setProperty('--glass-bg', cfg.panelBg);
    document.documentElement.style.setProperty('--glass-bg-card', cfg.cardBg);
    document.documentElement.style.setProperty('--glass-border', cfg.borderColor);
    document.documentElement.style.setProperty('--solar-accent', cfg.accentPrimary);
  }, [activeDesignThemeConfig]);

  const setDesignTheme = (themeId: DesignThemeId) => {
    const cfg = resolveDesignTheme(themeId);
    setPreviewDesignThemeState(null);
    setDesignThemeState(cfg.id);
    setAutoSunSync(false);
    setSunHourState(cfg.sunHour);
    setSolarPhase(cfg.solarPhase);
    document.documentElement.setAttribute('data-solar', cfg.solarPhase);
    setTheme(cfg.mode);
    if (cfg.solarPhase === 'night') {
      unlockBadge('badge-7');
    }
    try {
      localStorage.setItem('europa_design_theme', cfg.id);
      localStorage.setItem('europa_sun_hour', cfg.sunHour.toString());
      localStorage.setItem('europa_auto_sun', 'false');
    } catch {}
    showToast(`Applied "${cfg.name}" theme across the app & website.`);
  };

  const setPreviewDesignTheme = (themeId: DesignThemeId | null) => {
    setPreviewDesignThemeState(themeId);
    const targetCfg = resolveDesignTheme(themeId || designTheme);
    setAutoSunSync(false);
    setSunHourState(targetCfg.sunHour);
    setSolarPhase(targetCfg.solarPhase);
    document.documentElement.setAttribute('data-solar', targetCfg.solarPhase);
    setTheme(targetCfg.mode);
  };

  const setSolarPreset = (preset: SolarPhase) => {
    const resolved = resolveSolarPreset(preset);
    const mappedThemeId: DesignThemeId =
      preset === 'dawn'
        ? 'dawn-horizon'
        : preset === 'day'
        ? 'solar-zenith'
        : preset === 'sunset'
        ? 'golden-sunset'
        : 'europa-night';
    setPreviewDesignThemeState(null);
    setDesignThemeState(mappedThemeId);
    setAutoSunSync(false);
    setSunHourState(resolved.sunHour);
    setSolarPhase(resolved.solarPhase);
    document.documentElement.setAttribute('data-solar', resolved.solarPhase);
    setTheme(resolved.theme);
    if (preset === 'night') {
      unlockBadge('badge-7');
    }
    try {
      localStorage.setItem('europa_design_theme', mappedThemeId);
      localStorage.setItem('europa_sun_hour', resolved.sunHour.toString());
      localStorage.setItem('europa_auto_sun', 'false');
    } catch {}
    showToast(`Solar Theme Preset switched to ${resolved.label}`);
  };

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('europa_user', JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('europa_badges', JSON.stringify(badges));
    } catch {}
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem('europa_notes', JSON.stringify(notes));
    } catch {}
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('europa_forum', JSON.stringify(forumPosts));
    } catch {}
  }, [forumPosts]);

  useEffect(() => {
    try {
      localStorage.setItem('europa_exams', JSON.stringify(examList));
    } catch {}
  }, [examList]);

  useEffect(() => {
    try {
      localStorage.setItem('europa_contests', JSON.stringify(contests));
    } catch {}
  }, [contests]);

  useEffect(() => {
    try {
      localStorage.setItem('europa_selected_track_plan', selectedTrackPlan);
    } catch {}
  }, [selectedTrackPlan]);

  useEffect(() => {
    try {
      localStorage.setItem('europa_stepwise_plans', JSON.stringify(stepWisePlans));
    } catch {}
  }, [stepWisePlans]);

  useEffect(() => {
    try {
      localStorage.setItem('europa_quant_strategies', JSON.stringify(quantStrategies));
    } catch {}
  }, [quantStrategies]);

  useEffect(() => {
    try {
      localStorage.setItem('europa_modules', JSON.stringify(modules));
    } catch {}
  }, [modules]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('europa_lang', lang);
    } catch {}
  };

  const t = (key: string): string => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  const toggleOfflineMode = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    try {
      localStorage.setItem('europa_offline', String(nextState));
    } catch {}
    showToast(
      nextState
        ? 'Offline Mode Active: Browsing cached study modules & notes without internet.'
        : 'Online Mode Active: Cloud synchronization restored.'
    );
  };

  const clearCache = () => {
    setCachedModulesCount(0);
    showToast('Offline cache cleared (0 KB cached).');
  };

  const syncOfflineCache = () => {
    setCachedModulesCount(4);
    showToast('Cached all 4 core study paths & video transcripts offline (18.4 MB synced).');
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev =>
      prev.map(b => {
        if (b.id === badgeId && !b.unlocked) {
          const reward = b.xpReward || 150;
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}
          showToast(`🏆 Achievement Unlocked: "${b.name}"! +${reward} XP awarded!`);
          setUser(u => {
            const updated = applyXpGain(
              { xp: u.xp, level: u.level, nextLevelXp: u.nextLevelXp },
              reward
            );
            return {
              ...u,
              xp: updated.xp,
              level: updated.level,
              nextLevelXp: updated.nextLevelXp,
            };
          });
          return { ...b, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] };
        }
        return b;
      })
    );
  };

  // Compute live achievement milestones across AI and Quant study paths
  const completedAiLecturesCount = modules.reduce(
    (acc, mod) => acc + mod.lectures.filter(l => l.completed).length,
    0
  );
  const totalAiLecturesCount = modules.reduce((acc, mod) => acc + mod.lectures.length, 0);
  const completedAiStepsCount = stepWisePlans.filter(s => s.completed).length;
  const completedQuantStrategiesCount = quantStrategies.filter(q => q.completed).length;
  const totalQuantStrategiesCount = quantStrategies.length;

  const achievementMilestones = evaluateAchievementMilestones({
    completedAiLecturesCount,
    totalAiLecturesCount,
    completedAiStepsCount,
    completedQuantStrategiesCount,
    totalQuantStrategiesCount,
    xp: user.xp,
    level: user.level,
    streakDays: user.streakDays,
    notesCount: notes.length,
    highScore2D: gameStats.highScore2D,
    highScore3D: gameStats.highScore3D,
    gamesPlayed: gameStats.gamesPlayed,
  });

  // Automatically grant achievement badges when AI, Quant, or Game milestones are reached
  useEffect(() => {
    achievementMilestones.forEach(m => {
      if (m.shouldUnlock) {
        const match = badges.find(b => b.id === m.badgeId);
        if (match && !match.unlocked) {
          unlockBadge(m.badgeId);
        }
      }
    });
  }, [
    completedAiLecturesCount,
    completedAiStepsCount,
    completedQuantStrategiesCount,
    user.level,
    user.streakDays,
    notes.length,
    gameStats.highScore2D,
    gameStats.highScore3D,
    gameStats.gamesPlayed,
  ]);

  const recordGameRun = (mode: '2d' | '3d', score: number, orbsCollected: number) => {
    const safeScore = Math.max(0, Math.round(score));
    const safeOrbs = Math.max(0, Math.round(orbsCollected));
    const xpEarned = Math.max(60, Math.min(350, Math.round(safeScore / 6) + safeOrbs * 8));

    setGameStats(prev => {
      const next: GameStats = {
        highScore2D: mode === '2d' ? Math.max(prev.highScore2D, safeScore) : prev.highScore2D,
        highScore3D: mode === '3d' ? Math.max(prev.highScore3D, safeScore) : prev.highScore3D,
        gamesPlayed: prev.gamesPlayed + 1,
        totalOrbsCollected: prev.totalOrbsCollected + safeOrbs,
        totalGameXpEarned: prev.totalGameXpEarned + xpEarned,
      };
      try {
        localStorage.setItem('europa_game_stats', JSON.stringify(next));
      } catch {}
      return next;
    });

    setUser(u => {
      const updated = applyXpGain(
        { xp: u.xp, level: u.level, nextLevelXp: u.nextLevelXp },
        xpEarned
      );
      return {
        ...u,
        xp: updated.xp,
        level: updated.level,
        nextLevelXp: updated.nextLevelXp,
      };
    });

    if (mode === '2d' && safeScore >= 1000) {
      unlockBadge('badge-17');
    }
    if (mode === '3d' && safeScore >= 1500) {
      unlockBadge('badge-18');
    }

    showToast(
      `${mode === '3d' ? '3D AI Roadster' : '2D Quant Collider'} run banked: ${safeScore.toLocaleString()} pts · +${xpEarned} XP!`
    );
  };

  const completeLesson = (moduleId: string, lectureId: string) => {
    let newlyCompleted = false;
    setModules(prev =>
      prev.map(mod => {
        if (mod.id === moduleId) {
          const updatedLectures = mod.lectures.map(lec => {
            if (lec.id === lectureId) {
              if (!lec.completed) newlyCompleted = true;
              return { ...lec, completed: true };
            }
            return lec;
          });
          const completedCount = updatedLectures.filter(l => l.completed).length;
          const pct = Math.round((completedCount / updatedLectures.length) * 100);
          return {
            ...mod,
            lectures: updatedLectures,
            progressPercent: pct,
          };
        }
        return mod;
      })
    );

    recordStudySession(newlyCompleted ? 35 : 25);
    unlockBadge('badge-2');
    showToast('AI Study Module lesson completed! +140 XP gained.');
  };

  const toggleQuantStrategyComplete = (strategyId: string) => {
    setQuantStrategies(prev =>
      prev.map(strat => {
        if (strat.id === strategyId) {
          const nextCompleted = !strat.completed;
          if (nextCompleted) {
            setUser(u => {
              const updated = applyXpGain(
                { xp: u.xp, level: u.level, nextLevelXp: u.nextLevelXp },
                strat.xpReward
              );
              return {
                ...u,
                xp: updated.xp,
                level: updated.level,
                nextLevelXp: updated.nextLevelXp,
              };
            });
            try {
              confetti({ particleCount: 75, spread: 70, origin: { y: 0.65 } });
            } catch {}
            showToast(`Quant Strategy "${strat.name}" mastered! +${strat.xpReward} XP gained.`);
          } else {
            showToast(`Marked "${strat.name}" as in-progress.`);
          }
          return { ...strat, completed: nextCompleted };
        }
        return strat;
      })
    );
  };

  const recordStudySession = (durationMinutes: number) => {
    setUser(prev => {
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = prev.lastStudiedDate !== today;
      const newStreak = isNewDay ? prev.streakDays + 1 : prev.streakDays;
      const updated = applyXpGain(
        { xp: prev.xp, level: prev.level, nextLevelXp: prev.nextLevelXp },
        durationMinutes * 4
      );
      if (newStreak >= 5) {
        unlockBadge('badge-3');
      }
      return {
        ...prev,
        xp: updated.xp,
        level: updated.level,
        nextLevelXp: updated.nextLevelXp,
        streakDays: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastStudiedDate: today,
      };
    });
  };

  const toggleBookmarkNews = (newsId: string) => {
    setNews(prev =>
      prev.map(item =>
        item.id === newsId ? { ...item, bookmarked: !item.bookmarked } : item
      )
    );
  };

  const addForumPost = (
    title: string,
    content: string,
    category: ForumPost['category'],
    tags: string[]
  ) => {
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorRole: 'Europa Scholar',
      title,
      content,
      category,
      tags,
      upvotes: 1,
      commentsCount: 0,
      createdAt: 'Just now',
      userUpvoted: true,
      comments: [],
    };
    setForumPosts(prev => [newPost, ...prev]);
    showToast('Discussion thread created successfully!');
    unlockBadge('badge-9');
  };

  const toggleUpvotePost = (postId: string) => {
    setForumPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const upvoted = !post.userUpvoted;
          return {
            ...post,
            userUpvoted: upvoted,
            upvotes: upvoted ? post.upvotes + 1 : post.upvotes - 1,
          };
        }
        return post;
      })
    );
  };

  const addCommentToPost = (postId: string, content: string) => {
    setForumPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            authorId: user.id,
            authorName: user.name,
            authorAvatar: user.avatar,
            content,
            createdAt: 'Just now',
            upvotes: 0,
          };
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
    showToast('Reply posted to discussion!');
  };

  const toggleFollowUser = (userId: string) => {
    setUser(prev => {
      const isFollowing = prev.following.includes(userId);
      const updated = isFollowing
        ? prev.following.filter(id => id !== userId)
        : [...prev.following, userId];
      showToast(isFollowing ? 'Unfollowed user' : 'Following user! Peer updates will appear in your feed.');
      return { ...prev, following: updated };
    });
  };

  const addNote = (
    title: string,
    content: string,
    category: string,
    tags: string[],
    takeaways: string[]
  ) => {
    const newNote: StudyNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      category,
      tags,
      keyTakeaways: takeaways,
      updatedAt: new Date().toISOString().split('T')[0],
      isAiGenerated: true,
    };
    setNotes(prev => [newNote, ...prev]);
    unlockBadge('badge-4');
    showToast('Note saved & categorized under ' + category);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    showToast('Note deleted.');
  };

  const registerForContest = (contestId: string) => {
    setContests(prev =>
      prev.map(c => {
        if (c.id === contestId) {
          const wasRegistered = !!c.registered;
          const nextRegistered = !wasRegistered;
          return {
            ...c,
            registered: nextRegistered,
            registeredCount: nextRegistered ? c.registeredCount + 1 : Math.max(0, c.registeredCount - 1),
          };
        }
        return c;
      })
    );
    showToast('Registration preference updated for challenge!');
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
  };

  const toggleStepComplete = (stepId: string) => {
    setStepWisePlans(prev =>
      prev.map(step => {
        if (step.id === stepId) {
          const nextCompleted = !step.completed;
          if (nextCompleted) {
            recordStudySession(25);
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
            showToast(`Completed Step ${step.stepNumber}: ${step.title}! +100 XP gained.`);
          } else {
            showToast(`Marked Step ${step.stepNumber} as in-progress.`);
          }
          return { ...step, completed: nextCompleted };
        }
        return step;
      })
    );
  };

  const quickCaptureNote = (text: string, userTitle?: string, manualCategory?: string): StudyNote => {
    const lower = text.toLowerCase();

    // AI Subject Organizer Heuristic Engine
    let category = manualCategory || 'Generative AI';
    const tags: string[] = ['#QuickCapture'];

    if (!manualCategory) {
      if (
        lower.includes('robot') ||
        lower.includes('kinematics') ||
        lower.includes('lidar') ||
        lower.includes('gazebo') ||
        lower.includes('ros') ||
        lower.includes('slam') ||
        lower.includes('drone') ||
        lower.includes('uav') ||
        lower.includes('actuator') ||
        lower.includes('sensor') ||
        lower.includes('kalman') ||
        lower.includes('yolo')
      ) {
        category = 'Robotics';
        tags.push('#Robotics', '#EmbodiedAI', '#Perception');
      } else if (
        lower.includes('hackathon') ||
        lower.includes('contest') ||
        lower.includes('ctf') ||
        lower.includes('challenge') ||
        lower.includes('kaggle') ||
        lower.includes('sih') ||
        lower.includes('prize') ||
        lower.includes('bounty') ||
        lower.includes('red team') ||
        lower.includes('jailbreak') ||
        lower.includes('prompt injection')
      ) {
        category = 'Competitive AI & Hacking';
        tags.push('#AIContest', '#Hackathon', '#Security');
      } else if (
        lower.includes('ethics') ||
        lower.includes('safety') ||
        lower.includes('bias') ||
        lower.includes('alignment') ||
        lower.includes('governance') ||
        lower.includes('regulation') ||
        lower.includes('compact') ||
        lower.includes('audit') ||
        lower.includes('policy')
      ) {
        category = 'AI Ethics';
        tags.push('#AIEthics', '#Alignment', '#Governance');
      } else if (
        lower.includes('roi') ||
        lower.includes('executive') ||
        lower.includes('product') ||
        lower.includes('business') ||
        lower.includes('roadmap') ||
        lower.includes('strategy') ||
        lower.includes('metric') ||
        lower.includes('cost') ||
        lower.includes('enterprise')
      ) {
        category = 'Non-Technical AI';
        tags.push('#ProductStrategy', '#ExecutiveAI', '#Enterprise');
      } else if (
        lower.includes('backprop') ||
        lower.includes('loss') ||
        lower.includes('optimizer') ||
        lower.includes('cnn') ||
        lower.includes('rnn') ||
        lower.includes('gradient') ||
        lower.includes('weight') ||
        lower.includes('layer') ||
        lower.includes('cuda') ||
        lower.includes('tensor')
      ) {
        category = 'AI & ML';
        tags.push('#DeepLearning', '#NeuralNets', '#Architecture');
      } else {
        category = 'Generative AI';
        tags.push('#GenerativeAI', '#LLMs', '#Prompting');
      }
    }

    // Auto-generate concise title if missing
    let finalTitle = userTitle?.trim();
    if (!finalTitle) {
      const firstLine = text.trim().split('\n')[0].replace(/^#+\s*/, '');
      finalTitle = firstLine.length > 45 ? firstLine.slice(0, 42) + '...' : firstLine || `Quick Note: ${category}`;
    }

    // Generate smart key takeaways
    const sentences = text
      .split(/[.!?\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 8);

    const keyTakeaways =
      sentences.length >= 2
        ? sentences.slice(0, 3).map(s => (s.endsWith('.') ? s : s + '.'))
        : [
            `Key insight synthesized under ${category}.`,
            `Auto-organized and categorized by Europa AI Note Engine.`,
            `Recorded on ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.`,
          ];

    const newNote: StudyNote = {
      id: `note-${Date.now()}`,
      title: finalTitle,
      content: text,
      category,
      tags,
      keyTakeaways,
      updatedAt: new Date().toISOString().split('T')[0],
      isAiGenerated: true,
    };

    setNotes(prev => [newNote, ...prev]);
    setUser(prev => ({
      ...prev,
      xp: prev.xp + 25,
    }));
    unlockBadge('badge-4');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    showToast(`AI categorized note under "${category}" (+25 XP!)`);
    return newNote;
  };

  const addExamDeadline = (exam: Omit<ExamDeadline, 'id'>) => {
    const newExam: ExamDeadline = {
      ...exam,
      id: `exam-${Date.now()}`,
    };
    setExamList(prev => [...prev, newExam]);
    showToast('Exam / project milestone deadline added!');
  };

  const deleteExamDeadline = (id: string) => {
    setExamList(prev => prev.filter(e => e.id !== id));
  };

  const sendPeerMessage = (text: string, attachedNoteId?: string) => {
    const newMsg: PeerMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedNoteId,
    };
    setPeerMessages(prev => [...prev, newMsg]);
    if (attachedNoteId) {
      unlockBadge('badge-5');
    }
  };

  const loginWithProvider = (provider: 'gmail' | 'github') => {
    const isGmail = provider === 'gmail';
    setUser({
      id: `usr-${provider}-${Date.now().toString().slice(-4)}`,
      name: isGmail ? 'Suvo Mitra' : 'suvomitra-dev',
      email: isGmail ? 'suvomitra110@gmail.com' : 'suvomitra@users.noreply.github.com',
      avatar: isGmail
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      provider,
      role: 'researcher',
      level: 4,
      xp: 1420,
      nextLevelXp: 2000,
      streakDays: 6,
      longestStreak: 14,
      lastStudiedDate: new Date().toISOString().split('T')[0],
      biometricEnabled: true,
      following: ['usr-elena', 'usr-alex'],
    });
    setShowAuthModal(false);
    showToast(`Authenticated via ${isGmail ? 'Google (Gmail)' : 'GitHub'}! Welcome back, Suvo.`);
  };

  const logout = () => {
    setUser({
      id: 'guest',
      name: 'Guest Learner',
      email: 'guest@europa-ai.org',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      provider: 'guest',
      role: 'student',
      level: 1,
      xp: 0,
      nextLevelXp: 500,
      streakDays: 0,
      longestStreak: 0,
      lastStudiedDate: '',
      biometricEnabled: false,
      following: [],
    });
    showToast('Signed out. Switched to guest mode.');
  };

  const exportStudyCalendarIcs = () => {
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Europa Ai//AI Study Schedule//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n`;

    examList.forEach(e => {
      const dt = new Date(e.date);
      const dtStr = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      icsContent += `BEGIN:VEVENT\nUID:${e.id}@europa-ai.org\nSUMMARY:Europa Ai: ${e.title}\nDESCRIPTION:Study Milestone for ${e.subject}\nDTSTART:${dtStr}\nDTEND:${dtStr}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Europa_AI_Study_Schedule.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded Europa_AI_Study_Schedule.ics! Compatible with Google Calendar, Apple & Outlook.');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        goBack,
        navigationHistory,
        user,
        setUser,
        theme,
        toggleTheme,
        designTheme,
        previewDesignTheme,
        activeDesignThemeConfig,
        setDesignTheme,
        setPreviewDesignTheme,
        solarPhase,
        sunHour,
        autoSunSync,
        setSunHour,
        setAutoSunSync,
        setSolarPreset,
        language,
        setLanguage,
        t,
        isOffline,
        toggleOfflineMode,
        cachedModulesCount,
        clearCache,
        syncOfflineCache,
        badges,
        unlockBadge,
        achievementMilestones,
        modules,
        completeLesson,
        quantStrategies,
        toggleQuantStrategyComplete,
        activeLecture,
        setActiveLecture,
        news,
        toggleBookmarkNews,
        forumPosts,
        addForumPost,
        toggleUpvotePost,
        addCommentToPost,
        toggleFollowUser,
        notes,
        addNote,
        deleteNote,
        examDeadlines: examList,
        addExamDeadline,
        deleteExamDeadline,
        peerMessages,
        sendPeerMessage,
        activeNpc,
        setActiveNpc,
        showAuthModal,
        setShowAuthModal,
        loginWithProvider,
        logout,
        recordStudySession,
        exportStudyCalendarIcs,
        contests,
        registerForContest,
        stepWisePlans,
        toggleStepComplete,
        selectedTrackPlan,
        setSelectedTrackPlan,
        isQuickCaptureOpen,
        setIsQuickCaptureOpen,
        quickCaptureNote,
        toastMessage,
        showToast,
        gameStats,
        activeGameMode,
        setActiveGameMode,
        recordGameRun,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
