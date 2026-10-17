import React, { useState } from 'react';
import { Bot, BookOpen, Sparkles, Volume2, X, Compass, ChevronRight, Send, HelpCircle, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'npc';
  text: string;
  timestamp: string;
}

export const NpcDialogModal: React.FC = () => {
  const { activeNpc, setActiveNpc, setActiveTab, showToast, unlockBadge, user } = useApp();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'npc',
      text: activeNpc?.greeting || 'Greetings! How may I assist your AI studies today?',
      timestamp: 'Just now',
    },
  ]);

  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!activeNpc) return null;

  const quickPrompts = [
    activeNpc.id === 'ada'
      ? 'Explain the mathematical beauty of Self-Attention'
      : activeNpc.id === 'alan'
      ? 'How do Inverse Kinematics algorithms avoid singularities?'
      : 'Explain Transformer Query, Key, and Value like I am 15',
    'Give me a strategic hint for today’s study milestone',
    'What personalized study path do you suggest based on my progress?',
    activeNpc.id === 'ada'
      ? 'How should executives evaluate proprietary data moats?'
      : activeNpc.id === 'alan'
      ? 'What is the connection between Turing Machines and neural nets?'
      : 'Why is LoRA so parameter-efficient compared to full fine-tuning?',
  ];

  const handleSendMessage = async (msgText: string) => {
    const textToSend = msgText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/npc-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          npcId: activeNpc.id,
          message: textToSend,
          userProgress: {
            streak: user.streakDays,
            level: user.level,
            xp: user.xp,
            activePath: activeNpc.recommendedTrack,
          },
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'Knowledge weights processed. Let us continue exploring the foundations.';

      const npcMsg: ChatMessage = {
        id: `npc-${Date.now()}`,
        sender: 'npc',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages(prev => [...prev, npcMsg]);
      unlockBadge('badge-1');
    } catch (e: any) {
      const fallbackMsg: ChatMessage = {
        id: `npc-${Date.now()}`,
        sender: 'npc',
        text: `The analytical engine remains poised to guide your journey. Remember that perseverance in exploring mathematical foundations yields enduring mastery!`,
        timestamp: 'Just now',
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const playVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = activeNpc.voicePitch;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      showToast(`Playing vocal synthesis for ${activeNpc.name}`);
    } else {
      showToast('Speech synthesis not supported in this browser.');
    }
  };

  const startRecommendedTrack = () => {
    setActiveNpc(null);
    unlockBadge('badge-1');
    if (activeNpc.id === 'ada') {
      setActiveTab('non-technical');
    } else {
      setActiveTab('dashboard');
    }
    showToast(`Enrolled in recommended track: "${activeNpc.recommendedTrack}"!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full h-[85vh] max-h-[740px] shadow-2xl relative text-slate-100 flex flex-col overflow-hidden">
        {/* Top Mentor Profile Bar */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                activeNpc.id === 'ada'
                  ? 'bg-emerald-600'
                  : activeNpc.id === 'alan'
                  ? 'bg-amber-600'
                  : 'bg-indigo-600'
              }`}
            >
              {activeNpc.id === 'tensor' ? <Bot className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">{activeNpc.name}</h3>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-cyan-400 px-2.5 py-0.5 rounded-full border border-slate-700 font-semibold">
                  Conversational AI
                </span>
              </div>
              <p className="text-xs text-slate-400">{activeNpc.title} • {activeNpc.specialty}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveNpc(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-cyan-500 cursor-pointer shadow-sm transition"
            >
              <span>← Back</span>
            </button>
            <button
              onClick={() => setActiveNpc(null)}
              className="p-2 rounded-xl glass-button text-slate-500 dark:text-slate-400 hover:text-rose-500 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggested Path Pill */}
        <div className="px-5 py-2.5 bg-gradient-to-r from-indigo-950/60 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">Mentor Recommended Path:</span>
            <strong className="text-white font-semibold truncate max-w-[220px] sm:max-w-xs">{activeNpc.recommendedTrack}</strong>
          </div>
          <button
            onClick={startRecommendedTrack}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Begin Path</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Conversational Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {chatMessages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-cyan-600 text-white'
                      : activeNpc.id === 'ada'
                      ? 'bg-emerald-600 text-white'
                      : activeNpc.id === 'alan'
                      ? 'bg-amber-600 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isUser ? 'You' : activeNpc.name[0]}
                </div>

                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {!isUser && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-700/50 text-[11px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => playVoice(msg.text)}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Speak
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 bg-slate-800/60 p-3 rounded-2xl max-w-xs animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{activeNpc.name} is formulating guidance...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-mono uppercase text-slate-500 whitespace-nowrap">Suggested:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs whitespace-nowrap transition cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage(userInput);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder={`Ask ${activeNpc.name} for concept explanations, hints, or study roadmaps...`}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!userInput.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
