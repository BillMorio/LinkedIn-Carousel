"use client";
import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const mobileDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="p-4 md:p-10 space-y-8 bg-[#0A0A0A] min-h-screen text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Calendar</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2">Plan your publishing schedule</p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 p-2 rounded-xl">
           <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400">
             <ChevronLeft size={16} />
           </button>
           <span className="text-[10px] md:text-xs font-black uppercase tracking-widest px-2">MARCH 2026</span>
           <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400">
             <ChevronRight size={16} />
           </button>
        </div>
      </div>

      <div className="bg-zinc-900/10 border border-zinc-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-7 bg-zinc-950/50 border-b border-zinc-800">
          {days.map((day, i) => (
            <div key={day} className="p-3 md:p-4 text-center text-[8px] md:text-[10px] font-black text-zinc-600 tracking-widest">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{mobileDays[i]}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-zinc-800">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="bg-zinc-900/30 min-h-[80px] md:min-h-[140px] p-2 md:p-4 hover:bg-zinc-800/20 transition-colors">
              <span className={cn(
                "text-[8px] md:text-[10px] font-black",
                (i % 31) + 1 === 12 ? "text-[#BFFF00] bg-[#BFFF00]/10 px-1.5 py-0.5 rounded" : "text-zinc-600"
              )}>
                {(i % 31) + 1}
              </span>
              
              {/* Mock Event for mobile demo */}
              {(i % 31) + 1 === 12 && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 md:h-2 bg-[#BFFF00] rounded-full sm:hidden" />
                  <div className="hidden sm:block p-1.5 bg-[#BFFF00]/10 border border-[#BFFF00]/20 rounded-lg">
                    <p className="text-[8px] font-black text-[#BFFF00] uppercase truncate">Neural Post</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
