"use client";
import React, { useState } from 'react';
import { 
  Search, 
  Zap, 
  MessageSquare, 
  Heart, 
  ExternalLink, 
  RefreshCw, 
  X, 
  TrendingUp, 
  BarChart3, 
  Filter, 
  Users, 
  Layout, 
  ArrowUpRight, 
  Star, 
  Calendar,
  Bookmark,
  BookmarkCheck,
  Download,
  ChevronDown,
  ChevronUp,
  Gift,
  Target,
  Image as ImageIcon,
  UserPlus,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = 'http://localhost:8000/api';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [contentType, setContentType] = useState('documents');
  const [maxResults, setMaxResults] = useState(10);
  const [sortBy, setSortBy] = useState('date_posted');
  const [expandedIdeas, setExpandedIdeas] = useState<Record<number, boolean>>({});
  
  // Scraper State
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [watchlistStatus, setWatchlistStatus] = useState<Record<string, boolean>>({});

  const [savedKeywords, setSavedKeywords] = useState<any[]>([]);
  const [localSortBy, setLocalSortBy] = useState<'likes' | 'comments' | 'newest'>('newest');
  const [filterType, setFilterType] = useState<string>('all');

  React.useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const res = await fetch(`${API_URL}/discovery/keywords`);
      const data = await res.json();
      setSavedKeywords(data);
    } catch (err) {
      console.error("Failed to fetch keywords");
    }
  };

  const loadLocalResults = async (keyword: string) => {
    setQuery(keyword);
    setIsSearching(true);
    try {
      const res = await fetch(`${API_URL}/discovery/results/${encodeURIComponent(keyword)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Local load failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIdeas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Computed: Sorted and Filtered Results
  const sortedAndFilteredResults = React.useMemo(() => {
    let filtered = [...results];

    // Apply Filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.post_type?.toLowerCase() === filterType.toLowerCase());
    }

    // Apply Sort
    return filtered.sort((a, b) => {
      if (localSortBy === 'likes') return (b.engagement_count || 0) - (a.engagement_count || 0);
      if (localSortBy === 'comments') return (b.comments_count || 0) - (a.comments_count || 0);
      
      const dateA = a.posted_at ? new Date(a.posted_at).getTime() : new Date(a.created_at).getTime();
      const dateB = b.posted_at ? new Date(b.posted_at).getTime() : new Date(b.created_at).getTime();
      return dateB - dateA;
    });
  }, [results, filterType, localSortBy]);

  const formatDate = (date: any, raw: string) => {
    if (raw && /^\d{4}-\d{2}-\d{2}T/.test(raw)) {
      return new Date(raw).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
    if (raw) return raw;
    if (!date) return 'Recently';
    return new Date(date).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };


  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`${API_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          content_type: contentType === 'all' ? "" : contentType,
          maxResults: maxResults,
          sort_by: sortBy
        })
      });
      const data = await res.json();
      if (data.ideas) {
        setResults(data.ideas);
        fetchKeywords(); // Refresh the vault
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const addToWatchlist = async (idea: any) => {
    if (watchlistStatus[idea.author_profile_url]) return;
    try {
      const res = await fetch(`${API_URL}/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: idea.author_name,
          linkedin_url: idea.author_profile_url,
          avatar_url: idea.author_avatar_url,
          headline: idea.author_headline || "Creator discovered via search"
        })
      });
      if (res.ok) {
        setWatchlistStatus(prev => ({ ...prev, [idea.author_profile_url]: true }));
      }
    } catch (err) {
      console.error("Failed to add to watchlist", err);
    }
  };

  const analyzePost = async (idea: any) => {
    setSelectedIdea(idea);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch(`${API_URL}/ideas/${idea.id}/analyze`, { method: 'POST' });
      const data = await res.json();
      
      if (data.hook_strength || data.funnel_stage) {
        let text = `🎯 FUNNEL STAGE: ${data.funnel_stage}\n`;
        text += `🎁 GIVEAWAY: ${data.giveaway}\n\n`;
        text += `🪝 HOOK STRENGTH: ${data.hook_strength}\n\n`;
        text += `🧬 VIRAL MECHANICS:\n${data.viral_mechanics}\n\n`;
        text += `📐 STRUCTURE:\n${data.structure}\n\n`;
        text += `💡 REPLICATION TIP:\n${data.replication_tip}`;
        setAnalysisResult(text);
        
        // Update local results with backfilled analysis if possible
        setResults(prev => prev.map(item => 
          item.id === idea.id ? { 
            ...item, 
            analysis_funnel_stage: data.funnel_stage, 
            analysis_giveaway: data.giveaway 
          } : item
        ));
      } else if (data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        setAnalysisResult("Analysis failed. Please try again.");
      }
    } catch (err) {
      setAnalysisResult("Connection error. Ensure backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSave = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/ideas/${id}/toggle-save`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        // Update local state to reflect save status
        setResults(prev => prev.map(item => 
          item.id === id ? { ...item, is_saved: data.is_saved } : item
        ));
      }
    } catch (err) {
      console.error("Toggle save failed", err);
    }
  };

  const saveToVault = async () => {
    if (!query) return;
    try {
      const res = await fetch(`${API_URL}/discovery/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: query })
      });
      if (res.ok) {
        fetchKeywords();
      }
    } catch (err) {
      console.error("Save to vault failed", err);
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-12 bg-[#0A0A0A] min-h-screen text-white relative flex flex-col items-center overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#BFFF00]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none"></div>

      {/* Header Section */}
      <div className="w-full max-w-7xl flex flex-col gap-8 relative z-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white outline-text leading-none">Intelligence Search</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 ml-1">Universal LinkedIn Discovery Engine</p>
        </div>

        {/* Search Bar & Advanced Filters */}
        <form onSubmit={handleSearch} className="space-y-6">
            <div className="relative group">
                <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#BFFF00] transition-colors">
                    <Search size={22} />
                </div>
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search keywords (e.g. OpenClaw, AI Agents, SaaS...)"
                    className="w-full bg-zinc-900/40 border border-zinc-800 text-white pl-20 pr-8 py-8 rounded-[2.5rem] outline-none focus:border-[#BFFF00] focus:bg-zinc-900 transition-all font-bold placeholder:text-zinc-700 text-xl backdrop-blur-md shadow-2xl"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Max Results */}
                <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Maximum Results</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            min="1" 
                            max="50"
                            value={maxResults}
                            onChange={(e) => setMaxResults(parseInt(e.target.value))}
                            className="w-full bg-zinc-900/50 border border-zinc-800 text-white px-6 py-4 rounded-2xl outline-none focus:border-[#BFFF00] font-black tracking-widest text-[10px]"
                        />
                    </div>
                </div>

                {/* Sort By */}
                <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Sort By</label>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 text-white px-6 py-4 rounded-2xl outline-none focus:border-[#BFFF00] appearance-none font-black uppercase tracking-widest text-[10px] cursor-pointer"
                    >
                        <option value="date_posted">Newest (Date Posted)</option>
                        <option value="relevance">Relevance</option>
                    </select>
                </div>

                {/* Content Type */}
                <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Content Type</label>
                    <select 
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 text-white px-6 py-4 rounded-2xl outline-none focus:border-[#BFFF00] appearance-none font-black uppercase tracking-widest text-[10px] cursor-pointer"
                    >
                        <option value="all">All Channels</option>
                        <option value="documents">Documents (Carousels)</option>
                        <option value="photos">Photos</option>
                        <option value="videos">Videos</option>
                        <option value="liveVideos">Live Videos</option>
                        <option value="collaborativeArticles">Articles</option>
                    </select>
                </div>

                <div className="flex flex-col justify-end">
                    <button 
                        type="submit"
                        disabled={isSearching || !query}
                        className={`w-full py-4 bg-[#BFFF00] text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_40px_rgba(191,255,0,0.2)] ${isSearching ? 'opacity-50' : ''}`}
                    >
                        {isSearching ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                        {isSearching ? 'SCANNING...' : 'INITIATE SCAN'}
                    </button>
                </div>
            </div>
        </form>

        {/* Discovery Vault (Keyword Chips) */}
        {savedKeywords.length > 0 && (
          <div className="w-full max-w-7xl flex flex-wrap gap-2 md:gap-3 py-4 md:py-6 border-y border-zinc-900/50">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2 mr-2 w-full md:w-auto mb-2 md:mb-0">
              <Zap size={10} className="text-[#BFFF00]" /> Recent Scans:
            </span>
            <div className="flex flex-wrap gap-2">
              {savedKeywords.map((kw: any) => (
                <button
                  key={kw.id}
                  onClick={() => loadLocalResults(kw.keyword)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full border text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                    query === kw.keyword 
                    ? 'bg-[#BFFF00] text-black border-[#BFFF00]' 
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {kw.keyword}
                  <span className="opacity-40 text-[8px]">{kw.result_count}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="w-full max-w-7xl space-y-6 md:space-y-8 relative z-10 pb-20">
        {results.length > 0 && (
          <div className="flex flex-col gap-6 bg-zinc-900/30 p-6 md:p-8 rounded-[2rem] border border-zinc-800/50 backdrop-blur-xl">
            {/* Toolbar Top: Info & Primary Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex flex-col">
                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <BarChart3 size={20} className="text-[#BFFF00]" />
                  Internal Intelligence
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  Source: {query} • {results.length} Nodes Found
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => handleSearch()}
                  className="flex-1 md:flex-none px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-[#BFFF00] rounded-xl text-[10px] font-black uppercase tracking-widest border border-zinc-700 transition-all flex items-center justify-center gap-2 group"
                >
                  <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                  Deep Scan
                </button>

                {/* Manual Save Button */}
                {!savedKeywords.some(sw => sw.keyword.toLowerCase() === query.toLowerCase()) && (
                  <button 
                    onClick={saveToVault}
                    className="flex-1 md:flex-none px-6 py-3 bg-[#BFFF00] text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Star size={12} fill="currentColor" />
                    Save to Vault
                  </button>
                )}
              </div>
            </div>

            {/* Toolbar Bottom: Local Sort/Filter */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 border-t border-zinc-900 pt-6">
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-zinc-800 overflow-x-auto custom-scrollbar no-scrollbar">
                {['all', 'carousel', 'image', 'video', 'text'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      filterType === type 
                      ? 'bg-zinc-800 text-[#BFFF00] shadow-lg' 
                      : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex-1"></div>

              <select 
                value={localSortBy}
                onChange={(e) => setLocalSortBy(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl outline-none focus:border-[#BFFF00] cursor-pointer"
              >
                <option value="newest">Recent Nodes First</option>
                <option value="likes">Highest Impact (Likes)</option>
                <option value="comments">Viral Intensity (Comments)</option>
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {sortedAndFilteredResults.map((idea, index) => {
            const typeStyles: Record<string, string> = {
              'carousel': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
              'image': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
              'video': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
              'text': 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'
            };
            const currentStyle = typeStyles[(idea.post_type || 'text').toLowerCase()] || typeStyles.text;

            return (
              <div 
                key={idea.id || `search-${index}`} 
                onClick={() => idea.id && router.push(`/ideas/${idea.id}`)}
                className="group bg-[#0D0D0D] border border-zinc-800/50 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] hover:border-[#BFFF00]/40 transition-all flex flex-col h-full relative overflow-hidden backdrop-blur-xl shadow-2xl cursor-pointer"
              >
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6 border-b border-zinc-900/50 pb-5">
                    {idea.author_avatar_url ? (
                        <img src={idea.author_avatar_url} className="w-10 h-10 rounded-xl border border-zinc-800" alt="" />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700">
                            <Users size={20} />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                             <a 
                                href={idea.author_profile_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-white font-black text-xs uppercase truncate hover:text-[#BFFF00] transition-colors"
                             >
                                {idea.author_name}
                             </a>
                             <button 
                                onClick={() => addToWatchlist(idea)}
                                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                                    watchlistStatus[idea.author_profile_url]
                                    ? 'bg-[#BFFF00] text-black shadow-[0_0_20px_rgba(191,255,0,0.3)]'
                                    : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-[#BFFF00] hover:border-[#BFFF00]/40'
                                }`}
                                title={watchlistStatus[idea.author_profile_url] ? "In Watchlist" : "Add to Watchlist"}
                             >
                                {watchlistStatus[idea.author_profile_url] ? (
                                    <>
                                        <Check size={12} className="stroke-[3]" />
                                        <span className="text-[10px] font-black uppercase tracking-tight hidden sm:inline">Tracked</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-tight hidden sm:inline">Watchlist</span>
                                    </>
                                )}
                             </button>
                        </div>
                        <p className="text-[9px] text-zinc-600 font-bold truncate uppercase tracking-wider">{idea.author_headline || "Creator"}</p>
                    </div>
                    {/* Post Date */}
                    <div className="flex flex-col items-end whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-zinc-500">
                            <Calendar size={10} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{formatDate(idea.posted_at, idea.posted_at_raw)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-start mb-6">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${currentStyle}`}>
                        {(idea.post_type || 'TEXT').toUpperCase()}
                    </span>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <Heart size={14} className="text-red-500 fill-red-500" />
                            <span className="text-xs font-black text-red-500">{idea.engagement_count}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <MessageSquare size={14} className="text-blue-500 fill-blue-500" />
                            <span className="text-xs font-black text-blue-500">{idea.comments_count || 0}</span>
                        </div>
                    </div>
                </div>

                {idea.media_url && (
                    <div className="relative aspect-video mb-6 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/50">
                        <img 
                            src={idea.media_url} 
                            alt={idea.topic}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                            <ImageIcon size={14} className="text-zinc-400" />
                        </div>
                    </div>
                )}

                <h3 className="text-lg md:text-xl font-black tracking-tighter mb-4 text-white line-clamp-2">{idea.topic}</h3>

                <div className="flex-1 relative mb-6">
                  <div className="text-sm text-zinc-300 font-medium leading-relaxed">
                    {expandedIdeas[idea.id] ? (
                      <div className="space-y-4">
                         <p className="whitespace-pre-wrap">{idea.raw_content || "No content available."}</p>
                         <button 
                           onClick={() => toggleExpand(idea.id)}
                           className="flex items-center gap-1.5 text-[#BFFF00] text-[10px] font-black uppercase tracking-widest hover:underline"
                         >
                           <ChevronUp size={14} />
                           collapse content
                         </button>
                      </div>
                    ) : (
                      <div>
                        <p className="line-clamp-3">
                            {idea.raw_content || ""}
                        </p>
                        {idea.raw_content && idea.raw_content.length > 150 && (
                          <button 
                            onClick={() => toggleExpand(idea.id)}
                            className="flex items-center gap-1.5 mt-2 text-zinc-500 hover:text-[#BFFF00] text-[10px] font-black uppercase tracking-widest transition-colors"
                          >
                            <ChevronDown size={14} />
                            see more
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {(idea.analysis_funnel_stage || (idea.analysis_giveaway && idea.analysis_giveaway !== 'None')) && (
                  <div className="flex flex-wrap gap-2 mb-6 pt-4 border-t border-zinc-900/50">
                    {idea.analysis_funnel_stage && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[10px] font-black text-purple-400 uppercase">
                        <Target size={12} />
                        {idea.analysis_funnel_stage}
                      </div>
                    )}
                    {idea.analysis_giveaway && idea.analysis_giveaway !== 'None' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-[10px] font-black text-yellow-400 uppercase">
                        <Gift size={12} />
                        Giveaway
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-6 border-t border-zinc-900 flex items-center justify-between">
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Signal Source</span>
                   <div className="flex items-center gap-3">
                      <a 
                        href={idea.original_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-[#BFFF00] transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                       <button 
                        onClick={() => toggleSave(idea.id)}
                        className={`p-2.5 border rounded-xl transition-all ${
                          idea.is_saved 
                          ? 'bg-[#BFFF00] border-[#BFFF00] text-black shadow-[0_0_20px_rgba(191,255,0,0.3)]' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-[#BFFF00] hover:border-[#BFFF00]/40'
                        }`}
                        title={idea.is_saved ? "Saved to Bank" : "Save to Idea Bank"}
                      >
                        {idea.is_saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      </button>
                      <button 
                        onClick={() => analyzePost(idea)}
                        className="p-2.5 bg-[#BFFF00]/10 border border-[#BFFF00]/20 rounded-xl text-[#BFFF00] hover:bg-[#BFFF00] hover:text-black transition-all"
                      >
                        <Zap size={16} fill="currentColor" />
                      </button>
                   </div>
                </div>
              </div>
            );
          })}
          
          {!isSearching && results.length === 0 && (
            <div className="col-span-full py-40 border-2 border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center text-center">
              <div className="p-10 bg-zinc-900/20 rounded-full text-zinc-800 mb-8 border border-zinc-900">
                <Search size={64} strokeWidth={1} />
              </div>
              <h4 className="text-2xl font-black tracking-tighter uppercase italic">No Signal Detected</h4>
              <p className="text-zinc-600 font-bold text-xs uppercase tracking-[0.2em] mt-3 max-w-sm mx-auto leading-relaxed">
                Enter a precision keyword to begin scanning the global LinkedIn post network for viral patterns.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Overlay (Reused from Profile page) */}
      {selectedIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-end md:p-6 lg:p-10 backdrop-blur-md bg-black/60 animate-in fade-in transition-all">
          <div className="bg-[#0D0D0D] border-t md:border border-zinc-800 w-full max-w-2xl h-[100dvh] md:h-auto md:max-h-[90dvh] rounded-t-[2rem] md:rounded-[3rem] flex flex-col overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#BFFF00]"></div>
            
            <div className="p-6 md:p-10 flex flex-col h-full overflow-hidden">
               <div className="flex justify-between items-center mb-6 md:mb-10">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[#BFFF00]">
                        <Zap size={24} />
                     </div>
                     <div>
                        <h4 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Post Intel</h4>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Strategic AI Scan</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedIdea(null); setAnalysisResult(null); }}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto space-y-10 pr-1 custom-scrollbar pb-10">
                  <section className="space-y-4">
                     <h5 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] ml-1">Original Node</h5>
                     <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl">
                        <p className="text-sm text-zinc-400 font-medium leading-relaxed italic">
                          "{selectedIdea.raw_content}"
                        </p>
                     </div>
                  </section>

                  <section className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h5 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] ml-1">Decoding Signal</h5>
                        {isAnalyzing && (
                          <div className="flex items-center gap-2">
                             <RefreshCw className="animate-spin text-[#BFFF00]" size={12} />
                             <span className="text-[9px] font-black text-[#BFFF00] uppercase tracking-widest">Processing...</span>
                          </div>
                        )}
                     </div>

                     {isAnalyzing ? (
                        <div className="space-y-4 animate-pulse">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="h-24 bg-zinc-950 rounded-3xl border border-zinc-900"></div>
                           ))}
                        </div>
                     ) : analysisResult ? (
                        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-[2rem] prose prose-invert max-w-none prose-sm">
                           <div className="whitespace-pre-wrap font-bold text-zinc-300 leading-relaxed font-mono text-xs">
                              {analysisResult}
                           </div>
                        </div>
                     ) : (
                        <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2rem]">
                           <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Awaiting Trigger...</p>
                        </div>
                     )}
                  </section>
               </div>

               <div className="mt-auto pt-4 border-t border-zinc-900 bg-[#0D0D0D]">
                  <button 
                    onClick={() => analyzePost(selectedIdea)}
                    disabled={isAnalyzing}
                    className="w-full bg-[#BFFF00] text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
                  >
                    {isAnalyzing ? <RefreshCw className="animate-spin" /> : <TrendingUp size={16} />}
                    {isAnalyzing ? "INTERPRETING..." : "GENERATE INTEL REPORT"}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
