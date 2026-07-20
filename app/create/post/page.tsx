"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  Sparkles, 
  Send, 
  User, 
  BookOpen, 
  Check, 
  RotateCw,
  Copy,
  Calendar,
  Eye,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function PostEditor() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading Forge...</div>}>
      <PostEditorContent />
    </Suspense>
  );
}

function PostEditorContent() {
  const [topic, setTopic] = useState("");
  const [draft, setDraft] = useState("");
  const [format, setFormat] = useState<'post' | 'article'>('post');
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeVoice, setActiveVoice] = useState("Pro Builder");
  const [activeFramework, setActiveFramework] = useState("None");
  const [showPreview, setShowPreview] = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [editingId, setEditingId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const ideaTopic = searchParams.get('topic');
    const ideaContent = searchParams.get('content');
    if (ideaTopic || ideaContent) {
      setTopic(`${ideaTopic || ''}\n\nContext: ${ideaContent || ''}`.trim());
    }
  }, [searchParams]);

  // Load an existing draft into the editor when ?id= is present
  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/posts/${id}`);
        if (!res.ok) return;
        const post = await res.json();
        setDraft(post.content_json || '');
        setEditingId(post.id);
      } catch (error) {
        console.error('Failed to load draft', error);
      }
    })();
  }, [searchParams]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const selectedFramework = activeFramework !== 'None' ? activeFramework : null;
      const res = await fetch('http://localhost:8000/api/generate/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          framework_id: null,
          voice_id: activeVoice,
          format,
        }),
      });
      const data = await res.json();
      setDraft(data.draft);
      // For articles, seed the title field from the generated first line
      if (format === 'article' && data.draft) {
        setTitle((data.draft.split('\n')[0] || '').slice(0, 100));
      }
      if (window.innerWidth < 1024) {
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Generation failed", error);
      setDraft("An error occurred while generating the post. Please ensure the backend is running at http://localhost:8000");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!draft.trim() || saveState === 'saving') return;
    setSaveState('saving');
    try {
      const draftTitle = format === 'article'
        ? (title.trim() || draft.trim().split('\n')[0] || 'Untitled Article').slice(0, 80)
        : (draft.trim().split('\n')[0] || 'Untitled Draft').slice(0, 60);
      const isEditing = editingId != null;
      const res = await fetch(
        isEditing ? `http://localhost:8000/api/posts/${editingId}` : 'http://localhost:8000/api/posts',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: format === 'article' ? 'article' : 'text',
            title: draftTitle,
            content_json: draft,
            status: 'draft',
          }),
        }
      );
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      const saved = await res.json();
      // After a first save, keep editing the same draft instead of duplicating it
      if (!isEditing && saved?.id) setEditingId(saved.id);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      console.error('Save draft failed', error);
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  const saveLabel =
    saveState === 'saving' ? 'SAVING…' :
    saveState === 'saved' ? 'SAVED!' :
    saveState === 'error' ? 'RETRY' :
    editingId != null ? 'UPDATE DRAFT' : 'SAVE DRAFT';

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#0A0A0A] text-white overflow-hidden relative">
      {/* Editor Side */}
      <div className={cn(
        "flex-1 flex flex-col border-r border-zinc-800 overflow-hidden transition-all duration-300",
        showPreview ? "hidden lg:flex" : "flex"
      )}>
        {/* Top Header */}
        <div className="px-4 md:px-8 py-4 md:py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase">{format === 'article' ? 'Article Editor' : 'Post Editor'}</h2>
            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase truncate">{format === 'article' ? 'Forge long-form content' : 'Forge your text content'}</p>
          </div>
          <div className="flex gap-2 md:gap-3">
            <button className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] md:text-xs font-bold hover:bg-zinc-800 transition-colors">
              <Calendar size={14} /> Schedule
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={!draft.trim() || saveState === 'saving'}
              className={cn(
                "flex items-center gap-2 px-4 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-colors leading-none tracking-tight disabled:opacity-40 disabled:cursor-not-allowed",
                saveState === 'error'
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : saveState === 'saved'
                  ? "bg-[#8ACC00] text-black"
                  : "bg-[#BFFF00] text-black hover:bg-[#8ACC00]"
              )}
            >
              {saveState === 'saving'
                ? <RotateCw size={14} className="animate-spin" />
                : saveState === 'saved'
                ? <Check size={14} />
                : <Send size={14} />}
              {saveLabel}
            </button>
            <button 
              onClick={() => setShowPreview(true)}
              className="lg:hidden flex items-center justify-center p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="px-4 md:px-8 py-4 border-b border-zinc-800 grid grid-cols-2 gap-3 md:gap-4 bg-zinc-900/20">
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5 ml-1">
              <User size={10} /> <span className="truncate">Voice / Persona</span>
            </label>
            <select 
              value={activeVoice}
              onChange={(e) => setActiveVoice(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-[10px] md:text-xs font-bold focus:border-[#BFFF00] outline-none transition-colors appearance-none truncate"
            >
              <option>Pro Builder</option>
              <option>Casual Founder</option>
              <option>Technical Architect</option>
            </select>
          </div>
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5 ml-1">
              <BookOpen size={10} /> <span className="truncate">Framework</span>
            </label>
            <select 
              value={activeFramework}
              onChange={(e) => setActiveFramework(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-[10px] md:text-xs font-bold focus:border-[#BFFF00] outline-none transition-colors appearance-none truncate"
            >
              <option>None</option>
              <option>Alex Hormozi (The Blueprint)</option>
              <option>Justin Welsh (The Saturation)</option>
              <option>Dan Koe (The Narrative)</option>
            </select>
          </div>
        </div>

        {/* Task Input */}
        <div className="px-4 md:px-8 py-4 md:py-6 space-y-4">
          {/* Format toggle: Post vs Article */}
          <div className="inline-flex p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
            {(['post', 'article'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  format === f ? "bg-[#BFFF00] text-black" : "text-zinc-500 hover:text-white"
                )}
              >
                <FileText size={12} /> {f}
              </button>
            ))}
          </div>

          {/* Article title */}
          {format === 'article' && (
            <div className="space-y-2">
              <label className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Article Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A compelling article headline..."
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold placeholder:text-zinc-700 focus:border-[#BFFF00]/30 outline-none transition-all"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{format === 'article' ? 'What should the article cover?' : 'What are we building today?'}</label>
            <div className="relative group">
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Paste an idea..."
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl md:rounded-2xl p-4 text-[10px] md:text-sm font-bold placeholder:text-zinc-700 min-h-[100px] md:min-h-[120px] focus:border-[#BFFF00]/30 outline-none transition-all group-hover:border-zinc-700 pb-16"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    isGenerating 
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                      : "bg-[#BFFF00] text-black hover:bg-[#8ACC00] shadow-[0_4px_20px_rgba(191,255,0,0.2)]"
                  )}
                >
                  {isGenerating ? <RotateCw className="animate-spin" size={12} /> : <Sparkles size={12} />}
                  {isGenerating ? "Forging..." : "Generate"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 px-4 md:px-8 pb-4 md:pb-8 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest">{format === 'article' ? 'Article Body' : 'Final Draft'}</span>
            <button 
              onClick={() => navigator.clipboard.writeText(draft)}
              className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-bold text-zinc-500 hover:text-[#BFFF00] transition-colors uppercase tracking-widest"
            >
              <Copy size={12} /> COPY ALL
            </button>
          </div>
          <textarea 
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Your drafted content will appear here..."
            className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-xl md:rounded-2xl p-4 md:p-6 text-[11px] md:text-base font-medium leading-relaxed resize-none focus:border-[#BFFF00]/20 outline-none transition-all placeholder:text-zinc-800"
          />
        </div>
      </div>

      {/* Preview Side */}
      <div className={cn(
        "bg-zinc-950 p-6 md:p-8 flex flex-col overflow-y-auto transition-all duration-300 lg:w-[450px] w-full",
        showPreview ? "flex" : "hidden lg:flex"
      )}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2">
            <Eye size={12} /> LinkedIn Live Preview
          </h3>
          <button 
            onClick={() => setShowPreview(false)}
            className="lg:hidden flex items-center gap-1 text-[10px] font-black text-[#BFFF00] uppercase tracking-widest"
          >
            <ChevronLeft size={14} /> Back to Editor
          </button>
        </div>

        {/* Live Preview: article layout vs feed-post layout */}
        {format === 'article' ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden text-black font-sans max-w-[550px] mx-auto w-full">
            <div className="h-28 bg-gradient-to-br from-zinc-200 to-zinc-100 flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Cover Image</span>
            </div>
            <div className="p-5 md:p-6">
              <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight mb-4 [overflow-wrap:anywhere]">
                {title || (draft ? draft.split('\n')[0] : 'Your article title')}
              </h1>
              <div className="flex items-center gap-2 mb-5 pb-5 border-b border-zinc-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#BFFF00] to-blue-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold">Bill Morio</p>
                  <p className="text-[10px] text-zinc-500">Neural Architect &amp; Founder · Now</p>
                </div>
              </div>
              <div className="text-[13px] md:text-sm whitespace-pre-wrap [overflow-wrap:anywhere] leading-relaxed text-zinc-800">
                {(() => {
                  if (!draft) return 'Start forging to see your article preview...';
                  const lines = draft.split('\n');
                  const body = lines[0].trim() === (title || '').trim() ? lines.slice(1).join('\n').trim() : draft;
                  return body || draft;
                })()}
              </div>
            </div>
          </div>
        ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden text-black font-sans max-w-[550px] mx-auto w-full">
          <div className="p-4 flex gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-200 rounded-full shrink-0 overflow-hidden">
               <div className="w-full h-full bg-gradient-to-br from-[#BFFF00] to-blue-400" />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-bold hover:text-blue-600 cursor-pointer">Bill Morio</p>
              <p className="text-[10px] text-zinc-500 truncate">Neural Architect & Founder @ The Forge</p>
              <p className="text-[10px] text-zinc-400 mt-0.5 whitespace-nowrap">Now • 🌐</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="text-[12px] md:text-sm whitespace-pre-wrap [overflow-wrap:anywhere] leading-normal prose prose-sm max-w-none">
              {!draft ? (
                "Start forging to see your post preview..."
              ) : (() => {
                const LIMIT = 220;                       // ~LinkedIn's desktop cutoff
                const lines = draft.split('\n');
                const tooLong = draft.length > LIMIT || lines.length > 3;

                if (!tooLong || previewExpanded) {
                  return (
                    <>
                      {draft}
                      {tooLong && (
                        <span
                          onClick={() => setPreviewExpanded(false)}
                          className="ml-1 cursor-pointer text-zinc-500 hover:text-zinc-700 font-medium"
                        >
                          see less
                        </span>
                      )}
                    </>
                  );
                }

                let collapsed = lines.slice(0, 3).join('\n');
                if (collapsed.length > LIMIT) collapsed = collapsed.slice(0, LIMIT);
                collapsed = collapsed.replace(/\s+$/, '');
                return (
                  <>
                    {collapsed}
                    <span
                      onClick={() => setPreviewExpanded(true)}
                      className="cursor-pointer text-zinc-500 hover:text-zinc-700 font-medium"
                    >
                      …more
                    </span>
                  </>
                );
              })()}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-zinc-500 pt-4 border-t border-zinc-100">
               <span className="hover:bg-zinc-100 px-2 py-1 rounded transition-colors cursor-pointer">Like</span>
               <span className="hover:bg-zinc-100 px-2 py-1 rounded transition-colors cursor-pointer">Comment</span>
               <span className="hover:bg-zinc-100 px-2 py-1 rounded transition-colors cursor-pointer">Repost</span>
            </div>
          </div>
        </div>
        )}

        {/* Tips / Context */}
        <div className="mt-8 md:mt-10 bg-zinc-900/50 border border-zinc-800 rounded-xl md:rounded-2xl p-5 md:p-6 space-y-4 max-w-[550px] mx-auto w-full">
          <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Neural Insights</h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#BFFF00] mt-1.5 shrink-0" />
              <p className="text-[10px] md:text-[11px] text-zinc-500 leading-relaxed font-bold italic">
                "Apply the {activeFramework !== 'None' ? activeFramework : 'Persona'} layer to increase engagement by 24%."
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <p className="text-[10px] md:text-[11px] text-zinc-500 leading-relaxed font-bold">
                Your hook is optimal for conversion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
