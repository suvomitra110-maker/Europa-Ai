import React, { useState } from 'react';
import {
  QrCode,
  Scan,
  Send,
  FileText,
  Share2,
  CheckCircle,
  Copy,
  Users,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';

export const ScanTransferView: React.FC = () => {
  const { user, notes, peerMessages, sendPeerMessage, showToast, unlockBadge } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'qr' | 'scanner' | 'chat'>('chat');
  const [inputMsg, setInputMsg] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [simulatedCodeInput, setSimulatedCodeInput] = useState('');
  const [scannedPayload, setScannedPayload] = useState<string | null>(null);

  const peerPairCode = 'EUROPA-8924';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() && !selectedNoteId) return;
    sendPeerMessage(inputMsg, selectedNoteId || undefined);
    setInputMsg('');
    setSelectedNoteId('');
    showToast('Message & study material transferred to peer room!');
  };

  const handleSimulateScan = () => {
    if (!simulatedCodeInput.trim()) return;
    setScannedPayload(
      `Received Peer Study Package from User: ${simulatedCodeInput.toUpperCase()}\nContains: "Transformer Self-Attention Notes" + "3 Practice Quizzes"`
    );
    unlockBadge('badge-5');
    showToast('P2P QR Handshake verified! Study material synchronized.');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="Peer-to-Peer Material Transfer & Study Chat"
        subtitle="Direct decentralized user-to-user note exchange via QR code scan and real-time study channel."
        badge="Direct Transfer"
      />

      {/* Sub Tabs in Translucent Glass */}
      <div className="glass-panel border border-white/20 dark:border-white/10 p-1 rounded-2xl flex items-center max-w-md">
        <button
          onClick={() => setActiveTabSub('chat')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTabSub === 'chat'
              ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Live P2P Chat</span>
        </button>
        <button
          onClick={() => setActiveTabSub('qr')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTabSub === 'qr'
              ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>My Share QR</span>
        </button>
        <button
          onClick={() => setActiveTabSub('scanner')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTabSub === 'scanner'
              ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Scan className="w-4 h-4" />
          <span>Scan Code</span>
        </button>
      </div>

      {/* Tab 1: Live P2P Chat */}
      {activeTabSub === 'chat' && (
        <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col h-[600px] justify-between">
          {/* Chat room header */}
          <div className="pb-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active P2P Study Group: "Robotics & Transformers"</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">3 online peers connected • Direct local broadcast</p>
              </div>
            </div>

            <span className="text-xs font-mono glass-button text-teal-600 dark:text-teal-400 px-3 py-1 rounded-xl border border-teal-500/30 font-bold">
              PIN: {peerPairCode}
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
            {peerMessages.map(msg => {
              const isMe = msg.senderId === user.id;
              const attachedNote = notes.find(n => n.id === msg.attachedNoteId);

              return (
                <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/40 shadow-sm"
                  />
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                        : 'glass-panel text-slate-800 dark:text-slate-200 border border-white/20 dark:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 text-[11px] opacity-80 font-bold">
                      <span>{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    {msg.text && <p className="mb-2 whitespace-pre-line">{msg.text}</p>}

                    {/* Attached Study Material Card */}
                    {attachedNote && (
                      <div className="mt-2 p-2.5 rounded-xl bg-black/20 border border-white/20 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-cyan-300 shrink-0" />
                          <span className="font-bold text-[11px] truncate text-white">
                            {attachedNote.title}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/20 text-white shrink-0 font-bold">
                          Note attached
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSend} className="pt-4 border-t border-black/10 dark:border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder="Type a study question or message your peer..."
                className="flex-1 glass-button border border-white/20 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />

              {/* Attach Note selector */}
              <select
                value={selectedNoteId}
                onChange={e => setSelectedNoteId(e.target.value)}
                aria-label="Attach Study Note"
                className="glass-button border border-white/20 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-cyan-500 max-w-[180px] truncate cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-white">Attach Note...</option>
                {notes.map(n => (
                  <option key={n.id} value={n.id} className="bg-slate-900 text-white">
                    📄 {n.title}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Generate Share QR */}
      {activeTabSub === 'qr' && (
        <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center max-w-xl mx-auto space-y-5">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Your P2P Study Broadcast Code</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Have your peer scan this QR code on their device to instantly receive your active notes and syllabus.</p>
          </div>

          {/* Stylized High-Fidelity Procedural QR Display */}
          <div className="p-6 bg-white rounded-3xl shadow-2xl border-4 border-cyan-400/80">
            <div className="w-52 h-52 grid grid-cols-6 gap-1 bg-slate-950 p-2 rounded-2xl">
              {Array.from({ length: 36 }).map((_, i) => {
                const isCorner = i === 0 || i === 5 || i === 30 || i === 35 || i === 7 || i === 14;
                const isRnd = (i * 7 + 13) % 3 === 0;
                return (
                  <div
                    key={i}
                    className={`rounded-sm transition-all ${
                      isCorner || isRnd ? 'bg-white' : 'bg-slate-900'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">Direct Pair Code:</span>
            <code className="text-sm font-mono font-bold glass-button text-cyan-600 dark:text-cyan-400 px-3 py-1 rounded-xl border border-cyan-500/30">
              {peerPairCode}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(peerPairCode);
                showToast('Pair code copied to clipboard!');
              }}
              className="p-2 rounded-xl glass-button text-slate-600 dark:text-slate-300 hover:text-cyan-500 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Camera / Code Scanner Simulator */}
      {activeTabSub === 'scanner' && (
        <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Scan Peer QR Code</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Point device camera or enter 6-digit peer pairing code.</p>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="relative aspect-video glass-panel border-2 border-dashed border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-x-8 top-1/2 h-0.5 bg-cyan-400 shadow-[0_0_12px_#38bdf8] animate-pulse" />
            <Scan className="w-12 h-12 text-cyan-500 mb-2 animate-bounce" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Camera Viewfinder Active</span>
          </div>

          {/* Manual Code Input Form */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Or Enter Peer Pairing Code:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={simulatedCodeInput}
                onChange={e => setSimulatedCodeInput(e.target.value)}
                placeholder="e.g. EUROPA-8924"
                className="flex-1 glass-button border border-white/20 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white uppercase font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSimulateScan}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:brightness-110 text-white font-bold text-xs cursor-pointer shadow-md shadow-cyan-500/20"
              >
                Sync Material
              </button>
            </div>
          </div>

          {scannedPayload && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Synchronization Successful!</span>
              </div>
              <p className="font-mono text-slate-800 dark:text-slate-200 whitespace-pre-line">{scannedPayload}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
