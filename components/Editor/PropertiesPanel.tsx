"use client";

import React from 'react';
import { useCarouselStore } from '../../store/useCarouselStore';
import { getTheme, ThemeRegistry } from '../../themes';
import { FieldConfig, IntroContent, ContentSlideContent, CTAContent } from '../../types/carousel';
import { Square, RectangleVertical, Settings, PenLine, Palette, Smartphone, Image as ImageIcon, Plus, Trash2, Layout } from 'lucide-react';

const PropertiesPanel = () => {
  const { project, activeSlideId, setTheme, updateSlideContent, updateGlobalSettings } = useCarouselStore();
  const [activeTab, setActiveTab] = React.useState<'content' | 'design'>('content');
  const theme = getTheme(project.themeId);
  const activeSlide = project.slides.find(s => s.id === activeSlideId) || project.slides[0];

  const handleFieldChange = (key: string, value: any) => {
    updateSlideContent(activeSlide.id, { [key]: value } as Partial<IntroContent | ContentSlideContent | CTAContent>);
  };

  const renderField = (field: FieldConfig) => {
    const content = activeSlide.content as any;
    const value = content[field.key as keyof typeof content];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{field.label}</label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-black focus:outline-none transition-all"
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={field.key} className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{field.label}</label>
            <textarea
              value={value || ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-black focus:outline-none transition-all resize-none"
            />
          </div>
        );
      case 'steps':
        return (
          <div key={field.key} className="flex flex-col gap-3">
             <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{field.label}</label>
             <div className="flex flex-col gap-3">
                {(value || []).map((step: any, idx: number) => (
                  <div key={idx} className="bg-zinc-50 rounded-xl p-3 border-2 border-zinc-100 relative group">
                    <button 
                      onClick={() => {
                        const newSteps = [...(value || [])];
                        newSteps.splice(idx, 1);
                        handleFieldChange(field.key, newSteps);
                      }}
                      className="absolute -top-2 -right-2 bg-white border shadow-sm p-1 rounded-full text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                    <input
                      type="text"
                      value={step.title || ''}
                      onChange={(e) => {
                        const newSteps = [...value];
                        newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                        handleFieldChange(field.key, newSteps);
                      }}
                      placeholder="Step Title"
                      className="w-full bg-white border mb-2 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:border-black"
                    />
                    <textarea
                      value={step.description || ''}
                      onChange={(e) => {
                        const newSteps = [...value];
                        newSteps[idx] = { ...newSteps[idx], description: e.target.value };
                        handleFieldChange(field.key, newSteps);
                      }}
                      placeholder="Description"
                      rows={2}
                      className="w-full bg-white border rounded-lg px-2 py-1 text-[11px] font-medium focus:outline-none focus:border-black resize-none"
                    />
                  </div>
                ))}
                <button 
                  onClick={() => handleFieldChange(field.key, [...(value || []), { name: 'New Tool', icon: 'tool' }])}
                  disabled={(value || []).length >= 6}
                  className="w-full border-2 border-dashed border-zinc-200 rounded-xl py-3 flex items-center justify-center gap-2 text-zinc-400 hover:border-black hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-bold"
                >
                  <Plus size={14} /> {(value || []).length >= 6 ? 'Max Tools Reached' : 'Add Tool'}
                </button>
             </div>
          </div>
        );
      default:
        return (
          <div key={field.key} className="p-3 bg-zinc-50 rounded-xl border-dashed border-2 text-[10px] font-bold text-zinc-400">
            Editor for type '{field.type}' coming soon
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b shrink-0">
        <button 
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-4 border-b-2 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${
            activeTab === 'content' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          <PenLine size={14} /> Content
        </button>
        <button 
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-4 border-b-2 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${
            activeTab === 'design' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          <Palette size={14} /> Design
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 pb-12">
        {activeTab === 'design' ? (
          <>
            {/* Theme Picker */}
            <section className="flex flex-col gap-3">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Smartphone size={12} /> Visual Theme
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(ThemeRegistry).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all group ${
                      project.themeId === t.id ? 'border-black ring-4 ring-black/5' : 'border-zinc-100 hover:border-zinc-300'
                    }`}
                  >
                     <div className="absolute inset-0 bg-zinc-100 flex items-center justify-center overflow-hidden">
                       {t.preview ? (
                         <img 
                           src={t.preview} 
                           alt={t.name}
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                         />
                       ) : (
                         <ImageIcon size={24} className="text-zinc-300 group-hover:scale-110 transition-transform" />
                       )}
                     </div>
                    <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm p-2">
                      <span className="text-[10px] font-black uppercase truncate block">{t.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-zinc-100 w-full" />

            {/* Aspect Ratio Toggle */}
            <section className="flex flex-col gap-4">
               <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                 <Layout size={12} /> Aspect Ratio
               </h4>
               <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => updateGlobalSettings({ aspectRatio: 'square' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-xs ${
                      project.globalSettings.aspectRatio === 'square' ? 'border-black bg-zinc-50' : 'border-zinc-100'
                    }`}
                  >
                    <Square size={16} /> Square (1:1)
                  </button>
                  <button 
                    onClick={() => updateGlobalSettings({ aspectRatio: 'portrait' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-xs ${
                      project.globalSettings.aspectRatio === 'portrait' ? 'border-black bg-zinc-50' : 'border-zinc-100'
                    }`}
                  >
                    <RectangleVertical size={16} /> Portrait (4:5)
                  </button>
               </div>
            </section>
          </>
        ) : (
          /* Dynamic Fields */
          <section className="flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Settings size={12} /> Edit Slide
                </h4>
                <span className="bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded text-[9px] font-black">
                   {activeSlide.type}
                </span>
             </div>

             <div className="flex flex-col gap-6">
                {theme.editorConfig[activeSlide.type as keyof typeof theme.editorConfig].fields.map(renderField)}
             </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
