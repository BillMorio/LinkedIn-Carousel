"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Lightbulb, 
  FileText, 
  Layers, 
  Calendar, 
  Search, 
  BookOpen, 
  Settings,
  Zap,
  Menu,
  X,
  Users,
  Scissors
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  
  { type: 'divider', label: 'Intelligence' },
  { name: 'Idea Bank', icon: Lightbulb, href: '/ideas' },
  { name: 'Clips', icon: Scissors, href: '/clips' },
  { name: 'Keyword Search', icon: Search, href: '/search' },
  { name: 'Watchlist Sync', icon: Users, href: '/scrape' },
  
  { type: 'divider', label: 'The Forge' },
  { name: 'Post Editor', icon: FileText, href: '/create/post' },
  { name: 'Carousel Maker', icon: Layers, href: '/create/carousel' },
  { name: 'Drafts Vault', icon: Zap, href: '/drafts' },
  
  { type: 'divider', label: 'Neural Assets' },
  { name: 'Frameworks', icon: BookOpen, href: '/frameworks' },
  { name: 'Persona & Voice', icon: Settings, href: '/settings' },
  
  { type: 'divider', label: 'Planning' },
  { name: 'Content Calendar', icon: Calendar, href: '/calendar' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 w-full shrink-0">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-[#BFFF00] rounded-lg flex items-center justify-center">
            <Zap className="text-black fill-black" size={18} />
          </div>
          <h1 className="text-base font-black text-white tracking-tighter">FORGE</h1>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950/80 backdrop-blur-xl border-r border-white/5 flex flex-col shrink-0 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-screen lg:top-0 h-full overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section (Desktop) */}
        <Link href="/" className="p-6 hidden lg:flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-[#BFFF00] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(191,255,0,0.3)]">
            <Zap className="text-black fill-black" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter leading-none">FORGE</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">LinkedIn Engine</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 mt-4 lg:mt-0">
          {navItems.map((item, index) => {
            if (item.type === 'divider') {
              return (
                <div key={`divider-${index}`} className="pt-6 pb-2 px-3">
                  {item.label && (
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                      {item.label}
                    </span>
                  )}
                  {!item.label && <div className="h-px bg-zinc-800/50 w-full" />}
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "bg-[#BFFF00]/10 text-[#BFFF00]" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-[#BFFF00] rounded-r-full shadow-[0_0_10px_rgba(191,255,0,0.5)]" />
                )}
                <Icon size={18} className={cn(
                  "transition-colors",
                  isActive ? "text-[#BFFF00]" : "text-zinc-500 group-hover:text-zinc-300"
                )} />
                <span className="text-sm font-bold tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile/Status Section */}
        <div className="p-4 mt-auto">
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#BFFF00] to-[#8ACC00] flex items-center justify-center text-black font-black text-xs">
              BM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Bill Morio</p>
              <p className="text-[10px] text-zinc-500 font-bold">PRO BUILDER</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
