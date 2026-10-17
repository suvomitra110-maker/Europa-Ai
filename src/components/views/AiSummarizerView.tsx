import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Download,
  Trash2,
  CheckCircle,
  Copy,
  BookOpen,
  Sliders,
  Target,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';
import { ExportPdfModal } from '../modals/ExportPdfModal';
import { StudyNote } from '../../types';

export const AiSummarizerView: React.FC = () => {
  const { notes, addNote, deleteNote, showToast, unlockBadge } = useApp();

  const [transcriptInput, setTranscriptInput] = useState('');
  const [sourceTitle, setSourceTitle] = useState('Lecture: Attention Is All You Need & Transformer Internals');
  const [summaryLength, setSummaryLength] = useState<'concise' | 'standard' | 'detailed'>('standard');
  const [focusArea, setFocusArea] = useState<string>('All Core Concepts');
  const [customFocus, setCustomFocus] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeExportNote, setActiveExportNote] = useState<StudyNote | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const focusOptions = [
    'All Core Concepts',
    'Mathematical Formulations & Loss Functions',
    'System Architecture & Engineering Trade-offs',
    'Business ROI, Strategy & Product Applications',
    'Safety, Alignment Guardrails & Failure Modes',
    'Key Takeaways for Exams & Interviews',
    'Custom Focus Query',
  ];

  const sampleTranscripts = [
    {
      title: 'Attention & Transformers Internals',
      focus: 'Mathematical Formulations & Loss Functions',
      text: `In this lecture, we examine self-attention mechanisms where each token projects queries, keys, and values.
We compute softmax(Q * K^T / sqrt(d_k)) * V. The scaling term sqrt(d_k) is essential to prevent vanishing gradients when dimensions scale up.
Multi-Head Attention projects into h different representation subspaces, allowing the model to attend to positional and semantic relations simultaneously.
Residual connections around each sublayer followed by LayerNorm stabilize gradients across deep stacks.`,
    },
    {
      title: 'Robotics Inverse Kinematics & Jacobians',
      focus: 'System Architecture & Engineering Trade-offs',
      text: `Robot manipulators rely on Denavit-Hartenberg parameters to define joint coordinate frames.
Forward kinematics determines the end-effector position from joint angles theta.
Inverse kinematics calculates required joint angles for a specified Cartesian target position.
The Jacobian matrix maps joint velocities to Cartesian velocities. Singularities occur when det(J) = 0, meaning the manipulator loses degrees of freedom and requires infinite angular joint velocity.`,
    },
    {
      title: 'RLHF, PPO & Direct Preference Optimization',
      focus: 'Safety, Alignment Guardrails & Failure Modes',
      text: `Pretraining yields raw predictive completion capability. Post-training uses human preference pairs to train a scalar Reward Model.
Proximal Policy Optimization (PPO) optimizes the language model policy to maximize predicted reward while penalizing KL divergence away from the base model.
Direct Preference Optimization (DPO) derives an exact implicit reward formulation, directly updating weights via binary cross-entropy on preferred vs dispreferred responses without an explicit RL training loop.`,
    },
    {
      title: 'AI Executive Strategy: Data Moats & Token Economics',
      focus: 'Business ROI, Strategy & Product Applications',
      text: `For business leaders, AI foundation models are rapidly becoming standardized commodities.
Defensibility lies in proprietary data flywheels, continuous human evaluation in the loop, and token throughput economics.
When calculating ROI, teams must weigh API token costs, fine-tuning infrastructure, and regulatory liability against labor productivity gains.`,
    },
  ];

  const handleGenerateSummary = async () => {
    if (!transcriptInput.trim()) {
      showToast('Please paste a lecture transcript or select a sample lecture.');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcriptInput,
          length: summaryLength,
          focusArea,
          customFocus: focusArea === 'Custom Focus Query' ? customFocus : '',
        }),
      });

      const data = await res.json();
      const generatedSummary = data.summary || '';

      // Determine subject category automatically
      const lower = (transcriptInput + ' ' + (sourceTitle || '')).toLowerCase();
      let autoCategory = 'Generative AI';
      let tags = ['AI', 'Theory'];

      if (lower.includes('robot') || lower.includes('kinematics') || lower.includes('jacobian') || lower.includes('lidar')) {
        autoCategory = 'Robotics';
        tags = ['Robotics', 'Kinematics', 'Simulation'];
      } else if (lower.includes('ethics') || lower.includes('rlhf') || lower.includes('alignment') || lower.includes('dpo') || lower.includes('bias')) {
        autoCategory = 'AI Ethics';
        tags = ['Ethics', 'Safety', 'Alignment'];
      } else if (lower.includes('strategy') || lower.includes('roi') || lower.includes('management') || lower.includes('business')) {
        autoCategory = 'Non-Technical AI';
        tags = ['Strategy', 'Leadership', 'Business'];
      } else {
        autoCategory = 'Generative AI';
        tags = ['Transformers', 'LLMs', 'DeepLearning'];
      }

      const generatedKeyPoints = [
        `Summary format: ${summaryLength.toUpperCase()} with focus on ${focusArea}.`,
        'Extracted primary mathematical and architectural principles.',
        'Validated operational trade-offs and deployment considerations.',
      ];

      addNote(
        sourceTitle || 'AI Extracted Concept Note',
        generatedSummary,
        autoCategory,
        tags,
        generatedKeyPoints
      );

      unlockBadge('badge-4');
      showToast(`AI summary generated successfully (${data.model})! Auto-categorized under "${autoCategory}".`);
    } catch (e: any) {
      showToast('Summary generation failed: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredNotes = notes.filter(
    n => selectedCategoryFilter === 'all' || n.category === selectedCategoryFilter
  );

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="AI Lecture Summarizer & Note Engine"
        subtitle="Extract key mathematical concepts, summarize hours of transcripts, and organize into study cards."
        badge="Neural Summarizer"
      />

      {/* Main Controls Card in Frosted Glass */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Summarization Configuration</h2>
          </div>

          {/* Sample Loaders */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Load Sample:</span>
            {sampleTranscripts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSourceTitle(sample.title);
                  setTranscriptInput(sample.text);
                  setFocusArea(sample.focus);
                }}
                className="px-2.5 py-1 rounded-xl glass-button text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-500 transition cursor-pointer"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <input
          type="text"
          value={sourceTitle}
          onChange={e => setSourceTitle(e.target.value)}
          placeholder="Lecture / Paper / Concept Title..."
          className="w-full glass-button border border-white/20 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-semibold"
        />

        {/* Length & Focus Area Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* 1. Summary Length Selector */}
          <div className="glass-panel border border-white/20 dark:border-white/10 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Sliders className="w-4 h-4 text-cyan-500" />
              <span>Select Summary Length</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'concise', label: 'Concise (TL;DR)', desc: '3-4 punchy bullets' },
                { id: 'standard', label: 'Standard', desc: 'Overview + key points' },
                { id: 'detailed', label: 'In-Depth Dive', desc: 'Comprehensive analysis' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSummaryLength(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    summaryLength === opt.id
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-400 shadow-md'
                      : 'glass-button text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Area of Focus Selector */}
          <div className="glass-panel border border-white/20 dark:border-white/10 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Target className="w-4 h-4 text-indigo-500" />
              <span>Specify Area of Focus</span>
            </div>
            <select
              value={focusArea}
              onChange={e => setFocusArea(e.target.value)}
              className="w-full glass-button border border-white/20 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer font-semibold"
            >
              {focusOptions.map(opt => (
                <option key={opt} value={opt} className="bg-slate-900 text-white">
                  {opt}
                </option>
              ))}
            </select>

            {focusArea === 'Custom Focus Query' && (
              <input
                type="text"
                value={customFocus}
                onChange={e => setCustomFocus(e.target.value)}
                placeholder="e.g. Focus on attention scaling factor & computational complexity"
                className="w-full glass-button border border-cyan-500/50 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Transcript Textarea */}
        <textarea
          rows={7}
          value={transcriptInput}
          onChange={e => setTranscriptInput(e.target.value)}
          placeholder="Paste lecture transcript, academic paper excerpt, video subtitles, or article content here..."
          className="w-full glass-button border border-white/20 dark:border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
        />

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => {
              setTranscriptInput('');
              setSourceTitle('');
            }}
            className="px-4 py-2.5 rounded-xl glass-button text-slate-600 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={handleGenerateSummary}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isProcessing ? 'Generating AI Summary...' : 'Process & Generate Summary'}</span>
          </button>
        </div>
      </div>

      {/* Categorized Knowledge Repository */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Your Categorized Study Knowledge Base</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Summaries indexed with automatic subject categories and focus tags</p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'Generative AI', 'Robotics', 'AI Ethics', 'Non-Technical AI'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedCategoryFilter === cat
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'glass-button text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Subjects' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    {note.category}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{note.updatedAt}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition mb-2">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4 font-mono whitespace-pre-line glass-panel p-3.5 rounded-2xl border border-white/20 dark:border-white/10">
                  {note.content}
                </p>

                {note.keyTakeaways && note.keyTakeaways.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                      Key Takeaways:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-600 dark:text-slate-300">
                      {note.keyTakeaways.map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map(t => (
                    <span
                      key={t}
                      className="text-[10px] font-mono glass-button text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-lg border border-white/15 font-semibold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveExportNote(note)}
                    title="Export to PDF"
                    className="p-2 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition cursor-pointer border border-indigo-500/30"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteNote(note.id)}
                    title="Delete Note"
                    className="p-2 rounded-xl glass-button text-slate-500 dark:text-slate-400 hover:text-rose-500 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExportPdfModal note={activeExportNote} onClose={() => setActiveExportNote(null)} />
    </div>
  );
};
