"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useCarouselStore } from '../../store/useCarouselStore';
import { getTheme } from '../../themes';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const Canvas = () => {
  const { project, activeSlideId, setActiveSlide } = useCarouselStore();
  const [scale, setScale] = useState(0.4);
  const stageRef = useRef<HTMLDivElement>(null);
  
  const activeSlide = project.slides.find(s => s.id === activeSlideId) || project.slides[0];
  const { aspectRatio } = project.globalSettings;
  const theme = getTheme(project.themeId);
  const SlideComponent = theme.components[activeSlide.type as keyof typeof theme.components];

  const canvasWidth = 1080;
  const canvasHeight = aspectRatio === 'square' ? 1080 : 1350;

  const handleFitToScreen = useCallback(() => {
    if (!stageRef.current) return;
    
    const padding = 64;
    const stageWidth = stageRef.current.clientWidth;
    const stageHeight = stageRef.current.clientHeight;
    
    const availableWidth = stageWidth - padding;
    const availableHeight = stageHeight - padding;
    
    if (availableWidth <= 0 || availableHeight <= 0) return;

    const scaleX = availableWidth / canvasWidth;
    const scaleY = availableHeight / canvasHeight;
    
    const newScale = Math.min(scaleX, scaleY, 1);
    setScale(parseFloat(newScale.toFixed(2)));
  }, [canvasWidth, canvasHeight]);

  // Set initial active slide if none
  useEffect(() => {
    if (!activeSlideId && project.slides.length > 0) {
      setActiveSlide(project.slides[0].id);
    }
  }, [activeSlideId, project.slides, setActiveSlide]);

  // Handle auto-fit on mount and aspect ratio change
  useEffect(() => {
    const timer = setTimeout(handleFitToScreen, 150);
    window.addEventListener('resize', handleFitToScreen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleFitToScreen);
    };
  }, [handleFitToScreen, aspectRatio]);

  return (
    <div className="flex flex-col h-full w-full items-center">
      {/* Zoom & Info Toolbar */}
      <div className="flex items-center justify-between w-full px-8 py-4 bg-white/50 backdrop-blur-sm border-b border-zinc-200/50 shrink-0 z-10">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-white px-2 py-1 rounded border border-zinc-100 shadow-sm">
              Slide {project.slides.findIndex(s => s.id === activeSlide.id) + 1} of {project.slides.length}
           </span>
        </div>

        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-lg shadow-black/5 border border-zinc-100">
          <button onClick={() => setScale(s => Math.max(0.1, s - 0.05))} className="p-1.5 hover:bg-zinc-50 rounded-full transition-colors text-zinc-500">
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-black text-zinc-900 w-12 text-center select-none">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(1.5, s + 0.05))} className="p-1.5 hover:bg-zinc-50 rounded-full transition-colors text-zinc-500">
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-4 bg-zinc-200 mx-1" />
          <button 
            onClick={handleFitToScreen} 
            className="p-1.5 hover:bg-zinc-50 rounded-full transition-colors text-zinc-500 flex items-center gap-1.5 px-3" 
            title="Fit to Screen"
          >
            <Maximize2 size={16} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Fit</span>
          </button>
        </div>

        <div className="w-24" /> {/* Spacer */}
      </div>

      {/* Dotted Stage Stage */}
      <div 
        ref={stageRef}
        className="flex-1 w-full overflow-auto bg-[#F8F9FA] relative flex justify-center items-center py-10 px-12"
        style={{
          backgroundImage: 'radial-gradient(circle, #E1E4E8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div 
          className="relative transition-all duration-500 ease-out"
          style={{ 
            width: `${canvasWidth * scale}px`, 
            height: `${canvasHeight * scale}px`,
          }}
        >
          {/* Card Container with Premium Shadows */}
          <div 
            id="slide-canvas"
            className="absolute top-0 left-0 bg-white overflow-hidden shadow-[0_22px_70px_4px_rgba(0,0,0,0.12),0_4px_20px_rgba(0,0,0,0.05)] border border-zinc-200/50 rounded-lg"
            style={{ 
              width: `${canvasWidth}px`, 
              height: `${canvasHeight}px`, 
              transform: `scale(${scale})`, 
              transformOrigin: 'top left',
            }}
          >
            <div className="w-full h-full bg-white select-none pointer-events-none">
              {SlideComponent && (
                React.createElement(SlideComponent as any, {
                  content: activeSlide.content,
                  globalSettings: project.globalSettings
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
