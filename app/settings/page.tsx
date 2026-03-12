"use client";
import React from 'react';
import { Settings as SettingsIcon, Shield, Key, Bell, User, Sparkles, Save, RotateCw, ChevronRight } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('persona');
  const [persona, setPersona] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    fetchPersona();
  }, []);

  const fetchPersona = async () => {
    try {
      const res = await fetch(`${API_URL}/settings/persona_prompt`);
      const data = await res.json();
      setPersona(data.value || '');
    } catch (error) {
      console.error("Failed to fetch persona", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'persona_prompt', value: persona }),
      });
    } catch (error) {
      console.error("Failed to save persona", error);
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { id: 'persona', icon: User, title: 'Identity & Persona' },
    { id: 'api', icon: Key, title: 'API Integrations' },
    { id: 'cloud', icon: Shield, title: 'Cloud & Database' },
    { id: 'notifications', icon: Bell, title: 'Notifications' },
  ];

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#0A0A0A] min-h-screen text-white max-w-5xl">
      <div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Settings</h2>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2">Configure your content engine</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar / Mobile Scrollable Tabs */}
        <div className="w-full lg:w-64 space-y-1 lg:space-y-2 shrink-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 lg:p-4 rounded-xl transition-all duration-200 whitespace-nowrap lg:whitespace-normal ${
                  activeTab === item.id 
                    ? 'bg-[#BFFF00]/10 text-[#BFFF00] border border-[#BFFF00]/20' 
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                <item.icon className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'persona' && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-black tracking-tighter uppercase">WRITING PERSONA</h3>
                    <p className="text-zinc-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest">DEFINES YOUR VOICE FOR CLAUDE</p>
                  </div>
                  <div className="bg-[#BFFF00]/5 px-3 py-1.5 rounded-full border border-[#BFFF00]/20 flex items-center gap-2">
                    <Sparkles size={12} className="text-[#BFFF00]" />
                    <span className="text-[10px] font-black text-[#BFFF00] uppercase tracking-widest leading-none">AI ENABLED</span>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="relative group">
                    <textarea 
                      value={persona}
                      onChange={e => setPersona(e.target.value)}
                      placeholder="e.g. You are a software engineer specializing in AI. You write with a direct, no-fluff tone..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl p-4 md:p-6 text-xs md:text-sm font-medium leading-relaxed min-h-[250px] md:min-h-[300px] focus:border-[#BFFF00]/30 outline-none transition-all placeholder:text-zinc-800"
                    />
                    {!isLoaded && (
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-xl md:rounded-2xl flex items-center justify-center">
                         <RotateCw className="text-[#BFFF00] animate-spin" size={24} />
                       </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-zinc-800 gap-4 md:gap-6">
                    <p className="text-[10px] md:text-xs text-zinc-500 font-bold max-w-md leading-relaxed">
                      This prompt is injected as the system instructions for every generation task. Be specific about your tone, vocabulary, and topics.
                    </p>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full md:w-auto bg-[#BFFF00] text-black px-8 py-3.5 md:py-3 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-[#8ACC00] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(191,255,0,0.15)] uppercase tracking-widest whitespace-nowrap"
                    >
                      {isSaving ? <RotateCw className="animate-spin" size={16} /> : <Save size={16} />}
                      {isSaving ? "SAVING..." : "SAVE PERSONA"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Suggestions Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900/30 border border-zinc-800 p-5 md:p-6 rounded-xl md:rounded-2xl">
                  <h4 className="text-[8px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Tone Guide</h4>
                  <p className="text-[10px] md:text-xs text-zinc-500 font-bold leading-relaxed italic border-l-2 border-[#BFFF00]/30 pl-3">
                    "Use short punchy sentences. Avoid corporate jargon. Be direct and slightly opinionated."
                  </p>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800 p-5 md:p-6 rounded-xl md:rounded-2xl">
                  <h4 className="text-[8px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Structure Guide</h4>
                  <p className="text-[10px] md:text-xs text-zinc-500 font-bold leading-relaxed italic border-l-2 border-[#BFFF00]/30 pl-3">
                    "Lead with a hook that challenges a common belief. Always end with a question."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'persona' && (
            <div className="flex flex-col items-center justify-center py-24 md:py-40 text-center space-y-4 md:space-y-6">
              <div className="p-4 md:p-5 bg-zinc-900 rounded-xl md:rounded-2xl text-zinc-700">
                <SettingsIcon className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div>
                <h3 className="font-black text-lg md:text-xl tracking-tighter uppercase">Section Under Construction</h3>
                <p className="text-zinc-600 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2 px-6">This module will be part of the Phase 3 roll-out</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
