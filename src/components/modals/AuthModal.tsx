import React, { useState } from 'react';
import { Mail, Github, X, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, loginWithProvider, user } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  if (!showAuthModal) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithProvider('gmail');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-slate-900 dark:text-slate-100 flex flex-col gap-5">
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={() => setShowAuthModal(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-500 cursor-pointer shadow-sm transition"
          >
            <span>← Back</span>
          </button>
          <button
            onClick={() => setShowAuthModal(false)}
            className="p-2 rounded-xl glass-button text-slate-400 hover:text-rose-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Brand header */}
        <div className="text-center pt-2">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <span className="font-extrabold text-xl font-mono">E</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">Sign In to Europa Ai</h3>
          <p className="text-xs text-slate-400 mt-1">Sync your personalized learning paths, voxel progress, and badges</p>
        </div>

        {/* Social SSO Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => loginWithProvider('gmail')}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition shadow-md cursor-pointer border border-slate-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Gmail (Google)</span>
          </button>

          <button
            onClick={() => loginWithProvider('github')}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition shadow-md cursor-pointer border border-slate-700"
          >
            <Github className="w-4 h-4" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[11px] text-slate-500 uppercase tracking-wider">or sign in with email</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="suvomitra110@gmail.com"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm mt-1 hover:brightness-110 transition shadow-lg cursor-pointer"
          >
            Sign In with Europa Account
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Biometric & 256-bit Cloud Backup Protected</span>
        </div>
      </div>
    </div>
  );
};
