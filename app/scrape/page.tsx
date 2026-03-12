"use client";
import React from 'react';
import { Search, RefreshCw, UserPlus, Globe, Shield, History, Plus, MoreHorizontal, ArrowUpRight } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

export default function ScraperPage() {
  const [watchlist, setWatchlist] = React.useState<any[]>([]);
  const [keyword, setKeyword] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Mock data for now
  const mockWatchlist = [
    { name: 'Justin Welsh', handle: '@justinwelsh', lastScraped: '2h ago', status: 'Healthy' },
    { name: 'Alex Hormozi', handle: '@hormozi', lastScraped: '1d ago', status: 'Healthy' },
    { name: 'Sahil Bloom', handle: '@sahilbloom', lastScraped: '5h ago', status: 'Rate Limited' },
  ];

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#0A0A0A] min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-white">Scraper Engine</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2">Surface viral content from LinkedIn</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-4 md:px-5 py-2.5 rounded-xl font-black text-[10px] md:text-xs hover:bg-zinc-800 transition-colors uppercase whitespace-nowrap">
            <History size={14} /> <span className="hidden sm:inline">SCRAPE</span> HISTORY
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#BFFF00] text-black px-4 md:px-5 py-2.5 rounded-xl font-black text-[10px] md:text-xs hover:bg-[#8ACC00] transition-colors shadow-[0_4px_20px_rgba(191,255,0,0.15)] uppercase whitespace-nowrap">
            <UserPlus size={14} /> <span className="hidden sm:inline">ADD TO</span> WATCHLIST
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Keyword Scraper Container */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-6 md:space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-2.5 md:p-3 bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl text-[#BFFF00]">
                <Globe className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black tracking-tighter uppercase whitespace-nowrap">Global Discovery</h3>
                <p className="text-zinc-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest">Search LinkedIn by keyword or topic</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 flex items-center gap-3 md:gap-4 bg-zinc-950 border border-zinc-800 p-3.5 md:p-4 rounded-xl md:rounded-2xl">
                <Search className="text-zinc-500 w-[18px] h-[18px] md:w-5 md:h-5" />
                <input 
                  type="text" 
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="e.g. 'SaaS AI hooks'..." 
                  className="bg-transparent border-none outline-none flex-1 text-xs md:text-sm font-bold text-white placeholder:text-zinc-800"
                />
              </div>
              <button className="bg-[#BFFF00] text-black px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:scale-105 transition-all shadow-[0_4px_20px_rgba(191,255,0,0.2)] active:scale-95 uppercase tracking-widest">
                START SEARCH
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
               <div className="bg-zinc-950/50 border border-zinc-800/50 p-3 md:p-4 rounded-xl md:rounded-2xl">
                  <p className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Depth</p>
                  <p className="text-[10px] md:text-xs font-bold">TOP 50 POSTS</p>
               </div>
               <div className="bg-zinc-950/50 border border-zinc-800/50 p-3 md:p-4 rounded-xl md:rounded-2xl">
                  <p className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Timeframe</p>
                  <p className="text-[10px] md:text-xs font-bold">PAST 7 DAYS</p>
               </div>
            </div>
          </div>

          <div className="bg-zinc-900/10 border-2 border-dashed border-zinc-800 rounded-2xl md:rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center">
            <div className="p-4 md:p-6 bg-zinc-900 rounded-full text-zinc-700 mb-4 md:mb-6">
              <Shield className="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <h4 className="text-base md:text-lg font-black tracking-tighter uppercase whitespace-nowrap">No Active Session</h4>
            <p className="text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2 max-w-[280px] md:max-w-sm">
              Your results will appear here in real-time once the engine starts.
            </p>
          </div>
        </div>

        {/* Watchlist Sidebar */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-base md:text-lg font-black tracking-tighter uppercase">Watchlist</h3>
               <button 
                onClick={() => {
                  setIsRefreshing(true);
                  setTimeout(() => setIsRefreshing(false), 2000);
                }}
                className={`p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-500 hover:text-[#BFFF00] transition-all ${isRefreshing ? 'animate-spin text-[#BFFF00]' : ''}`}
               >
                 <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
               </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {mockWatchlist.map((item, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800 p-3.5 md:p-4 rounded-xl md:rounded-2xl hover:border-[#BFFF00]/30 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                     <div className="min-w-0">
                        <p className="font-black text-xs md:text-sm tracking-tight group-hover:text-[#BFFF00] transition-colors truncate">{item.name}</p>
                        <p className="text-[8px] md:text-[10px] font-bold text-zinc-600 uppercase tracking-widest truncate">{item.handle}</p>
                     </div>
                     <MoreHorizontal className="text-zinc-700 w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                  <div className="flex justify-between items-end mt-4">
                     <div>
                        <p className="text-[6px] md:text-[8px] font-black text-zinc-500 uppercase tracking-widest">Last Run</p>
                        <p className="text-[8px] md:text-[10px] font-bold">{item.lastScraped}</p>
                     </div>
                     <span className={`text-[6px] md:text-[8px] font-black px-1.5 md:px-2 py-0.5 rounded-full ${
                        item.status === 'Healthy' ? 'bg-[#BFFF00]/10 text-[#BFFF00]' : 'bg-red-500/10 text-red-500'
                     }`}>
                        {item.status.toUpperCase()}
                     </span>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 md:py-4 border-2 border-dashed border-zinc-800 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 text-zinc-600 hover:text-zinc-400 hover:border-zinc-600 font-black text-[10px] md:text-xs tracking-widest uppercase transition-all">
                 <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" /> NEW PROFILE
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800">
               <button className="w-full flex items-center justify-between p-3.5 md:p-4 bg-[#BFFF00] text-black rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#8ACC00] transition-all group">
                  <span>REFRESH ALL</span>
                  <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
