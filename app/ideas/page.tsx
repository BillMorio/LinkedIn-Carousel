"use client";
import React, { useState, useEffect } from 'react';
import { Lightbulb, Search, Plus, Trash2, ExternalLink, Sparkles, Heart, BookmarkX, BookmarkCheck, ChevronDown, ChevronUp, Gift, Target, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = 'http://localhost:8000/api';

export default function IdeasPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIdeas, setExpandedIdeas] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await fetch(`${API_URL}/ideas`);
      const data = await res.json();
      setIdeas(data);
    } catch (error) {
      console.error("Failed to fetch ideas", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unarchiveIdea = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/ideas/${id}/toggle-save`, {
        method: 'POST'
      });
      if (res.ok) {
        // Remove from local list since this page only shows saved items
        setIdeas(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to unarchive", err);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIdeas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredIdeas = ideas.filter(idea => 
    idea.topic.toLowerCase().includes(search.toLowerCase()) ||
    idea.raw_content.toLowerCase().includes(search.toLowerCase()) ||
    (idea.niche_tag && idea.niche_tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#0A0A0A] min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Idea Bank</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2">Manage your content seeds</p>
        </div>
        <div className="flex items-center gap-3 md:gap-4 bg-zinc-900/50 border border-zinc-800 p-2 md:p-2.5 rounded-xl md:rounded-2xl w-full md:w-96">
          <Search className="text-zinc-500 ml-2 w-4 h-4 md:w-[18px] md:h-[18px]" />
          <input 
            type="text" 
            placeholder="Search ideas..." 
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
      ) : filteredIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 md:py-20 bg-zinc-900/10 border-2 border-dashed border-zinc-800 rounded-2xl md:rounded-3xl space-y-4">
          <div className="p-3 md:p-4 bg-zinc-900 rounded-xl md:rounded-2xl text-zinc-500">
            <Lightbulb className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="text-center px-4">
            <p className="text-xs md:text-sm font-bold text-zinc-400">Your bank is empty</p>
            <p className="text-[10px] md:text-xs text-zinc-600 font-bold uppercase tracking-wider mt-1">Start by scraping some ideas or adding them manually</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredIdeas.map((idea) => (
            <div 
              key={idea.id} 
              onClick={() => router.push(`/ideas/${idea.id}`)}
              className="bg-zinc-900/50 border border-zinc-800 p-5 md:p-6 rounded-xl md:rounded-2xl group hover:border-[#BFFF00]/30 transition-all flex flex-col cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="flex flex-col gap-1">
                  <span className={`text-[8px] font-black px-2 py-0.5 md:py-1 rounded uppercase border max-w-fit ${
                    idea.source === 'scraped'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : idea.source === 'clip'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  }`}>
                    {idea.source === 'clip' ? '✂ clip' : idea.source}
                  </span>
                  {idea.post_type && idea.post_type !== 'text' && (
                    <span className="text-[7px] font-black bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase max-w-fit">
                      {idea.post_type}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 text-[10px] text-zinc-600 font-bold">
                  <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                  {idea.engagement_count > 0 && (
                    <span className="text-red-500/60 flex items-center gap-1 font-black leading-none">
                      <Heart size={10} fill="currentColor" /> {idea.engagement_count}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-base md:text-lg font-black tracking-tighter mb-2 line-clamp-1">{idea.topic}</h3>
              
              {idea.media_url && (
                <div className="relative aspect-video mb-4 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/50 group-hover:border-[#BFFF00]/20 transition-all">
                  <img 
                    src={idea.media_url} 
                    alt={idea.topic}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                    <ImageIcon size={12} className="text-zinc-400" />
                  </div>
                </div>
              )}

              <div className="flex-1 space-y-4 mb-4 md:mb-6">
                <div className="text-[10px] md:text-xs text-zinc-400 font-medium leading-relaxed">
                  {expandedIdeas[idea.id] ? (
                    <div className="space-y-4">
                      <p className="whitespace-pre-wrap">{idea.raw_content}</p>
                      <button 
                        onClick={() => toggleExpand(idea.id)}
                        className="flex items-center gap-1.5 text-[#BFFF00] text-[9px] font-black uppercase tracking-widest hover:underline mt-2"
                      >
                        <ChevronUp size={12} />
                        show less
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="line-clamp-3">{idea.raw_content}</p>
                      {idea.raw_content.length > 150 && (
                        <button 
                          onClick={() => toggleExpand(idea.id)}
                          className="flex items-center gap-1.5 text-[#BFFF00] text-[9px] font-black uppercase tracking-widest hover:underline mt-2"
                        >
                          <ChevronDown size={12} />
                          see more
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {idea.notes && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                    <p className="text-[8px] font-black text-emerald-400/70 uppercase tracking-widest mb-1">My Note</p>
                    <p className="text-[10px] md:text-xs text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap break-words">{idea.notes}</p>
                  </div>
                )}

                {idea.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {idea.tags.split(',').map((t: string, i: number) => t.trim() && (
                      <span key={i} className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {(idea.analysis_funnel_stage || idea.analysis_giveaway) && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/50">
                    {idea.analysis_funnel_stage && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[8px] font-black text-purple-400 uppercase">
                        <Target size={10} />
                        {idea.analysis_funnel_stage}
                      </div>
                    )}
                    {idea.analysis_giveaway && idea.analysis_giveaway !== 'None' && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-[8px] font-black text-yellow-400 uppercase">
                        <Gift size={10} />
                        Giveaway
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                 <div className="flex gap-2">
                    {idea.niche_tag && (
                      <span className="text-[8px] font-black bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded uppercase truncate max-w-[120px]">
                        {idea.niche_tag}
                      </span>
                    )}
                 </div>
                 <div className="flex gap-2">
                    <Link 
                      href={`/create/post?topic=${encodeURIComponent(idea.topic)}&content=${encodeURIComponent(idea.raw_content)}`}
                      className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-[#BFFF00] transition-colors"
                    >
                      <Sparkles size={14} />
                    </Link>
                    <button 
                      onClick={() => unarchiveIdea(idea.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-lg transition-all group/btn"
                      title="Remove from Bank"
                    >
                      <BookmarkX size={14} className="group-hover/btn:scale-110" />
                    </button>
                    {idea.original_url && (
                      <a 
                        href={idea.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
