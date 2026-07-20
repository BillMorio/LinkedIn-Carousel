"use client";
import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Trash2, ExternalLink, Sparkles, Archive, Layers } from 'lucide-react';
import Link from 'next/link';

const API_URL = 'http://localhost:8000/api';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      // Filter only drafts
      setDrafts(data.filter((p: any) => p.status === 'draft'));
    } catch (error) {
      console.error("Failed to fetch drafts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this draft? This cannot be undone.')) return;
    // Optimistically remove from the list
    const prev = drafts;
    setDrafts(drafts.filter(d => d.id !== id));
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
    } catch (error) {
      console.error('Failed to delete draft', error);
      setDrafts(prev); // roll back on failure
      alert('Failed to delete draft. Please try again.');
    }
  };

  const filteredDrafts = drafts.filter(draft =>
    draft.title.toLowerCase().includes(search.toLowerCase()) ||
    draft.content_json.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#0A0A0A] min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Drafts Vault</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2">Your forged content awaits</p>
        </div>
        <div className="flex items-center gap-3 md:gap-4 bg-zinc-900/50 border border-zinc-800 p-2 md:p-2.5 rounded-xl md:rounded-2xl w-full md:w-96">
          <Search className="text-zinc-500 ml-2 w-4 h-4 md:w-[18px] md:h-[18px]" />
          <input 
            type="text" 
            placeholder="Search drafts..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-[10px] md:text-xs font-bold text-white placeholder:text-zinc-600"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#BFFF00] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredDrafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 md:py-20 bg-zinc-900/10 border-2 border-dashed border-zinc-800 rounded-2xl md:rounded-3xl space-y-4">
          <div className="p-3 md:p-4 bg-zinc-900 rounded-xl md:rounded-2xl text-zinc-500">
            <Archive className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="text-center px-4">
            <p className="text-xs md:text-sm font-bold text-zinc-400">The vault is empty</p>
            <p className="text-[10px] md:text-xs text-zinc-600 font-bold uppercase tracking-wider mt-1">Start forging posts or carousels to see them here</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredDrafts.map((draft) => (
            <div key={draft.id} className="bg-zinc-900/50 border border-zinc-800 p-5 md:p-6 rounded-xl md:rounded-2xl group hover:border-[#BFFF00]/30 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <span className={`text-[8px] font-black px-2 py-0.5 md:py-1 rounded uppercase border flex items-center gap-1 ${
                  draft.type === 'text'
                    ? 'bg-[#BFFF00]/10 text-[#BFFF00] border-[#BFFF00]/20'
                    : draft.type === 'article'
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {draft.type === 'carousel' ? <Layers size={8} /> : <FileText size={8} />}
                  {draft.type}
                </span>
                <span className="text-[10px] text-zinc-600 font-bold">
                  {new Date(draft.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-black tracking-tighter mb-2 line-clamp-1">{draft.title}</h3>
              <p className="text-[10px] md:text-xs text-zinc-400 font-medium mb-4 md:mb-6 flex-1 line-clamp-4 leading-relaxed">
                {draft.content_json}
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                 <div className="flex gap-2">
                    <span className="text-[8px] font-black bg-zinc-800 text-white px-2 py-0.5 rounded uppercase">
                      Draft
                    </span>
                 </div>
                 <div className="flex gap-2">
                    <Link 
                      href={draft.type === 'text' ? `/create/post?id=${draft.id}` : `/create/carousel?id=${draft.id}`}
                      className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-[#BFFF00] transition-colors"
                    >
                      <Sparkles size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(draft.id)}
                      className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
