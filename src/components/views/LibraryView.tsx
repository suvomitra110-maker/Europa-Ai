import React, { useState } from 'react';
import {
  Box,
  Play,
  Clock,
  User,
  Sparkles,
  Search,
  CheckCircle,
  Layers,
  GraduationCap,
  Wand2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VoxelLibraryScene } from '../3d/VoxelLibraryScene';
import { VoxelProgressSpireInspector } from '../3d/VoxelProgressSpireInspector';
import { StepWiseVideoLearning } from '../library/StepWiseVideoLearning';
import { VoxelPathIconStudio } from '../library/VoxelPathIconStudio';
import { PageBackHeader } from '../layout/PageBackHeader';
import { videoLectures } from '../../data/initialData';
import { resolveLearningPathIdFromCategory } from '../../utils/voxelPathIcons';

export const LibraryView: React.FC = () => {
  const { t, setActiveLecture, voxelPathIcons } = useApp();
  const [viewMode, setViewMode] = useState<'step-wise' | '3d-campus' | '3d-progress' | 'catalog'>('step-wise');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Generative AI', 'Robotics', 'AI Ethics', 'Non-Technical AI'];

  const filteredLectures = videoLectures.filter(lec => {
    const matchCat = selectedCategory === 'all' || lec.category === selectedCategory;
    const matchSearch =
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6">
      {/* Universal Page Back Header & Minimalist Glass Navigation */}
      <PageBackHeader
        title="AI Study Library & Video Academy"
        subtitle="Explore step-wise video learning pathways, 3D voxel campus, progress spires, and custom 3D voxel path icons."
        badge="Curriculum Engine"
      >
        {/* View Toggle Tabs */}
        <div className="glass-panel p-1 rounded-2xl flex items-center shrink-0 flex-wrap gap-1 border border-white/20 dark:border-white/10">
          <button
            onClick={() => setViewMode('step-wise')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'step-wise'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Step-Wise Video Academy</span>
          </button>

          <button
            onClick={() => setViewMode('3d-campus')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === '3d-campus'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Campus</span>
          </button>

          <button
            onClick={() => setViewMode('3d-progress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === '3d-progress'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Progress</span>
          </button>

          <button
            onClick={() => setViewMode('catalog')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'catalog'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Masterclasses</span>
          </button>
        </div>
      </PageBackHeader>

      {/* 3D Voxel Learning Path Icons & Image Generation Studio */}
      <div className="max-w-7xl mx-auto w-full">
        <VoxelPathIconStudio
          selectedCategory={selectedCategory}
          onSelectCategory={cat => {
            setSelectedCategory(cat);
          }}
          onOpen3DCampus={() => setViewMode('3d-campus')}
        />
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1 min-h-0">
        {viewMode === 'step-wise' ? (
          <StepWiseVideoLearning />
        ) : viewMode === '3d-campus' ? (
          <div className="w-full h-[calc(100vh-180px)] rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 relative">
            <VoxelLibraryScene />
          </div>
        ) : viewMode === '3d-progress' ? (
          <div className="max-w-7xl mx-auto w-full space-y-4">
            <VoxelProgressSpireInspector />
          </div>
        ) : (
          <div className="space-y-6 max-w-7xl mx-auto w-full">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-white/20 dark:border-white/10">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full glass-button rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {categories.map(cat => {
                  const pathId = cat === 'all' ? null : resolveLearningPathIdFromCategory(cat);
                  const pathIconUri = pathId ? voxelPathIcons[pathId]?.dataUri : null;

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border flex items-center gap-1.5 ${
                        selectedCategory === cat
                          ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'glass-button text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {pathIconUri && (
                        <img
                          src={pathIconUri}
                          alt={`${cat} voxel icon`}
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 rounded object-cover"
                        />
                      )}
                      <span>{cat === 'all' ? t('filterAll') : cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video Lecture Grid with Transparent Glass Cards & 3D Voxel Path Icons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLectures.map(lecture => {
                const pathId = resolveLearningPathIdFromCategory(lecture.category);
                const pathIcon = voxelPathIcons[pathId];

                return (
                  <div
                    key={lecture.id}
                    className="glass-card rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between group border border-white/20 dark:border-white/10"
                  >
                    <div>
                      <div className="relative aspect-video overflow-hidden bg-slate-950">
                        <img
                          src={lecture.thumbnail}
                          alt={lecture.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <span className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md text-white font-mono text-[11px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {lecture.duration}
                        </span>

                        {/* Differentiated 3D Voxel Path Icon + Category Badge */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-slate-950/85 text-indigo-200 border border-indigo-500/40 pr-2.5 pl-1 py-0.5 rounded-xl backdrop-blur-md shadow-lg">
                          {pathIcon && (
                            <img
                              src={pathIcon.dataUri}
                              alt={`${lecture.category} 3D Voxel Path Icon`}
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-lg object-cover border border-white/20"
                            />
                          )}
                          <span className="text-[10px] font-mono uppercase font-semibold">
                            {lecture.category}
                          </span>
                        </div>

                        {lecture.completed && (
                          <span className="absolute top-2.5 right-2.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 backdrop-blur-md">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            Completed
                          </span>
                        )}
                      </div>

                      <div className="p-5 space-y-2.5">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition leading-snug line-clamp-2">
                          {lecture.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {lecture.summary}
                        </p>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1 font-medium">
                          <User className="w-3.5 h-3.5 text-cyan-500" />
                          <span>{lecture.instructor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => setActiveLecture(lecture)}
                        className="w-full py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{t('watchLecture')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
