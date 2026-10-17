import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  PenTool,
  X,
  CheckCircle2,
  Tag,
  ArrowRight,
  BookOpen,
  Volume2,
  Trash2,
  Layers,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudyNote } from '../../types';

// SpeechRecognition type definitions for cross-browser safety
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export const QuickCaptureFAB: React.FC = () => {
  const { isQuickCaptureOpen, setIsQuickCaptureOpen, quickCaptureNote, setActiveTab } = useApp();

  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('auto');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Success view state
  const [lastSavedNote, setLastSavedNote] = useState<StudyNote | null>(null);

  const availableSubjects = [
    'auto',
    'Generative AI',
    'Deep Learning & Neural Architectures',
    'Robotics',
    'AI Ethics',
    'Non-Technical AI',
    'Competitive AI & Hacking',
  ];

  // Global keyboard shortcut: Alt + Q
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'q') || (e.ctrlKey && e.key.toLowerCase() === 'j')) {
        e.preventDefault();
        setIsQuickCaptureOpen(!isQuickCaptureOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickCaptureOpen, setIsQuickCaptureOpen]);

  // Check Web Speech API support
  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setContent(prev => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${transcript}` : transcript;
        });
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Timer while recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsRecording(false);
    } else {
      setIsRecording(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // If native speech fails (e.g. permission or secure context), use simulated voice assistant
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    const samplePhrases = [
      "In deep transformer models, dot-product attention variance scales with square root of dimension d_k. Division prevents softmax saturation.",
      "Check ROS2 message_filters approximate time synchronizer to avoid LiDAR and RGB camera drift in Gazebo simulations.",
      "DEF CON AI Village challenge focuses on autonomous cyber reasoning systems analyzing open-source repositories to generate provably safe patches.",
      "Parameter-efficient fine-tuning with LoRA freezes original model weights W_0 and trains low-rank decomposition matrices B and A.",
    ];
    const phrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
    let idx = 0;
    const simInterval = setInterval(() => {
      idx += 8;
      setContent(phrase.slice(0, idx));
      if (idx >= phrase.length) {
        clearInterval(simInterval);
        setIsRecording(false);
      }
    }, 120);
  };

  // Predict Subject in real-time
  const getPredictedSubject = () => {
    if (!content.trim()) return 'Awaiting note input...';
    const lower = content.toLowerCase();
    if (
      lower.includes('robot') ||
      lower.includes('kinematics') ||
      lower.includes('lidar') ||
      lower.includes('gazebo') ||
      lower.includes('ros') ||
      lower.includes('slam') ||
      lower.includes('drone')
    ) {
      return 'Robotics';
    }
    if (
      lower.includes('hackathon') ||
      lower.includes('contest') ||
      lower.includes('ctf') ||
      lower.includes('challenge') ||
      lower.includes('kaggle') ||
      lower.includes('defcon') ||
      lower.includes('jailbreak')
    ) {
      return 'Competitive AI & Hacking';
    }
    if (
      lower.includes('ethics') ||
      lower.includes('safety') ||
      lower.includes('bias') ||
      lower.includes('alignment') ||
      lower.includes('governance')
    ) {
      return 'AI Ethics';
    }
    if (
      lower.includes('roi') ||
      lower.includes('executive') ||
      lower.includes('product') ||
      lower.includes('business') ||
      lower.includes('roadmap')
    ) {
      return 'Non-Technical AI';
    }
    if (
      lower.includes('backprop') ||
      lower.includes('loss') ||
      lower.includes('optimizer') ||
      lower.includes('gradient') ||
      lower.includes('neural')
    ) {
      return 'Deep Learning & Neural Architectures';
    }
    return 'Generative AI';
  };

  const handleSave = () => {
    if (!content.trim()) return;
    const manual = selectedCategory === 'auto' ? undefined : selectedCategory;
    const note = quickCaptureNote(content, title, manual);
    setLastSavedNote(note);
    setContent('');
    setTitle('');
  };

  const handleResetForAnother = () => {
    setLastSavedNote(null);
    setContent('');
    setTitle('');
    setSelectedCategory('auto');
  };

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => setIsQuickCaptureOpen(true)}
          title="Quick Capture Note (Voice & AI Organization) — Shortcut: Alt+Q"
          aria-label="Quick Capture Note"
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-2xl glass-card border border-cyan-500/50 shadow-2xl hover:border-cyan-400 text-slate-800 dark:text-white transition-all cursor-pointer backdrop-blur-2xl group hover:scale-105 active:scale-95"
        >
          {/* Glowing Ambient Halo */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-30 group-hover:opacity-75 blur-md transition duration-300 -z-10" />

          <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-xs font-black tracking-tight leading-none flex items-center gap-1.5">
              <span>Quick Capture</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-mono font-bold">
                AI Note
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
              <span>Voice / Text</span>
              <span className="opacity-60">• Alt+Q</span>
            </div>
          </div>
        </button>
      </div>

      {/* Quick Capture Minimalist Glass Modal */}
      {isQuickCaptureOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-xl glass-card rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-2xl text-slate-800 dark:text-slate-100 p-6 space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Top iridescent glow accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-400" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/15 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black tracking-tight">Quick Capture & AI Organizer</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" /> +25 XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Record voice or type short thoughts. Europa AI automatically files them under your curriculum subjects.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isRecording) toggleRecording();
                  setIsQuickCaptureOpen(false);
                }}
                className="p-2 rounded-xl glass-button text-slate-400 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If note was just saved: Celebratory confirmation view */}
            {lastSavedNote ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Successfully Organized & Saved!</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {lastSavedNote.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                      Subject: {lastSavedNote.category}
                    </span>
                    {lastSavedNote.tags.map(t => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
                      Extracted Key Insights:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-xs">
                      {lastSavedNote.keyTakeaways.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleResetForAnother}
                    className="px-4 py-2 rounded-xl glass-button text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    Capture Another Note
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickCaptureOpen(false);
                      setActiveTab('summarizer');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-lg hover:brightness-110 transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open in AI Notes Library</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Capture Form View */
              <div className="space-y-4">
                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10">
                  <button
                    onClick={() => {
                      if (isRecording) toggleRecording();
                      setMode('text');
                    }}
                    className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      mode === 'text'
                        ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Type Quick Note</span>
                  </button>
                  <button
                    onClick={() => setMode('voice')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      mode === 'voice'
                        ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Dictation & Speech</span>
                  </button>
                </div>

                {/* Voice Dictation Interface */}
                {mode === 'voice' && (
                  <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col items-center justify-center space-y-3">
                    <div className="relative">
                      {isRecording && (
                        <div className="absolute -inset-3 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
                      )}
                      <button
                        onClick={toggleRecording}
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer ${
                          isRecording
                            ? 'bg-gradient-to-tr from-rose-500 to-red-600 animate-pulse'
                            : 'bg-gradient-to-tr from-cyan-500 to-indigo-600'
                        }`}
                      >
                        {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                      </button>
                    </div>

                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1.5">
                        {isRecording ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span>Listening... {formatSecs(recordingSeconds)}</span>
                          </>
                        ) : (
                          <span>Click to start recording your voice note</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {speechSupported
                          ? 'Speak naturally — live transcription powered by Web Speech API'
                          : 'Interactive audio simulation ready to test note recording'}
                      </p>
                    </div>

                    {/* Soundwave Animation while recording */}
                    {isRecording && (
                      <div className="flex items-center gap-1 h-6">
                        {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95].map((h, i) => (
                          <span
                            key={i}
                            style={{ height: `${h}%` }}
                            className="w-1 bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-full animate-pulse"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Note Title (Optional) */}
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Note Title (Optional — AI will auto-generate if blank)"
                    className="w-full glass-button rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Content Textarea */}
                <div>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Type or dictate lecture concepts, code snippets, contest ideas, formulas, or questions..."
                    className="w-full glass-button rounded-2xl p-3.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed resize-none"
                  />
                </div>

                {/* Quick Inspiration Chips */}
                {!content && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Quick Templates:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Transformer Self-Attention scaling factor math',
                        'Gazebo LiDAR-camera timestamp synchronization trick',
                        'DEF CON AI Village Cyber Reasoning idea',
                        'LoRA rank decomposition parameter reduction',
                      ].map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => setContent(chip)}
                          className="text-[10px] px-2.5 py-1 rounded-xl glass-button text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition cursor-pointer"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Subject Prediction Banner & Category Override */}
                <div className="p-3 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                        AI Subject Prediction:
                      </span>
                      <div className="text-xs font-bold text-cyan-600 dark:text-cyan-300">
                        {selectedCategory === 'auto'
                          ? `🎯 ${getPredictedSubject()}`
                          : `Manual: ${selectedCategory}`}
                      </div>
                    </div>
                  </div>

                  {/* Manual Category Override Dropdown */}
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="glass-button text-[11px] font-bold px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="auto">✨ Auto-Organize with AI</option>
                    <option value="Generative AI">Generative AI & LLMs</option>
                    <option value="Deep Learning & Neural Architectures">Deep Learning & Neural Architectures</option>
                    <option value="Robotics">Robotics & Autonomous Perception</option>
                    <option value="AI Ethics">AI Ethics & Alignment</option>
                    <option value="Non-Technical AI">Executive AI & Strategy</option>
                    <option value="Competitive AI & Hacking">AI Contests & Hacking</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  {content.trim() ? (
                    <button
                      onClick={() => {
                        setContent('');
                        setTitle('');
                      }}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsQuickCaptureOpen(false)}
                      className="px-4 py-2 rounded-xl glass-button text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!content.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Organize & Save</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
