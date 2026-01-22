"use client";

import React from 'react';
import { useCarouselStore } from '../../store/useCarouselStore';
import { getTheme, ThemeRegistry } from '../../themes';
import { FieldConfig, IntroContent, ContentSlideContent, CTAContent } from '../../types/carousel';
import { Square, RectangleVertical, Settings, PenLine, Palette, Smartphone, Image as ImageIcon, Plus, Trash2, Layout, Upload, X, Settings2, Italic, Type, Maximize2, LayoutPanelLeft } from 'lucide-react';
import { ElementStyle, SectionStyle } from '../../types/carousel';

const StyleEditor = ({ style, onChange, isImage = false }: { style?: ElementStyle, onChange: (newStyle: ElementStyle) => void, isImage?: boolean }) => {
  return (
    <div className="bg-zinc-50 border-2 border-zinc-100 rounded-xl p-4 mt-2 flex flex-col gap-4">
      {!isImage ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Font Size</span>
              <input 
                type="text" 
                value={style?.fontSize || ''} 
                onChange={(e) => onChange({ ...style, fontSize: e.target.value })}
                placeholder="e.g. 2rem"
                className="bg-white border rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Spacing</span>
              <input 
                type="text" 
                value={style?.letterSpacing || ''} 
                onChange={(e) => onChange({ ...style, letterSpacing: e.target.value })}
                placeholder="e.g. -0.02em"
                className="bg-white border rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onChange({ ...style, fontStyle: style?.fontStyle === 'italic' ? 'normal' : 'italic' })}
              className={`flex-1 py-1.5 border-2 rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold transition-all ${style?.fontStyle === 'italic' ? 'border-black bg-black text-white' : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300'}`}
            >
              <Italic size={12} /> Italic
            </button>
            <div className="flex-1 flex flex-col gap-1">
               <span className="text-[9px] font-bold text-zinc-400 uppercase">Weight</span>
               <select 
                 value={style?.fontWeight || 'bold'} 
                 onChange={(e) => onChange({ ...style, fontWeight: e.target.value })}
                 className="bg-white border rounded-lg px-2 py-1 text-xs outline-none focus:border-black font-bold"
               >
                 <option value="normal">Normal</option>
                 <option value="medium">Medium</option>
                 <option value="semibold">Semibold</option>
                 <option value="bold">Bold</option>
                 <option value="black">Black</option>
               </select>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4">
           <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Width</span>
              <input 
                type="text" 
                value={style?.width || ''} 
                onChange={(e) => onChange({ ...style, width: e.target.value })}
                placeholder="e.g. 100px"
                className="bg-white border rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Height</span>
              <input 
                type="text" 
                value={style?.height || ''} 
                onChange={(e) => onChange({ ...style, height: e.target.value })}
                placeholder="auto"
                className="bg-white border rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
              />
            </div>
        </div>
      )}
    </div>
  )
}

const SectionStyleEditor = ({ style, onChange, isLogoSection = false }: { style?: SectionStyle, onChange: (newStyle: SectionStyle) => void, isLogoSection?: boolean }) => {
  return (
    <div className="bg-zinc-50 border-2 border-zinc-100 rounded-xl p-4 mt-2 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-zinc-400 uppercase">Top Margin</span>
          <input 
            type="text" 
            value={style?.marginTop || ''} 
            onChange={(e) => onChange({ ...style, marginTop: e.target.value })}
            placeholder="e.g. 2rem"
            className="bg-white border rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-zinc-400 uppercase">Bottom Margin</span>
          <input 
            type="text" 
            value={style?.marginBottom || ''} 
            onChange={(e) => onChange({ ...style, marginBottom: e.target.value })}
            placeholder="e.g. 2rem"
            className="bg-white border rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-zinc-400 uppercase">Padding (X)</span>
          <input 
            type="text" 
            value={style?.paddingLeft || ''} 
            onChange={(e) => onChange({ ...style, paddingLeft: e.target.value, paddingRight: e.target.value })}
            placeholder="e.g. 1rem"
            className="bg-white border rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-zinc-400 uppercase">Padding (Y)</span>
          <input 
            type="text" 
            value={style?.paddingTop || ''} 
            onChange={(e) => onChange({ ...style, paddingTop: e.target.value, paddingBottom: e.target.value })}
            placeholder="e.g. 1rem"
            className="bg-white border rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
          />
        </div>
      </div>

      {isLogoSection && (
        <div className="flex flex-col gap-4 pt-2 border-t">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Layout Type</span>
            <div className="grid grid-cols-3 gap-2">
              {['grid', 'row', 'wrap'].map((l) => (
                <button
                  key={l}
                  onClick={() => onChange({ ...style, layout: l as any })}
                  className={`py-1.5 border-2 rounded-lg text-[9px] font-black uppercase transition-all ${style?.layout === l ? 'border-black bg-black text-white' : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Logo Size</span>
              <input 
                type="text" 
                value={style?.itemSize || ''} 
                onChange={(e) => onChange({ ...style, itemSize: e.target.value })}
                placeholder="e.g. 40px"
                className="bg-white border rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Logo Gap</span>
              <input 
                type="text" 
                value={style?.itemGap || ''} 
                onChange={(e) => onChange({ ...style, itemGap: e.target.value })}
                placeholder="e.g. 1rem"
                className="bg-white border rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-zinc-400 uppercase">Opacity</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            value={style?.opacity ?? 1} 
            onChange={(e) => onChange({ ...style, opacity: parseFloat(e.target.value) })}
            className="w-full accent-black"
          />
        </div>
    </div>
  )
}

const PropertiesPanel = () => {
  const { project, activeSlideId, setTheme, updateSlideContent, updateGlobalSettings, setSlideVariant } = useCarouselStore();
  const [activeTab, setActiveTab] = React.useState<'content' | 'design'>('content');
  const [expandedStyleField, setExpandedStyleField] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const theme = getTheme(project.themeId);
  const activeSlide = project.slides.find(s => s.id === activeSlideId) || project.slides[0];
  const activeVariants = theme.variants[activeSlide.type];
  const activeVariant = activeVariants.find(v => v.id === activeSlide.variantId) || activeVariants[0];

  const handleFieldChange = (key: string, value: any) => {
    updateSlideContent(activeSlide.id, { [key]: value } as Partial<IntroContent | ContentSlideContent | CTAContent>);
  };

  const handleImageUpload = (key: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleFieldChange(key, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleStyleChange = (fieldKey: string, style: ElementStyle) => {
    const currentStyles = (activeSlide.content as any).styles || {};
    handleFieldChange('styles', { ...currentStyles, [fieldKey]: style });
  };

  const handleSectionStyleChange = (sectionId: string, style: SectionStyle) => {
    const currentSectionStyles = (activeSlide.content as any).sectionStyles || {};
    handleFieldChange('sectionStyles', { ...currentSectionStyles, [sectionId]: style });
  };

  const renderField = (field: FieldConfig) => {
    const content = activeSlide.content as any;
    const value = content[field.key as keyof typeof content];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{field.label}</label>
              {field.hasStyleControls && (
                <button 
                  onClick={() => setExpandedStyleField(expandedStyleField === field.key ? null : field.key)}
                  className={`p-1 rounded-md transition-colors ${expandedStyleField === field.key ? 'bg-black text-white' : 'text-zinc-400 hover:bg-zinc-100'}`}
                >
                  <Settings2 size={12} />
                </button>
              )}
            </div>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-black focus:outline-none transition-all"
            />
            {expandedStyleField === field.key && (
              <StyleEditor 
                style={content.styles?.[field.key]} 
                onChange={(s) => handleStyleChange(field.key, s)}
              />
            )}
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
      case 'image':
        return (
          <div key={field.key} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{field.label}</label>
              {field.hasStyleControls && (
                <button 
                  onClick={() => setExpandedStyleField(expandedStyleField === field.key ? null : field.key)}
                  className={`p-1 rounded-md transition-colors ${expandedStyleField === field.key ? 'bg-black text-white' : 'text-zinc-400 hover:bg-zinc-100'}`}
                >
                  <Settings2 size={12} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
               {value ? (
                 <div className="relative group w-20 h-20 shrink-0">
                    <img src={value} alt="Preview" className="w-full h-full object-cover rounded-xl border-2 border-zinc-100 shadow-sm" />
                    <button 
                       onClick={() => handleFieldChange(field.key, '')}
                      className="absolute -top-2 -right-2 bg-white border shadow-md p-1 rounded-full text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                 </div>
               ) : (
                 <button 
                   onClick={() => {
                     const input = document.createElement('input');
                     input.type = 'file';
                     input.accept = 'image/*';
                     input.onchange = (e) => {
                       const file = (e.target as HTMLInputElement).files?.[0];
                       if (file) handleImageUpload(field.key, file);
                     };
                     input.click();
                   }}
                   className="w-20 h-20 shrink-0 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 hover:border-black hover:text-black transition-all"
                 >
                    <Upload size={16} />
                    <span className="text-[8px] font-black uppercase">Upload</span>
                 </button>
               )}
               <div className="flex-1">
                  <p className="text-[10px] font-medium text-zinc-400 leading-tight">Recommended: Square PNG or JPG. Max 2MB.</p>
                  {value && (
                    <button 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) handleImageUpload(field.key, file);
                         };
                        input.click();
                      }}
                      className="mt-2 text-[10px] font-bold text-black hover:underline"
                    >
                      Change Image
                    </button>
                  )}
               </div>
            </div>
            {expandedStyleField === field.key && (
              <StyleEditor 
                style={content.styles?.[field.key]} 
                onChange={(s) => handleStyleChange(field.key, s)}
                isImage
              />
            )}
          </div>
        );
      case 'section-controls':
        return (
          <div key={field.key} className="flex flex-col gap-2 mt-4 first:mt-0">
            <div className="flex items-center justify-between bg-zinc-100/50 px-3 py-2 rounded-xl border border-zinc-200">
              <div className="flex items-center gap-2">
                <LayoutPanelLeft size={14} className="text-zinc-500" />
                <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">{field.label} Controls</span>
              </div>
              <button 
                onClick={() => setExpandedStyleField(expandedStyleField === field.key ? null : field.key)}
                className={`p-1 rounded-md transition-colors ${expandedStyleField === field.key ? 'bg-black text-white' : 'text-zinc-400 hover:bg-zinc-200'}`}
              >
                <Settings2 size={12} />
              </button>
            </div>
            {expandedStyleField === field.key && (
              <SectionStyleEditor 
                style={(activeSlide.content as any).sectionStyles?.[field.key]} 
                onChange={(s) => handleSectionStyleChange(field.key, s)}
                isLogoSection={field.key === 'footer'}
              />
            )}
          </div>
        );
      case 'icon-grid':
        return (
          <div key={field.key} className="flex flex-col gap-3">
             <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{field.label}</label>
             <div className="flex flex-wrap gap-2">
                {(value || []).map((icon: string, idx: number) => (
                  <div key={idx} className="relative group w-12 h-12">
                     <img src={icon} alt="" className="w-full h-full object-contain rounded-lg border bg-white p-1" />
                     <button 
                       onClick={() => {
                         const newVal = [...value];
                         newVal.splice(idx, 1);
                         handleFieldChange(field.key, newVal);
                       }}
                       className="absolute -top-1.5 -right-1.5 bg-white border shadow-sm p-0.5 rounded-full text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <X size={10} />
                     </button>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleFieldChange(field.key, [...(value || []), reader.result as string]);
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                  className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-lg text-zinc-300 hover:border-black hover:text-black transition-all"
                >
                   <Plus size={16} />
                </button>
             </div>
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
                  onClick={() => handleFieldChange(field.key, [...(value || []), { title: 'New Item', description: 'Description' }])}
                  disabled={(value || []).length >= 6}
                  className="w-full border-2 border-dashed border-zinc-200 rounded-xl py-3 flex items-center justify-center gap-2 text-zinc-400 hover:border-black hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-bold"
                >
                  <Plus size={14} /> {(value || []).length >= 6 ? 'Max Items Reached' : 'Add Item'}
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
            {/* Variation Picker */}
            <section className="flex flex-col gap-3">
               <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                 <LayoutPanelLeft size={12} /> Slide Variation
               </h4>
               <div className="grid grid-cols-2 gap-2">
                  {activeVariants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSlideVariant(activeSlide.id, v.id)}
                      className={`py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${
                        (activeSlide.variantId || activeVariants[0].id) === v.id ? 'border-black bg-black text-white' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200 bg-white'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
               </div>
            </section>

            <div className="h-px bg-zinc-100 w-full" />

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
                <div className="flex items-center gap-2">
                   <span className="bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                      {activeSlide.type}
                   </span>
                   <span className="bg-black text-white px-2 py-0.5 rounded text-[9px] font-black uppercase">
                      {activeVariant.name}
                   </span>
                </div>
             </div>
 
             <div className="flex flex-col gap-6">
             {activeVariant.editorConfig.fields.map(renderField)}
             </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
