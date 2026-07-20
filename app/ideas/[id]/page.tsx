"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Users, 
  Heart, 
  MessageSquare, 
  Calendar,
  Zap,
  Target,
  Gift,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Sparkles,
  Quote,
  TrendingUp,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

export default function PostIntelligencePage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [icpData, setIcpData] = useState<any>(null);
  const [isAnalyzingIcp, setIsAnalyzingIcp] = useState(false);

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const fetchPostDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/ideas/${id}`);
      if (!res.ok) throw new Error("Post not found");
      const data = await res.json();
      setIdea(data);
      
      if (data.analysis_full_json) {
        try {
          setAnalysisData(JSON.parse(data.analysis_full_json));
        } catch (e) {
          console.error("Failed to parse existing analysis", e);
        }
      }

      if (data.icp_json) {
        try {
          setIcpData(JSON.parse(data.icp_json));
        } catch (e) {
          console.error("Failed to parse existing ICP", e);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const runDeepAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${API_URL}/ideas/${id}/analyze`, { method: 'POST' });
      const data = await res.json();
      setAnalysisData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runIcpAnalysis = async () => {
    setIsAnalyzingIcp(true);
    try {
      const res = await fetch(`${API_URL}/ideas/${id}/icp`, { method: 'POST' });
      const data = await res.json();
      setIcpData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingIcp(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#BFFF00]"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-black mb-4">POST NOT FOUND</h1>
        <p className="text-zinc-500 mb-8 max-w-md">The intelligence node you're looking for doesn't exist or has been archived.</p>
        <button 
          onClick={() => router.back()}
          className="px-8 py-4 bg-zinc-900 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all border border-zinc-800"
        >
          Return to Neural Hub
        </button>
      </div>
    );
  }

  const typeStyles: Record<string, string> = {
    'carousel': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'image': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'video': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'text': 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'
  };
  const currentStyle = typeStyles[(idea.post_type || 'text').toLowerCase()] || typeStyles.text;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-[#BFFF00]/40 group-hover:bg-zinc-800 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Feed</span>
        </button>

        <div className="flex items-center gap-4">
          <a 
            href={idea.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#BFFF00]/40 transition-all flex items-center gap-2"
          >
            <ExternalLink size={14} />
            View Original
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Post Content */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-[#0D0D0D] border border-zinc-900 rounded-[2.5rem] p-10 space-y-8">
             {/* Author Metadata */}
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                {idea.author_avatar_url ? (
                  <img src={idea.author_avatar_url} className="w-14 h-14 rounded-2xl border border-zinc-800" alt="" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700">
                    <Users size={24} />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-black tracking-tight">{idea.author_name}</h2>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{idea.author_headline || "Creator"}</p>
                </div>
               </div>
               
               <div className="text-right">
                  <div className="flex items-center gap-2 text-zinc-500 justify-end mb-1">
                    <Calendar size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {new Date(idea.posted_at || idea.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${currentStyle}`}>
                    {idea.post_type || 'TEXT'}
                  </span>
               </div>
             </div>

             {/* Media */}
             {idea.media_url && (
               <div className="relative rounded-[2rem] overflow-hidden border border-zinc-800 bg-zinc-950/50">
                 <img src={idea.media_url} className="w-full object-contain max-h-[600px]" alt="Post Media" />
               </div>
             )}

             {/* Text Content */}
             <div className="relative">
               <Quote className="absolute -left-4 -top-4 text-zinc-900" size={40} />
               <div className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                 {idea.raw_content}
               </div>
             </div>

             {/* Engagement Stats */}
             <div className="flex flex-wrap gap-4 pt-8 border-t border-zinc-900">
                <div className="flex items-center gap-3 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] transition-transform hover:scale-105">
                  <Heart size={20} className="text-red-500 fill-red-500" />
                  <div>
                    <div className="text-xl font-black text-red-500">{idea.engagement_count}</div>
                    <div className="text-[9px] text-red-500/60 font-black uppercase tracking-widest">Impact</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-blue-500/10 border border-blue-500/20 rounded-[1.5rem] transition-transform hover:scale-105">
                  <MessageSquare size={20} className="text-blue-500 fill-blue-500" />
                  <div>
                    <div className="text-xl font-black text-blue-500">{idea.comments_count || 0}</div>
                    <div className="text-[9px] text-blue-500/60 font-black uppercase tracking-widest">Intensity</div>
                  </div>
                </div>
                {idea.reposts_count !== undefined && (
                  <div className="flex items-center gap-3 px-6 py-4 bg-[#BFFF00]/10 border border-[#BFFF00]/20 rounded-[1.5rem] transition-transform hover:scale-105">
                    <TrendingUp size={20} className="text-[#BFFF00]" />
                    <div>
                      <div className="text-xl font-black text-[#BFFF00]">{idea.reposts_count || 0}</div>
                      <div className="text-[9px] text-[#BFFF00]/60 font-black uppercase tracking-widest">Resonance</div>
                    </div>
                  </div>
                )}
             </div>
          </section>
        </div>

        {/* Right Column: AI Intelligence */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-zinc-950 border-2 border-[#BFFF00]/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(191,255,0,0.05)]">
            <div className="p-8 bg-gradient-to-br from-zinc-900 to-black border-b border-zinc-900">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-[#BFFF00]">
                  <Sparkles size={24} />
                  <h2 className="text-2xl font-black tracking-tighter uppercase italic">Neural Analysis</h2>
                </div>
                {!analysisData && !isAnalyzing && (
                  <button 
                    onClick={runDeepAnalysis}
                    className="p-2.5 bg-[#BFFF00] text-black rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(191,255,0,0.3)]"
                  >
                    <Zap size={18} fill="currentColor" />
                  </button>
                )}
              </div>
              <p className="text-zinc-500 text-xs font-medium italic">Strategic content deconstruction using Gemini Intelligence</p>
            </div>

            <div className="p-8 space-y-8">
              {isAnalyzing ? (
                <div className="py-20 flex flex-col items-center justify-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 blur-2xl bg-[#BFFF00]/20 animate-pulse"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#BFFF00] relative"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#BFFF00] font-black uppercase tracking-widest animate-pulse">Running Neural Scans...</div>
                    <p className="text-zinc-600 text-[10px] mt-1 uppercase font-bold tracking-tighter">Deconstructing Viral Hooks & Structure</p>
                  </div>
                </div>
              ) : analysisData ? (
                <div className="space-y-6">
                  {/* Strategic Pillars: Funnel stage + Hook strength */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-2 text-zinc-500 mb-2">
                         <Target size={14} />
                         <span className="text-[9px] font-black uppercase tracking-[0.1em]">Funnel Stage</span>
                      </div>
                      <div className="text-sm font-black text-[#BFFF00] uppercase italic">{analysisData.funnel_stage || "—"}</div>
                      {analysisData.funnel_reason && (
                        <p className="text-[10px] text-zinc-500 font-medium mt-1.5 leading-snug">{analysisData.funnel_reason}</p>
                      )}
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-2 text-zinc-500 mb-2">
                         <Zap size={14} />
                         <span className="text-[9px] font-black uppercase tracking-[0.1em]">Hook Strength</span>
                      </div>
                      <div className="text-sm font-black text-[#BFFF00] uppercase italic">{analysisData.hook_strength || "—"}</div>
                    </div>
                  </div>

                  {/* Deep Breakdown: Hook / Promise / Transformation */}
                  <div className="space-y-6">
                    {[
                      { key: 'hook', label: 'The Hook', sub: 'What stopped the scroll', color: 'from-[#BFFF00]' },
                      { key: 'promise', label: 'The Promise', sub: 'What the post pledges', color: 'from-blue-500' },
                      { key: 'transformation', label: 'The Transformation', sub: "The outcome they'll get", color: 'from-purple-500' },
                    ].map(s => (
                      <div key={s.key} className="relative group">
                        <div className={`absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b ${s.color} to-transparent opacity-40`}></div>
                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
                          {s.label} <span className="text-zinc-700 normal-case tracking-normal">· {s.sub}</span>
                        </h4>
                        <p className="text-white text-sm font-medium leading-relaxed bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 whitespace-pre-wrap">
                          {analysisData[s.key] || "—"}
                        </p>
                      </div>
                    ))}

                    {/* CTA — what the viewer gets */}
                    <div className="p-6 bg-blue-500/5 border-2 border-blue-500/20 rounded-3xl relative overflow-hidden group">
                      <Target className="absolute -right-4 -bottom-4 text-blue-500/10 group-hover:scale-110 transition-transform" size={100} />
                      <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Gift size={14} />
                        The CTA <span className="text-blue-400/50 normal-case tracking-normal">· what the viewer gets</span>
                      </h4>
                      <p className="text-white text-sm font-bold leading-relaxed relative z-10">
                        {analysisData.cta || "No explicit CTA"}
                      </p>
                    </div>

                    {/* Replication Strategy */}
                    <div className="p-6 bg-[#BFFF00]/5 border-2 border-[#BFFF00]/20 rounded-3xl relative overflow-hidden group">
                      <Zap className="absolute -right-4 -bottom-4 text-[#BFFF00]/10 group-hover:scale-110 transition-transform" size={100} />
                      <h4 className="text-[10px] font-black text-[#BFFF00] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <ArrowUpRight size={14} />
                        Replication Strategy
                      </h4>
                      <p className="text-white text-sm font-bold leading-relaxed relative z-10">
                        {analysisData.replication_tip || "—"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={runDeepAnalysis}
                    className="w-full py-4 mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#BFFF00] hover:text-black hover:border-transparent transition-all"
                  >
                    Refresh Intelligence
                  </button>
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center gap-6">
                   <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                     <Zap size={32} />
                   </div>
                   <div className="text-center">
                    <h3 className="font-black text-white uppercase tracking-widest mb-2">Awaiting Calibration</h3>
                    <p className="text-zinc-500 text-[10px] max-w-[200px] mx-auto uppercase font-bold tracking-tighter leading-relaxed">
                      Run deep scans to extract viral signals from this node's electromagnetic field.
                    </p>
                   </div>
                   <button 
                      onClick={runDeepAnalysis}
                      className="px-8 py-3 bg-[#BFFF00] text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(191,255,0,0.2)]"
                    >
                      Initialize Analysis
                    </button>
                </div>
              )}
            </div>
          </section>

          {/* Audience / ICP */}
          <section className="bg-zinc-950 border-2 border-blue-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.05)]">
            <div className="p-8 bg-gradient-to-br from-zinc-900 to-black border-b border-zinc-900">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-blue-400">
                  <Users size={24} />
                  <h2 className="text-2xl font-black tracking-tighter uppercase italic">Audience ICP</h2>
                </div>
                {!icpData && !isAnalyzingIcp && (
                  <button
                    onClick={runIcpAnalysis}
                    className="p-2.5 bg-blue-500 text-black rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  >
                    <Target size={18} />
                  </button>
                )}
              </div>
              <p className="text-zinc-500 text-xs font-medium italic">Who is this post talking to?</p>
            </div>

            <div className="p-8 space-y-6">
              {isAnalyzingIcp ? (
                <div className="py-16 flex flex-col items-center justify-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-400"></div>
                  <div className="text-blue-400 font-black uppercase tracking-widest text-xs animate-pulse">Profiling Audience...</div>
                </div>
              ) : icpData ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Target Persona</h4>
                      {icpData.awareness_level && (
                        <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-500/30 bg-blue-500/10 text-blue-400">
                          {icpData.awareness_level}
                        </span>
                      )}
                    </div>
                    <p className="text-white text-sm font-bold leading-relaxed bg-blue-500/5 border-2 border-blue-500/20 p-4 rounded-2xl">
                      {icpData.audience || "—"}
                    </p>
                  </div>

                  {icpData.pains?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Pains</h4>
                      <ul className="space-y-2">
                        {icpData.pains.map((p: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300 font-medium leading-relaxed">
                            <span className="text-red-500 mt-1 shrink-0">•</span><span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {icpData.desires?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Desires</h4>
                      <ul className="space-y-2">
                        {icpData.desires.map((p: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300 font-medium leading-relaxed">
                            <span className="text-[#BFFF00] mt-1 shrink-0">•</span><span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {icpData.why_it_resonates && (
                    <div>
                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Why It Resonates</h4>
                      <p className="text-white text-sm font-medium leading-relaxed bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
                        {icpData.why_it_resonates}
                      </p>
                    </div>
                  )}

                  {icpData.objections?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Likely Objections</h4>
                      <ul className="space-y-2">
                        {icpData.objections.map((p: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400 font-medium italic leading-relaxed">
                            <span className="text-zinc-600 mt-1 shrink-0">›</span><span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={runIcpAnalysis}
                    className="w-full py-4 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-500 hover:text-black hover:border-transparent transition-all"
                  >
                    Refresh Audience
                  </button>
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center gap-5">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                    <Users size={28} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-black text-white uppercase tracking-widest mb-2 text-sm">Who is this for?</h3>
                    <p className="text-zinc-500 text-[10px] max-w-[200px] mx-auto uppercase font-bold tracking-tighter leading-relaxed">
                      Map the exact audience, their pains, and desires this post targets.
                    </p>
                  </div>
                  <button
                    onClick={runIcpAnalysis}
                    className="px-8 py-3 bg-blue-500 text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(59,130,246,0.2)] text-xs"
                  >
                    Analyze Audience
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
