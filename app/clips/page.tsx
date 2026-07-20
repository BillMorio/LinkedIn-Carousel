"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Scissors, Search, ExternalLink, Trash2, Sparkles, Tag, Pencil, Check, X, Network, Loader2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const API_URL = 'http://localhost:8000/api';

const PLATFORM_COLORS: Record<string, string> = {
  twitter: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  linkedin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  youtube: 'bg-red-500/10 text-red-400 border-red-500/20',
  reddit: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  article: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  web: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

export default function ClipsPage() {
  const [clips, setClips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNote, setEditNote] = useState('');
  const [editTags, setEditTags] = useState('');

  const [connections, setConnections] = useState<any[] | null>(null);
  const [loadingConn, setLoadingConn] = useState(false);
  const [connError, setConnError] = useState('');

  useEffect(() => { fetchClips(); }, []);

  const fetchClips = async () => {
    try {
      const res = await fetch(`${API_URL}/ideas?source=clip`);
      setClips(await res.json());
    } catch (e) { console.error('Failed to load clips', e); }
    finally { setIsLoading(false); }
  };

  const parseTags = (t?: string) => (t ? t.split(',').map(s => s.trim()).filter(Boolean) : []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    clips.forEach(c => parseTags(c.tags).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [clips]);

  const filtered = useMemo(() => clips.filter(c => {
    if (activeTag && !parseTags(c.tags).includes(activeTag)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (c.topic || '').toLowerCase().includes(q) ||
        (c.raw_content || '').toLowerCase().includes(q) ||
        (c.notes || '').toLowerCase().includes(q) ||
        (c.tags || '').toLowerCase().includes(q);
    }
    return true;
  }), [clips, search, activeTag]);

  const startEdit = (clip: any) => {
    setEditingId(clip.id);
    setEditNote(clip.notes || '');
    setEditTags(clip.tags || '');
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/ideas/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editNote, tags: editTags.split(',').map(t => t.trim()).filter(Boolean) }),
      });
      if (res.ok) {
        const updated = await res.json();
        setClips(prev => prev.map(c => c.id === id ? { ...c, notes: updated.notes, tags: updated.tags } : c));
      }
    } catch (e) { console.error('save failed', e); }
    finally { setEditingId(null); }
  };

  const removeClip = async (id: number) => {
    if (!confirm('Remove this clip from your bank?')) return;
    const prev = clips;
    setClips(clips.filter(c => c.id !== id));
    try {
      const res = await fetch(`${API_URL}/ideas/${id}/toggle-save`, { method: 'POST' });
      if (!res.ok) throw new Error('failed');
    } catch (e) { setClips(prev); alert('Failed to remove clip.'); }
  };

  const findConnections = async () => {
    setLoadingConn(true); setConnError(''); setConnections(null);
    try {
      const res = await fetch(`${API_URL}/clips/connections`, { method: 'POST' });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'failed'); }
      const data = await res.json();
      setConnections(data.clusters || []);
    } catch (e: any) { setConnError(e.message || 'Failed to find connections'); }
    finally { setLoadingConn(false); }
  };

  return (
    <div className="p-4 md:p-10 space-y-8 bg-[#0A0A0A] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
            <Scissors className="text-emerald-400" size={28} /> Clips
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2">Captured from the web via Forge Clipper</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 p-2 md:p-2.5 rounded-xl md:rounded-2xl flex-1 md:w-72">
            <Search className="text-zinc-500 ml-1 w-4 h-4" />
            <input type="text" placeholder="Search clips..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-[10px] md:text-xs font-bold text-white placeholder:text-zinc-600" />
          </div>
          <button onClick={findConnections} disabled={loadingConn || clips.length < 2}
            className="flex items-center gap-2 bg-[#BFFF00] text-black px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#a8e600] transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
            {loadingConn ? <Loader2 size={14} className="animate-spin" /> : <Network size={14} />} Find Connections
          </button>
        </div>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setActiveTag(null)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${!activeTag ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}>All</button>
          {allTags.map(t => (
            <button key={t} onClick={() => setActiveTag(t === activeTag ? null : t)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${activeTag === t ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-zinc-900/50 text-emerald-400 border-zinc-800 hover:border-emerald-500/40'}`}>#{t}</button>
          ))}
        </div>
      )}

      {/* Connections panel */}
      {(connections || connError) && (
        <div className="bg-[#0D0D0D] border-2 border-[#BFFF00]/20 rounded-[2rem] p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-tighter italic flex items-center gap-2"><Network size={18} className="text-[#BFFF00]" /> Connections</h3>
            <button onClick={() => { setConnections(null); setConnError(''); }} className="text-zinc-500 hover:text-white"><X size={18} /></button>
          </div>
          {connError && <p className="text-red-400 text-xs font-bold">{connError}</p>}
          {connections && connections.length === 0 && <p className="text-zinc-500 text-xs font-bold">No strong connections found yet — clip a few more ideas.</p>}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {connections?.map((cl, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black bg-[#BFFF00]/10 text-[#BFFF00] border border-[#BFFF00]/20 px-2 py-0.5 rounded uppercase tracking-widest">{cl.theme}</span>
                </div>
                <p className="text-sm font-bold text-white leading-snug">{cl.angle}</p>
                <p className="text-[11px] text-zinc-500 italic">{cl.why}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(cl.clips || []).map((c: any) => (
                    <span key={c.id} className="text-[8px] font-black bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded truncate max-w-[160px]" title={c.topic}>{c.topic}</span>
                  ))}
                </div>
                <Link href={`/create/post?topic=${encodeURIComponent(cl.angle)}`}
                  className="inline-flex items-center gap-2 text-[10px] font-black text-[#BFFF00] uppercase tracking-widest hover:underline">
                  <Sparkles size={12} /> Generate post <ArrowUpRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clip grid */}
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/10 border-2 border-dashed border-zinc-800 rounded-3xl space-y-4">
          <div className="p-4 bg-zinc-900 rounded-2xl text-zinc-500"><Scissors className="w-8 h-8" /></div>
          <div className="text-center px-4">
            <p className="text-sm font-bold text-zinc-400">No clips yet</p>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mt-1">Install the Forge Clipper extension and start hunting</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map(clip => {
            const style = PLATFORM_COLORS[(clip.niche_tag || 'web').toLowerCase()] || PLATFORM_COLORS.web;
            const editing = editingId === clip.id;
            return (
              <div key={clip.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-3 hover:border-emerald-500/30 transition-all">
                <div className="flex justify-between items-start">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase border ${style}`}>{clip.niche_tag || 'web'}</span>
                  <span className="text-[10px] text-zinc-600 font-bold">{new Date(clip.created_at).toLocaleDateString()}</span>
                </div>

                <h3 className="text-sm font-black tracking-tight line-clamp-2">{clip.topic}</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3">{clip.raw_content}</p>

                {/* Note + tags (view / edit) */}
                {editing ? (
                  <div className="space-y-2">
                    <textarea value={editNote} onChange={e => setEditNote(e.target.value)} rows={2} placeholder="Your note..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-[11px] text-white outline-none focus:border-emerald-500/40" />
                    <input value={editTags} onChange={e => setEditTags(e.target.value)} placeholder="tags, comma, separated"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-[11px] text-white outline-none focus:border-emerald-500/40" />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(clip.id)} className="flex items-center gap-1 bg-emerald-500 text-black px-3 py-1.5 rounded-lg text-[9px] font-black uppercase"><Check size={12} /> Save</button>
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase"><X size={12} /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {clip.notes && (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2.5">
                        <p className="text-[8px] font-black text-emerald-400/70 uppercase tracking-widest mb-1">My Note</p>
                        <p className="text-[11px] text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">{clip.notes}</p>
                      </div>
                    )}
                    {clip.tags && (
                      <div className="flex flex-wrap gap-1.5">
                        {parseTags(clip.tags).map((t, i) => (
                          <span key={i} className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase flex items-center gap-1"><Tag size={8} />{t}</span>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-3 mt-auto border-t border-zinc-800">
                  <div className="flex gap-2">
                    <button onClick={() => editing ? setEditingId(null) : startEdit(clip)} title="Edit note/tags"
                      className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-emerald-400 transition-colors"><Pencil size={13} /></button>
                    <Link href={`/create/post?topic=${encodeURIComponent(clip.topic)}&content=${encodeURIComponent(clip.raw_content || '')}`}
                      title="Send to Post Editor" className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-[#BFFF00] transition-colors"><Sparkles size={13} /></Link>
                  </div>
                  <div className="flex gap-2">
                    {clip.original_url && (
                      <a href={clip.original_url} target="_blank" rel="noopener noreferrer" title="Open source"
                        className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"><ExternalLink size={13} /></a>
                    )}
                    <button onClick={() => removeClip(clip.id)} title="Remove"
                      className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500/20 transition-all"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
