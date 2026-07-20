"use client";
import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, UserPlus, Globe, History, Plus, MoreHorizontal, ArrowUpRight, Trash2, ExternalLink, X, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = 'http://localhost:8000/api';

export default function ScraperPage() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [newProfileUrl, setNewProfileUrl] = useState("");
  const [newProfileName, setNewProfileName] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/watchlist`);
      const data = await res.json();
      setWatchlist(data);
    } catch (err) {
      console.error("Failed to fetch watchlist", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProfile = async () => {
    if (!newProfileUrl) return;
    setIsAdding(true);
    try {
      const res = await fetch(`${API_URL}/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: newProfileName || newProfileUrl.split('/in/')[1]?.split('/')[0] || "New Profile",
          linkedin_url: newProfileUrl
        })
      });
      if (res.ok) {
        setNewProfileUrl("");
        setNewProfileName("");
        setIsModalOpen(false);
        fetchWatchlist();
      }
    } catch (err) {
      console.error("Failed to add profile", err);
    } finally {
      setIsAdding(false);
    }
  };

  const removeProfile = async (id: number) => {
    if (!confirm("Are you sure you want to remove this profile?")) return;
    try {
      await fetch(`${API_URL}/watchlist/${id}`, { method: 'DELETE' });
      fetchWatchlist();
    } catch (err) {
      console.error("Failed to remove profile", err);
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-12 bg-[#0A0A0A] min-h-screen text-white relative">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#BFFF00] shadow-[0_0_12px_#BFFF00]"></div>
            <span className="text-[#BFFF00] font-black uppercase tracking-[0.2em] text-[10px]">Intelligence Hub</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white outline-text">Spy Engine</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-1 border-l border-zinc-800 pl-3 ml-1">Surface viral strategies from the world's best</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-3 bg-[#BFFF00] text-black px-6 py-4 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_8px_30px_rgba(191,255,0,0.2)] uppercase tracking-widest"
          >
            <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> 
            ADD CREATOR
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="space-y-8">
        <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
          <h3 className="text-xl font-black tracking-tighter uppercase flex items-center gap-3">
             Monitored Assets <span className="text-zinc-800 font-mono text-sm">[{watchlist.length}]</span>
          </h3>
          <button 
            onClick={fetchWatchlist}
            className={`p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-[#BFFF00] transition-all hover:bg-zinc-800 ${isRefreshing ? 'animate-spin text-[#BFFF00]' : ''}`}
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-zinc-900/50 rounded-3xl border border-zinc-800"></div>
            ))}
          </div>
        ) : watchlist.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-zinc-900/10 border-2 border-dashed border-zinc-900 rounded-[3rem]">
            <div className="p-8 bg-zinc-900/50 rounded-full text-zinc-800 mb-6">
              <Zap size={48} />
            </div>
            <h4 className="text-2xl font-black tracking-tighter uppercase">Your Watchlist is Empty</h4>
            <p className="text-zinc-600 font-bold text-xs uppercase tracking-widest mt-2 max-w-sm leading-relaxed">
              Target creators who are crushing it on LinkedIn. Add their profile URL to start surfacing viral ideas.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 text-[#BFFF00] font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
            >
              + Add your first creator
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {watchlist.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-zinc-900/40 border border-zinc-800 rounded-[3rem] p-1 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(191,255,0,0.15)] backdrop-blur-xl"
              >
                {/* Multi-layer Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#BFFF00]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#BFFF00]/5 rounded-full blur-[80px] group-hover:bg-[#BFFF00]/20 transition-all duration-700"></div>
                
                <div className="relative bg-zinc-950/40 rounded-[2.9rem] p-8 h-full flex flex-col border border-white/5">
                  {/* Top: Avatar & Title Section */}
                  <div className="flex flex-col items-center text-center mb-8">
                     <div className="relative mb-6">
                        <div className="absolute inset-0 bg-[#BFFF00] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        {item.avatar_url ? (
                          <img 
                            src={item.avatar_url} 
                            alt={item.display_name} 
                            className="w-24 h-24 rounded-[2.5rem] object-cover relative z-10 border-2 border-white/10 group-hover:border-[#BFFF00] transition-all shadow-2xl" 
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-900 flex items-center justify-center text-[#BFFF00] relative z-10 border-2 border-zinc-800 group-hover:border-[#BFFF00] transition-all shadow-2xl">
                            <Plus size={32} strokeWidth={3} />
                          </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 p-2 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl z-20">
                          <Globe size={14} className="text-[#BFFF00]" />
                        </div>
                     </div>
                     
                     <h4 className="font-black text-2xl tracking-tighter mb-1 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent group-hover:from-[#BFFF00] group-hover:to-white transition-all duration-500">
                       {item.display_name}
                     </h4>
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] line-clamp-2 max-w-[200px] leading-relaxed">
                        {item.headline || "Analyzing creator strategy..."}
                     </p>
                  </div>

                  {/* Middle: Intelligence Feed / Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                     <div className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-3xl flex flex-col items-center text-center">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</span>
                        <div className="flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#BFFF00] animate-pulse"></div>
                           <span className="text-[9px] font-black text-white uppercase tracking-tighter">Live Scrape</span>
                        </div>
                     </div>
                     <div className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-3xl flex flex-col items-center text-center">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Depth</span>
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter">24H Window</span>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto relative z-10">
                     <button 
                        onClick={() => router.push(`/scrape/${item.id}`)}
                        className="flex-1 flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#BFFF00] transition-all shadow-lg active:scale-95"
                     >
                       OPEN ENGINE <ArrowUpRight size={16} strokeWidth={3} />
                     </button>
                     <button 
                        onClick={() => removeProfile(item.id)}
                        className="p-4 bg-zinc-900 border border-zinc-800 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-2xl active:scale-90"
                     >
                       <Trash2 size={18} />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-in fade-in zoom-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-[3rem] p-10 shadow-[0_20px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#BFFF00]"></div>
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all active:scale-90"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-10">
              <div className="inline-flex p-4 bg-zinc-950 border border-zinc-800 rounded-3xl text-[#BFFF00] mb-6 shadow-2xl">
                <Globe size={32} />
              </div>
              <h3 className="text-3xl font-black tracking-tighter uppercase italic">Inject Creator URL</h3>
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] mt-3">Target any high-performance LinkedIn profile</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1">Creator Name</label>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4 focus-within:border-[#BFFF00]/50 transition-colors">
                  <UserPlus size={18} className="text-zinc-700" />
                  <input 
                    type="text" 
                    value={newProfileName}
                    onChange={e => setNewProfileName(e.target.value)}
                    placeholder="e.g. Justin Welsh" 
                    className="bg-transparent border-none outline-none flex-1 text-sm font-bold placeholder:text-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1">LinkedIn Profile Link</label>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4 focus-within:border-[#BFFF00]/50 transition-colors">
                  <Globe size={18} className="text-zinc-700" />
                  <input 
                    type="text" 
                    value={newProfileUrl}
                    onChange={e => setNewProfileUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username" 
                    className="bg-transparent border-none outline-none flex-1 text-sm font-bold placeholder:text-zinc-800"
                  />
                </div>
              </div>

              <button 
                onClick={addProfile}
                disabled={isAdding}
                className="w-full bg-[#BFFF00] text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_40px_rgba(191,255,0,0.15)] flex items-center justify-center gap-3"
              >
                {isAdding ? <RefreshCw className="animate-spin" /> : <Zap size={16} />}
                {isAdding ? "ESTABLISHING SYNC..." : "INITIATE INTELLIGENCE SYNC"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Health Monitor */}
      <div className="fixed bottom-10 right-10 hidden lg:block">
         <div className="bg-zinc-950 border border-zinc-800 px-6 py-4 rounded-[2rem] shadow-2xl backdrop-blur-xl flex items-center gap-4">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[#BFFF00]">
               <ShieldCheck size={16} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Global Status</p>
               <p className="text-[10px] font-black uppercase text-white tracking-widest">Nodes Operational</p>
            </div>
         </div>
      </div>
    </div>
  );
}
