import React, { useState } from 'react';
import {
  Trophy,
  Globe,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Users,
  Search,
  CheckCircle2,
  Sparkles,
  Shield,
  Bot,
  Brain,
  Layers,
  ChevronDown,
  ChevronUp,
  Share2,
  Award,
  ArrowRight,
  Bookmark,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';
import { ContestItem } from '../../types';

export const ContestsView: React.FC = () => {
  const { contests, registerForContest, showToast, setActiveTab, setIsQuickCaptureOpen } = useApp();

  const [regionFilter, setRegionFilter] = useState<'All' | 'India' | 'Global'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContest, setSelectedContest] = useState<ContestItem | null>(null);
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  const categories = [
    'All',
    'GenAI & Agents',
    'Cybersecurity & CTF',
    'Robotics & Hardware',
    'Competitive ML & Kaggle',
    'AI for Social Good',
  ];

  const filteredContests = contests.filter(item => {
    const matchRegion = regionFilter === 'All' || item.region === regionFilter;
    const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchRegion && matchCategory && matchSearch;
  });

  const indiaCount = contests.filter(c => c.region === 'India').length;
  const globalCount = contests.filter(c => c.region === 'Global').length;

  const handleShare = (contest: ContestItem) => {
    if (navigator.share) {
      navigator.share({
        title: contest.title,
        text: `Compete in ${contest.title} (${contest.prizePool})! Found on Europa Ai:`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${contest.title} - ${contest.websiteUrl}`);
      showToast('Contest details copied to clipboard!');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cybersecurity & CTF':
        return <Shield className="w-4 h-4 text-rose-400" />;
      case 'Robotics & Hardware':
        return <Bot className="w-4 h-4 text-emerald-400" />;
      case 'Competitive ML & Kaggle':
        return <Brain className="w-4 h-4 text-purple-400" />;
      case 'AI for Social Good':
        return <Globe className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="AI Contests & Global Hacking Arena"
        subtitle="National Indian hackathons, global cybersecurity CTFs, frontier AI agent sprints, and autonomous robotics challenges."
        badge="₹250+ Cr Prize Pool"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs font-bold text-cyan-600 dark:text-cyan-300 hover:text-cyan-500 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Capture Idea</span>
          </button>
        </div>
      </PageBackHeader>

      {/* Hero Stats & Highlight Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4 rounded-3xl border border-white/20 dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Total Active Purse</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">₹250+ Cr</div>
          <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">$33.5M+ USD equivalent</div>
        </div>

        <div className="glass-card p-4 rounded-3xl border border-white/20 dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">🇮🇳 India Challenges</span>
            <MapPin className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{indiaCount} Premier</div>
          <div className="text-[10px] text-orange-600 dark:text-orange-400 font-mono mt-0.5">SIH, IIT Bombay, CERT-In</div>
        </div>

        <div className="glass-card p-4 rounded-3xl border border-white/20 dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">🌍 Global Contests</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{globalCount} Competitions</div>
          <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">DEF CON, Gemini, ARC-AGI</div>
        </div>

        <div className="glass-card p-4 rounded-3xl border border-white/20 dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Europa Team Finder</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">Active P2P</div>
          <button
            onClick={() => setActiveTab('forum')}
            className="text-[10px] text-purple-600 dark:text-purple-400 font-mono mt-0.5 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Match with scholars</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Region Tabs (India vs Global) & Category Filters */}
      <div className="glass-card p-4 rounded-3xl border border-white/20 dark:border-white/10 shadow-lg space-y-3">
        {/* Top Region Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => setRegionFilter('All')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                regionFilter === 'All'
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              All Arenas ({contests.length})
            </button>
            <button
              onClick={() => setRegionFilter('India')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                regionFilter === 'India'
                  ? 'bg-orange-500/20 text-orange-600 dark:text-orange-300 border border-orange-500/40 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <span>🇮🇳 India Contests</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-orange-500/20 text-orange-600 dark:text-orange-300 font-mono">
                {indiaCount}
              </span>
            </button>
            <button
              onClick={() => setRegionFilter('Global')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                regionFilter === 'Global'
                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <span>🌍 Global Challenges</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-mono">
                {globalCount}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search hackathons, CTFs, tracks..."
              className="w-full glass-button rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-white/10">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold pr-1 shrink-0">
            Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'glass-button text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contest Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredContests.map(contest => {
          const isExpanded = expandedDetailsId === contest.id;

          return (
            <div
              key={contest.id}
              className={`glass-card rounded-3xl border transition-all duration-300 p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 shadow-xl ${
                contest.featured
                  ? 'border-cyan-500/30 bg-cyan-500/5'
                  : 'border-white/20 dark:border-white/10'
              }`}
            >
              <div>
                {/* Header row: Region badge, Category badge, Days Remaining */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl glass-button flex items-center gap-1 border border-white/20">
                      <span>{contest.flag}</span>
                      <span>{contest.region}</span>
                    </span>

                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      {getCategoryIcon(contest.category)}
                      <span>{contest.category}</span>
                    </span>
                  </div>

                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{contest.daysRemaining} days left</span>
                  </span>
                </div>

                {/* Title & Organizer */}
                <div className="mt-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                    {contest.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    <span>{contest.organizer}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {contest.location}
                    </span>
                  </div>
                </div>

                {/* Prize Pool Spotlight Card */}
                <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                      Prize Pool
                    </span>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {contest.prizePool}
                    </div>
                  </div>
                  {contest.prizePoolInr && (
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                        Approx. INR
                      </span>
                      <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        {contest.prizePoolInr}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {contest.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {contest.tags.map(t => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Expandable Problem Statement & Rules */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 space-y-1.5">
                      <div className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Problem Statement & Challenge Theme:</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                        {contest.problemStatement}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Contest Rules & Submission Format:
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-xs">
                        {contest.rules.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span>Eligibility: {contest.eligibility}</span>
                      <span>Format: {contest.format}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedDetailsId(isExpanded ? null : contest.id)}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'Problem Statement & Rules'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleShare(contest)}
                    title="Share contest"
                    className="p-1.5 rounded-xl glass-button text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Register / Interested button */}
                  <button
                    onClick={() => registerForContest(contest.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      contest.registered
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'glass-button text-slate-700 dark:text-slate-200 hover:border-cyan-500/50'
                    }`}
                  >
                    {contest.registered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>I'm Competing</span>
                      </>
                    )}
                  </button>

                  {/* External Portal Link */}
                  <a
                    href={contest.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-md hover:brightness-110 transition"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredContests.length === 0 && (
        <div className="glass-card p-12 rounded-3xl text-center space-y-3">
          <Trophy className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            No contests matched your current filters
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try switching between "All Arenas", "India Contests" or "Global Challenges", or clearing your search term.
          </p>
          <button
            onClick={() => {
              setRegionFilter('All');
              setCategoryFilter('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl glass-button text-xs font-bold text-cyan-600 dark:text-cyan-400 transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
