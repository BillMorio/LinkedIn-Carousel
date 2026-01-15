import React from 'react';
import { IntroContent, ContentSlideContent, CTAContent, GlobalSettings } from '../types/carousel';

// Helper for grainy background overlay
const GrainOverlay = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-[0.03]" 
    style={{ 
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
    }}
  />
);

const SquircleIcon = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`aspect-square w-16 bg-white rounded-[1.25rem] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.15)] flex items-center justify-center border border-black/5 ${className}`}>
    {children}
  </div>
);

const GridOverlay = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-[0.4]" 
    style={{ 
      backgroundImage: `
        linear-gradient(to right, white 1px, transparent 1px),
        linear-gradient(to bottom, white 1px, transparent 1px)
      `,
      backgroundSize: '80px 80px',
    }}
  />
);

export const Intro = ({ content, globalSettings }: { content: IntroContent & { onUpdate?: (key: string, value: any) => void }, globalSettings: GlobalSettings }) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const currentLogos = [...(content.logos || [])];
      
      if (index !== undefined) {
        currentLogos[index] = base64;
      } else {
        currentLogos.push(base64);
      }
      
      content.onUpdate?.('logos', currentLogos);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full relative p-16 px-20 flex flex-col justify-center overflow-hidden" 
      style={{ 
        background: 'linear-gradient(135deg, #FFEDE1 0%, #FAAE87 100%)'
      }}
    >
      <GrainOverlay />
      <GridOverlay />
      
      {/* Profile Tag (Hanging from top) */}
      <div className="absolute top-0 left-12 flex flex-col bg-[#FAD4C0] px-6 pb-8 pt-6 rounded-b-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border-x border-b border-white/40 items-center min-w-[140px]">
         <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-200 border-4 border-white shadow-xl mb-4">
             {content.profileImage ? (
               <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-zinc-100 font-bold text-zinc-400">?</div>
             )}
         </div>
         <span className="text-base font-bold text-zinc-900 leading-tight">{content.name || 'Your Name'}</span>
         <span className="text-[11px] text-zinc-500 font-medium tracking-tight mt-0.5">{content.tagline || 'website.com'}</span>
      </div>

      <div className="absolute top-16 right-16 text-[14px] font-black text-zinc-800 tracking-[0.4em] uppercase opacity-70">
        {(content as any).logoText || 'COLDIQ'}
      </div>

      {/* Main Content */}
      <div className="mt-40 mb-12">
        <h2 className="text-[3.5rem] font-bold text-zinc-500/80 tracking-tight leading-none mb-4">{content.subheadline || 'Build your'}</h2>
        <h1 className="text-[8.5rem] font-black text-[#1B1B1B] leading-[0.85] tracking-tighter">
          {(content as any).mainTitle?.split(' ').map((word: string, i: number) => (
            <span key={i} className="block">{word}</span>
          )) || 'Sales Technology Stack'}
        </h1>
      </div>

      {/* Icon Grid */}
      <div className="mt-auto pl-2">
        <div className="flex flex-wrap gap-4 max-w-[800px]">
          {(content.logos || []).map((logo, idx) => (
            <div key={idx} className="relative group cursor-pointer" onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => handleLogoUpload(e as any, idx);
              input.click();
            }}>
              <SquircleIcon className="w-20 bg-white shadow-xl border-white hover:scale-110 transition-transform">
                <img src={logo} className="w-10 h-10 object-contain" alt="" />
              </SquircleIcon>
            </div>
          ))}
          
          {/* Add Logo Button on Canvas */}
          <div className="cursor-pointer" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => handleLogoUpload(e as any);
            input.click();
          }}>
            <SquircleIcon className="w-20 border-2 border-dashed border-black/10 hover:border-black/30 bg-black/5 hover:bg-black/10 transition-all flex items-center justify-center group">
               <span className="text-3xl font-light text-black/20 group-hover:text-black/40">+</span>
            </SquircleIcon>
          </div>
        </div>
      </div>

      {/* Arrow Pill Bottom Right */}
      <div className="absolute bottom-16 right-16 w-20 h-10 bg-black rounded-full flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-105 active:scale-95">
         <span className="text-2xl font-bold">→</span>
      </div>
    </div>
  );
};

export const ContentSlide = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative p-20 px-24 flex flex-col overflow-hidden bg-[#FAD4C0]/30"
      style={{ 
        background: 'linear-gradient(180deg, #FDE6D7 0%, #FFEEE4 100%)'
      }}
    >
      <GrainOverlay />
      <GridOverlay />
      
      <div className="mb-12 relative z-10">
        <h1 className="text-[6.5rem] font-black text-[#1B1B1B] leading-[0.95] tracking-tighter mb-8">
          {(content as any).mainTitle || content.title}
        </h1>
        <div className="inline-block px-8 py-4 rounded-full border border-black/10 bg-white/40 backdrop-blur-sm text-xl font-bold text-zinc-800">
          {content.subtitle}
        </div>
      </div>

      <div className="flex flex-col gap-10 relative z-10">
        {((content as any).steps || []).slice(0, 4).map((item: any, i: number) => (
          <div key={i} className="flex gap-8 items-center">
            <SquircleIcon className="w-24 shadow-2xl border-black/5 bg-white">
               {item.icon ? (
                 <img src={item.icon} className="w-12 h-12 object-contain" alt="" />
               ) : (
                 <div className="w-12 h-12 rounded bg-zinc-100" />
               )}
            </SquircleIcon>
            <div className="flex flex-col">
              <h3 className="text-4xl font-black text-[#1B1B1B]">{item.title}</h3>
              <p className="text-2xl font-medium text-zinc-500/80">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-12 left-24 text-zinc-400 font-bold text-base z-10">{content.footerNote || 'Your Name'}</div>
      <div className="absolute bottom-12 right-24 text-zinc-400 font-bold text-base z-10">{content.footerCTA || 'website.com/'}</div>
    </div>
  );
};

export const CTA = ({ content, globalSettings }: { content: CTAContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-20 overflow-hidden"
       style={{ background: '#FAD4C0' }}
    >
      <GrainOverlay />
      <GridOverlay />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.2)] border border-black/5 overflow-hidden">
        {/* Banner Area */}
        <div className="h-48 bg-[#0A192F] relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 grid grid-cols-10 gap-2 p-4">
              {Array.from({length: 40}).map((_, i) => (
                <div key={i} className="aspect-square bg-white rounded-lg blur-[2px]" />
              ))}
           </div>
           <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
              <span className="text-white font-black text-2xl tracking-tight leading-tight">{(content as any).bannerText || 'Join the Community'}</span>
           </div>
           <div className="absolute top-4 left-4 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{(content as any).logoText || 'LOGOTEXT'}</span>
           </div>
        </div>

        {/* Profile Details */}
        <div className="px-12 pb-14 pt-20 relative bg-white">
          <div className="absolute -top-20 left-12 w-40 h-40 rounded-full border-[10px] border-white overflow-hidden bg-zinc-200 shadow-2xl">
             {content.profileImage ? (
               <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-zinc-100 font-bold text-zinc-400">?</div>
             )}
          </div>

          <div className="flex justify-between items-start">
             <div className="max-w-[65%]">
                <h2 className="text-4xl font-black text-zinc-900 mb-2">{content.name || 'Your Name'}</h2>
                <p className="text-xl font-bold text-zinc-600 leading-tight">{content.title || 'Your Title'}</p>
                <p className="text-base text-blue-600 font-bold mt-4">Barcelona, Catalonia, Spain · Contact info</p>
             </div>
             
             <div className="flex flex-col gap-3 scale-100 origin-top-right">
                <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 p-3 rounded-xl shadow-sm">
                   <div className="w-8 h-8 bg-zinc-300 rounded-md" />
                   <span className="text-[13px] font-bold text-zinc-800">Company</span>
                </div>
                <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 p-3 rounded-xl shadow-sm">
                   <div className="w-8 h-8 bg-zinc-300 rounded-md" />
                   <span className="text-[13px] font-bold text-zinc-800">University</span>
                </div>
             </div>
          </div>

          {/* Follow Button */}
          <div className="absolute -bottom-10 right-12 flex flex-col items-center">
             <button className="bg-[#BA1A1A] text-white px-12 py-6 rounded-3xl text-3xl font-black shadow-[0_20px_40px_rgba(186,26,26,0.4)] hover:scale-105 transition-transform active:scale-95 border-4 border-white">
                {content.ctaText || '+Follow'}
             </button>
             <div className="mt-4 text-zinc-400 animate-bounce">
                <span className="text-2xl">🖱️</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
