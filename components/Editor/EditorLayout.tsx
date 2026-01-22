"use client";

import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import SlideNavigator from './SlideNavigator';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import { useCarouselStore } from '../../store/useCarouselStore';
import { getTheme } from '../../themes';
import { Download, Layout, FileJson, Upload } from 'lucide-react';

const EditorLayout = () => {
  const { project, activeSlideId, updateProjectName, importProject, exportProject } = useCarouselStore();
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const theme = getTheme(project.themeId);

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const result = importProject(json);
        if (!result.success) {
          alert(`Import failed: ${result.error}`);
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleExport = async () => {
    const el = document.getElementById('slide-canvas');
    if (!el) return;

    try {
      setIsExporting(true);
      console.log('Starting export...', { element: el, width: el.offsetWidth, height: el.offsetHeight });
      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 2,
        skipAutoScale: true,
        cacheBust: true,
        filter: (node) => {
          // Skip external images to test if CORS is the issue
          if (node instanceof HTMLImageElement) {
            const src = node.src || '';
            // Only allow data URLs and same-origin images
            if (src.startsWith('data:') || src.startsWith(window.location.origin)) {
              return true;
            }
            // Skip external images
            console.log('Skipping external image:', src);
            return false;
          }
          return true;
        },
      });

      const link = document.createElement('a');
      link.download = `${project.name || 'carousel'}-slide-${activeSlideId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        type: typeof err,
        stringified: JSON.stringify(err)
      });
      alert('Failed to export slide. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = async () => {
    const originalSlideId = activeSlideId;
    const zip = new JSZip();

    try {
      setIsExporting(true);
      
      for (const slide of project.slides) {
        useCarouselStore.getState().setActiveSlide(slide.id);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const el = document.getElementById('slide-canvas');
        if (!el) continue;

        const dataUrl = await toPng(el, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
          filter: (node) => {
            // Skip external images to prevent CORS issues
            if (node instanceof HTMLImageElement) {
              const src = node.src || '';
              if (src.startsWith('data:') || src.startsWith(window.location.origin)) {
                return true;
              }
              return false;
            }
            return true;
          },
        });

        const base64Data = dataUrl.split(',')[1];
        zip.file(`${project.name || 'carousel'}-slide-${slide.id}.png`, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.download = `${project.name || 'carousel'}-bundle.zip`;
      link.href = URL.createObjectURL(content);
      link.click();
      
    } catch (err) {
      console.error('Batch export failed:', err);
      alert('Failed to export carousel. Please try again.');
    } finally {
      if (originalSlideId) {
        useCarouselStore.getState().setActiveSlide(originalSlideId);
      }
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FB] text-zinc-900 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="bg-black text-white p-2 rounded-lg">
            <Layout size={20} />
          </div>
          <input
            type="text"
            value={project.name}
            onChange={(e) => updateProjectName(e.target.value)}
            className="text-lg font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-zinc-100 rounded px-2 py-1"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Theme</span>
            <span className="text-sm font-bold text-zinc-900">{theme.name}</span>
          </div>

          <div className="h-8 w-px bg-zinc-200 mx-2" />
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleJsonImport} 
            accept=".json" 
            className="hidden" 
          />

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-full border-2 border-zinc-200 text-zinc-400 hover:border-black hover:text-black hover:bg-zinc-50 transition-all active:scale-95"
            title="Import JSON"
          >
            <Upload size={18} />
          </button>

          <button 
            onClick={exportProject}
            className="p-2.5 rounded-full border-2 border-zinc-200 text-zinc-400 hover:border-black hover:text-black hover:bg-zinc-50 transition-all active:scale-95"
            title="Export JSON"
          >
            <FileJson size={18} />
          </button>

          <div className="h-8 w-px bg-zinc-200 mx-2" />
          
          <button 
            onClick={handleExportAll}
            disabled={isExporting}
            className="flex items-center gap-2 border-2 border-zinc-200 text-zinc-600 px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:border-black hover:text-black active:scale-95 disabled:opacity-50"
          >
            {isExporting ? 'Processing Carousel...' : 'Export All (ZIP)'}
          </button>

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:bg-zinc-800 active:scale-95 shadow-lg shadow-black/10 disabled:opacity-50"
          >
            {isExporting ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {isExporting ? 'Exporting...' : 'Export Slide'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Slide Navigator */}
        <aside className="w-64 border-r bg-white flex flex-col shrink-0">
          <SlideNavigator />
        </aside>

        {/* Center: Canvas Stage */}
        <main className="flex-1 overflow-hidden">
           <Canvas />
        </main>

        {/* Right Sidebar: Properties Panel */}
        <aside className="w-80 border-l bg-white flex flex-col shrink-0 overflow-y-auto">
          <PropertiesPanel />
        </aside>
      </div>
    </div>
  );
};

export default EditorLayout;
