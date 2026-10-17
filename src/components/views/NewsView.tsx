import React, { useState } from 'react';
import {
  Newspaper,
  Bookmark,
  Share2,
  ExternalLink,
  Flame,
  Search,
  Calendar,
  Sparkles,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';
import { DailyNewsItem } from '../../types';

export const NewsView: React.FC = () => {
  const { news, toggleBookmarkNews, showToast, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<DailyNewsItem | null>(null);

  const tags = ['all', 'Model Release', 'Research Paper', 'Industry', 'Robotics', 'Ethics'];

  const filteredNews = news.filter(item => {
    const matchTag = selectedTag === 'all' || item.category === selectedTag;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTag && matchSearch;
  });

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, text: `Check out this AI breakthrough on Europa Ai: ${title}` });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="Daily AI & Robotics Newsfeed"
        subtitle="Curated daily updates on frontier model releases, research papers, and robotics breakthroughs."
        badge="Live Wire"
      >
        <button
          onClick={() => setActiveTab('contests')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-bold hover:brightness-110 transition cursor-pointer"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>AI & Hacking Contests (🇮🇳 & Global)</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </PageBackHeader>

      {/* Filter and Search Bar in Translucent Glass */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-3xl border border-white/20 dark:border-white/10 shadow-lg">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search news, papers or releases..."
            className="w-full glass-button rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                selectedTag === tag
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'glass-button text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tag === 'all' ? 'All Updates' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNews.map(item => (
          <div
            key={item.id}
            className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono uppercase bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {item.category}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{item.source}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                  <Calendar className="w-3 h-3 text-cyan-500" />
                  <span>{item.date}</span>
                </div>
              </div>

              <h3
                onClick={() => setActiveArticle(item)}
                className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition cursor-pointer leading-snug mb-2"
              >
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                {item.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{item.readTime} read</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmarkNews(item.id)}
                  title="Bookmark update"
                  className={`p-2 rounded-xl transition cursor-pointer border ${
                    item.bookmarked
                      ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                      : 'glass-button text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleShare(item.title)}
                  title="Share article"
                  className="p-2 rounded-xl glass-button text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveArticle(item)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-sm shadow-cyan-500/20"
                >
                  <span>Read Brief</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal in Frosted Glass */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative text-slate-900 dark:text-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono uppercase bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  {activeArticle.category}
                </span>
                <span className="text-slate-500 dark:text-slate-400">• {activeArticle.source}</span>
                <span className="text-slate-500 dark:text-slate-400">• {activeArticle.date}</span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="w-7 h-7 rounded-xl glass-button flex items-center justify-center text-slate-500 hover:text-rose-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-snug">{activeArticle.title}</h2>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-sans">
              <p>{activeArticle.content}</p>
              <div className="p-3.5 glass-panel rounded-2xl border border-white/20 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">
                <strong>Academic / Primary Citation:</strong> Published in preprint and peer-reviewed conference archives. Full arXiv PDF available at <a href={activeArticle.url} target="_blank" rel="noopener noreferrer" className="text-cyan-500 underline font-mono">{activeArticle.url}</a>.
              </div>
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 glass-button text-slate-800 dark:text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
