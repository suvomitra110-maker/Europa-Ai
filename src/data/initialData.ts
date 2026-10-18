import { Badge, ContestItem, CourseModule, DailyNewsItem, ExamDeadline, ForumPost, GlobalQuantHub, NpcInfo, QuantStrategyItem, StepWiseLearningItem, StudyNote, UserProfile, VideoLecture } from '../types';

export const initialProfile: UserProfile = {
  id: 'usr-europa-01',
  name: 'Suvo Mitra',
  email: 'suvomitra110@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  provider: 'gmail',
  role: 'researcher',
  level: 4,
  xp: 1420,
  nextLevelXp: 2000,
  streakDays: 6,
  longestStreak: 14,
  lastStudiedDate: new Date().toISOString().split('T')[0],
  biometricEnabled: true,
  following: ['usr-elena', 'usr-alex'],
};

export const initialBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Voxel Pioneer',
    description: 'Explored the 3D Voxel AI Library and inspected the Grimoire knowledge cubes.',
    category: 'voxel',
    studyPath: 'general',
    milestoneCriterion: 'Enter the 3D Voxel AI Library',
    xpReward: 100,
    icon: 'Cube',
    unlocked: true,
    unlockedAt: '2026-10-12',
    rarity: 'common',
  },
  {
    id: 'badge-2',
    name: 'Transformer Sage',
    description: 'Completed 3+ core AI architecture video lectures and passed the Scaled Dot-Product Attention checkpoint.',
    category: 'mastery',
    studyPath: 'ai',
    milestoneCriterion: 'Complete 3 Core AI Video Lectures',
    xpReward: 150,
    icon: 'Sparkles',
    unlocked: true,
    unlockedAt: '2026-10-14',
    rarity: 'epic',
  },
  {
    id: 'badge-3',
    name: 'Flame Keeper',
    description: 'Maintained a consecutive daily AI & Quant study streak of 5+ days.',
    category: 'streak',
    studyPath: 'general',
    milestoneCriterion: 'Maintain a 5-Day Study Streak',
    xpReward: 150,
    icon: 'Flame',
    unlocked: true,
    unlockedAt: '2026-10-16',
    rarity: 'rare',
  },
  {
    id: 'badge-4',
    name: 'Prompt Alchemist',
    description: 'Captured and structured 3+ AI lecture summaries and key takeaway extractions.',
    category: 'notes',
    studyPath: 'ai',
    milestoneCriterion: 'Capture 3+ Structured AI Study Notes',
    xpReward: 150,
    icon: 'BookOpen',
    unlocked: true,
    unlockedAt: '2026-10-15',
    rarity: 'rare',
  },
  {
    id: 'badge-5',
    name: 'Decentralized Peer',
    description: 'Transferred study notes to another peer using the P2P QR scan system.',
    category: 'community',
    studyPath: 'general',
    milestoneCriterion: 'Share a study note in P2P Transfer',
    xpReward: 150,
    icon: 'QrCode',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'badge-6',
    name: 'Embodied Architect',
    description: 'Completed 6+ AI & Embodied Robotics lectures covering ROS2 navigation, 3D LiDAR, and inverse kinematics.',
    category: 'mastery',
    studyPath: 'ai',
    milestoneCriterion: 'Complete 6 AI & Embodied Robotics Lectures',
    xpReward: 200,
    icon: 'Bot',
    unlocked: false,
    rarity: 'legendary',
  },
  {
    id: 'badge-7',
    name: 'Night Owl Scholar',
    description: 'Logged study sessions using Celestial Night solar theme mode.',
    category: 'streak',
    studyPath: 'general',
    milestoneCriterion: 'Activate Night Solar Theme or study at night',
    xpReward: 100,
    icon: 'Moon',
    unlocked: true,
    unlockedAt: '2026-10-16',
    rarity: 'common',
  },
  {
    id: 'badge-8',
    name: 'Executive Mind',
    description: 'Completed 5+ modules in the Step-Wise AI Strategy & Technical Roadmap.',
    category: 'mastery',
    studyPath: 'ai',
    milestoneCriterion: 'Complete 5 Step-Wise AI Learning Plan Modules',
    xpReward: 200,
    icon: 'Briefcase',
    unlocked: true,
    unlockedAt: '2026-10-16',
    rarity: 'epic',
  },
  {
    id: 'badge-9',
    name: 'Community Pillar',
    description: 'Contributed technical solutions and research threads in the Europa Community Forum.',
    category: 'community',
    studyPath: 'general',
    milestoneCriterion: 'Publish a thread in the Community Forum',
    xpReward: 150,
    icon: 'MessageSquare',
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'badge-10',
    name: 'Offline Voyager',
    description: 'Synchronized study modules and studied using Offline Cache Mode.',
    category: 'voxel',
    studyPath: 'general',
    milestoneCriterion: 'Sync or toggle Offline Cache Mode',
    xpReward: 100,
    icon: 'WifiOff',
    unlocked: false,
    rarity: 'common',
  },
  {
    id: 'badge-11',
    name: 'Biometric Shield',
    description: 'Enabled hardware biometric authentication (WebAuthn FIDO2) for profile data protection.',
    category: 'mastery',
    studyPath: 'general',
    milestoneCriterion: 'Enable WebAuthn Biometric Security',
    xpReward: 150,
    icon: 'Fingerprint',
    unlocked: true,
    unlockedAt: '2026-10-11',
    rarity: 'rare',
  },
  {
    id: 'badge-12',
    name: 'Grandmaster of Europa',
    description: 'Reached Level 6 Frontier Systems Architect across AI & Quantitative disciplines.',
    category: 'mastery',
    studyPath: 'general',
    milestoneCriterion: 'Reach Level 6 Frontier Systems Architect',
    xpReward: 300,
    icon: 'Award',
    unlocked: false,
    rarity: 'legendary',
  },
  {
    id: 'badge-13',
    name: 'Frontier AI Laureate',
    description: 'Mastered the entire AI & Robotics video lecture curriculum across Transformers, LoRA, RLHF, and Embodied AI.',
    category: 'mastery',
    studyPath: 'ai',
    milestoneCriterion: 'Complete All AI Architecture & Alignment Lectures',
    xpReward: 300,
    icon: 'BrainCircuit',
    unlocked: false,
    rarity: 'legendary',
  },
  {
    id: 'badge-14',
    name: 'Quant Initiate: Alpha Seeker',
    description: 'Completed your first Quantitative Trading strategy module and backtest verification.',
    category: 'quant',
    studyPath: 'quant',
    milestoneCriterion: 'Complete Your First Quant Trading Strategy Lesson',
    xpReward: 150,
    icon: 'TrendingUp',
    unlocked: true,
    unlockedAt: '2026-10-15',
    rarity: 'rare',
  },
  {
    id: 'badge-15',
    name: 'Statistical Arbitrage Tactician',
    description: 'Mastered 3+ Quantitative Trading strategy methods including Cointegration, Market Microstructure, and Deep RL.',
    category: 'quant',
    studyPath: 'quant',
    milestoneCriterion: 'Master 3 Quantitative Trading Strategy Methods',
    xpReward: 220,
    icon: 'LineChart',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'badge-16',
    name: 'Global Quant Grandmaster',
    description: 'Completed all 6 Worldwide Quantitative Strategy modules from Statistical Arbitrage to NLP Sentiment Alpha.',
    category: 'quant',
    studyPath: 'quant',
    milestoneCriterion: 'Complete All 6 Global Quant Strategy Modules',
    xpReward: 350,
    icon: 'Globe',
    unlocked: false,
    rarity: 'legendary',
  },
  {
    id: 'badge-17',
    name: 'Quant Alpha 2D Collider Ace',
    description: 'Mastered 2D elastic collision physics and harvested 1,000+ Alpha signal points in the 2D Quant Alpha Collider arena.',
    category: 'quant',
    studyPath: 'quant',
    milestoneCriterion: 'Score 1,000+ pts in 2D Quant Alpha Collider',
    xpReward: 200,
    icon: 'Gamepad2',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'badge-18',
    name: 'AI Roadster 3D Telemetry Pilot',
    description: 'Piloted the 3D Autonomous AI Roadster at 240+ MPH on the Solar Quantum Highway and scored 1,500+ telemetry points.',
    category: 'voxel',
    studyPath: 'ai',
    milestoneCriterion: 'Score 1,500+ pts in 3D AI Roadster Highway',
    xpReward: 250,
    icon: 'Gauge',
    unlocked: false,
    rarity: 'legendary',
  },
];

export const videoLectures: VideoLecture[] = [
  {
    id: 'lec-1',
    title: 'Attention Is All You Need & Transformer Internals',
    category: 'Generative AI',
    instructor: 'Andrej Karpathy & Europa Research',
    duration: '42 min',
    youtubeId: 'kCc8FmEb1nY',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kCc8FmEb1nY',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    summary: 'A step-by-step walkthrough of Self-Attention, Query-Key-Value dot product, Multi-Head projections, Feed-Forward sublayers, and positional embeddings.',
    transcript: `Welcome to the deep architectural review of Attention Is All You Need. 
The core innovation begins with eliminating recurrence entirely in favor of self-attention mechanisms. 
In self-attention, each token computes queries, keys, and values.
We compute the attention score matrix via softmax(Q * K^T / sqrt(d_k)). 
Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions.
Residual connections around each sublayer followed by layer normalization stabilize gradients across deep stacks.`,
    keyPoints: [
      'Self-Attention computes compatibility between every token pair in O(N^2) complexity.',
      'Scaling by 1/sqrt(d_k) prevents the softmax gradients from vanishing into regions with extremely small gradients.',
      'Multi-head projections enable diverse attention patterns simultaneously.',
      'Positional encodings provide crucial sequence order information without recurrence.'
    ],
    level: 'Advanced',
    tags: ['Transformer', 'Self-Attention', 'PyTorch', 'LLMs'],
    views: 18450,
    completed: true,
  },
  {
    id: 'lec-2',
    title: 'Prompt Engineering, RAG & LLM Fine-Tuning (LoRA)',
    category: 'Generative AI',
    instructor: 'Dr. Andrew Ng & DeepLearning.AI',
    duration: '35 min',
    youtubeId: '_ZvnD73m40o',
    embedUrl: 'https://www.youtube-nocookie.com/embed/_ZvnD73m40o',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
    summary: 'Mastering parameter-efficient fine-tuning (PEFT), Low-Rank Adaptation (LoRA), Quantized QLoRA, and building reliable Retrieval Augmented Generation (RAG) pipelines.',
    transcript: `In this lecture, we examine modern practical LLM adaptation.
Instead of updating billions of parameters during full fine-tuning, LoRA decomposes weight updates into two low-rank matrices: W + DeltaW, where DeltaW = B * A with rank r << d.
This reduces memory consumption by over 75% and accelerates training significantly.
Meanwhile, for knowledge-intensive tasks, RAG pairs semantic search over vector embeddings with grounded generation to prevent hallucinations.`,
    keyPoints: [
      'LoRA freezes pretrained model weights and injects trainable rank decomposition matrices.',
      'QLoRA quantizes base model weights to 4-bit NormalFloat (NF4).',
      'RAG decouples parametric memory from factual document retrieval.',
      'Chunking strategy and rerankers heavily dictate RAG retrieval precision.'
    ],
    level: 'Intermediate',
    tags: ['LoRA', 'RAG', 'Vector DB', 'Prompting'],
    views: 12900,
    completed: true,
  },
  {
    id: 'lec-3',
    title: 'RLHF, DPO & AI Alignment Guardrails',
    category: 'AI Ethics',
    instructor: 'Anthropic Alignment Lab',
    duration: '48 min',
    youtubeId: '2MBJOuVq380',
    embedUrl: 'https://www.youtube-nocookie.com/embed/2MBJOuVq380',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
    summary: 'How Reinforcement Learning from Human Feedback (RLHF), Direct Preference Optimization (DPO), and Constitutional AI ensure model safety, honesty, and helpfulness.',
    transcript: `Raw pretrained language models simply predict the next token on Internet text.
To transform them into helpful and safe assistants, we train a Reward Model on human preference pairs (chosen vs rejected).
Proximal Policy Optimization (PPO) then optimizes the policy to maximize reward while penalizing divergence from the base reference model via KL divergence.
DPO derives an analytical mapping that eliminates the unstable reinforcement learning loop entirely.`,
    keyPoints: [
      'Pretraining provides raw capability; post-training alignment shapes steerability and safety.',
      'KL-divergence penalty prevents reward gaming and model collapse.',
      'Direct Preference Optimization (DPO) optimizes the implicit reward directly via cross-entropy.',
      'Red-teaming and Constitutional AI provide automated safety critique loops.'
    ],
    level: 'Advanced',
    tags: ['RLHF', 'DPO', 'Safety', 'Alignment'],
    views: 9400,
  },
  {
    id: 'lec-4',
    title: 'Computer Vision & Autonomous Perception (YOLOv8 & 3D LiDAR)',
    category: 'Robotics',
    instructor: 'Stanford AI Lab & Europa',
    duration: '50 min',
    youtubeId: 'vT1JzLTH4G4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/vT1JzLTH4G4',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    summary: 'Deep dive into real-time object detection with anchor-free heads, 3D point cloud processing, sensor fusion with Extended Kalman Filters, and ROS2 perception nodes.',
    transcript: `Autonomous robots rely on multimodal perception to navigate unstructured environments.
We study anchor-free architectures like YOLOv8 that predict bounding boxes and class logits directly from feature pyramids.
Then we fuse camera RGB images with 3D LiDAR point clouds to obtain 3D oriented bounding boxes with depth.
Extended Kalman Filters (EKF) fuse odometry, IMU, and visual features for robust 6-DOF pose estimation.`,
    keyPoints: [
      'Anchor-free object detection eliminates heuristic anchor box hyperparameter tuning.',
      'PointNet and VoxelNet architectures ingest unordered 3D point cloud coordinate sets.',
      'Sensor fusion mitigates camera occlusion and LiDAR weather degradation.',
      'ROS2 DDS middleware provides low-latency inter-process telemetry.'
    ],
    level: 'Intermediate',
    tags: ['YOLOv8', 'LiDAR', 'Perception', 'ROS2'],
    views: 11200,
  },
  {
    id: 'lec-5',
    title: 'Robotics Kinematics, Gazebo Simulation & Trajectory Planning',
    category: 'Robotics',
    instructor: 'Modern Robotics Institute',
    duration: '54 min',
    youtubeId: 'nin2TbMuhR0',
    embedUrl: 'https://www.youtube-nocookie.com/embed/nin2TbMuhR0',
    thumbnail: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80',
    summary: 'Forward and inverse kinematics with Denavit-Hartenberg parameters, Jacobian matrices, collision avoidance in Gazebo, and robotic manipulator trajectory smoothing.',
    transcript: `Manipulator mechanics involves computing end-effector spatial coordinates from joint angles (Forward Kinematics) and finding corresponding joint angles for desired positions (Inverse Kinematics).
Jacobians correlate joint angular velocities with Cartesian end-effector velocities.
Singularities occur when the Jacobian loses rank, creating infinite velocity requirements.
We build Gazebo URDF models and simulate trajectory controllers using minimum jerk polynomial splines.`,
    keyPoints: [
      'DH parameters provide a standardized convention for spatial link coordinate frames.',
      'Analytical vs numerical Inverse Kinematics trade off determinism versus generality.',
      'Jacobian pseudoinverse and damped least squares prevent numerical explosions near singularities.',
      'Physics simulation allows collision testing prior to real hardware deployment.'
    ],
    level: 'Advanced',
    tags: ['Kinematics', 'Gazebo', 'Robotics', 'Path Planning'],
    views: 8750,
  },
  {
    id: 'lec-6',
    title: 'Executive AI Strategy: ROI, Data Moats & Organizational Adoption',
    category: 'Non-Technical AI',
    instructor: 'Europa Strategy Group',
    duration: '28 min',
    youtubeId: 'V_xro1bcAuA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/V_xro1bcAuA',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    summary: 'A non-technical executive guide on evaluating AI readiness, building defensible proprietary data moats, managing workforce reskilling, and measuring business ROI.',
    transcript: `For business leaders, AI is not merely an engineering experiment—it is a core lever of strategic differentiation.
We outline the three pillars of sustainable enterprise AI: Proprietary Data Flywheels, Human-in-the-Loop workflows, and Governance Compliance.
We dispel common generative AI myths and introduce a 5-step framework to evaluate whether a workflow warrants a rule-based system, an off-the-shelf API, or a tailored foundation model.`,
    keyPoints: [
      'Off-the-shelf foundation models offer parity, not competitive advantage—data flywheels create the moat.',
      'Human-in-the-loop workflows drastically minimize enterprise liability during early automation.',
      'Compute cost forecasting and token unit economics must be modeled into customer acquisition cost.',
      'Responsible AI policies prevent regulatory backlash and protect intellectual property.'
    ],
    level: 'Beginner',
    tags: ['Non-Technical', 'Strategy', 'ROI', 'Governance'],
    views: 14200,
    completed: true,
  },
  {
    id: 'lec-7',
    title: 'Demystifying AI for Beginners: How LLMs Actually Work Without Code',
    category: 'Non-Technical AI',
    instructor: 'Prof. Ada Lovelace & Stanford HAI',
    duration: '24 min',
    youtubeId: 'zjkBMFhNj_g',
    embedUrl: 'https://www.youtube-nocookie.com/embed/zjkBMFhNj_g',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    summary: 'A friendly, zero-code visual guide explaining how probability, tokenization, context windows, and embeddings allow models to predict words without feeling intimidated by math.',
    transcript: `Welcome to the non-technical journey of Artificial Intelligence.
You don't need a math degree or programming background to master how language models think.
At their essence, modern LLMs are hyper-dimensional pattern recognizers.
They convert text into chunks called tokens, place them in a high-dimensional concept space, and predict the most plausible next token based on context.
Understanding this probabilistic nature is your superpower for prompting accurately and avoiding common traps like hallucinations.`,
    keyPoints: [
      'LLMs predict next-token probabilities based on contextual patterns, not sentient comprehension.',
      'Tokens are word fragments (~4 characters in English); managing them is key to speed and cost.',
      'Context windows act like working RAM: information outside the window is forgotten.',
      'Hallucinations occur because models prioritize plausibility over ground truth unless anchored.'
    ],
    level: 'Beginner',
    tags: ['Non-Technical', 'Beginner', 'Foundations', 'LLMs'],
    views: 22100,
    completed: true,
  },
  {
    id: 'lec-8',
    title: 'Prompt Engineering for Non-Technical Professionals & Managers',
    category: 'Non-Technical AI',
    instructor: 'Europa Product Strategy & Andrew Ng',
    duration: '32 min',
    youtubeId: 'jC4v5AS4RIM',
    embedUrl: 'https://www.youtube-nocookie.com/embed/jC4v5AS4RIM',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
    summary: 'Master the Role-Task-Constraint framework, few-shot priming, document synthesis, and automated business correspondence without writing a line of code.',
    transcript: `Prompting is the modern executive's interface to computing.
In this workshop, we introduce the RTC formula: Role (who the AI should emulate), Task (the precise transformation required), and Constraints (format, length, tone, what to omit).
We explore few-shot prompting where providing 2-3 clean examples skyrockets output consistency from 60% to 98%.
Finally, we demonstrate how to analyze messy quarterly spreadsheets and PDF contracts in seconds.`,
    keyPoints: [
      'The RTC Framework (Role, Task, Constraints) creates reproducible, audit-ready AI outputs.',
      'Few-shot demonstration examples eliminate ambiguity and format drift.',
      'Chain-of-thought nudges ("Think step by step") allow models to reason through multi-layered business dilemmas.',
      'Negative constraints ("Do NOT include fluff") save precious token budget.'
    ],
    level: 'Beginner',
    tags: ['Prompting', 'Productivity', 'No-Code', 'Business'],
    views: 19800,
    completed: true,
  },
  {
    id: 'lec-9',
    title: 'AI Governance, Copyright Risk & The EU AI Act Made Simple',
    category: 'Non-Technical AI',
    instructor: 'Europa Policy Institute & Legal Council',
    duration: '30 min',
    youtubeId: 'bLhGzXbY810',
    embedUrl: 'https://www.youtube-nocookie.com/embed/bLhGzXbY810',
    thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    summary: 'A clear guide for managers on navigating intellectual property, data leaks, GDPR/EU AI Act risk tiers, and implementing responsible workplace AI policies.',
    transcript: `As enterprise AI adoption surges, regulatory scrutiny has arrived with force.
The European Union AI Act creates a tiered classification: Unacceptable Risk (banned), High-Risk (strict auditing, logging, human oversight), and Minimal/General Purpose Risk.
We discuss how to ensure your team never feeds proprietary customer PII or secret code into public training sets.
We also cover safe harbor agreements and algorithmic bias auditing protocols.`,
    keyPoints: [
      'EU AI Act classifies applications into risk tiers with fines up to 35M EUR or 7% of global turnover.',
      'Enterprise zero-retention API agreements prevent company data from leaking into public training sets.',
      'Provenance watermarking standards (C2PA) help verify synthetic media origin.',
      'Human-in-the-loop review remains mandatory for credit, hiring, and legal workflows.'
    ],
    level: 'Intermediate',
    tags: ['Compliance', 'Legal', 'EU AI Act', 'Governance'],
    views: 13400,
    completed: false,
  },
  {
    id: 'lec-10',
    title: 'No-Code AI Automation & Agentic Workflows for Teams',
    category: 'Non-Technical AI',
    instructor: 'Europa Automation Lab',
    duration: '36 min',
    youtubeId: '7xTGNNLPyMI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/7xTGNNLPyMI',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    summary: 'Learn how to chain AI models to your daily work tools (Sheets, Gmail, Slack, CRM) using visual drag-and-drop automation builders to eliminate repetitive tasks.',
    transcript: `Why manually copy and paste summaries between browser tabs when AI can orchestrate your daily tools autonomously?
In this masterclass, we construct hands-on workflows where incoming client emails are categorized, summarized, logged into Google Sheets, and routed to Slack with draft replies ready for human approval.
We look at autonomous triggers, error handlers, and safeguard limits to ensure automations never run amok.`,
    keyPoints: [
      'Visual webhooks allow foundation models to react dynamically to real-time events.',
      'Human approval checkpoints prevent unvetted AI emails from sending automatically.',
      'Structured JSON extraction makes unstructured text instantly searchable in spreadsheets.',
      'Idempotency and rate limiting prevent infinite retry loops in automation flows.'
    ],
    level: 'Beginner',
    tags: ['Automation', 'Zapier', 'No-Code', 'Agents'],
    views: 16750,
    completed: false,
  },
  {
    id: 'lec-11',
    title: 'Autonomous AI Agents: Function Calling, Planning & Reflection',
    category: 'Generative AI',
    instructor: 'Europa Research & Harrison Chase',
    duration: '44 min',
    youtubeId: 'sal78ACtGTc',
    embedUrl: 'https://www.youtube-nocookie.com/embed/sal78ACtGTc',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    summary: 'Building stateful agentic loops with ReAct prompting, tool calling schemas, long-term vector memory, and self-critique reflection mechanisms.',
    transcript: `We transition from static chatbot QA to autonomous agents that reason, plan, and take actions in the real world.
The ReAct framework unifies Reasoning traces and Action execution.
We explore tool calling where models generate structured JSON payloads to execute database queries, web searches, and Python code in sandboxed execution environments.
Finally, we study self-reflection and Monte Carlo tree search for agentic problem-solving.`,
    keyPoints: [
      'ReAct (Reason + Act) loop enables models to interleave thoughts with external observations.',
      'Structured tool calling uses JSON schemas to guarantee valid API parameters.',
      'Reflection steps review draft actions against constraints before real execution.',
      'Multi-agent architectures separate specialized roles (planner, researcher, critic, coder).'
    ],
    level: 'Advanced',
    tags: ['Agents', 'ReAct', 'Tool Use', 'Function Calling'],
    views: 15300,
    completed: false,
  },
];

export const courseModules: CourseModule[] = [
  {
    id: 'mod-1',
    title: 'Generative AI & Transformer Foundations',
    track: 'technical',
    category: 'Generative AI',
    description: 'Master self-attention, encoder-decoder architectures, LoRA fine-tuning, and modern multimodal LLMs.',
    lessonsCount: 8,
    durationHours: 12,
    progressPercent: 75,
    icon: 'Sparkles',
    color: '#8b5cf6',
    npcGuide: 'tensor',
    lectures: [videoLectures[0], videoLectures[1]],
  },
  {
    id: 'mod-2',
    title: 'Autonomous Robotics & Embodied Perception',
    track: 'technical',
    category: 'Robotics',
    description: 'Explore sensor fusion, 3D point clouds, forward/inverse kinematics, Gazebo simulations, and ROS2.',
    lessonsCount: 10,
    durationHours: 16,
    progressPercent: 30,
    icon: 'Bot',
    color: '#06b6d4',
    npcGuide: 'alan',
    lectures: [videoLectures[3], videoLectures[4]],
  },
  {
    id: 'mod-3',
    title: 'AI Alignment, Ethics & Safety Systems',
    track: 'technical',
    category: 'AI Ethics',
    description: 'Delve into RLHF, DPO, constitutional guardrails, red-teaming, and algorithmic bias mitigation.',
    lessonsCount: 6,
    durationHours: 8,
    progressPercent: 45,
    icon: 'Shield',
    color: '#f43f5e',
    npcGuide: 'ada',
    lectures: [videoLectures[2]],
  },
  {
    id: 'mod-4',
    title: 'Non-Technical AI Strategy for Leaders & Creatives',
    track: 'non-technical',
    category: 'Non-Technical AI',
    description: 'No code required: Learn AI business strategy, data moats, prompt literacy, ethics, and project management.',
    lessonsCount: 6,
    durationHours: 6,
    progressPercent: 85,
    icon: 'Briefcase',
    color: '#10b981',
    npcGuide: 'ada',
    lectures: [videoLectures[5]],
  },
];

export const dailyNews: DailyNewsItem[] = [
  {
    id: 'news-1',
    title: 'Europa AI Labs Releases Open Frontier Spec for Spatial Voxel Reasoning',
    source: 'Europa AI Research',
    date: 'Today, 08:30 AM',
    category: 'Model Release',
    readTime: '4 min',
    summary: 'A breakthrough multimodal architecture trained to reason in 3D voxel space for physical world robotics and spatial design.',
    content: 'Europa AI Labs announced today the open-source weights for SpatialVoxel-X, a model capable of generating and manipulating 3D voxel meshes directly from continuous natural language prompts. The architecture unifies volumetric representations with transformer attention, providing robotics simulators and game engines with instant semantic scene synthesis.',
    url: 'https://arxiv.org',
    trendingScore: 98,
    bookmarked: true,
  },
  {
    id: 'news-2',
    title: 'Direct Preference Optimization (DPO) Surpasses PPO in Stability Benchmarks',
    source: 'AI Alignment Review',
    date: 'Yesterday',
    category: 'Research Paper',
    readTime: '6 min',
    summary: 'New empirical studies reveal DPO offers higher sample efficiency and zero hyperparameter instability compared to classical RLHF.',
    content: 'Researchers across leading academic institutions published a comprehensive 50,000-sample comparison between classical PPO-based RLHF and closed-form DPO. Findings show DPO reaches parity with lower compute overhead while eliminating reward collapse failure modes.',
    url: 'https://arxiv.org',
    trendingScore: 92,
  },
  {
    id: 'news-3',
    title: 'Robotics Startups Adopt Vision-Language-Action (VLA) for Household Dexterity',
    source: 'Robotics World Daily',
    date: '2 days ago',
    category: 'Robotics',
    readTime: '5 min',
    summary: 'General-purpose humanoid robots show remarkable transfer learning from internet video pretraining directly to bimanual manipulation.',
    content: 'By integrating large vision-language models with end-to-end motor action output tokens, modern humanoid platforms are executing multi-step tasks such as folding linens and clearing dining tables with over 94% success rates without task-specific engineering.',
    url: 'https://spectrum.ieee.org',
    trendingScore: 89,
  },
  {
    id: 'news-4',
    title: 'Global AI Governance Compact Unveils Standardized Auditing Frameworks',
    source: 'Tech Policy Global',
    date: '3 days ago',
    category: 'Ethics',
    readTime: '4 min',
    summary: 'International standard organizations approve consensus guidelines for certifying watermarking, provenance, and data attribution.',
    content: 'The new standards mandate cryptographically verified metadata signatures for all synthetic media outputs and establish voluntary red-team disclosures for frontier reasoning models prior to widespread enterprise deployment.',
    url: 'https://oecd.ai',
    trendingScore: 81,
  },
];

export const initialForumPosts: ForumPost[] = [
  {
    id: 'post-1',
    authorId: 'usr-elena',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
    authorRole: 'Ph.D. Student in Robotics',
    title: 'How are you dealing with camera-LiDAR calibration drift in outdoor Gazebo simulations?',
    content: `Hey everyone! In my ROS2 autonomous navigation project, we notice after prolonged simulated runs in Gazebo that timestamp synchronization between the synthetic RGB camera and 3D LiDAR creates ghosting in our PointNet clusterer.

Has anyone experimented with hardware-clock simulation hooks in Gazebo Harmonic? Any tips for clock jitter mitigation?`,
    category: 'Robotics',
    tags: ['ROS2', 'LiDAR', 'Simulation', 'Gazebo'],
    upvotes: 42,
    commentsCount: 3,
    createdAt: '4 hours ago',
    userUpvoted: true,
    comments: [
      {
        id: 'c-1',
        authorId: 'usr-europa-01',
        authorName: 'Suvo Mitra',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
        content: 'Check `use_sim_time: true` across all your nodes! Also, use message_filters::ApproximateTimeSynchronizer with an explicit tolerance buffer of 0.05s.',
        createdAt: '3 hours ago',
        upvotes: 14,
        userUpvoted: true,
      },
      {
        id: 'c-2',
        authorId: 'usr-alex',
        authorName: 'Alex Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
        content: 'Seconding Suvo! We had the exact issue until we configured the DDS QoS profile to keep_last(1) with best_effort reliability on point clouds.',
        createdAt: '2 hours ago',
        upvotes: 8,
      },
    ],
  },
  {
    id: 'post-2',
    authorId: 'usr-sarah',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80',
    authorRole: 'Product Director',
    title: 'Non-Technical Track Review: How Europa Ai changed our product roadmap',
    content: `I manage a team of 18 non-technical product managers. Taking the Europa Ai Non-Technical Track helped us understand token economics and prompt design patterns. We replaced a costly $120k planned microservice with a well-structured RAG pipeline and clear human evaluation benchmarks. Highly recommended!`,
    category: 'Career & Study',
    tags: ['Non-Technical', 'Strategy', 'ProductManagement'],
    upvotes: 79,
    commentsCount: 1,
    createdAt: '1 day ago',
    userUpvoted: false,
    comments: [
      {
        id: 'c-3',
        authorId: 'usr-marcus',
        authorName: 'Marcus Aurelius V',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
        content: 'That is awesome Sarah! Module 4 specifically on data flywheels opened my eyes as well.',
        createdAt: '18 hours ago',
        upvotes: 6,
      },
    ],
  },
];

export const initialNotes: StudyNote[] = [
  {
    id: 'note-1',
    title: 'Transformer Attention Matrix Derivation',
    category: 'Generative AI',
    tags: ['Math', 'Attention', 'Transformers'],
    content: `# Transformer Self-Attention

Self-attention operates across input sequence vectors X in R^{n x d}.

1. **Projection**:
   - Q = X * W_Q
   - K = X * W_K
   - V = X * W_V

2. **Scaled Dot-Product**:
   - Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V

3. **Multi-Head Projection**:
   - MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W_O

Crucial insight: The scaling factor 1/sqrt(d_k) counteracts the growth of dot product variance as dimensions scale up!`,
    sourceLecture: 'Attention Is All You Need & Transformer Internals',
    updatedAt: '2026-10-15',
    isAiGenerated: false,
    keyTakeaways: [
      'Variance of dot products scales with d_k; without division, softmax saturates with near-zero gradients.',
      'Multi-head attention allows concurrent subspace focus.',
      'Complexity per layer is O(n^2 * d).'
    ],
  },
  {
    id: 'note-2',
    title: 'LoRA & PEFT Parameter Efficiency Cheatsheet',
    category: 'Generative AI',
    tags: ['LoRA', 'FineTuning', 'PEFT'],
    content: `# Low-Rank Adaptation (LoRA)

- Instead of updating W in R^{d x k}, LoRA sets:
  W' = W_0 + (alpha / r) * (B * A)
- where B in R^{d x r} and A in R^{r x k}, with r << min(d, k).
- A is initialized from Gaussian N(0, sigma^2), B is initialized to 0 so training begins with delta = 0!`,
    sourceLecture: 'Prompt Engineering, RAG & LLM Fine-Tuning (LoRA)',
    updatedAt: '2026-10-16',
    isAiGenerated: true,
    keyTakeaways: [
      'Freezes original weights W_0 completely during training.',
      'Zero latency overhead during inference if weights are merged back: W = W_0 + B*A.',
      'Rank r = 8 or 16 is sufficient for 95%+ of fine-tuning benchmarks.'
    ],
  },
];

export const examDeadlines: ExamDeadline[] = [
  {
    id: 'exam-1',
    title: 'Europa Frontier AI Midterm Exam',
    subject: 'Generative Models & Transformers',
    date: '2026-10-24T14:00:00Z',
    type: 'Exam',
    reminderDaysBefore: 2,
  },
  {
    id: 'exam-2',
    title: 'ROS2 Gazebo Simulation Capstone Project',
    subject: 'Autonomous Robotics',
    date: '2026-10-29T23:59:59Z',
    type: 'Project',
    reminderDaysBefore: 3,
  },
  {
    id: 'exam-3',
    title: 'Certified AI Ethics & Governance Specialist',
    subject: 'Ethics & Regulatory Compliance',
    date: '2026-11-08T10:00:00Z',
    type: 'Certification',
    reminderDaysBefore: 5,
  },
];

export const npcList: NpcInfo[] = [
  {
    id: 'ada',
    name: 'Ada Lovelace',
    title: 'Chief Archivist & Pioneer',
    greeting: 'Greetings, seeker of knowledge! The analytical engine awaits your creative instructions. Shall we explore foundational machine reasoning or executive AI ethics?',
    description: 'The visionary mathematician who wrote the first computer algorithm. Ada guides learners through core foundations, ethical frameworks, and non-technical strategy.',
    specialty: 'Core Foundations, Math & Ethics',
    voicePitch: 1.2,
    recommendedTrack: 'AI Alignment, Ethics & Safety Systems',
  },
  {
    id: 'alan',
    name: 'Alan Turing',
    title: 'Logic Sage & Computability Master',
    greeting: 'Can machines think? Indeed they can perceive, deliberate, and actuate! What algorithmic puzzle or kinematics challenge shall we solve today?',
    description: 'The father of theoretical computer science and artificial intelligence. Alan assists with autonomous robotics, kinematics, algorithms, and computational logic.',
    specialty: 'Autonomous Robotics, Kinematics & Logic',
    voicePitch: 0.9,
    recommendedTrack: 'Autonomous Robotics & Embodied Perception',
  },
  {
    id: 'tensor',
    name: 'Tensor-9',
    title: 'Frontier AI Companion & Voxel Bot',
    greeting: 'Beep-boop! Quantum neural weights loaded! Ready to inspect modern Transformer attention matrices, fine-tune LoRA adapters, or synthesize voxel worlds!',
    description: 'A charming futuristic voxel bot powered by frontier LLMs. Tensor-9 specializes in Generative AI, prompt engineering, diffusion, and reinforcement learning.',
    specialty: 'Transformers, Generative AI & Prompting',
    voicePitch: 1.5,
    recommendedTrack: 'Generative AI & Transformer Foundations',
  },
];

export const initialContests: ContestItem[] = [
  {
    id: 'contest-sih-2026',
    title: 'Smart India Hackathon (SIH 2026) - AI & Robotics Edition',
    organizer: 'Ministry of Education & AICTE (Govt. of India)',
    region: 'India',
    flag: '🇮🇳',
    category: 'AI for Social Good',
    prizePool: '₹1,00,00,000 INR',
    prizePoolInr: '₹1.00 Crore',
    deadline: '2026-11-15',
    daysRemaining: 29,
    format: 'Hybrid',
    location: 'Nodal Centers across India (Finale: IIT Delhi)',
    eligibility: 'Undergraduate & Graduate University Students (Teams of 6)',
    difficulty: 'College / University',
    tags: ['Edge AI', 'Indic LLMs', 'Robotics', 'AgriTech', 'GovTech'],
    description: "The world's largest nation-building open innovation model by Govt. of India, challenging youth to solve acute national problems using edge AI and robotics.",
    problemStatement: 'Develop edge-deployable multimodal AI computer vision models and low-latency speech agents supporting 22 Indian regional languages for disaster relief, crop pathology detection, and smart public governance.',
    rules: [
      'Teams must consist of exactly 6 students with mandatory inclusion of at least 1 female teammate.',
      'All code must be original, open-source compliant, and accompanied by complete documentation.',
      'Grand Finale requires a live hardware demonstration or interactive web application container deployment.',
      'Mentorship from senior ISRO, DRDO, and industry directors provided during 36-hour non-stop finals.'
    ],
    websiteUrl: 'https://sih.gov.in',
    registrationUrl: 'https://sih.gov.in/register',
    registeredCount: 4820,
    featured: true,
  },
  {
    id: 'contest-defcon-aixcc',
    title: 'DEF CON AI Village & DARPA AIxCC (Artificial Intelligence Cyber Challenge)',
    organizer: 'DARPA & DEF CON Hacking Community',
    region: 'Global',
    flag: '🌍',
    category: 'Cybersecurity & CTF',
    prizePool: '$29,500,000 USD',
    prizePoolInr: '₹245 Crores',
    deadline: '2026-12-01',
    daysRemaining: 45,
    format: 'Hybrid',
    location: 'Online Preliminary / Finals in Las Vegas, USA',
    eligibility: 'Cybersecurity Researchers, Red-Teamers & Autonomous Systems Engineers',
    difficulty: 'Advanced / Professional',
    tags: ['AI Hacking', 'Zero-Day', 'Program Verification', 'Automated Patching', 'CTF'],
    description: 'A landmark global grand challenge tasking autonomous Cyber Reasoning Systems (CRS) powered by frontier LLMs to autonomously uncover and remediate zero-day vulnerabilities in critical infrastructure.',
    problemStatement: 'Construct autonomous AI agents that analyze real-world C, Java, and Rust open-source code repositories, generate valid exploit proofs-of-concept (POCs), and synthesize provably sound security patches without breaking system functionality.',
    rules: [
      'Cyber Reasoning Systems must operate in completely sandboxed head-to-head execution pipelines without human input.',
      'Generated patches undergo rigorous automated unit and regression testing suites.',
      'Teams retain full IP rights to their reasoning architectures with open-source reference implementations encouraged.',
      'Finalists compete live at DEF CON Las Vegas in the AI Village arena.'
    ],
    websiteUrl: 'https://aicyberchallenge.com',
    registrationUrl: 'https://aicyberchallenge.com/participate',
    registeredCount: 1640,
    featured: true,
  },
  {
    id: 'contest-iitb-techfest',
    title: 'IIT Bombay Techfest - International AI Grand Challenge 2026',
    organizer: 'IIT Bombay & SINE Incubation',
    region: 'India',
    flag: '🇮🇳',
    category: 'Robotics & Hardware',
    prizePool: '₹15,00,000 INR',
    prizePoolInr: '₹15.0 Lakhs',
    deadline: '2026-11-28',
    daysRemaining: 42,
    format: 'Hybrid',
    location: 'IIT Bombay Campus, Powai, Mumbai',
    eligibility: 'Open to All Students, Startups & Global Researchers',
    difficulty: 'Open to All',
    tags: ['Autonomous UAVs', '3D SLAM', 'ROS2', 'Computer Vision', 'Gazebo'],
    description: 'Asia’s premier technological festival hosting the Autonomous Flight and Spatial AI Challenge for GPS-denied indoor search and rescue operations.',
    problemStatement: 'Engineer an autonomous quadcopter or ground rover navigating an unmapped multi-story maze, using onboard 3D LiDAR and monocular depth estimation to locate thermal hazard markers and transmit volumetric voxel maps.',
    rules: [
      'Stage 1: ROS2 / Gazebo simulation track submission with reproducible Docker container.',
      'Stage 2: Top 20 teams qualify for physical arena trials inside IIT Bombay Indoor Stadium.',
      'Total weight of drone/rover must not exceed 2.5 kg; emergency kill-switch mandatory.'
    ],
    websiteUrl: 'https://techfest.org',
    registrationUrl: 'https://techfest.org/competitions/ai-grand-challenge',
    registeredCount: 2310,
    featured: true,
  },
  {
    id: 'contest-google-gemini',
    title: 'Google Gemini API Global Innovation Competition',
    organizer: 'Google DeepMind & Google Cloud',
    region: 'Global',
    flag: '🌍',
    category: 'GenAI & Agents',
    prizePool: '$1,000,000 USD',
    prizePoolInr: '₹8.3 Crores',
    deadline: '2026-11-20',
    daysRemaining: 34,
    format: 'Online',
    location: 'Global (Online Virtual Showcase)',
    eligibility: 'Developers, Builders & Founders Worldwide (18+)',
    difficulty: 'Open to All',
    tags: ['Gemini 2.5', 'Multimodal', '1M Context', 'Function Calling', 'Agents'],
    description: 'Global competition rewarding the most revolutionary web and mobile applications utilizing Gemini’s massive context window and multimodal processing capabilities.',
    problemStatement: 'Build innovative interactive solutions that ingest hours of audio/video, massive codebases, or complex multidimensional data to solve problems that were previously unfeasible with short-context LLMs.',
    rules: [
      'Applications must actively call the official @google/genai SDK or REST API endpoints.',
      'Submissions require a working deployed web app, open GitHub repository, and a 3-minute video walkthrough.',
      'Judged on real-world utility, technical novelty, UX design, and effective multimodal utilization.'
    ],
    websiteUrl: 'https://ai.google.dev/competition',
    registrationUrl: 'https://ai.google.dev/competition/register',
    registeredCount: 8940,
    featured: true,
  },
  {
    id: 'contest-certin-ctf',
    title: 'CERT-In National AI Cyber Defense CTF & Red-Teaming',
    organizer: 'Indian Computer Emergency Response Team (CERT-In)',
    region: 'India',
    flag: '🇮🇳',
    category: 'Cybersecurity & CTF',
    prizePool: '₹20,00,000 INR',
    prizePoolInr: '₹20.0 Lakhs',
    deadline: '2026-11-05',
    daysRemaining: 19,
    format: 'Online',
    location: 'Online CTF Platform (CyberPeace National Portal)',
    eligibility: 'Indian Students, Security Analysts & Ethical Hackers',
    difficulty: 'Advanced / Professional',
    tags: ['Prompt Injection', 'Model Poisoning', 'Adversarial Jailbreak', 'CERT-In'],
    description: 'National competitive offensive security arena where ethical hackers stress-test enterprise AI models against prompt injections, data extraction, and model poisoning.',
    problemStatement: 'Craft innovative adversarial payloads to bypass state-of-the-art guardrails, extract secret system instructions, execute indirect prompt injection, and submit robust remediation patches.',
    rules: [
      'Strict adherence to the Indian IT Act and ethical security disclosure terms.',
      'Automated brute-force flooding of CTF servers is forbidden.',
      'Flags are captured via verified adversarial prompt logs and defense bypass demonstrations.'
    ],
    websiteUrl: 'https://cert-in.org.in',
    registrationUrl: 'https://cert-in.org.in/events/ai-ctf-2026',
    registeredCount: 3120,
    featured: false,
  },
  {
    id: 'contest-arc-agi',
    title: 'ARC-AGI 2026: Visual-Relational Reasoning Grand Prize',
    organizer: 'François Chollet & ARC Prize Foundation',
    region: 'Global',
    flag: '🌍',
    category: 'Competitive ML & Kaggle',
    prizePool: '$1,100,000 USD',
    prizePoolInr: '₹9.1 Crores',
    deadline: '2026-11-30',
    daysRemaining: 44,
    format: 'Online',
    location: 'Kaggle & ARC Prize Global Leaderboard',
    eligibility: 'Open to All Researchers, Engineers, and Independent Minds',
    difficulty: 'Advanced / Professional',
    tags: ['AGI Benchmark', 'Symbolic AI', 'Few-Shot Learning', 'Kaggle', 'Abstraction'],
    description: 'The benchmark of genuine artificial general intelligence. Measure machine adaptability on spatial grid transformation tasks that LLMs cannot memorize.',
    problemStatement: 'Write algorithms that generalize from 3 to 5 training input-output grid examples to accurately predict test outputs for never-before-seen conceptual transformation puzzles.',
    rules: [
      'Execution time strictly restricted to 9 hours on single Kaggle T4/P100 compute container.',
      'Internet access disabled during inference.',
      'Submissions must predict the exact test grid matrix dimensions and pixel values.'
    ],
    websiteUrl: 'https://arcprize.org',
    registrationUrl: 'https://kaggle.com/competitions/arc-prize-2026',
    registeredCount: 5410,
    featured: false,
  },
  {
    id: 'contest-ai4bharat',
    title: 'AI for Bharat: Multilingual Indic Speech & Reasoning Challenge',
    organizer: 'IIT Madras & AI4Bharat Consortium',
    region: 'India',
    flag: '🇮🇳',
    category: 'GenAI & Agents',
    prizePool: '₹25,00,000 INR',
    prizePoolInr: '₹25.0 Lakhs',
    deadline: '2026-12-10',
    daysRemaining: 54,
    format: 'Online',
    location: 'IIT Madras Research Park / Virtual',
    eligibility: 'Indian Students, Researchers & Open Source Contributors',
    difficulty: 'College / University',
    tags: ['Indic Languages', 'ASR', 'Bhashini', 'Speech-to-Text', 'IIT Madras'],
    description: 'Pioneering contest aimed at breaking language barriers across 22 Scheduled Indian languages through cutting-edge neural speech models and low-compute translation.',
    problemStatement: 'Develop robust, low-bitrate Automatic Speech Recognition (ASR) and text generation pipelines that maintain over 85% BLEU score accuracy across regional accents and code-mixed (Hinglish/Tanglish) conversations.',
    rules: [
      'Models must be released under MIT/Apache 2.0 open-source licenses.',
      'Compute sponsors provide free GPU access on PARAM-Ganga supercomputers for shortlisted participants.',
      'Evaluation carried out on undisclosed blind test sets curated by native linguists.'
    ],
    websiteUrl: 'https://ai4bharat.iitm.ac.in',
    registrationUrl: 'https://ai4bharat.iitm.ac.in/challenge-2026',
    registeredCount: 1980,
    featured: false,
  },
  {
    id: 'contest-ethglobal-agents',
    title: 'ETHGlobal Autonomous AI Agents & Swarms Hackathon',
    organizer: 'ETHGlobal & Autonomous Systems Labs',
    region: 'Global',
    flag: '🌍',
    category: 'GenAI & Agents',
    prizePool: '$350,000 USD',
    prizePoolInr: '₹2.9 Crores',
    deadline: '2026-11-12',
    daysRemaining: 26,
    format: 'Online',
    location: 'Global Virtual (Kickoff in San Francisco)',
    eligibility: 'Open to All Hackers & Developers Worldwide',
    difficulty: 'Open to All',
    tags: ['Agent Swarms', 'Autonomous Web', 'Micro-transactions', 'Decentralized AI'],
    description: 'Intense 48-hour global hackathon exploring autonomous software agents equipped with verifiable tool execution, private memory, and peer collaboration protocols.',
    problemStatement: 'Build multi-agent swarms that autonomously negotiate resource allocations, synthesize cross-domain research, and execute decentralized tool calls without continuous human prompting.',
    rules: [
      'Must submit working demo video, deployed contract/endpoint, and open GitHub repo.',
      'Teams of 1 to 5 members.',
      'Live virtual demo presentations to jury of frontier AI researchers.'
    ],
    websiteUrl: 'https://ethglobal.com',
    registrationUrl: 'https://ethglobal.com/events/ai-agents-2026',
    registeredCount: 2890,
    featured: false,
  },
];

export const initialStepWisePlans: StepWiseLearningItem[] = [
  // --- NON-TECHNICAL LEARNING PLAN (STEP-BY-STEP) ---
  {
    id: 'step-nt-1',
    stepNumber: 1,
    track: 'non-technical',
    title: 'Mental Models: Demystifying How AI & LLMs Actually Work',
    subtitle: 'Zero coding required. Build intuitive mental models of tokens, predictions, probability, and context windows.',
    phase: 'Phase 1: Foundational Mental Models',
    estimatedMinutes: 24,
    difficulty: 'Beginner',
    lectureId: 'lec-7',
    learningObjectives: [
      'Grasp tokenization and how words turn into mathematical concept vectors without math formulas',
      'Understand why next-token prediction causes hallucinations if left unanchored',
      'Learn how temperature controls creativity vs deterministic precision'
    ],
    practicalTakeaways: [
      'Think of an LLM as a brilliant autocomplete on all human knowledge',
      'Always ground factual tasks with source documents or explicit constraints'
    ],
    checklist: [
      'Watched lecture: Demystifying AI for Beginners',
      'Explored token count breakdown (1 token ≈ 4 characters)',
      'Identified the 3 common causes of LLM hallucinations'
    ],
    quiz: {
      question: 'Why do Large Language Models sometimes invent facts (hallucinate)?',
      options: [
        'Because they prioritize predicting plausible text patterns over verified ground truth when unanchored',
        'Because their hard drives run out of storage space during inference',
        'Because they deliberately try to deceive human users',
        'Because they only understand binary machine code'
      ],
      correctIndex: 0,
      explanation: 'LLMs are trained to maximize the probabilistic likelihood of next tokens. Without grounding in factual context, they generate answers that sound superficially convincing but may be factually fictitious.'
    },
    completed: true,
  },
  {
    id: 'step-nt-2',
    stepNumber: 2,
    track: 'non-technical',
    title: 'Prompt Engineering for Professionals: The RTC Framework',
    subtitle: 'Role-Task-Constraint architecture, few-shot prompting, and bulletproof output formatting for everyday work.',
    phase: 'Phase 2: Everyday Productivity & Prompt Craft',
    estimatedMinutes: 32,
    difficulty: 'Beginner',
    lectureId: 'lec-8',
    learningObjectives: [
      'Apply the RTC (Role, Task, Constraints) formula for consistent results',
      'Provide 2-3 few-shot examples to boost response accuracy from 60% to 98%',
      'Master negative constraints to prune boilerplate and save reading time'
    ],
    practicalTakeaways: [
      'Never send raw one-line prompts for complex business deliverables',
      'Define exact target outputs: markdown tables, bullet takeaways, or executive memos'
    ],
    checklist: [
      'Learned the Role-Task-Constraint prompt template',
      'Drafted a few-shot prompt for summarizing customer feedback',
      'Saved a reusable system prompt in Europa Quick Capture'
    ],
    quiz: {
      question: 'Which prompting strategy provides the highest boost in format consistency?',
      options: [
        'Adding 2 to 3 few-shot demonstration examples showing the desired input/output format',
        'Typing prompt instructions in ALL CAPS',
        'Repeating the question 10 times in the prompt',
        'Setting temperature to maximum'
      ],
      correctIndex: 0,
      explanation: 'Few-shot demonstration examples prime the model attention pattern with concrete in-context precedents, eliminating ambiguity in format and tone.'
    },
    completed: true,
  },
  {
    id: 'step-nt-3',
    stepNumber: 3,
    track: 'non-technical',
    title: 'AI Economics, Token Cost Modeling & Building Proprietary Moats',
    subtitle: 'Evaluate build vs buy, unit economics per 1M tokens, and why foundation models are commodities.',
    phase: 'Phase 3: Business Strategy & Enterprise ROI',
    estimatedMinutes: 28,
    difficulty: 'Beginner',
    lectureId: 'lec-6',
    learningObjectives: [
      'Model token input/output costs against human labor hourly equivalents',
      'Understand the AI flywheel: unique user feedback loops create defensibility',
      'Evaluate when simple deterministic rules beat stochastic models'
    ],
    practicalTakeaways: [
      'Base models offer parity, not edge; proprietary data and workflow integration create the moat',
      'Model latency and rate limits directly impact customer churn'
    ],
    checklist: [
      'Calculated 1M token throughput costs for GPT-4o vs Claude 3.5 Sonnet vs Gemini Flash',
      'Mapped the enterprise data flywheel for a custom product idea',
      'Drafted an AI initiative ROI business case presentation'
    ],
    quiz: {
      question: 'When foundation models are accessible to everyone via API, where does sustainable competitive advantage come from?',
      options: [
        'Proprietary data flywheels, user feedback loops, and tight workflow integration',
        'Buying the most expensive GPU clusters',
        'Hiding API keys in source code',
        'Using as many prompt tokens as possible'
      ],
      correctIndex: 0,
      explanation: 'Pretrained models are rapidly commoditizing. Sustainable defensibility stems from unique domain data, human feedback loops (RLHF), and deep workflow stickiness.'
    },
    completed: true,
  },
  {
    id: 'step-nt-4',
    stepNumber: 4,
    track: 'non-technical',
    title: 'AI Governance, Copyright Protection & EU AI Act Compliance',
    subtitle: 'De-risk workplace adoption: understand risk tiers, data confidentiality, copyright exposure, and auditing.',
    phase: 'Phase 4: Risk, Legal & Governance',
    estimatedMinutes: 30,
    difficulty: 'Intermediate',
    lectureId: 'lec-9',
    learningObjectives: [
      'Navigate EU AI Act risk tiers: Prohibited, High-Risk, and Transparency systems',
      'Prevent employee leaks of trade secrets into public training sets',
      'Audit vendor AI for bias, drift, and copyright safe harbor protections'
    ],
    practicalTakeaways: [
      'Always verify enterprise zero-data-retention terms with LLM cloud providers',
      'Mandate human-in-the-loop signoff on any automated customer-facing decision'
    ],
    checklist: [
      'Reviewed the EU AI Act 4-tier risk classification taxonomy',
      'Verified zero-retention data privacy policy with enterprise AI vendors',
      'Established employee prompt guidelines and safe harbor rules'
    ],
    quiz: {
      question: 'Under the EU AI Act, what requirement is mandatory for AI systems categorized as High-Risk (e.g. hiring, credit scoring)?',
      options: [
        'Continuous logging, risk assessment audits, and mandatory human oversight',
        'Making the model completely open source for public download',
        'Running only on solar-powered server hardware',
        'Eliminating all databases from the software'
      ],
      correctIndex: 0,
      explanation: 'High-Risk AI systems under the EU AI Act require strict conformity assessments, risk management documentation, robust training data governance, and human-in-the-loop oversight.'
    },
    completed: false,
  },
  {
    id: 'step-nt-5',
    stepNumber: 5,
    track: 'non-technical',
    title: 'No-Code AI Automation & Agentic Workflows for Daily Operations',
    subtitle: 'Orchestrate models with Google Sheets, Slack, Gmail, and databases without writing scripts.',
    phase: 'Phase 5: Implementation & Scaling',
    estimatedMinutes: 36,
    difficulty: 'Beginner',
    lectureId: 'lec-10',
    learningObjectives: [
      'Connect LLMs to visual webhook builders for automated task pipelines',
      'Design fail-safes and human approval gates to intercept errors before sending',
      'Extract unstructured text from PDFs directly into relational spreadsheets'
    ],
    practicalTakeaways: [
      'Automate the 80% repetitive manual parsing and keep human attention on edge cases',
      'Always test automations with synthetic dummy data first'
    ],
    checklist: [
      'Built a multi-step visual webhook pipeline connecting AI to email',
      'Configured a human approval button before external dispatch',
      'Stress-tested pipeline with malformed inputs to verify fallback triggers'
    ],
    quiz: {
      question: 'Why is a Human-in-the-Loop approval gate recommended before automated AI emails are dispatched to customers?',
      options: [
        'To prevent hallucinations or sensitive misstatements from reaching clients unreviewed',
        'Because computers cannot send emails without a mouse click',
        'To slow down internet traffic',
        'Because email servers reject machine-written text'
      ],
      correctIndex: 0,
      explanation: 'Human-in-the-loop gates ensure brand safety, verify factual correctness, and protect against unintended commitments or reputational risks.'
    },
    completed: false,
  },

  // --- TECHNICAL AI ENGINEERING PLAN (STEP-BY-STEP) ---
  {
    id: 'step-tech-1',
    stepNumber: 1,
    track: 'technical',
    title: 'Attention Is All You Need: Mathematical Foundations & Tensor Ops',
    subtitle: 'Dissect Scaled Dot-Product Attention, Multi-Head projections, layer normalization, and positional encoding.',
    phase: 'Phase 1: Transformer Architecture',
    estimatedMinutes: 42,
    difficulty: 'Advanced',
    lectureId: 'lec-1',
    learningObjectives: [
      'Derive softmax(QK^T / sqrt(d_k))V and quadratic O(N^2) token complexity',
      'Understand projection of queries, keys, and values into parallel subspace heads',
      'Analyze residual connection gradients and pre-layer vs post-layer normalization'
    ],
    practicalTakeaways: [
      'Scaling factor 1/sqrt(d_k) prevents softmax gradients from vanishing in high dimensions',
      'Positional embeddings restore sequence order lost when eliminating recurrent connections'
    ],
    checklist: [
      'Derived query-key dot product attention formula by hand',
      'Implemented scaled dot product attention in PyTorch tensor notation',
      'Inspected attention heatmaps across multiple attention heads'
    ],
    quiz: {
      question: 'Why do we scale the dot product of Query and Key vectors by 1/sqrt(d_k)?',
      options: [
        'To prevent dot products from growing excessively large, which pushes softmax into regions with vanishing gradients',
        'To speed up CPU clock cycles during matrix multiplication',
        'To invert the direction of the attention vector',
        'To round decimal weights into integer values'
      ],
      correctIndex: 0,
      explanation: 'For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients. Dividing by sqrt(d_k) stabilizes training gradients.'
    },
    completed: true,
  },
  {
    id: 'step-tech-2',
    stepNumber: 2,
    track: 'technical',
    title: 'Parameter-Efficient Fine Tuning (LoRA/QLoRA) & Production RAG',
    subtitle: 'Decompose weight updates into low-rank matrices, quantize to 4-bit NormalFloat, and build hybrid semantic search.',
    phase: 'Phase 2: Adaptation & Retrieval',
    estimatedMinutes: 35,
    difficulty: 'Intermediate',
    lectureId: 'lec-2',
    learningObjectives: [
      'Derive W_new = W_0 + B * A where rank r << d',
      'Implement 4-bit NormalFloat (NF4) quantization with double quantization',
      'Pair semantic vector embeddings with Reciprocal Rank Fusion (RRF) rerankers'
    ],
    practicalTakeaways: [
      'LoRA cuts GPU VRAM consumption by 75%+ during fine-tuning',
      'RAG chunk size and overlap determine retrieval precision more than embedding model size'
    ],
    checklist: [
      'Configured HuggingFace PEFT LoRAConfig with rank r=16 and alpha=32',
      'Loaded 7B foundation weights in 4-bit NF4 using bitsandbytes',
      'Built hybrid BM25 + dense vector search with cross-encoder reranker'
    ],
    quiz: {
      question: 'In LoRA (Low-Rank Adaptation), how are pretrained weights handled during fine-tuning?',
      options: [
        'The pretrained base weights are completely frozen, and only low-rank adapter matrices are updated',
        'All pretrained weights are updated with double precision',
        'Pretrained weights are deleted to save memory',
        'Every layer is replaced with a single dense neuron'
      ],
      correctIndex: 0,
      explanation: 'LoRA freezes the original model weights and injects trainable rank decomposition matrices into each transformer layer, dramatically reducing trainable parameters and gradient memory.'
    },
    completed: true,
  },
  {
    id: 'step-tech-3',
    stepNumber: 3,
    track: 'technical',
    title: 'Embodied AI & Computer Vision: YOLOv8, 3D LiDAR & Sensor Fusion',
    subtitle: 'Real-time object detection with anchor-free heads, PointNet coordinate ingestion, and Extended Kalman Filters.',
    phase: 'Phase 3: Multimodal Perception',
    estimatedMinutes: 50,
    difficulty: 'Intermediate',
    lectureId: 'lec-4',
    learningObjectives: [
      'Understand anchor-free object detection heads and Task-Aligned Assigner',
      'Process unordered 3D point cloud sets with permutation-invariant networks',
      'Fuse camera RGB frames with LiDAR range measurements using EKF'
    ],
    practicalTakeaways: [
      'Anchor-free heads simplify training and generalize better across varying aspect ratios',
      'Sensor fusion compensates for camera glare in direct sunlight and LiDAR attenuation in rain'
    ],
    checklist: [
      'Trained custom YOLOv8 model for robot manipulator part detection',
      'Streamed point cloud clusters into RViz2 / ROS2 perception node',
      'Tuned Extended Kalman Filter covariance matrices for smooth state estimation'
    ],
    quiz: {
      question: 'Why are anchor-free object detection architectures advantageous compared to anchor-based models?',
      options: [
        'They predict bounding box coordinates directly without requiring heuristic anchor box tuning',
        'They only work with black and white images',
        'They eliminate the need for convolutional feature pyramids',
        'They can only detect one object per image'
      ],
      correctIndex: 0,
      explanation: 'Anchor-free detectors eliminate hyperparameter tuning for anchor box scales and aspect ratios, reducing training complexity while achieving high detection accuracy.'
    },
    completed: false,
  },
  {
    id: 'step-tech-4',
    stepNumber: 4,
    track: 'technical',
    title: 'Robotics Kinematics, Gazebo URDF Physics & Trajectory Splines',
    subtitle: 'Forward/Inverse kinematics, Denavit-Hartenberg frames, Jacobian singularities, and ROS2 controllers.',
    phase: 'Phase 4: Physical Manipulation',
    estimatedMinutes: 54,
    difficulty: 'Advanced',
    lectureId: 'lec-5',
    learningObjectives: [
      'Compute end-effector spatial poses using DH transformation matrices',
      'Solve inverse kinematics using damped least squares near singularities',
      'Generate minimum-jerk polynomial trajectory splines in Gazebo physics'
    ],
    practicalTakeaways: [
      'Singularities cause infinite joint velocity requests; damping factor lambda is mandatory in real robots',
      'Always simulate collisions in Gazebo before running trajectory plans on hardware'
    ],
    checklist: [
      'Derived Denavit-Hartenberg table for 6-DOF robotic manipulator',
      'Built URDF mesh model with inertial, visual, and collision tags',
      'Simulated trajectory execution in Gazebo with Joint Trajectory Controller'
    ],
    quiz: {
      question: 'What occurs at a kinematic singularity in a robotic arm?',
      options: [
        'The Jacobian matrix loses rank, preventing motion in one or more Cartesian directions without infinite joint velocities',
        'The robot motor power supply immediately shuts down',
        'The forward kinematics equations become unsolvable',
        'The robot reverses its rotation direction randomly'
      ],
      correctIndex: 0,
      explanation: 'At a singularity, the Jacobian loses rank and cannot be inverted, meaning the manipulator cannot achieve certain end-effector velocities without instantaneous infinite joint acceleration.'
    },
    completed: false,
  },
  {
    id: 'step-tech-5',
    stepNumber: 5,
    track: 'technical',
    title: 'Post-Training Alignment: RLHF, DPO & Autonomous Agentic Loops',
    subtitle: 'Reward modeling, Direct Preference Optimization, and multi-agent ReAct frameworks with tool execution.',
    phase: 'Phase 5: Alignment & Frontier Agents',
    estimatedMinutes: 44,
    difficulty: 'Advanced',
    lectureId: 'lec-11',
    learningObjectives: [
      'Understand why Direct Preference Optimization replaces complex RL reward modeling',
      'Structure ReAct thought-action-observation loops with JSON schema validation',
      'Implement self-critique reflection steps to verify sandboxed code execution'
    ],
    practicalTakeaways: [
      'Pretraining yields raw reasoning; alignment delivers safety and steering reliability',
      'Constrain agent tool calls with strict typing and timeout boundaries'
    ],
    checklist: [
      'Formulated Bradley-Terry preference loss for DPO alignment training',
      'Implemented ReAct agent with sandboxed Python calculator tool',
      'Configured Monte Carlo tree search reflection loop for complex coding problems'
    ],
    quiz: {
      question: 'How does Direct Preference Optimization (DPO) simplify model alignment over classical PPO-based RLHF?',
      options: [
        'It derives an analytical closed-form solution that optimizes preferences directly without training a separate reward model or RL loop',
        'It eliminates the need for human preference dataset pairs',
        'It converts all model parameters into binary weights',
        'It requires training models only on single-word sentences'
      ],
      correctIndex: 0,
      explanation: 'DPO shows that the reward function can be implicitly parameterized by the language model policy itself, enabling direct optimization via binary cross-entropy and avoiding unstable RL training.'
    },
    completed: false,
  },
];

export const globalQuantHubs: GlobalQuantHub[] = [
  {
    id: 'hub-nyc',
    city: 'New York',
    region: 'Americas',
    exchange: 'NYSE / NASDAQ (Mahwah & Carteret)',
    status: 'OPEN',
    dailyQuantVolume: '$284.6B',
    aiOrderFlowShare: '78.4%',
    dominantStrategy: 'StatArb & Deep RL Execution',
    latencyBenchmark: '14.2 μs',
    benchmarkIndex: 'S&P 500 Quant Alpha',
    indexChange: '+1.42%',
  },
  {
    id: 'hub-lon',
    city: 'London',
    region: 'EMEA',
    exchange: 'LSE / Slough Equinix LD4',
    status: 'OPEN',
    dailyQuantVolume: '$142.8B',
    aiOrderFlowShare: '71.2%',
    dominantStrategy: 'G10 FX Macro & Cross-Venue Arbitrage',
    latencyBenchmark: '18.6 μs',
    benchmarkIndex: 'FTSE Systemic Factor',
    indexChange: '+0.88%',
  },
  {
    id: 'hub-tyo',
    city: 'Tokyo',
    region: 'APAC',
    exchange: 'JPX Arrowhead / Osaka Derivatives',
    status: 'AFTER-HOURS',
    dailyQuantVolume: '$96.4B',
    aiOrderFlowShare: '68.9%',
    dominantStrategy: 'Nikkei Volatility Dispersion & Carry',
    latencyBenchmark: '21.0 μs',
    benchmarkIndex: 'Nikkei 225 Quant',
    indexChange: '+1.19%',
  },
  {
    id: 'hub-sgp',
    city: 'Singapore',
    region: 'APAC',
    exchange: 'SGX / APAC Multi-Asset Hub',
    status: 'AFTER-HOURS',
    dailyQuantVolume: '$68.2B',
    aiOrderFlowShare: '74.5%',
    dominantStrategy: 'Cross-Border Index Futures & Commodity Basis',
    latencyBenchmark: '19.4 μs',
    benchmarkIndex: 'MSCI Asia Quant',
    indexChange: '+0.94%',
  },
  {
    id: 'hub-bom',
    city: 'Mumbai / GIFT City',
    region: 'APAC',
    exchange: 'NSE / BSE Colocation',
    status: 'AFTER-HOURS',
    dailyQuantVolume: '$89.5B',
    aiOrderFlowShare: '64.8%',
    dominantStrategy: 'Index Options Gamma Scalping & Dispersion',
    latencyBenchmark: '24.5 μs',
    benchmarkIndex: 'NIFTY 50 Algo Index',
    indexChange: '+1.64%',
  },
  {
    id: 'hub-fra',
    city: 'Frankfurt',
    region: 'EMEA',
    exchange: 'Eurex / Deutsche Börse FR2',
    status: 'OPEN',
    dailyQuantVolume: '$112.1B',
    aiOrderFlowShare: '73.0%',
    dominantStrategy: 'Fixed Income Yield Curve & Bund Futures HFT',
    latencyBenchmark: '15.8 μs',
    benchmarkIndex: 'DAX Systematic',
    indexChange: '+0.76%',
  },
];

export const initialQuantStrategies: QuantStrategyItem[] = [
  {
    id: 'quant-1',
    name: 'Statistical Arbitrage & Ornstein-Uhlenbeck Pairs Trading',
    category: 'Statistical Arbitrage',
    difficulty: 'Intermediate',
    sharpeRatio: '2.45',
    typicalHorizon: 'Intraday to 5 Days',
    annualizedAlpha: '+18.4%',
    maxDrawdown: '-4.2%',
    mathematicalMethod: 'Engle-Granger Cointegration, Johansen Test & Kalman Filter Dynamic Hedge Ratio',
    formulaLatex: 'dS_t = \\theta (\\mu - S_t)dt + \\sigma dW_t, \\quad Z_t = \\frac{S_t - \\mu_S}{\\sigma_S}',
    coreMethodology: 'Identifies cointegrated asset baskets whose linear combination forms a stationary mean-reverting spread. Uses an online Kalman filter to continuously update hedge ratios beta_t and triggers market-neutral long/short entries when Z-score exceeds +/- 2.0 sigma.',
    realWorldApplication: 'Deployed across US semiconductor equities (e.g., NVDA/AMD/TSM baskets), dual-listed ADR vs local shares, and Brent vs WTI crude calendar spreads.',
    aiIntegration: 'Graph Neural Networks (GNNs) discover non-linear dynamic peer clusters across supply chains before traditional linear correlation matrices detect regime shifts.',
    riskControls: [
      'Stop-loss termination at Z-score > 4.0 sigma (structural break protection)',
      'Sector and beta neutrality constraints (|Net Beta| < 0.03)',
      'Earnings announcement blackout windows (+/- 48 hours)'
    ],
    executionSteps: [
      'Screen universe of 1,500 liquid equities for pairwise Augmented Dickey-Fuller (ADF) p-value < 0.01',
      'Estimate dynamic state-space hedge ratio via Kalman filter update equations',
      'Enter dollar-neutral spread when |Z_t| > 2.0 and exit upon mean reversion to |Z_t| < 0.35'
    ],
    xpReward: 160,
    completed: true,
  },
  {
    id: 'quant-2',
    name: 'Limit Order Book (LOB) Microstructure & Order Flow Imbalance',
    category: 'Market Microstructure & HFT',
    difficulty: 'Advanced',
    sharpeRatio: '3.60',
    typicalHorizon: '50 Milliseconds to 30 Seconds',
    annualizedAlpha: '+26.8%',
    maxDrawdown: '-2.1%',
    mathematicalMethod: 'Order Book Imbalance (OBI), Hawkes Self-Exciting Point Processes & Almgren-Chriss Optimal Execution',
    formulaLatex: 'OBI_t = \\frac{V_t^{bid} - V_t^{ask}}{V_t^{bid} + V_t^{ask}}, \\quad \\lambda(t) = \\mu + \\sum_{t_i < t} \\alpha e^{-\\beta(t - t_i)}',
    coreMethodology: 'Models L3 tick-by-tick limit order book queue depletion, cancellation rates, and trade arrival intensity using mutually exciting Hawkes processes to predict short-term mid-price tick movements and minimize adverse selection.',
    realWorldApplication: 'Market-making on NASDAQ/Eurex/NSE futures, optimal VWAP/TWAP child order slicing for institutional block execution, and queue-position sniping.',
    aiIntegration: 'DeepLOB (Convolutional + Transformer architectures over L2/L3 order book tensors) predicts directional price ticks 100ms ahead with calibrated probability.',
    riskControls: [
      'Real-time inventory skew penalty to prevent directional accumulation',
      'Kill-switch triggered if toxic flow VPIN (Volume-Synchronized Probability of Informed Trading) > 0.85',
      'Strict colocation latency budget (< 25 microseconds wire-to-wire)'
    ],
    executionSteps: [
      'Ingest Level-3 ITCH/OUCH feed and reconstruct top-10 price levels in ring buffers',
      'Compute multi-level weighted Order Book Imbalance and trade flow toxicity metrics',
      'Post passive limit quotes skewed away from toxic inventory or cross spread when alpha exceeds half-spread cost'
    ],
    xpReward: 200,
    completed: false,
  },
  {
    id: 'quant-3',
    name: 'Deep Reinforcement Learning (PPO / SAC) Portfolio & Execution Agent',
    category: 'AI / Deep RL Alpha',
    difficulty: 'Advanced',
    sharpeRatio: '2.78',
    typicalHorizon: '1 Hour to 10 Days',
    annualizedAlpha: '+22.1%',
    maxDrawdown: '-5.8%',
    mathematicalMethod: 'Markov Decision Process (MDP) with Differential Sharpe Ratio Reward & Proximal Policy Optimization',
    formulaLatex: 'J(\\pi_\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta} \\left[ \\sum_{t=0}^T \\gamma^t \\left( R_t - \\lambda \\cdot \\text{TC}_t - \\eta \\cdot \\text{CVaR}_t \\right) \\right]',
    coreMethodology: 'Formulates dynamic portfolio allocation and trade execution as a continuous-action Markov Decision Process. Unlike supervised return forecasting, the RL policy directly optimizes net-of-cost risk-adjusted returns including transaction slippage and turnover penalties.',
    realWorldApplication: 'Multi-asset futures allocation (Equities, Treasuries, Commodities, FX), adaptive liquidation of large institutional parent orders, and dynamic leverage scaling.',
    aiIntegration: 'Uses an ensemble of PPO, Soft Actor-Critic (SAC), and Decision Transformers trained across synthetic regime-switching market environments.',
    riskControls: [
      'Action-space projection layer enforcing hard gross and net leverage caps',
      'Out-of-distribution epistemic uncertainty detection via critic ensemble variance',
      'Turnover penalty embedded directly in the per-step reward function'
    ],
    executionSteps: [
      'Construct state tensor combining multi-timeframe price returns, realized volatility, and macro regime indicators',
      'Train Actor-Critic policy with transaction cost and market impact simulator',
      'Deploy ensemble policy with real-time drawdown throttling'
    ],
    xpReward: 220,
    completed: false,
  },
  {
    id: 'quant-4',
    name: 'Stochastic Volatility Surface Arbitrage & Dispersion Trading',
    category: 'Volatility & Options',
    difficulty: 'Advanced',
    sharpeRatio: '2.15',
    typicalHorizon: '1 Day to 45 Days',
    annualizedAlpha: '+16.9%',
    maxDrawdown: '-4.9%',
    mathematicalMethod: 'Heston / SABR Stochastic Volatility Calibration, Delta-Gamma-Vega Neutrality & Implied Correlation Dispersion',
    formulaLatex: '\\sigma_{index}^2 \\approx \\sum_{i=1}^N w_i^2 \\sigma_i^2 + 2 \\sum_{i < j} w_i w_j \\sigma_i \\sigma_j \\rho_{ij}^{imp}',
    coreMethodology: 'Exploits structural risk premia between index implied volatility and constituent single-stock implied volatilities. Sells rich index correlation (short index straddles/variance swaps) while buying constituent volatility, continuously delta-hedging to harvest gamma scalping PnL.',
    realWorldApplication: 'S&P 500 (SPX) vs Top-50 constituent options dispersion, NIFTY 50 vs BankNifty volatility surface arbitrage, and earnings implied-vs-realized vol harvesting.',
    aiIntegration: 'Physics-Informed Neural Networks (PINNs) calibrate arbitrage-free SVI/SABR volatility surfaces in sub-millisecond time and forecast realized volatility jumps.',
    riskControls: [
      'Tail-risk convexity hedge via far OTM VIX call spreads (crash correlation protection)',
      'Continuous Vega and Vomma bucket limits across expiration tenors',
      'Automated delta-hedging threshold bands to optimize gamma capture vs transaction cost'
    ],
    executionSteps: [
      'Fit arbitrage-free implied volatility surface across strikes and maturities',
      'Compute implied correlation cube and identify dispersion Z-score > 1.8',
      'Execute vega-neutral short index / long single-stock option basket and run automated delta hedger'
    ],
    xpReward: 190,
    completed: false,
  },
  {
    id: 'quant-5',
    name: 'Transformer Financial NLP, Earnings Call & Alternative Data Alpha',
    category: 'Sentiment & NLP Alpha',
    difficulty: 'Intermediate',
    sharpeRatio: '2.05',
    typicalHorizon: '1 Day to 30 Days',
    annualizedAlpha: '+15.6%',
    maxDrawdown: '-5.1%',
    mathematicalMethod: 'Domain-Adapted Financial LLM Embeddings, Cross-Attention Sentiment Drift & Post-Earnings Announcement Drift (PEAD)',
    formulaLatex: '\\alpha_{i,t} = \\beta_1 \\Delta \\text{Tone}_{i,t}^{LLM} + \\beta_2 \\text{Surprise}_{i,t}^{EPS} + \\beta_3 \\text{SupplyChain}_{i,t}^{GNN}',
    coreMethodology: 'Extracts granular semantic signals from SEC 10-K/10-Q filings, live earnings call audio transcripts (executive vocal hesitation + Q&A evasiveness), central bank statements, and global supply-chain news to capture alpha before consensus analyst revisions.',
    realWorldApplication: 'Global equity long/short ranking around quarterly earnings seasons, FOMC/ECB hawkish-dovish rate trajectory trading, and supply-chain disruption hedging.',
    aiIntegration: 'Fine-tuned FinBERT + LoRA-adapted frontier LLMs score sentence-level guidance revisions, hedging language shifts, and cross-company supplier mentions.',
    riskControls: [
      'Point-in-time timestamp verification to eliminate look-ahead bias in backtests',
      'Orthogonalization against Fama-French 5 factors and momentum to isolate pure NLP alpha',
      'Position sizing capped at 1.5% of Average Daily Volume (ADV)'
    ],
    executionSteps: [
      'Ingest live earnings call transcript chunks and SEC EDGAR filings within 800ms of release',
      'Run FinLLM prompt & embedding pipeline to compute Management Confidence & Guidance Delta scores',
      'Rank cross-sectional universe into deciles and construct market-neutral long Top-Decile / short Bottom-Decile portfolio'
    ],
    xpReward: 180,
    completed: false,
  },
  {
    id: 'quant-6',
    name: 'Systematic Multi-Factor Cross-Sectional Alpha & Regime Risk Parity',
    category: 'Macro & Factor Investing',
    difficulty: 'Beginner',
    sharpeRatio: '1.85',
    typicalHorizon: '1 Week to 6 Months',
    annualizedAlpha: '+14.2%',
    maxDrawdown: '-6.0%',
    mathematicalMethod: 'Fama-French-Carhart Factor Orthogonalization, Black-Litterman Bayesian Views & Hierarchical Risk Parity (HRP)',
    formulaLatex: 'R_{i,t} - R_{f,t} = \\alpha_i + \\sum_{k=1}^K \\beta_{i,k} F_{k,t} + \\epsilon_{i,t}, \\quad w^* = \\Sigma^{-1}(\\mu - \\lambda \\mathbf{1})',
    coreMethodology: 'Combines orthogonalized Value, Cross-Sectional Momentum, Quality, Low-Volatility, and Carry factors across global equities, fixed income, and currencies. Allocates risk dynamically using Lopez de Prado Hierarchical Risk Parity (HRP) to avoid covariance matrix inversion instability.',
    realWorldApplication: 'Institutional sovereign wealth and quant hedge fund core portfolios across MSCI World, Emerging Markets, G10 FX carry, and sovereign bond futures.',
    aiIntegration: 'Hidden Markov Models (HMM) and Gradient Boosted Decision Trees dynamically weight factor exposures based on inflation, liquidity, and volatility regimes.',
    riskControls: [
      'Hierarchical clustering covariance allocation to prevent concentration in collinear assets',
      'Dynamic volatility targeting (e.g., constant 10% annualized portfolio volatility)',
      'Factor crowding monitor to reduce momentum exposure during sharp market reversals'
    ],
    executionSteps: [
      'Compute standardized cross-sectional factor Z-scores across 3,000 global instruments',
      'Neutralize unintended country, industry, and market-beta exposures via linear programming',
      'Apply Hierarchical Risk Parity (HRP) tree clustering to size weights and rebalance monthly'
    ],
    xpReward: 150,
    completed: false,
  },
];

