"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, ImageIcon, Lightbulb, Zap, TrendingUp, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const API_URL = 'http://localhost:8000/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    ideas: 0,
    drafts: 0,
    scheduled: 0,
    published: 0,
    ideasAll: []
  });

  const [recentIdeas, setRecentIdeas] = useState([]);
  const [activePersona, setActivePersona] = useState('Pro Builder');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ideasRes, postsRes] = await Promise.all([
        fetch(`${API_URL}/ideas`),
        fetch(`${API_URL}/posts`)
      ]);
      const ideas = await ideasRes.json();
      const posts = await postsRes.json();
      
      setStats({
        ideas: ideas.length,
        drafts: posts.filter((p: any) => p.status === 'draft').length,
        scheduled: posts.filter((p: any) => p.status === 'scheduled').length,
        published: posts.filter((p: any) => p.status === 'posted').length,
        ideasAll: ideas
      });
      setRecentIdeas(ideas.slice(0, 3));

      const personaRes = await fetch(`${API_URL}/settings/persona_name`);
      const personaData = await personaRes.json();
      if (personaData.value) setActivePersona(personaData.value);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-12 bg-[#0A0A0A] min-h-screen text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">The Forge</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs mt-2 md:track-3">Advanced LinkedIn Content Engine</p>
        </div>
        <div className="flex gap-3 md:gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs hover:bg-zinc-800 transition-all uppercase tracking-widest leading-none">
            <ImageIcon size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">New</span> Carousel
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#BFFF00] text-black px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs hover:bg-[#8ACC00] transition-all uppercase tracking-widest leading-none shadow-[0_4px_20px_rgba(191,255,0,0.2)]">
            <Sparkles size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">New</span> Post
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Unused Ideas', value: stats.ideas, icon: Lightbulb, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Active Drafts', value: stats.drafts, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Scheduled', value: stats.scheduled, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Total Posted', value: stats.published, icon: CheckCircle2, color: 'text-[#BFFF00]', bg: 'bg-[#BFFF00]/10' },
        ].map((stat, i) => (
          <Link 
            key={i} 
            href={stat.label === 'Active Drafts' ? '/drafts' : (stat.label === 'Unused Ideas' ? '/ideas' : (stat.label === 'Scheduled' ? '/calendar' : '#'))}
            className="bg-zinc-900/40 border border-zinc-800 p-4 md:p-8 rounded-2xl md:rounded-3xl hover:border-[#BFFF00]/30 transition-all group block"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 border border-white/5`}>
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <p className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl md:text-4xl font-black tracking-tighter">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Ideas Bridge */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-base md:text-xl font-black tracking-tighter uppercase flex items-center gap-2">
              <TrendingUp size={18} className="text-[#BFFF00] md:w-5 md:h-5" /> Recent <span className="hidden sm:inline">High-Viability</span> Ideas
            </h3>
            <button className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">View All →</button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {recentIdeas.length > 0 ? recentIdeas.map((idea: any, i) => (
              <div key={idea.id} className="bg-zinc-900/20 border border-zinc-800 p-4 md:p-6 rounded-xl md:rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-zinc-900/40 transition-all gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="font-bold text-xs md:text-sm tracking-tight text-white group-hover:text-[#BFFF00] transition-colors truncate">
                    {idea.topic}
                  </p>
                  <p className="text-[8px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Source: {idea.source} • {idea.niche_tag || 'GENERAL'}</p>
                </div>
                <Link 
                  href={`/create/post?topic=${encodeURIComponent(idea.topic)}&content=${encodeURIComponent(idea.raw_content)}`}
                  className="bg-zinc-950 border border-zinc-800 text-zinc-500 p-2 md:p-2.5 rounded-lg md:rounded-xl hover:text-[#BFFF00] hover:border-[#BFFF00]/30 transition-all shrink-0"
                >
                  <ArrowRight size={14} />
                </Link>
              </div>
            )) : (
              <div className="bg-zinc-900/10 border-2 border-dashed border-zinc-800 p-8 rounded-2xl text-center">
                <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">No ideas yet. Start by scraping!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-6 md:space-y-8">
           <h3 className="text-base md:text-lg font-black tracking-tighter uppercase">Forge Insights</h3>
           <div className="space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <p className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Persona</p>
                <div className="bg-zinc-900 p-3 md:p-4 rounded-xl md:rounded-2xl border border-zinc-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-black text-xs text-white">
                    {activePersona.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="font-bold text-xs md:text-sm">{activePersona}</p>
                </div>
              </div>
              <div className="space-y-2 md:space-y-3">
                <p className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Watchlist Health</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-[#BFFF00] w-[85%]" />
                  </div>
                  <span className="text-[10px] font-black text-zinc-400">85%</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
