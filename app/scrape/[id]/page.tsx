"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, ExternalLink, Calendar, Zap, MessageSquare, Heart, Share2, Layers, Type, FileText, Play, ArrowUpRight, X, Sparkles, TrendingUp, BarChart3, Eye, Bookmark, BookmarkCheck, Filter, Clock, Search, ChevronDown, History, Flame, Users, Target } from 'lucide-react';
import Link from 'next/link';

const API_URL = 'http://localhost:8000/api';

export default function ProfileAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [timeLimit, setTimeLimit] = useState("week");
  const [maxPosts, setMaxPosts] = useState(10);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const [expandedIdeas, setExpandedIdeas] = useState<Record<number, boolean>>({});

  // Sort / filter controls
  const [sortBy, setSortBy] = useState<'engagement' | 'comments' | 'reposts' | 'views' | 'posted' | 'scraped'>('engagement');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'image' | 'carousel' | 'video'>('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const [outliersOnly, setOutliersOnly] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Scrape history
  const [scrapeJobs, setScrapeJobs] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Creator-level ICP
  const [creatorIcp, setCreatorIcp] = useState<any>(null);
  const [icpUpdatedAt, setIcpUpdatedAt] = useState<string | null>(null);
  const [isAnalyzingCreator, setIsAnalyzingCreator] = useState(false);
  const [icpError, setIcpError] = useState<string | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedIdeas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetchProfileAndIdeas();
  }, [params.id]);

  const fetchScrapeJobs = async (watchlistId: number) => {
    try {
      const res = await fetch(`${API_URL}/watchlist/${watchlistId}/scrape-jobs`);
      if (res.ok) setScrapeJobs(await res.json());
    } catch (err) {
      console.error("Failed to load scrape history", err);
    }
  };

  const fetchProfileAndIdeas = async () => {
    try {
      const wRes = await fetch(`${API_URL}/watchlist`);
      const wData = await wRes.json();
      const item = wData.find((p: any) => p.id === parseInt(params.id as string));
      setProfile(item);

      if (item?.icp_json) {
        try {
          setCreatorIcp(JSON.parse(item.icp_json));
          setIcpUpdatedAt(item.icp_updated_at || null);
        } catch (e) {
          console.error("Failed to parse creator ICP", e);
        }
      }

      if (item) {
        const iRes = await fetch(`${API_URL}/ideas?watchlist_id=${item.id}&all_items=true`);
        const iData = await iRes.json();
        setIdeas(iData);
        fetchScrapeJobs(item.id);
      }
    } catch (err) {
      console.error("Analysis load failed", err);
    }
  };

  const WINDOW_LABELS: Record<string, string> = {
    '24h': 'Live 24H', 'week': 'Past Week', 'month': 'Past Month', '3months': 'Past 3 Months',
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  // Prefer the actual LinkedIn post date; fall back to the raw relative string,
  // then to the scrape date (clearly labelled) if no post date was captured.
  const postedDisplay = (idea: any): { text: string; isPosted: boolean } => {
    if (idea.posted_at) {
      return {
        text: new Date(idea.posted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        isPosted: true,
      };
    }
    if (idea.posted_at_raw) return { text: String(idea.posted_at_raw).split('•')[0].trim(), isPosted: true };
    return { text: new Date(idea.created_at).toLocaleDateString(), isPosted: false };
  };

  // Posts after content filters (type / saved / search) — this is the "on screen" set
  // used to compute the average. Note: the outliers-only toggle is applied AFTER this,
  // so toggling it never shifts the average (avoids a circular threshold).
  const filteredIdeas = useMemo(() => {
    let list = [...ideas];
    if (filterType !== 'all') list = list.filter(i => (i.post_type || 'text').toLowerCase() === filterType);
    if (savedOnly) list = list.filter(i => i.is_saved);
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter(i => (i.raw_content || '').toLowerCase().includes(q) || (i.topic || '').toLowerCase().includes(q));
    }
    return list;
  }, [ideas, filterType, savedOnly, searchText]);

  // Average likes across the posts on screen
  const avgLikes = useMemo(() => {
    if (!filteredIdeas.length) return 0;
    return filteredIdeas.reduce((acc, i) => acc + (i.engagement_count || 0), 0) / filteredIdeas.length;
  }, [filteredIdeas]);

  // An outlier = above the on-screen average (needs >1 post and a non-zero average)
  const isOutlier = (i: any) => filteredIdeas.length > 1 && avgLikes > 0 && (i.engagement_count || 0) > avgLikes;
  const outlierCount = useMemo(() => filteredIdeas.filter(isOutlier).length, [filteredIdeas, avgLikes]);

  const displayedIdeas = useMemo(() => {
    let list = outliersOnly ? filteredIdeas.filter(isOutlier) : [...filteredIdeas];
    const num = (v: any) => (typeof v === 'number' ? v : 0);
    const dateVal = (v: any) => (v ? new Date(v).getTime() : 0);
    switch (sortBy) {
      case 'comments': list.sort((a, b) => num(b.comments_count) - num(a.comments_count)); break;
      case 'reposts': list.sort((a, b) => num(b.reposts_count) - num(a.reposts_count)); break;
      case 'views': list.sort((a, b) => num(b.view_count) - num(a.view_count)); break;
      case 'posted': list.sort((a, b) => dateVal(b.posted_at) - dateVal(a.posted_at)); break;
      case 'scraped': list.sort((a, b) => dateVal(b.created_at) - dateVal(a.created_at)); break;
      default: list.sort((a, b) => num(b.engagement_count) - num(a.engagement_count));
    }
    return list;
  }, [filteredIdeas, outliersOnly, sortBy, avgLikes]);

  const runScrape = async () => {
    if (!profile) return;
    setIsScraping(true);
    try {
      const res = await fetch(`${API_URL}/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_url: profile.linkedin_url,
          time_limit: timeLimit,
          limit: maxPosts
        })
      });
      if (res.ok) {
        await fetchProfileAndIdeas();
      }
    } catch (err) {
      console.error("Scrape failed", err);
    } finally {
      setIsScraping(false);
    }
  };

  const runCreatorIcp = async (refresh = false) => {
    if (!profile) return;
    setIsAnalyzingCreator(true);
    setIcpError(null);
    try {
      const res = await fetch(`${API_URL}/watchlist/${profile.id}/icp${refresh ? '?refresh=true' : ''}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setIcpError(data.detail || 'Analysis failed. Please try again.');
        return;
      }
      setCreatorIcp(data);
      setIcpUpdatedAt(new Date().toISOString());
    } catch (err) {
      console.error("Creator ICP failed", err);
      setIcpError('Connection error. Ensure the backend is running.');
    } finally {
      setIsAnalyzingCreator(false);
    }
  };

  const analyzePost = async (idea: any) => {
    setSelectedIdea(idea);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch(`${API_URL}/ideas/${idea.id}/analyze`, { method: 'POST' });
      const data = await res.json();
      if (data.analysis) {
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

  const toggleSave = async (e: React.MouseEvent, ideaId: number, currentSavedState: boolean) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/ideas/${ideaId}/toggle-save`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setIdeas(prev => prev.map(idea => 
          idea.id === ideaId ? { ...idea, is_saved: data.is_saved } : idea
        ));
      }
    } catch (err) {
      console.error("Failed to toggle save state", err);
    }
  };

  if (!profile) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="animate-spin text-[#BFFF00]" size={32} />
        <p className="font-black uppercase text-zinc-500 tracking-widest text-xs">Accessing Intel Nodes...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-12 bg-[#0A0A0A] min-h-screen text-white relative flex flex-col items-center">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#BFFF00]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>

      {/* Header Section */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => router.back()} className="p-3 md:p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-4 md:gap-5">
             {profile.avatar_url && (
               <img src={profile.avatar_url} className="w-12 h-12 md:w-16 md:h-16 rounded-2xl border-2 border-zinc-800 shadow-2xl" alt="" />
             )}
             <div>
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-white outline-text leading-none">{profile.display_name}</h2>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
                   <span className="text-zinc-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Strategic Analysis</span>
                   <div className="hidden md:block w-1 h-1 rounded-full bg-[#BFFF00]"></div>
                   <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[#BFFF00] font-black uppercase tracking-widest text-[8px] md:text-[10px] flex items-center gap-1.5 hover:underline">
                     SOURCE LINK <ExternalLink size={10} />
                   </a>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div
            className="relative w-full sm:w-36 flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-5 hover:border-[#BFFF00]/50 transition-colors"
            title="Max posts to fetch per sync (1–100). ~$0.0015/post."
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mr-2 whitespace-nowrap">Max</span>
            <input
              type="number"
              min={1}
              max={100}
              value={maxPosts}
              onChange={(e) => setMaxPosts(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="w-full bg-transparent text-white text-xs font-black py-4 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl outline-none cursor-pointer hover:border-[#BFFF00]/50 transition-colors appearance-none"
            >
              <option value="24h">Live Feed (24H)</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="3months">Past 3 Months</option>
            </select>
          </div>
          <button 
            onClick={runScrape}
            disabled={isScraping}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 bg-[#BFFF00] text-black px-8 py-4 rounded-2xl font-black text-[10px] md:text-xs hover:scale-[1.03] active:scale-95 transition-all shadow-[0_8px_30px_rgba(191,255,0,0.2)] uppercase tracking-widest ${isScraping ? 'opacity-50' : ''}`}
          >
            {isScraping ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />} 
            {isScraping ? "SYNCING..." : "INTELLIGENCE SYNC"}
          </button>
        </div>
      </div>

      {/* Strategic Stats */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
        {[
          { label: 'Total Ideas', val: ideas.length, icon: Layers, color: 'text-blue-400', bg: 'bg-blue-400/5' },
          { label: 'Avg Engagement', val: ideas.length ? Math.round(ideas.reduce((acc, i) => acc + i.engagement_count, 0) / ideas.length) : 0, icon: TrendingUp, color: 'text-red-400', bg: 'bg-red-400/5' },
          { label: 'Primary Hook', val: ideas[0]?.post_type || 'N/A', icon: Sparkles, color: 'text-[#BFFF00]', bg: 'bg-[#BFFF00]/5' },
          { label: 'Consistency', val: 'High-Level', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-400/5' },
        ].map((stat, i) => (
          <div key={i} className={`bg-zinc-900/30 border border-zinc-800 p-6 md:p-8 rounded-[2rem] backdrop-blur-sm group hover:border-zinc-700 transition-all`}>
            <div className={`p-3 w-fit rounded-xl border border-white/5 mb-4 md:mb-5 ${stat.color} ${stat.bg} group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} strokeWidth={2.5} />
            </div>
            <p className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-xl md:text-3xl font-black mt-1 md:mt-2 uppercase tracking-tighter group-hover:text-white transition-colors">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Creator ICP */}
      <div className="w-full max-w-7xl relative z-10">
        <div className="bg-zinc-950 border-2 border-[#BFFF00]/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(191,255,0,0.04)]">
          <div className="p-6 md:p-8 bg-gradient-to-br from-zinc-900/60 to-black border-b border-zinc-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-[#BFFF00]/10 border border-[#BFFF00]/20 rounded-2xl text-[#BFFF00] shrink-0"><Target size={22} /></div>
              <div className="min-w-0">
                <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">Creator ICP</h3>
                <p className="text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-0.5 truncate">
                  {creatorIcp ? `Who ${profile.display_name} helps` : 'Who does this creator talk to?'}
                  {creatorIcp && icpUpdatedAt && <span className="text-zinc-700"> · analyzed {timeAgo(icpUpdatedAt)}</span>}
                </p>
              </div>
            </div>
            <button
              onClick={() => runCreatorIcp(!!creatorIcp)}
              disabled={isAnalyzingCreator}
              className="flex items-center gap-2 bg-[#BFFF00] text-black px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 shrink-0"
            >
              {isAnalyzingCreator ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isAnalyzingCreator ? 'Analyzing' : creatorIcp ? 'Refresh' : 'Analyze Creator'}
            </button>
          </div>

          <div className="p-6 md:p-8">
            {icpError ? (
              <div className="py-10 text-center">
                <p className="text-zinc-400 font-bold text-sm">{icpError}</p>
                {icpError.toLowerCase().includes('sync') && (
                  <button onClick={runScrape} className="mt-5 px-6 py-3 bg-[#BFFF00] text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                    Run a Sync First
                  </button>
                )}
              </div>
            ) : isAnalyzingCreator && !creatorIcp ? (
              <div className="py-12 flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#BFFF00]"></div>
                <p className="text-[#BFFF00] font-black uppercase tracking-widest text-xs animate-pulse">Reading bio + top posts...</p>
              </div>
            ) : creatorIcp ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-5">
                  {creatorIcp.creator_summary && (
                    <p className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed">{creatorIcp.creator_summary}</p>
                  )}
                  <div className="bg-[#BFFF00]/5 border-2 border-[#BFFF00]/20 rounded-3xl p-5">
                    <div className="flex items-center gap-2 text-[#BFFF00] mb-2"><Users size={14} /><span className="text-[9px] font-black uppercase tracking-[0.2em]">Who They Help</span></div>
                    <p className="text-white font-bold text-sm md:text-base leading-relaxed">{creatorIcp.who_they_help}</p>
                    {creatorIcp.secondary_audience && creatorIcp.secondary_audience !== 'None' && (
                      <p className="text-zinc-500 text-xs font-medium mt-2">Also reaches: {creatorIcp.secondary_audience}</p>
                    )}
                  </div>
                  {creatorIcp.transformation && (
                    <div>
                      <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Transformation</h5>
                      <p className="text-zinc-300 text-sm font-medium leading-relaxed">{creatorIcp.transformation}</p>
                    </div>
                  )}
                  {creatorIcp.pains_solved?.length > 0 && (
                    <div>
                      <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Pains Solved</h5>
                      <ul className="space-y-1.5">
                        {creatorIcp.pains_solved.map((p: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-300 font-medium leading-relaxed"><span className="text-red-500 mt-1 shrink-0">•</span><span>{p}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="space-y-5">
                  {creatorIcp.content_themes?.length > 0 && (
                    <div>
                      <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2.5">Content Themes</h5>
                      <div className="flex flex-wrap gap-2">
                        {creatorIcp.content_themes.map((t: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-300">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {creatorIcp.offer_signals && (
                    <div>
                      <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Offer Signals</h5>
                      {Array.isArray(creatorIcp.offer_signals) ? (
                        <ul className="space-y-1.5">
                          {creatorIcp.offer_signals.map((o: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300 font-medium leading-relaxed"><span className="text-[#BFFF00] mt-1 shrink-0">›</span><span>{o}</span></li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-zinc-300 text-sm font-medium">{creatorIcp.offer_signals}</p>
                      )}
                    </div>
                  )}
                  {creatorIcp.tone && (
                    <div>
                      <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Tone</h5>
                      <p className="text-zinc-300 text-sm font-medium">{creatorIcp.tone}</p>
                    </div>
                  )}
                  {creatorIcp.confidence && (
                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pt-3 border-t border-zinc-900">
                      Confidence: <span className="text-zinc-400">{creatorIcp.confidence}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-1"><Users size={26} /></div>
                <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest max-w-md leading-relaxed">
                  Analyze this creator's bio + top 5 posts to reveal exactly who they serve, the pains they solve, and what they sell.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Analysis Room Feed */}
      <div className="w-full max-w-7xl space-y-8 relative z-10 pb-20">
        <div className="border-b border-zinc-900 pb-8 space-y-6">
          {/* Title + last-sync badge */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h3 className="text-2xl font-black tracking-tighter uppercase italic">Scraped Intelligence</h3>
            <div className="relative">
              <button
                onClick={() => setShowHistory(s => !s)}
                className="flex items-center gap-2.5 bg-zinc-900/60 border border-zinc-800 rounded-2xl px-4 py-2.5 hover:border-[#BFFF00]/40 transition-colors"
              >
                <Clock size={14} className="text-[#BFFF00]" />
                {scrapeJobs.length > 0 ? (
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                    Last sync {timeAgo(scrapeJobs[0].created_at)} · {scrapeJobs[0].result_count} posts
                    <span className="text-zinc-600"> · {WINDOW_LABELS[scrapeJobs[0].input] || scrapeJobs[0].input || '—'}</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">No syncs yet</span>
                )}
                {scrapeJobs.length > 0 && <ChevronDown size={14} className={`text-zinc-500 transition-transform ${showHistory ? 'rotate-180' : ''}`} />}
              </button>

              {showHistory && scrapeJobs.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#0D0D0D] border border-zinc-800 rounded-2xl shadow-2xl z-30 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-900 flex items-center gap-2">
                    <History size={13} className="text-[#BFFF00]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Scrape History</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto custom-scrollbar">
                    {scrapeJobs.map((job) => (
                      <div key={job.id} className="px-4 py-3 border-b border-zinc-900/60 last:border-0 flex items-center justify-between hover:bg-zinc-900/40">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-white">{job.result_count} posts</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{WINDOW_LABELS[job.input] || job.input || '—'}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-zinc-400">{timeAgo(job.created_at)}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#BFFF00]/70">{job.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter / sort controls */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'text', 'image', 'carousel', 'video'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                    filterType === t
                      ? 'bg-[#BFFF00] text-black border-[#BFFF00]'
                      : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 lg:ml-auto w-full lg:w-auto">
              <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 flex-1 lg:w-56 lg:flex-none focus-within:border-[#BFFF00]/40 transition-colors">
                <Search size={14} className="text-zinc-500" />
                <input
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder="Search content..."
                  className="bg-transparent outline-none text-[11px] font-bold text-white placeholder:text-zinc-600 w-full"
                />
              </div>

              <button
                onClick={() => setSavedOnly(s => !s)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                  savedOnly
                    ? 'bg-[#BFFF00] text-black border-[#BFFF00]'
                    : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {savedOnly ? <BookmarkCheck size={13} /> : <Bookmark size={13} />} Saved
              </button>

              <button
                onClick={() => setOutliersOnly(s => !s)}
                disabled={outlierCount === 0}
                title="Show only posts with above-average likes"
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${
                  outliersOnly
                    ? 'bg-orange-500 text-black border-orange-500'
                    : 'bg-zinc-900/50 text-orange-400 border-zinc-800 hover:border-orange-500/50 hover:text-orange-300'
                }`}
              >
                <Flame size={13} /> Outliers {outlierCount > 0 && <span className="opacity-70">({outlierCount})</span>}
              </button>

              <div className="relative">
                <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="appearance-none bg-zinc-900/50 border border-zinc-800 rounded-xl pl-8 pr-8 py-2.5 text-[9px] font-black uppercase tracking-widest text-zinc-300 outline-none cursor-pointer hover:border-[#BFFF00]/40 transition-colors"
                >
                  <option value="engagement">Most Likes</option>
                  <option value="comments">Most Comments</option>
                  <option value="reposts">Most Reposts</option>
                  <option value="views">Most Views</option>
                  <option value="posted">Newest Posted</option>
                  <option value="scraped">Recently Scraped</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Result count + on-screen analytics */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#BFFF00] animate-pulse"></div>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Showing {displayedIdeas.length} of {ideas.length} Data Points
              </span>
            </div>
            {filteredIdeas.length > 0 && (
              <>
                <span className="text-[10px] font-black text-zinc-700">·</span>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Avg <span className="text-white">{Math.round(avgLikes)}</span> likes
                </span>
                <span className="text-[10px] font-black text-zinc-700">·</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 flex items-center gap-1.5">
                  <Flame size={11} /> {outlierCount} outlier{outlierCount === 1 ? '' : 's'}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedIdeas.map((idea, index) => {
            const typeStyles: Record<string, string> = {
              'carousel': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
              'image': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
              'video': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
              'text': 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
              'poll': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
            };
            const currentStyle = typeStyles[(idea.post_type || 'text').toLowerCase()] || typeStyles.text;
            const outlier = isOutlier(idea);
            const posted = postedDisplay(idea);

            return (
              <div
                key={idea.id || `scrape-${index}`}
                onClick={() => idea.id && router.push(`/ideas/${idea.id}`)}
                className={`group bg-[#0D0D0D] p-6 md:p-7 rounded-[2.5rem] transition-all flex flex-col h-full relative overflow-hidden backdrop-blur-xl shadow-2xl cursor-pointer border ${
                  outlier
                    ? 'border-orange-500/50 shadow-[0_0_35px_rgba(249,115,22,0.12)] hover:border-orange-500/70'
                    : 'border-zinc-800/50 hover:border-[#BFFF00]/40'
                }`}
              >
                {/* Ultra-Conspicuous Metrics */}
                <div className="flex justify-between items-start mb-8">
                   <div className="flex flex-col gap-2">
                      <span className={`w-fit px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${currentStyle}`}>
                        {(idea.post_type || 'TEXT').toUpperCase()}
                      </span>
                      {outlier && (
                        <span className="w-fit px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border bg-orange-500/15 text-orange-400 border-orange-500/30 flex items-center gap-1.5">
                          <Flame size={10} /> Outlier
                        </span>
                      )}
                   </div>
                   <div className="flex gap-2.5">
                      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl shadow-[0_5px_15px_rgba(239,68,68,0.1)] group-hover:scale-105 transition-transform">
                         <Heart size={16} className="text-red-500 fill-red-500" />
                         <span className="text-sm font-black text-red-500">{idea.engagement_count}</span>
                      </div>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl shadow-[0_5px_15px_rgba(59,130,246,0.1)] group-hover:scale-105 transition-transform">
                         <MessageSquare size={16} className="text-blue-500 fill-blue-500" />
                         <span className="text-sm font-black text-blue-500">{idea.comments_count || 0}</span>
                      </div>
                   </div>
                </div>

                {/* Enhanced Content with Inline "...see more" */}
                <div className="flex-1 relative mb-6">
                  <div className="text-sm md:text-base text-zinc-300 font-medium leading-relaxed">
                    {expandedIdeas[idea.id] ? (
                      <div className="space-y-4">
                         <p>{idea.raw_content || "No content available."}</p>
                         <button 
                           onClick={() => toggleExpand(idea.id)}
                           className="text-[#BFFF00] text-[10px] font-black uppercase tracking-widest hover:underline"
                         >
                           collapse content
                         </button>
                      </div>
                    ) : (
                      <p>
                        {(idea.raw_content || "").slice(0, 150)}
                        {(idea.raw_content || "").length > 150 && (
                          <button 
                            onClick={() => toggleExpand(idea.id)}
                            className="ml-1 text-zinc-500 hover:text-[#BFFF00] font-black transition-colors"
                          >
                            ...see more
                          </button>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-zinc-900 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <span
                       className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]"
                       title={posted.isPosted ? 'Date posted on LinkedIn' : 'Post date unknown — showing scrape date'}
                     >
                       <Calendar size={11} className="text-zinc-600" />
                       {posted.text}
                       {!posted.isPosted && <span className="text-zinc-700 lowercase tracking-normal">(scraped)</span>}
                     </span>
                     <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                     <a 
                       href={idea.original_url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-zinc-600 hover:text-[#BFFF00] transition-colors flex items-center gap-1 group/link"
                     >
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/link:opacity-100 transition-opacity">Source</span>
                       <ExternalLink size={14} />
                     </a>
                   </div>
                   <div className="flex items-center gap-2">
                     <button
                       onClick={(e) => toggleSave(e, idea.id, idea.is_saved)}
                       className={`p-3 rounded-xl transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)] group-hover:scale-110 active:scale-90 ${
                         idea.is_saved 
                           ? 'bg-[#BFFF00] text-black border border-[#BFFF00]' 
                           : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-600'
                       }`}
                     >
                       {idea.is_saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                     </button>
                     <button 
                        onClick={(e) => { e.stopPropagation(); analyzePost(idea); }}
                        className="p-3 bg-[#BFFF00]/10 border border-[#BFFF00]/20 rounded-xl text-[#BFFF00] hover:bg-[#BFFF00] hover:text-black hover:border-[#BFFF00] transition-all group-hover:scale-110 active:scale-90 shadow-[0_0_20px_rgba(191,255,0,0.1)]"
                     >
                        <Zap size={18} fill="currentColor" />
                     </button>
                   </div>
                </div>
              </div>
            );
          })}
          
          {ideas.length > 0 && displayedIdeas.length === 0 && (
            <div className="col-span-full py-28 border-2 border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center text-center">
              <div className="p-8 bg-zinc-900/20 rounded-full text-zinc-700 mb-6 border border-zinc-900">
                <Filter size={48} />
              </div>
              <h4 className="text-xl font-black tracking-tighter uppercase italic">No posts match your filters</h4>
              <p className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">Try clearing the search, type, or saved filters.</p>
              <button
                onClick={() => { setFilterType('all'); setSavedOnly(false); setSearchText(''); setOutliersOnly(false); }}
                className="mt-8 px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#BFFF00]/40 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}

          {ideas.length === 0 && (
            <div className="col-span-full py-40 border-2 border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center text-center">
              <div className="p-10 bg-zinc-900/20 rounded-full text-zinc-800 mb-8 border border-zinc-900">
                <BarChart3 size={64} />
              </div>
              <h4 className="text-2xl font-black tracking-tighter uppercase italic">Intelligence Bank Empty</h4>
              <p className="text-zinc-600 font-bold text-xs uppercase tracking-[0.2em] mt-3 max-w-sm mx-auto leading-relaxed">
                Connect your nodes and initiate a sync to surface high-performance content from this creator.
              </p>
              <button 
                onClick={runScrape}
                className="mt-10 px-10 py-5 bg-[#BFFF00] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
              >
                START SCAN
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Overlay */}
      {selectedIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-end md:p-6 lg:p-10 backdrop-blur-md bg-black/60 animate-in fade-in transition-all">
          <div className="bg-[#0D0D0D] border-t md:border border-zinc-800 w-full max-w-2xl h-[100dvh] md:h-auto md:max-h-[90dvh] rounded-t-[2rem] md:rounded-[3rem] flex flex-col overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)] slide-in-from-bottom md:slide-in-from-right duration-500 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#BFFF00]"></div>
            
            <div className="p-6 md:p-10 flex flex-col h-full overflow-hidden">
               <div className="flex justify-between items-center mb-8 md:mb-10">
                  <div className="flex items-center gap-3">
                     <div className="p-2.5 md:p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[#BFFF00]">
                        <Zap size={24} />
                     </div>
                     <div>
                        <h4 className="text-lg md:text-2xl font-black tracking-tighter uppercase italic leading-none">Post Intel</h4>
                        <p className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Strategic AI Scan</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedIdea(null); setAnalysisResult(null); }}
                    className="p-2.5 md:p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all active:scale-90"
                  >
                    <X size={20} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto space-y-8 md:space-y-10 pr-1 custom-scrollbar pb-10">
                  <section className="space-y-4">
                     <h5 className="text-[9px] md:text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] ml-1">Original Node</h5>
                     <div className="bg-zinc-950 border border-zinc-900 p-5 md:p-6 rounded-3xl">
                        <p className="text-xs md:text-sm text-zinc-400 font-medium leading-relaxed italic">
                          "{selectedIdea.raw_content}"
                        </p>
                     </div>
                  </section>

                  <section className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h5 className="text-[9px] md:text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] ml-1">Decoding Signal</h5>
                        {isAnalyzing && (
                          <div className="flex items-center gap-2">
                             <RefreshCw className="animate-spin text-[#BFFF00]" size={12} />
                             <span className="text-[8px] md:text-[9px] font-black text-[#BFFF00] uppercase tracking-widest">Processing...</span>
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
                        <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-[2rem] prose prose-invert max-w-none prose-sm">
                           <div className="whitespace-pre-wrap font-bold text-zinc-300 leading-relaxed font-mono text-[10px] md:text-[11px] lg:text-xs">
                              {analysisResult}
                           </div>
                        </div>
                     ) : (
                        <div className="py-16 md:py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2rem]">
                           <p className="text-[9px] md:text-[10px] font-black text-zinc-700 uppercase tracking-widest">Awaiting Trigger...</p>
                        </div>
                     )}
                  </section>
               </div>

               <div className="mt-auto pt-4 border-t border-zinc-900 bg-[#0D0D0D]">
                  <button 
                    onClick={() => analyzePost(selectedIdea)}
                    disabled={isAnalyzing}
                    className="w-full bg-[#BFFF00] text-black py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
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
