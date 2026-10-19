import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  ArrowRight,
  Shield,
  Briefcase,
  Code2,
  Calendar,
  MessageSquare,
  PenTool,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { videoLectures } from '../../data/initialData';
import { StepWiseLearningItem, VideoLecture } from '../../types';
import { resolveLearningPathIdFromCategory } from '../../utils/voxelPathIcons';

export const StepWiseVideoLearning: React.FC = () => {
  const {
    stepWisePlans,
    toggleStepComplete,
    selectedTrackPlan,
    setSelectedTrackPlan,
    setActiveLecture,
    setIsQuickCaptureOpen,
    setActiveNpc,
    showToast,
    user,
    voxelPathIcons,
  } = useApp();

  const [expandedQuizStepId, setExpandedQuizStepId] = useState<string | null>(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [dailyPace, setDailyPace] = useState<'15' | '30' | '60'>('30');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');

  // Filter steps by active track plan
  const currentPlanSteps = stepWisePlans.filter(step => step.track === selectedTrackPlan);

  const filteredSteps = currentPlanSteps.filter(step => {
    if (filterDifficulty === 'all') return true;
    return step.difficulty === filterDifficulty;
  });

  const totalSteps = currentPlanSteps.length;
  const completedSteps = currentPlanSteps.filter(s => s.completed).length;
  const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const totalMinutes = currentPlanSteps.reduce((acc, s) => acc + s.estimatedMinutes, 0);
  const remainingMinutes = currentPlanSteps.filter(s => !s.completed).reduce((acc, s) => acc + s.estimatedMinutes, 0);

  const daysToComplete = Math.ceil(remainingMinutes / parseInt(dailyPace));

  const handleSelectQuizOption = (stepId: string, optionIndex: number) => {
    setSelectedQuizAnswers(prev => ({ ...prev, [stepId]: optionIndex }));
  };

  const handleCheckQuizAnswer = (stepId: string) => {
    setQuizSubmitted(prev => ({ ...prev, [stepId]: true }));
  };

  const toggleChecklistItem = (stepId: string, checkIndex: number) => {
    const key = `${stepId}-${checkIndex}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getLecture = (lectureId: string): VideoLecture | undefined => {
    return videoLectures.find(l => l.id === lectureId);
  };

  const handleLaunchStepVideo = (lectureId: string) => {
    const lecture = getLecture(lectureId);
    if (lecture) {
      setActiveLecture(lecture);
    } else {
      showToast('Video lecture loading...');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Track Plan Switcher Hero Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Step-Wise Video Academy
              </span>
              <span className="text-xs font-mono uppercase bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full font-bold">
                {selectedTrackPlan === 'non-technical' ? 'Zero Coding Required' : 'Advanced Engineering'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {selectedTrackPlan === 'non-technical'
                ? 'Non-Technical AI Strategy & Leadership Plan'
                : 'Frontier AI Engineering & Robotics Curriculum'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedTrackPlan === 'non-technical'
                ? 'Master artificial intelligence from the ground up without writing code. Focus on mental models, token economics, business ROI, prompt engineering, copyright compliance, and no-code automation.'
                : 'Deep architectural immersion: Scaled self-attention, parameter-efficient LoRA/QLoRA adaptation, autonomous perception, robotics kinematics, and post-training alignment.'}
            </p>
          </div>

          {/* Interactive Learning Plan Toggle Pill */}
          <div className="glass-panel p-1.5 rounded-2xl flex items-center shrink-0 border border-white/30 dark:border-white/10 shadow-lg w-full sm:w-auto">
            <button
              onClick={() => setSelectedTrackPlan('non-technical')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                selectedTrackPlan === 'non-technical'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Non-Technical Plan</span>
            </button>

            <button
              onClick={() => setSelectedTrackPlan('technical')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                selectedTrackPlan === 'technical'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Technical Track</span>
            </button>
          </div>
        </div>

        {/* Progress Metrics & Daily Pace Bar */}
        <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">
              <span>Overall Progress</span>
              <span className="font-bold text-slate-800 dark:text-white font-mono">{progressPct}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 rounded-full ${
                  selectedTrackPlan === 'non-technical'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                    : 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              {completedSteps} of {totalSteps} Steps Complete
            </p>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Estimated Duration</span>
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Remaining to Learn</span>
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                {remainingMinutes === 0 ? 'All Completed!' : `${remainingMinutes} mins`}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
              <span>Target Study Pace</span>
              <span className="font-mono font-bold text-cyan-500">{dailyPace} min/day</span>
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              {(['15', '30', '60'] as const).map(pace => (
                <button
                  key={pace}
                  onClick={() => setDailyPace(pace)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    dailyPace === pace
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'bg-white/10 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {pace}m
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {remainingMinutes === 0 ? 'Goal Achieved!' : `~${daysToComplete} days to certificate`}
            </p>
          </div>
        </div>
      </div>

      {/* Non-Technical Highlights Banner (When Non-Technical Track is Active) */}
      {selectedTrackPlan === 'non-technical' && (
        <div className="glass-card border border-emerald-500/30 rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Executive Non-Technical AI Competencies</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Designed for product managers, corporate directors, founders, and creative leads who want to steer AI initiatives with clarity.
              </p>
            </div>
            <button
              onClick={() => setActiveNpc({
                id: 'ada',
                name: 'Ada Lovelace',
                title: 'Archivist & Non-Technical Mentor',
                greeting: 'Greetings! I am here to guide your non-technical exploration of artificial intelligence without mathematical jargon.',
                description: 'First computer programmer and pioneer of poetic science.',
                specialty: 'Conceptual AI, Ethics, Philosophy, and Business ROI',
                voicePitch: 1.1,
                recommendedTrack: 'Non-Technical AI Strategy',
              })}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Ada Lovelace (Mentor)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-500/20">
            <div className="glass-panel p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono text-emerald-500 font-bold block">01 • ROI & Economics</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Token Cost Models</span>
            </div>
            <div className="glass-panel p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono text-emerald-500 font-bold block">02 • Prompt Craft</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Role-Task-Constraint</span>
            </div>
            <div className="glass-panel p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono text-emerald-500 font-bold block">03 • Legal Safety</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">EU AI Act Tiers</span>
            </div>
            <div className="glass-panel p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono text-emerald-500 font-bold block">04 • No-Code Pipelines</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Autonomous Webhooks</span>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty Filter Bar */}
      <div className="flex items-center justify-between gap-4 glass-card p-3 rounded-2xl border border-white/10 flex-wrap">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Curriculum Sequence ({filteredSteps.length} Steps)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                filterDifficulty === diff
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {diff === 'all' ? 'All Steps' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* STEP-BY-STEP VERTICAL ROADMAP */}
      <div className="space-y-6 relative before:absolute before:top-8 before:bottom-8 before:left-6 sm:before:left-8 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-indigo-500 before:to-emerald-500 before:opacity-30">
        {filteredSteps.map((step, index) => {
          const lecture = getLecture(step.lectureId);
          const isQuizOpen = expandedQuizStepId === step.id;
          const userChoice = selectedQuizAnswers[step.id];
          const isSubmitted = quizSubmitted[step.id];
          const isCorrect = userChoice === step.quiz.correctIndex;

          return (
            <div
              key={step.id}
              className={`relative pl-14 sm:pl-20 transition-all duration-300 ${
                step.completed ? 'opacity-95' : 'opacity-100'
              }`}
            >
              {/* Step Node Marker on Conduit Line */}
              <div
                onClick={() => toggleStepComplete(step.id)}
                className={`absolute left-2.5 sm:left-4 top-5 w-8 h-8 rounded-2xl flex items-center justify-center font-mono text-xs font-bold cursor-pointer transition-transform hover:scale-110 shadow-lg z-10 ${
                  step.completed
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                    : index === 0 || currentPlanSteps[index - 1]?.completed
                    ? 'bg-cyan-500 text-white shadow-cyan-500/40 ring-4 ring-cyan-500/20 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
                title={step.completed ? 'Completed (Click to toggle)' : 'In Progress (Click to complete)'}
              >
                {step.completed ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>0{step.stepNumber}</span>
                )}
              </div>

              {/* Step Content Card */}
              <div
                className={`glass-card rounded-3xl p-5 sm:p-7 border shadow-xl transition-all duration-300 hover:border-cyan-500/40 space-y-5 ${
                  step.completed
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-white/20 dark:border-white/10'
                }`}
              >
                {/* Step Header Badges with 3D Voxel Learning Path Icon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {lecture && voxelPathIcons[resolveLearningPathIdFromCategory(lecture.category)] && (
                      <img
                        src={voxelPathIcons[resolveLearningPathIdFromCategory(lecture.category)].dataUri}
                        alt={`${lecture.category} 3D Voxel Path Icon`}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-lg object-cover border border-cyan-500/30 shadow-sm"
                      />
                    )}
                    <span className="text-xs font-mono uppercase bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 px-2.5 py-0.5 rounded-lg font-bold">
                      Step {step.stepNumber}
                    </span>
                    <span className="text-xs font-mono uppercase bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-lg font-semibold">
                      {step.phase}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        step.difficulty === 'Beginner'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : step.difficulty === 'Intermediate'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {step.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {step.estimatedMinutes} mins
                    </span>
                    {step.completed && (
                      <span className="flex items-center gap-1 text-emerald-500 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Step Title & Subtitle */}
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.subtitle}
                  </p>
                </div>

                {/* Integrated Video Preview Card */}
                {lecture && (
                  <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 p-3 sm:p-4 flex flex-col md:flex-row items-center gap-4 group">
                    {/* Thumbnail with Overlay Play Button */}
                    <div
                      onClick={() => handleLaunchStepVideo(lecture.id)}
                      className="relative w-full md:w-56 aspect-video rounded-xl overflow-hidden cursor-pointer shrink-0 shadow-md group-hover:shadow-cyan-500/20 transition"
                    >
                      <img
                        src={lecture.thumbnail}
                        alt={lecture.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {lecture.duration}
                      </span>
                    </div>

                    {/* Video Info & Launch Button */}
                    <div className="flex-1 min-w-0 space-y-2 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold uppercase">
                          Featured Video Lecture
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                          Instructor: {lecture.instructor}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {lecture.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {lecture.summary}
                      </p>

                      <div className="pt-1 flex items-center gap-3">
                        <button
                          onClick={() => handleLaunchStepVideo(lecture.id)}
                          className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Watch Step Video</span>
                        </button>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Includes interactive transcript & AI mentor
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Learning Objectives & Checkpoints */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Objectives */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Key Learning Objectives:</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {step.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Checklist */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Step Mastery Checklist:</span>
                    </span>
                    <div className="space-y-1.5">
                      {step.checklist.map((item, idx) => {
                        const itemKey = `${step.id}-${idx}`;
                        const isDone = !!checkedItems[itemKey] || step.completed;

                        return (
                          <div
                            key={idx}
                            onClick={() => toggleChecklistItem(step.id, idx)}
                            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 cursor-pointer text-xs transition"
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="rounded text-cyan-500 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                            />
                            <span
                              className={`transition-colors ${
                                isDone
                                  ? 'text-slate-400 line-through dark:text-slate-500'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Interactive Step Concept Check (Mini-Quiz) */}
                <div className="pt-2 border-t border-slate-200/50 dark:border-white/10">
                  <button
                    onClick={() => setExpandedQuizStepId(isQuizOpen ? null : step.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 py-1 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-purple-400" />
                      <span>Interactive Concept Check: Test Your Step Understanding</span>
                    </span>
                    {isQuizOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isQuizOpen && (
                    <div className="mt-3 p-4 rounded-2xl glass-panel border border-purple-500/20 space-y-3 animate-in fade-in duration-200">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {step.quiz.question}
                      </p>

                      <div className="space-y-2">
                        {step.quiz.options.map((opt, optIdx) => {
                          const isSelected = userChoice === optIdx;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectQuizOption(step.id, optIdx)}
                              className={`w-full text-left p-2.5 rounded-xl text-xs transition cursor-pointer border ${
                                isSelected
                                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-800 dark:text-purple-200 font-semibold'
                                  : 'bg-white/10 dark:bg-white/5 border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/15'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {userChoice !== undefined && !isSubmitted && (
                        <button
                          onClick={() => handleCheckQuizAnswer(step.id)}
                          className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
                        >
                          Check Answer
                        </button>
                      )}

                      {isSubmitted && (
                        <div
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            isCorrect
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          <p className="font-bold">
                            {isCorrect ? '✓ Correct! Concept mastered.' : 'Almost! Here is the insight:'}
                          </p>
                          <p className="text-[11px] leading-relaxed">
                            {step.quiz.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Step Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => toggleStepComplete(step.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm ${
                        step.completed
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{step.completed ? 'Step Completed (+100 XP)' : 'Mark Step Complete (+100 XP)'}</span>
                    </button>

                    <button
                      onClick={() => setIsQuickCaptureOpen(true)}
                      className="px-3.5 py-2 rounded-xl glass-button text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-500 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Take Step Notes</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    XP Reward: +100 XP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Track Completion Milestone Card */}
      {completedSteps >= totalSteps && totalSteps > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Congratulations, {user.name}! Track Completed
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              You have completed all {totalSteps} steps in the{' '}
              {selectedTrackPlan === 'non-technical' ? 'Non-Technical AI Leadership Plan' : 'Technical AI Engineering Plan'}.
              Your credential has been recorded in your Europa AI profile.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setSelectedTrackPlan(selectedTrackPlan === 'non-technical' ? 'technical' : 'non-technical')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs transition cursor-pointer shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2"
            >
              <span>Explore {selectedTrackPlan === 'non-technical' ? 'Technical Track' : 'Non-Technical Track'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
