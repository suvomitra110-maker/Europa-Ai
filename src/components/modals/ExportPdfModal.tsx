import React from 'react';
import { X, Printer, Download, FileCheck } from 'lucide-react';
import { StudyNote } from '../../types';

interface ExportPdfModalProps {
  note: StudyNote | null;
  onClose: () => void;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({ note, onClose }) => {
  if (!note) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# Europa Ai Study Note: ${note.title}\n\n**Subject**: ${note.category}\n**Updated**: ${note.updatedAt}\n**Tags**: ${note.tags.join(', ')}\n\n---\n\n## Content\n${note.content}\n\n## Key Takeaways\n${note.keyTakeaways.map(t => `- ${t}`).join('\n')}\n\n---\n*Exported from Europa Ai Personalized Learning Hub*`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl max-w-2xl w-full max-h-[85vh] p-6 shadow-2xl relative text-slate-900 dark:text-slate-100 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-500 cursor-pointer shadow-sm transition"
            >
              <span>← Back</span>
            </button>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Export Study Document</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">PDF Print & Markdown Export</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-cyan-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-1.5 rounded-xl glass-button text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save .MD</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-button text-slate-400 hover:text-rose-500 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable styled page preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 font-sans print:bg-white print:text-black">
          <div className="border-b border-slate-800 pb-4 mb-4">
            <div className="text-xs font-mono uppercase text-cyan-400 print:text-blue-600 font-bold">
              Europa Ai Study Summary
            </div>
            <h1 className="text-xl font-extrabold text-white print:text-black mt-1">{note.title}</h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 print:text-gray-600 mt-2">
              <span>Category: <strong>{note.category}</strong></span>
              <span>•</span>
              <span>Updated: {note.updatedAt}</span>
              {note.sourceLecture && (
                <>
                  <span>•</span>
                  <span>Lecture: {note.sourceLecture}</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {note.content}
          </div>

          {note.keyTakeaways && note.keyTakeaways.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-gray-900 mb-2">
                Core Key Takeaways
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300 print:text-gray-800">
                {note.keyTakeaways.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-slate-900 text-center text-[10px] text-slate-500">
            Europa Ai — Verified Personalized Learning Knowledge Base
          </div>
        </div>
      </div>
    </div>
  );
};
