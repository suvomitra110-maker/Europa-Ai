import React, { useState, useEffect } from 'react';
import {
  Users,
  Save,
  Download,
  Share2,
  Copy,
  Sparkles,
  CheckCircle,
  Clock,
  Bold,
  Italic,
  Code,
  List,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';

export const CollaborativeDocView: React.FC = () => {
  const { user, showToast } = useApp();

  const [docTitle, setDocTitle] = useState('Europa Group Sprint: Multimodal VLA Architectures');
  const [docContent, setDocContent] = useState(() => {
    return `# Collaborative AI Study Notes
*Live group session: Autonomous Robotics & Vision-Language-Action Models*

## 1. Vision-Language-Action (VLA) Fundamentals
- Traditional robots decouple perception (YOLO/PointNet) from motion planning (Jacobians, RRT*).
- Modern VLA models ingest continuous images and natural language instructions, and predict tokenized end-effector delta coordinates (dx, dy, dz, droll, dpitch, dyaw, gripper_state).

## 2. Low-Rank Adaptation for Robot Arms
- We can freeze a 7B vision-language model backbone and attach LoRA adapters to cross-attention layers.
- Action chunking: Predicting 10 to 50 timesteps into the future prevents jerky stop-and-go motion.

## 3. Meeting Action Items for Study Group
- [ ] Elena: Run Gazebo physics simulation with simulated UR5 robotic arm.
- [ ] Alex: Benchmark latency overhead of 4-bit quantized VLA model on RTX 4090.
- [ ] Suvo: Document mathematical bounds on collision avoidance constraints.
`;
  });

  const [activePeers] = useState([
    {
      id: 'usr-elena',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
      status: 'Editing Section 2',
      color: '#10b981',
    },
    {
      id: 'usr-alex',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
      status: 'Viewing Section 3',
      color: '#06b6d4',
    },
  ]);

  const [lastSaved, setLastSaved] = useState('Just now');

  useEffect(() => {
    const timer = setInterval(() => {
      setLastSaved('Synced with peers at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleInsert = (prefix: string, suffix: string = '') => {
    setDocContent(prev => prev + `\n${prefix}New Entry${suffix}\n`);
    showToast('Formatted element added');
  };

  const handleDownload = () => {
    const blob = new Blob([docContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docTitle.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded collaborative markdown document.');
  };

  const words = docContent.trim().split(/\s+/).filter(Boolean).length;
  const chars = docContent.length;

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="Collaborative Study Document Canvas"
        subtitle="Real-time multi-peer markdown editor, mathematical derivation scratchpad, and revision sync."
        badge="Multi-User Study"
      />

      {/* Editor Main Container in Frosted Glass */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Document Header & Active Collaborators */}
        <div className="p-4 sm:p-6 glass-panel border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={docTitle}
              onChange={e => setDocTitle(e.target.value)}
              className="text-base sm:text-lg font-black text-slate-900 dark:text-white bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded-lg px-2 py-1 w-full"
            />
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 px-2 mt-1">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                {lastSaved}
              </span>
              <span>•</span>
              <span className="font-mono text-[11px]">{words} words</span>
              <span>•</span>
              <span className="font-mono text-[11px]">{chars} characters</span>
            </div>
          </div>

          {/* Active Peer Avatars */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center -space-x-2">
              <img
                src={user.avatar}
                alt={user.name}
                title={`You (${user.name}) - Active`}
                className="w-8 h-8 rounded-full ring-2 ring-cyan-500 object-cover shadow-sm"
              />
              {activePeers.map(p => (
                <img
                  key={p.id}
                  src={p.avatar}
                  alt={p.name}
                  title={`${p.name}: ${p.status}`}
                  className="w-8 h-8 rounded-full ring-2 ring-indigo-500 object-cover shadow-sm"
                />
              ))}
            </div>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 glass-panel border-b border-black/10 dark:border-white/10 flex items-center gap-1 flex-wrap">
          <button
            onClick={() => handleInsert('### ')}
            className="p-1.5 rounded-lg glass-button text-slate-700 dark:text-slate-300 hover:text-cyan-500 text-xs font-bold font-mono"
            title="Heading"
          >
            H3
          </button>
          <button
            onClick={() => handleInsert('**', '**')}
            className="p-1.5 rounded-lg glass-button text-slate-700 dark:text-slate-300 hover:text-cyan-500"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleInsert('*', '*')}
            className="p-1.5 rounded-lg glass-button text-slate-700 dark:text-slate-300 hover:text-cyan-500"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleInsert('```ts\n', '\n```')}
            className="p-1.5 rounded-lg glass-button text-slate-700 dark:text-slate-300 hover:text-cyan-500"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleInsert('- ')}
            className="p-1.5 rounded-lg glass-button text-slate-700 dark:text-slate-300 hover:text-cyan-500"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time Document Textarea */}
        <div className="p-4 sm:p-6 bg-transparent">
          <textarea
            rows={20}
            value={docContent}
            onChange={e => setDocContent(e.target.value)}
            className="w-full bg-transparent border-0 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-mono leading-relaxed focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};
