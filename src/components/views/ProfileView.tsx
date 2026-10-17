import React, { useState } from 'react';
import {
  Award,
  Flame,
  Fingerprint,
  ShieldCheck,
  CheckCircle,
  Lock,
  UserCheck,
  Sparkles,
  Download,
  Share2,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';
import { Badge } from '../../types';

export const ProfileView: React.FC = () => {
  const { user, setUser, badges, unlockBadge, showToast } = useApp();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  const toggleBiometric = () => {
    const nextState = !user.biometricEnabled;
    setUser(prev => ({ ...prev, biometricEnabled: nextState }));
    if (nextState) {
      unlockBadge('badge-11');
      showToast('🔒 Hardware Biometric Authentication (WebAuthn / TouchID) enabled successfully!');
    } else {
      showToast('Biometric protection disabled.');
    }
  };

  const celebrateBadge = (badge: Badge) => {
    setSelectedBadge(badge);
    if (badge.unlocked) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="Scholar Profile & Gamified Badges"
        subtitle="Manage your learning milestones, biometric security keys, streak milestones, and verified credentials."
        badge="Learner ID"
      />

      {/* Profile Hero Card in Frosted Glass */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-cyan-500/50 shadow-xl"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
              <span className="text-[10px] font-mono uppercase bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                {user.role}
              </span>
              <span className="text-[10px] font-mono uppercase bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
                via {user.provider}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user.email}</p>

            <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-1 font-medium">
              <span>Current Level: <strong className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">LVL {user.level}</strong></span>
              <span>•</span>
              <span>Streak: <strong className="text-amber-500 font-mono font-bold">{user.streakDays} Days</strong></span>
              <span>•</span>
              <span>Badges: <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{unlockedCount} / {badges.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Certificate Generator Trigger */}
        <button
          onClick={() => setShowCertificate(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition self-start md:self-auto"
        >
          <Award className="w-4 h-4" />
          <span>View Study Certificate</span>
        </button>
      </div>

      {/* Biometric Privacy & Security Hardware Widget */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Biometric Authentication & Private Key Storage</h3>
              <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                WebAuthn FIDO2
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Require hardware fingerprint or FaceID confirmation before decrypting local offline study notes.
            </p>
          </div>
        </div>

        <button
          onClick={toggleBiometric}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
            user.biometricEnabled
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'glass-button text-slate-700 dark:text-slate-300 hover:text-cyan-500'
          }`}
        >
          {user.biometricEnabled ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4" />}
          <span>{user.biometricEnabled ? 'Biometrics Active' : 'Enable Biometrics'}</span>
        </button>
      </div>

      {/* Gamified Achievement Badges Showcase */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Gamified Achievement Badges</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Unlock badges by exploring voxel worlds, mastering algorithms, and sharing notes</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {badges.map(b => {
            const isUnlocked = b.unlocked;
            let rarityColor = 'border-white/15 text-slate-500';
            if (isUnlocked) {
              if (b.rarity === 'legendary') rarityColor = 'border-amber-500/70 shadow-amber-500/10 text-amber-500 bg-amber-500/10';
              else if (b.rarity === 'epic') rarityColor = 'border-purple-500/70 shadow-purple-500/10 text-purple-500 bg-purple-500/10';
              else if (b.rarity === 'rare') rarityColor = 'border-cyan-500/70 shadow-cyan-500/10 text-cyan-500 bg-cyan-500/10';
              else rarityColor = 'border-white/20 text-slate-700 dark:text-slate-200 glass-card';
            }

            return (
              <div
                key={b.id}
                onClick={() => celebrateBadge(b)}
                className={`border rounded-3xl p-4 flex flex-col items-center text-center justify-between gap-3 transition-all cursor-pointer shadow-lg hover:scale-105 ${rarityColor} ${
                  isUnlocked ? 'opacity-100' : 'opacity-40 grayscale glass-panel'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl glass-panel border border-white/20 flex items-center justify-center font-bold text-xl shadow-inner">
                  {b.category === 'voxel' ? '🧱' : b.category === 'streak' ? '🔥' : b.category === 'mastery' ? '⚡' : '📜'}
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{b.name}</h4>
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">
                    {b.rarity}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {isUnlocked ? b.unlockedAt || 'Unlocked' : 'Locked'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 text-slate-900 dark:text-white shadow-2xl relative">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"
            >
              ✕
            </button>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-3xl shadow-xl">
              {selectedBadge.category === 'voxel' ? '🧱' : selectedBadge.category === 'streak' ? '🔥' : '⚡'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-cyan-600 dark:text-cyan-400 font-bold tracking-wider">
                {selectedBadge.rarity} Badge
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{selectedBadge.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{selectedBadge.description}</p>
            </div>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-black/10 dark:border-white/10">
              Status: {selectedBadge.unlocked ? `Unlocked on ${selectedBadge.unlockedAt}` : 'Complete study quests to unlock'}
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card border border-amber-500/60 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative text-slate-900 dark:text-slate-100 flex flex-col gap-6">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-500"
            >
              ✕
            </button>

            {/* Certificate Frame */}
            <div className="p-8 border-4 border-double border-amber-500/50 rounded-2xl glass-panel text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm">
                  ★
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                  Europa Ai • Verified Academic Certification
                </span>
                <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm">
                  ★
                </span>
              </div>

              <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white">Certificate of AI Mastery</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">This certifies that</p>
              <h3 className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono tracking-tight">{user.name}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                has successfully demonstrated proficiency in <strong>Transformer Attention Architectures, LoRA Fine-Tuning, and Embodied Robotics Kinematics</strong> with 18 verified checkpoints.
              </p>

              <div className="pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Issue Date: 2026-10-17</span>
                <span>ID: EUROPA-CERT-9042</span>
                <span>Signed: Ada Lovelace & Alan Turing</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-md shadow-cyan-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Print / Download Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
