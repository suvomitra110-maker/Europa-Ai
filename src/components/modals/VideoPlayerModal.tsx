import React, { useState } from 'react';
import { X, CheckCircle, FileText, Bookmark, Share2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VideoPlayerModal: React.FC = () => {
  const { activeLecture, setActiveLecture, completeLesson, addNote, showToast, setActiveTab, setActiveNpc } = useApp();
  const [activeTabSub, setActiveTabSub] = useState<'transcript' | 'keypoints' | 'quicknote' | 'mentor'>('keypoints');
  const [quickNoteText, setQuickNoteText] = useState('');
  const [mentorQuestion, setMentorQuestion] = useState('');
  const [mentorAnswer, setMentorAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  if (!activeLecture) return null;

  const handleAskMentor = async (q: string) => {
    const questionText = q || mentorQuestion;
    if (!questionText.trim()) return;
    setIsAsking(true);
    try {
      const res = await fetch('/api/ai/npc-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          npcId: activeLecture.category.includes('Robotics') ? 'alan' : activeLecture.category.includes('Ethics') || activeLecture.category.includes('Non') ? 'ada' : 'tensor',
          message: `In the lecture "${activeLecture.title}": ${questionText}`,
        }),
      });
      const data = await res.json();
      setMentorAnswer(data.reply);
    } catch {
      setMentorAnswer(`Here is a helpful conceptual hint: Deconstruct the formulation into its core inputs, transformation stages, and optimization objective.`);
    } finally {
      setIsAsking(false);
    }
  };

  const handleMarkComplete = () => {
    completeLesson('mod-1', activeLecture.id);
  };

  const handleSaveQuickNote = () => {
    if (!quickNoteText.trim()) return;
    addNote(
      `Notes: ${activeLecture.title}`,
      quickNoteText,
      activeLecture.category,
      activeLecture.tags,
      activeLecture.keyPoints.slice(0, 2)
    );
    setQuickNoteText('');
  };

  const handleSummarizeWithAi = () => {
    setActiveLecture(null);
    setActiveTab('summarizer');
    showToast('Transferred lecture transcript to AI Summarizer tool!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-5xl w-full h-[90vh] max-h-[820px] shadow-2xl relative text-slate-100 flex flex-col overflow-hidden">
        {/* Top bar with Prominent Back Option */}
        <div className="p-4 glass-panel border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveLecture(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-cyan-500 cursor-pointer shadow-sm transition group"
            >
              <span>← Back</span>
            </button>
            <span className="text-xs font-mono uppercase bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-xl font-bold">
              {activeLecture.category}
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {activeLecture.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkComplete}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                activeLecture.completed
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{activeLecture.completed ? 'Completed' : 'Mark Complete (+100 XP)'}</span>
            </button>
            <button
              onClick={() => setActiveLecture(null)}
              className="p-2 rounded-xl glass-button text-slate-500 dark:text-slate-400 hover:text-rose-500 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Split player + interactive study tabs */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left: Video Embed & Meta */}
          <div className="flex-1 flex flex-col bg-black">
            <div className="relative w-full aspect-video bg-slate-950">
              <iframe
                src={`${activeLecture.embedUrl}?autoplay=1&rel=0`}
                title={activeLecture.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-slate-900/95 flex-1 overflow-y-auto border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Instructor: <strong className="text-slate-200">{activeLecture.instructor}</strong></span>
                <span>Duration: {activeLecture.duration}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeLecture.summary}</p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {activeLecture.tags.map(t => (
                  <span key={t} className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Study Hub Sidebar */}
          <div className="w-full lg:w-96 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950/40 p-1">
              <button
                onClick={() => setActiveTabSub('keypoints')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  activeTabSub === 'keypoints'
                    ? 'bg-slate-800 text-cyan-400 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Key Concepts
              </button>
              <button
                onClick={() => setActiveTabSub('transcript')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  activeTabSub === 'transcript'
                    ? 'bg-slate-800 text-cyan-400 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Transcript
              </button>
              <button
                onClick={() => setActiveTabSub('quicknote')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  activeTabSub === 'quicknote'
                    ? 'bg-slate-800 text-cyan-400 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTabSub('mentor')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  activeTabSub === 'mentor'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ask Mentor
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeTabSub === 'keypoints' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Exam Takeaways</span>
                    <button
                      onClick={handleSummarizeWithAi}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> AI Extract
                    </button>
                  </div>

                  {activeLecture.keyPoints.map((pt, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-400 font-mono text-[10px] flex items-center justify-center shrink-0 border border-indigo-700/60">
                        {i + 1}
                      </span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTabSub === 'transcript' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Full Audio Transcript</span>
                    <button
                      onClick={handleSummarizeWithAi}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Summarize in AI Tool
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    {activeLecture.transcript}
                  </div>
                </div>
              )}

              {activeTabSub === 'quicknote' && (
                <div className="flex flex-col h-full gap-3">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Quick Note Editor</span>
                  <textarea
                    rows={8}
                    value={quickNoteText}
                    onChange={e => setQuickNoteText(e.target.value)}
                    placeholder="Type key formulas, insights or questions while watching..."
                    className="w-full flex-1 bg-slate-950/70 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleSaveQuickNote}
                    className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Save to Europa Notes</span>
                  </button>
                </div>
              )}

              {activeTabSub === 'mentor' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>In-Lecture Mentor Guidance</span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Stuck on a concept or formula? Ask your mentor for an intuitive explanation or hint.
                  </p>

                  <div className="space-y-1.5">
                    {[
                      'Can you break down the intuition behind this lecture?',
                      'What is the most common exam pitfall for this topic?',
                      'Explain the formula step-by-step with a simple analogy.',
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAskMentor(q)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition cursor-pointer border border-slate-700/60"
                      >
                        💡 {q}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mentorQuestion}
                      onChange={e => setMentorQuestion(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAskMentor(mentorQuestion);
                      }}
                      placeholder="Type a specific question about this video..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={() => handleAskMentor(mentorQuestion)}
                      disabled={isAsking}
                      className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                    >
                      {isAsking ? '...' : 'Ask'}
                    </button>
                  </div>

                  {mentorAnswer && (
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-xs text-slate-200 leading-relaxed space-y-2">
                      <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Mentor Hint & Explanation:</span>
                      </div>
                      <p className="whitespace-pre-line">{mentorAnswer}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
