"use client";
import React from 'react';
import { BookOpen, Plus, X, Trash2, CheckCircle2 } from 'lucide-react';

// This would typically come from a shared config or API
const API_URL = 'http://localhost:8000/api';

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = React.useState<any[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [newFramework, setNewFramework] = React.useState({
    name: '',
    author_handle: '',
    description: '',
    prompt_template: '',
    content_type: 'both',
    active: true
  });

  React.useEffect(() => {
    fetchFrameworks();
  }, []);

  const fetchFrameworks = async () => {
    try {
      const res = await fetch(`${API_URL}/frameworks`);
      const data = await res.json();
      setFrameworks(data);
    } catch (error) {
      console.error("Failed to fetch frameworks", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/frameworks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFramework),
      });
      if (res.ok) {
        setShowModal(false);
        setNewFramework({
          name: '',
          author_handle: '',
          description: '',
          prompt_template: '',
          content_type: 'both',
          active: true
        });
        fetchFrameworks();
      }
    } catch (error) {
      console.error("Failed to create framework", error);
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#0A0A0A] min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-white">Frameworks</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2">Writing patterns for Claude</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#BFFF00] text-black px-5 py-3 md:py-2.5 rounded-xl font-black text-xs md:text-sm hover:bg-[#8ACC00] transition-colors uppercase tracking-widest leading-none"
        >
          <Plus size={16} /> ADD FRAMEWORK
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#BFFF00] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : frameworks.length === 0 ? (
        <div className="text-center py-12 md:py-20 bg-zinc-900/10 border-2 border-dashed border-zinc-800 rounded-2xl md:rounded-3xl px-4">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-sm">No frameworks found</p>
          <button onClick={() => setShowModal(true)} className="mt-4 text-[#BFFF00] text-[10px] md:text-xs font-black uppercase tracking-widest hover:underline">Create your first one</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {frameworks.map((f, i) => (
            <div key={f.id || i} className="bg-zinc-900/50 border border-zinc-800 p-5 md:p-6 rounded-xl md:rounded-2xl group hover:border-[#BFFF00]/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 md:p-3 bg-zinc-950 border border-zinc-800 rounded-lg md:rounded-xl text-zinc-500 group-hover:text-[#BFFF00] transition-colors">
                  <BookOpen className="w-[18px] h-[18px] md:w-5 md:h-5" />
                </div>
                {f.active && (
                   <span className="text-[8px] md:text-[10px] font-black text-[#BFFF00] bg-[#BFFF00]/10 border border-[#BFFF00]/20 px-2 py-0.5 md:py-1 rounded flex items-center gap-1">
                     <CheckCircle2 size={10} /> ACTIVE
                   </span>
                )}
              </div>
              <p className="text-lg md:text-xl font-black tracking-tighter truncate">{f.name}</p>
              <p className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 truncate">{f.author_handle}</p>
              <p className="text-[10px] md:text-xs text-zinc-500 font-bold mb-6 line-clamp-2 leading-relaxed">{f.description}</p>
              <div className="flex gap-2">
                {(f.content_type === 'both' || f.content_type === 'post') && (
                  <span className="text-[8px] font-black bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase">POST</span>
                )}
                {(f.content_type === 'both' || f.content_type === 'carousel') && (
                  <span className="text-[8px] font-black bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase">CAROUSEL</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] my-auto">
            <div className="p-4 md:p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
              <h3 className="font-black text-lg md:text-xl tracking-tighter uppercase whitespace-nowrap">NEW FRAMEWORK</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 md:p-8 space-y-5 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
                <div className="space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Name</label>
                  <input 
                    required
                    value={newFramework.name}
                    onChange={e => setNewFramework({...newFramework, name: e.target.value})}
                    placeholder="e.g. Hormozi Lead"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 md:py-3 text-[10px] md:text-sm font-bold focus:border-[#BFFF00] outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Author Handle</label>
                  <input 
                    value={newFramework.author_handle}
                    onChange={e => setNewFramework({...newFramework, author_handle: e.target.value})}
                    placeholder="@handle"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 md:py-3 text-[10px] md:text-sm font-bold focus:border-[#BFFF00] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Description</label>
                <input 
                  required
                  value={newFramework.description}
                  onChange={e => setNewFramework({...newFramework, description: e.target.value})}
                  placeholder="Short summary of the writing style..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 md:py-3 text-[10px] md:text-sm font-bold focus:border-[#BFFF00] outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Prompt Template</label>
                <textarea 
                  required
                  value={newFramework.prompt_template}
                  onChange={e => setNewFramework({...newFramework, prompt_template: e.target.value})}
                  placeholder="Detailed instructions for Claude..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 md:py-4 text-[10px] md:text-sm font-bold focus:border-[#BFFF00] outline-none transition-colors min-h-[120px] md:min-h-[150px] resize-none"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-4">
                 <div className="flex-1 space-y-2">
                  <label className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Content Type</label>
                  <select 
                    value={newFramework.content_type}
                    onChange={e => setNewFramework({...newFramework, content_type: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 md:py-3 text-[10px] md:text-sm font-bold focus:border-[#BFFF00] outline-none transition-colors appearance-none"
                  >
                    <option value="both">Both</option>
                    <option value="post">Post Only</option>
                    <option value="carousel">Carousel Only</option>
                  </select>
                 </div>
                 <div className="flex items-end">
                   <button 
                    type="submit"
                    className="w-full md:w-auto bg-[#BFFF00] text-black px-8 py-3.5 md:py-3 rounded-xl font-black text-[10px] md:text-sm hover:bg-[#8ACC00] transition-colors uppercase tracking-widest"
                   >
                     SAVE FRAMEWORK
                   </button>
                 </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
