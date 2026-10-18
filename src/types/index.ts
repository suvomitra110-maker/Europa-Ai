export type LanguageCode = 'en' | 'es' | 'hi' | 'bn' | 'zh' | 'ja' | 'de' | 'fr';

export type SolarPhase = 'dawn' | 'day' | 'sunset' | 'night';

export type UserRole = 'student' | 'researcher' | 'executive' | 'enthusiast';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'gmail' | 'github' | 'guest';
  role: UserRole;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  longestStreak: number;
  lastStudiedDate: string; // YYYY-MM-DD
  biometricEnabled: boolean;
  following: string[]; // User IDs
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'streak' | 'voxel' | 'mastery' | 'community' | 'notes' | 'quant';
  studyPath?: 'ai' | 'quant' | 'general';
  milestoneCriterion?: string;
  xpReward?: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface VideoLecture {
  id: string;
  title: string;
  category: 'Generative AI' | 'AI & ML' | 'Robotics' | 'AI Ethics' | 'Non-Technical AI';
  instructor: string;
  duration: string;
  youtubeId: string;
  embedUrl: string;
  thumbnail: string;
  summary: string;
  transcript: string;
  keyPoints: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  views: number;
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  track: 'technical' | 'non-technical';
  category: string;
  description: string;
  lessonsCount: number;
  durationHours: number;
  progressPercent: number;
  icon: string;
  color: string;
  npcGuide: 'ada' | 'alan' | 'tensor';
  lectures: VideoLecture[];
}

export interface DailyNewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  category: 'Model Release' | 'Research Paper' | 'Industry' | 'Robotics' | 'Ethics';
  readTime: string;
  summary: string;
  content: string;
  url: string;
  trendingScore: number;
  bookmarked?: boolean;
}

export interface ForumComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  title: string;
  content: string;
  category: 'Generative AI' | 'Robotics' | 'Career & Study' | 'AI Ethics' | 'Papers';
  tags: string[];
  upvotes: number;
  commentsCount: number;
  createdAt: string;
  userUpvoted?: boolean;
  comments: ForumComment[];
}

export interface StudyNote {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  sourceLecture?: string;
  updatedAt: string;
  isAiGenerated?: boolean;
  keyTakeaways: string[];
}

export interface ExamDeadline {
  id: string;
  title: string;
  subject: string;
  date: string; // ISO date
  type: 'Exam' | 'Project' | 'Certification';
  reminderDaysBefore: number;
}

export interface PeerMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  attachedNoteId?: string;
}

export interface NpcInfo {
  id: 'ada' | 'alan' | 'tensor';
  name: string;
  title: string;
  greeting: string;
  description: string;
  specialty: string;
  voicePitch: number;
  recommendedTrack: string;
}

export interface ContestItem {
  id: string;
  title: string;
  organizer: string;
  region: 'India' | 'Global';
  flag: string;
  category: 'GenAI & Agents' | 'Cybersecurity & CTF' | 'Robotics & Hardware' | 'Competitive ML & Kaggle' | 'AI for Social Good';
  prizePool: string;
  prizePoolInr?: string;
  deadline: string; // ISO date or readable date
  daysRemaining: number;
  format: 'Online' | 'In-Person' | 'Hybrid';
  location: string;
  eligibility: string;
  difficulty: 'Open to All' | 'College / University' | 'Advanced / Professional';
  tags: string[];
  description: string;
  problemStatement: string;
  rules: string[];
  websiteUrl: string;
  registrationUrl: string;
  registeredCount: number;
  featured?: boolean;
  registered?: boolean;
}

export interface StepConceptQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StepWiseLearningItem {
  id: string;
  stepNumber: number;
  track: 'technical' | 'non-technical';
  title: string;
  subtitle: string;
  phase: string;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lectureId: string;
  learningObjectives: string[];
  practicalTakeaways: string[];
  quiz: StepConceptQuiz;
  checklist: string[];
  completed?: boolean;
}

export interface QuantStrategyItem {
  id: string;
  name: string;
  category: 'Statistical Arbitrage' | 'Market Microstructure & HFT' | 'AI / Deep RL Alpha' | 'Volatility & Options' | 'Macro & Factor Investing' | 'Sentiment & NLP Alpha';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sharpeRatio: string;
  typicalHorizon: string;
  annualizedAlpha: string;
  maxDrawdown: string;
  mathematicalMethod: string;
  formulaLatex: string;
  coreMethodology: string;
  realWorldApplication: string;
  aiIntegration: string;
  riskControls: string[];
  executionSteps: string[];
  xpReward: number;
  completed?: boolean;
}

export interface GlobalQuantHub {
  id: string;
  city: string;
  region: 'Americas' | 'EMEA' | 'APAC';
  exchange: string;
  status: 'OPEN' | 'AFTER-HOURS' | 'PRE-MARKET';
  dailyQuantVolume: string;
  aiOrderFlowShare: string;
  dominantStrategy: string;
  latencyBenchmark: string;
  benchmarkIndex: string;
  indexChange: string;
}

