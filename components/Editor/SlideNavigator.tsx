"use client";

import React from 'react';
import { useCarouselStore } from '../../store/useCarouselStore';
import { Trash2, GripVertical, FileText, LayoutTemplate, Send } from 'lucide-react';
import { SlideType, IntroContent, ContentSlideContent, CTAContent } from '../../types/carousel';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SlideNavigator = () => {
  const { project, activeSlideId, setActiveSlide, addSlide, removeSlide } = useCarouselStore();

  const getSlideIcon = (type: SlideType) => {
    switch (type) {
      case 'INTRO': return <LayoutTemplate size={16} />;
      case 'CONTENT': return <FileText size={16} />;
      case 'CTA': return <Send size={16} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex flex-col gap-2">
        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Add Slide</h3>
        <div className="grid grid-cols-3 gap-2">
           {(['INTRO', 'CONTENT', 'CTA'] as SlideType[]).map((type) => (
             <button
               key={type}
               onClick={() => addSlide(type, {})}
               className="flex flex-col items-center gap-1 p-2 rounded-lg border-2 border-zinc-50 hover:border-black hover:bg-zinc-50 transition-all text-[10px] font-bold"
             >
               {getSlideIcon(type)}
               {type}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
         {project.slides.map((slide: any, index: number) => (
           <div 
             key={slide.id}
             onClick={() => setActiveSlide(slide.id)}
             className={cn(
               "group relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
               activeSlideId === slide.id 
                ? "border-black bg-zinc-50 shadow-sm" 
                : "border-transparent hover:border-zinc-100 hover:bg-zinc-50/50"
             )}
           >
              <div className="flex flex-col items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                <GripVertical size={14} className="cursor-grab" />
                <span className="text-[10px] font-black">{index + 1}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1 rounded bg-zinc-100 border text-zinc-500">
                    {getSlideIcon(slide.type)}
                  </span>
                  <span className="text-xs font-black truncate uppercase tracking-tight">
                    {slide.type} CARD
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate font-medium">
                  {slide.type === 'INTRO' && (slide.content as IntroContent).headline}
                  {slide.type === 'CONTENT' && (slide.content as ContentSlideContent).title}
                  {slide.type === 'CTA' && (slide.content as CTAContent).ctaText}
                </p>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeSlide(slide.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 hover:text-red-600 transition-all text-zinc-400"
              >
                <Trash2 size={14} />
              </button>
           </div>
         ))}
      </div>

      <div className="p-4 border-t bg-zinc-50/50">
         <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
               {project.slides.length} Slides
            </span>
         </div>
      </div>
    </div>
  );
};

export default SlideNavigator;
