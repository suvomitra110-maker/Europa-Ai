import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  UserPlus,
  UserCheck,
  Send,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';
import { ForumPost } from '../../types';

export const ForumView: React.FC = () => {
  const {
    forumPosts,
    addForumPost,
    toggleUpvotePost,
    addCommentToPost,
    toggleFollowUser,
    user,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<ForumPost['category']>('Generative AI');
  const [newTags, setNewTags] = useState('Transformers, LLMs');

  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const categories = ['all', 'Generative AI', 'Robotics', 'Career & Study', 'AI Ethics', 'Papers'];

  const filteredPosts = forumPosts.filter(
    p => activeCategory === 'all' || p.category === activeCategory
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    const tagArray = newTags.split(',').map(s => s.trim()).filter(Boolean);
    addForumPost(newTitle, newContent, newCategory, tagArray);
    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
  };

  const handlePostComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addCommentToPost(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleDirectChat = (authorName: string) => {
    setActiveTab('scan-transfer');
    showToast(`Opening peer-to-peer chat room with ${authorName}!`);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="Europa AI Community Forum"
        subtitle="Peer-to-peer discussion threads, mathematical derivations, code reviews, and study circles."
        badge="P2P Knowledge"
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </PageBackHeader>

      {/* Category Filter Pills in Translucent Glass */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
              activeCategory === cat
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'glass-button text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Discussions' : cat}
          </button>
        ))}
      </div>

      {/* Forum Threads List */}
      <div className="space-y-4">
        {filteredPosts.map(post => {
          const isFollowing = user.following.includes(post.authorId);
          const isExpanded = expandedPostId === post.id;

          return (
            <div
              key={post.id}
              className="glass-card border border-white/20 dark:border-white/10 hover:-translate-y-0.5 rounded-3xl p-6 sm:p-7 shadow-xl transition-all space-y-4"
            >
              {/* Header with Author Profile & Follow Button */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-11 h-11 rounded-full ring-2 ring-indigo-500/40 object-cover shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{post.authorName}</span>
                      <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30 font-bold">
                        {post.authorRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{post.createdAt}</span>
                      <span>•</span>
                      <span className="text-purple-600 dark:text-purple-400 font-mono font-semibold">{post.category}</span>
                    </div>
                  </div>
                </div>

                {/* Follow & Message User Action buttons */}
                {post.authorId !== user.id && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleFollowUser(post.authorId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer border ${
                        isFollowing
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                          : 'glass-button text-slate-700 dark:text-slate-300 hover:text-cyan-500'
                      }`}
                    >
                      {isFollowing ? <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> : <UserPlus className="w-3.5 h-3.5" />}
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </button>

                    <button
                      onClick={() => handleDirectChat(post.authorName)}
                      title="Direct P2P Message"
                      className="p-2 rounded-xl glass-button text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-cyan-500" />
                    </button>
                  </div>
                )}
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">{post.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.tags.map(t => (
                    <span
                      key={t}
                      className="text-[11px] font-mono glass-button text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-lg border border-white/15"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions: Upvote, Comment toggle */}
              <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleUpvotePost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                      post.userUpvoted
                        ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/40 shadow-sm'
                        : 'glass-button text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-purple-500" />
                    <span>{post.upvotes} Upvotes</span>
                  </button>

                  <button
                    onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-slate-700 dark:text-slate-300 transition cursor-pointer font-bold"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{post.commentsCount} Comments</span>
                  </button>
                </div>
              </div>

              {/* Nested Comments Drawer */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 space-y-3 pl-2 sm:pl-4">
                  {post.comments.map(c => (
                    <div key={c.id} className="glass-panel border border-white/20 dark:border-white/10 rounded-2xl p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={c.authorAvatar} alt={c.authorName} className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{c.authorName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{c.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{c.content}</p>
                    </div>
                  ))}

                  {/* Add reply input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={e =>
                        setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter') handlePostComment(post.id);
                      }}
                      placeholder="Write a constructive peer reply..."
                      className="flex-1 glass-button border border-white/20 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={() => handlePostComment(post.id)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Discussion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative text-slate-900 dark:text-slate-100 flex flex-col gap-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Create New Discussion Thread</h3>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. How to prevent reward hacking in RLHF policy tuning?"
                  className="w-full glass-button border border-white/20 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as ForumPost['category'])}
                    className="w-full glass-button border border-white/20 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Generative AI" className="bg-slate-900 text-white">Generative AI</option>
                    <option value="Robotics" className="bg-slate-900 text-white">Robotics</option>
                    <option value="Career & Study" className="bg-slate-900 text-white">Career & Study</option>
                    <option value="AI Ethics" className="bg-slate-900 text-white">AI Ethics</option>
                    <option value="Papers" className="bg-slate-900 text-white">Papers</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="LoRA, PEFT, PyTorch"
                    className="w-full glass-button border border-white/20 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Discussion Content</label>
                <textarea
                  rows={5}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Elaborate on your question, provide context, or share research results..."
                  className="w-full glass-button border border-white/20 dark:border-white/10 rounded-2xl p-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl glass-button text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-bold text-xs cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
