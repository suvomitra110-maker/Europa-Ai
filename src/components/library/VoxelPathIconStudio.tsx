import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  RefreshCw,
  CheckCircle2,
  Compass,
  Box,
  Layers,
  Download,
  Sliders,
  ChevronDown,
  ChevronUp,
  Palette,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  VOXEL_ICON_STYLE_PRESETS,
  VOXEL_LEARNING_PATHS,
  VoxelIconStylePreset,
  VoxelLearningPathId,
  buildVoxelIconPrompt,
} from '../../utils/voxelPathIcons';

interface VoxelPathIconStudioProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpen3DCampus?: () => void;
  defaultExpanded?: boolean;
}

export const VoxelPathIconStudio: React.FC<VoxelPathIconStudioProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpen3DCampus,
  defaultExpanded = false,
}) => {
  const {
    voxelPathIcons,
    generateVoxelPathIcon,
    regenerateAllVoxelPathIcons,
    resetVoxelPathIcons,
    modules,
  } = useApp();

  const [studioExpanded, setStudioExpanded] = useState(defaultExpanded);
  const [activePathId, setActivePathId] = useState<VoxelLearningPathId>('generative-ai');
  const [selectedStyle, setSelectedStyle] = useState<VoxelIconStylePreset>('isometric-cube');
  const [customNotes, setCustomNotes] = useState('');
  const [customAccentHex, setCustomAccentHex] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  const activeSpec =
    VOXEL_LEARNING_PATHS.find(p => p.id === activePathId) || VOXEL_LEARNING_PATHS[0];
  const activeRecord = voxelPathIcons[activePathId];

  const getPathProgressPct = (pathId: VoxelLearningPathId): number => {
    if (pathId === 'generative-ai') return modules[0]?.progressPercent ?? 75;
    if (pathId === 'robotics') return modules[1]?.progressPercent ?? 30;
    if (pathId === 'ai-ethics') return modules[2]?.progressPercent ?? 45;
    if (pathId === 'non-technical-ai') return modules[3]?.progressPercent ?? 85;
    return 70;
  };

  const handleGenerateSingle = async () => {
    setIsGenerating(true);
    try {
      await generateVoxelPathIcon({
        pathId: activePathId,
        stylePreset: selectedStyle,
        customNotes: customNotes.trim() || undefined,
        customAccentHex: customAccentHex || undefined,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBatchGenerateAll = async () => {
    setIsBatchGenerating(true);
    try {
      await regenerateAllVoxelPathIcons(selectedStyle);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  const handleDownloadIcon = (pathId: VoxelLearningPathId) => {
    const rec = voxelPathIcons[pathId];
    if (!rec) return;
    const link = document.createElement('a');
    link.href = rec.dataUri;
    link.download = `europa-voxel-${pathId}-icon.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      aria-label="3D Voxel Learning Path Icons & Image Generator"
      className="glass-card rounded-3xl border border-white/20 dark:border-white/10 p-4 sm:p-5 shadow-xl space-y-4 mb-5"
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                3D Voxel Learning Path Icons
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 font-bold">
                5 Voxel Paths Differentiated
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Visual 3D voxel icon badges differentiating each study track across the 3D Campus, Progress Spires, and Video Academy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setStudioExpanded(prev => !prev)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{studioExpanded ? 'Hide Icon Generator Tool' : 'Voxel Icon Generator Tool'}</span>
            {studioExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* 5-Card Differentiated Learning Path Icon Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {VOXEL_LEARNING_PATHS.map(spec => {
          const rec = voxelPathIcons[spec.id];
          const pct = getPathProgressPct(spec.id);
          const isSelected =
            selectedCategory === spec.categoryName ||
            (studioExpanded && activePathId === spec.id);

          return (
            <div
              key={spec.id}
              onClick={() => {
                setActivePathId(spec.id);
                onSelectCategory(
                  selectedCategory === spec.categoryName ? 'all' : spec.categoryName
                );
              }}
              role="button"
              tabIndex={0}
              aria-label={`Select ${spec.title} learning path (${pct}% complete)`}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActivePathId(spec.id);
                  onSelectCategory(
                    selectedCategory === spec.categoryName ? 'all' : spec.categoryName
                  );
                }
              }}
              className={`group rounded-2xl p-3 border transition-all cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? 'glass-panel border-cyan-400/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                  : 'glass-panel border-white/15 dark:border-white/10 hover:border-cyan-500/40'
              }`}
            >
              {/* 1:1 Generated Voxel Placeholder Icon Image */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/20 bg-slate-950 shadow-md group-hover:scale-105 transition-transform">
                <img
                  src={rec?.dataUri}
                  alt={`${spec.title} 3D Voxel Icon`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="text-[10px] font-mono font-bold uppercase truncate"
                    style={{ color: spec.primaryHex }}
                  >
                    {spec.badgeCode}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                    {pct}%
                  </span>
                </div>

                <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                  {spec.shortLabel}
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {spec.spireName}
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: spec.primaryHex }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Interactive Image Generation Studio */}
      {studioExpanded && (
        <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Controls & Prompt Studio */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono uppercase text-cyan-600 dark:text-cyan-400 font-bold">
                  AI & Procedural 3D Voxel Image Generation Tool
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Customize & Generate Path Icon: {activeSpec.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBatchGenerateAll}
                  disabled={isBatchGenerating}
                  className="px-3 py-1.5 rounded-xl glass-button border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/15 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isBatchGenerating ? 'animate-spin' : ''}`} />
                  <span>{isBatchGenerating ? 'Synthesizing All 5...' : 'Regenerate All 5 Paths'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetVoxelPathIcons}
                  className="px-3 py-1.5 rounded-xl glass-button text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Target Learning Path Selector Buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                1. Select Target Learning Path
              </label>
              <div className="flex flex-wrap gap-1.5">
                {VOXEL_LEARNING_PATHS.map(spec => (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => {
                      setActivePathId(spec.id);
                      setCustomAccentHex('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                      activePathId === spec.id
                        ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-200 border-cyan-500/50 shadow-sm'
                        : 'glass-button text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: spec.primaryHex }}
                    />
                    <span>{spec.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voxel Style Preset Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                2. Choose 3D Voxel Icon Style Preset
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VOXEL_ICON_STYLE_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedStyle(preset.id)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      selectedStyle === preset.id
                        ? 'bg-indigo-500/20 border-indigo-400/60 text-slate-900 dark:text-white shadow-sm'
                        : 'glass-panel border-white/10 text-slate-600 dark:text-slate-300 hover:border-white/25'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{preset.label}</span>
                      {selectedStyle === preset.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Voxel Detail Prompt & Accent Swatch */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label
                  htmlFor="voxel-icon-custom-prompt"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300 block"
                >
                  3. Custom Voxel Detail / Motif Prompt (Optional)
                </label>
                <input
                  id="voxel-icon-custom-prompt"
                  type="text"
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  placeholder="e.g., floating quantum rings, golden holographic runes..."
                  className="w-full glass-button rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Voxel Glow Accent</span>
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {['#38bdf8', '#a855f7', '#10b981', '#f43f5e', '#fde047'].map(hex => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setCustomAccentHex(hex)}
                      aria-label={`Set voxel glow accent color ${hex}`}
                      className={`w-6 h-6 rounded-lg border transition cursor-pointer ${
                        (customAccentHex || activeSpec.accentHex) === hex
                          ? 'scale-110 ring-2 ring-white border-white'
                          : 'border-white/20 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Prompt Preview & Action Bar */}
            <div className="glass-panel rounded-2xl p-3 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono line-clamp-2 flex-1">
                <strong className="text-slate-700 dark:text-slate-200">Active Prompt:</strong>{' '}
                {buildVoxelIconPrompt(activePathId, selectedStyle, customNotes)}
              </div>

              <button
                type="button"
                onClick={handleGenerateSingle}
                disabled={isGenerating}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-cyan-500/20"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating ? 'Generating Icon...' : `Generate ${activeSpec.shortLabel} Icon`}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Live 1:1 Voxel Icon Preview Card */}
          <div className="lg:col-span-4 glass-panel rounded-2xl p-4 border border-white/15 flex flex-col items-center text-center space-y-3">
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>{activeSpec.badgeCode}</span>
              <span>Seed #{activeRecord?.seed ?? 1}</span>
            </div>

            <div className="w-44 h-44 rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl bg-slate-950 relative">
              <img
                src={activeRecord?.dataUri}
                alt={`${activeSpec.title} Generated 3D Voxel Icon`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-0.5">
              <div className="text-sm font-black text-slate-900 dark:text-white">
                {activeSpec.title}
              </div>
              <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">
                3D Campus Structure: {activeSpec.spireName}
              </div>
            </div>

            <div className="w-full flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDownloadIcon(activePathId)}
                className="flex-1 py-2 rounded-xl glass-button text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-400 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Icon</span>
              </button>

              {onOpen3DCampus && (
                <button
                  type="button"
                  onClick={() => {
                    setStudioExpanded(false);
                    onOpen3DCampus();
                  }}
                  className="flex-1 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 border border-indigo-500/40 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>View in 3D</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
