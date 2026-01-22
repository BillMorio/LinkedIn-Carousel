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

const SquircleIcon = ({ children, className = "", style = {} }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
  <div className={`aspect-square w-16 bg-white rounded-[1.25rem] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.15)] flex items-center justify-center border border-black/5 ${className}`} style={style}>
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

const getStyle = (styles: any, key: string) => {
  const s = styles?.[key];
  if (!s) return {};
  const style: React.CSSProperties = {};
  if (s.fontSize) style.fontSize = s.fontSize;
  if (s.fontWeight) style.fontWeight = s.fontWeight;
  if (s.fontFamily) style.fontFamily = s.fontFamily;
  if (s.letterSpacing) style.letterSpacing = s.letterSpacing;
  if (s.fontStyle) style.fontStyle = s.fontStyle;
  if (s.color) style.color = s.color;
  if (s.width) style.width = s.width;
  if (s.height) style.height = s.height;
  if (s.lineHeight) style.lineHeight = s.lineHeight;
  return style;
};

const getSectionStyle = (sectionStyles: any, key: string) => {
  const s = sectionStyles?.[key];
  if (!s) return {};
  const style: React.CSSProperties = {};
  if (s.marginTop) style.marginTop = s.marginTop;
  if (s.marginBottom) style.marginBottom = s.marginBottom;
  if (s.paddingTop) style.paddingTop = s.paddingTop;
  if (s.paddingBottom) style.paddingBottom = s.paddingBottom;
  if (s.paddingLeft) style.paddingLeft = s.paddingLeft;
  if (s.paddingRight) style.paddingRight = s.paddingRight;
  if (s.opacity !== undefined) style.opacity = s.opacity;
  if (s.backgroundColor) style.backgroundColor = s.backgroundColor;
  if (s.borderRadius) style.borderRadius = s.borderRadius;
  if (s.gap) style.gap = s.gap;
  return style;
};

export const ModernSquircleIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative p-16 px-20 flex flex-col justify-center overflow-hidden" 
      style={{ 
        background: 'linear-gradient(135deg, #FFEDE1 0%, #FAAE87 100%)'
      }}
    >
      <GrainOverlay />
      <GridOverlay />
      
      {/* Header Section */}
      <div style={getSectionStyle(content.sectionStyles, 'header')} className="absolute top-0 left-0 w-full z-20 pointer-events-none">
        {/* Profile Tag (Hanging from top) */}
        <div className="absolute top-0 left-12 flex flex-col bg-[#FAD4C0] px-6 pb-8 pt-6 rounded-b-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border-x border-b border-white/40 items-center min-w-[140px] pointer-events-auto">
           <div className="rounded-full overflow-hidden bg-zinc-200 border-4 border-white shadow-xl mb-4"
             style={{ width: '5rem', height: '5rem', ...getStyle(content.styles, 'profileImage') }}
           >
               {content.profileImage ? (
                 <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-zinc-100 font-bold text-zinc-400">?</div>
               )}
           </div>
           <span className="text-base font-bold text-zinc-900 leading-tight" style={getStyle(content.styles, 'name')}>{content.name || 'Your Name'}</span>
           <span className="text-[11px] text-zinc-500 font-medium tracking-tight mt-0.5" style={getStyle(content.styles, 'tagline')}>{content.tagline || 'website.com'}</span>
        </div>

        <div className="absolute top-16 right-16 text-[14px] font-black text-zinc-800 tracking-[0.4em] uppercase opacity-70 pointer-events-auto">
          {(content as any).logoText || 'COLDIQ'}
        </div>
      </div>

      {/* Title Section */}
      <div style={{ marginTop: '10rem', ...getSectionStyle(content.sectionStyles, 'titleSection') }} className="relative z-10">
        <h1 className="text-[8.5rem] font-black text-[#1B1B1B] leading-[0.85] tracking-tighter" style={getStyle(content.styles, 'mainTitle')}>
          {(content as any).mainTitle?.split(' ').map((word: string, i: number) => (
            <span key={i} className="block">{word}</span>
          )) || 'Sales Technology Stack'}
        </h1>
      </div>

      {/* Subtitle Section */}
      <div style={{ marginTop: '2rem', ...getSectionStyle(content.sectionStyles, 'subtitleSection') }} className="relative z-10">
        <h2 className="text-[3.5rem] font-bold text-zinc-500/80 tracking-tight leading-none mb-4" style={getStyle(content.styles, 'subtitle')}>
          {content.subtitle || content.subheadline || 'Build your'}
        </h2>
      </div>

      {/* Footer (Logo) Section */}
      <div style={getSectionStyle(content.sectionStyles, 'footer')} className="mt-auto pl-2 relative z-10">
        <div 
          className="flex flex-wrap" 
          style={{ 
            gap: content.sectionStyles?.footer?.itemGap || '1rem',
            display: content.sectionStyles?.footer?.layout === 'grid' ? 'grid' : 'flex',
            flexDirection: content.sectionStyles?.footer?.layout === 'row' ? 'row' : 'row',
            flexWrap: content.sectionStyles?.footer?.layout === 'wrap' ? 'wrap' : 'nowrap',
            gridTemplateColumns: content.sectionStyles?.footer?.layout === 'grid' ? `repeat(auto-fill, minmax(${content.sectionStyles?.footer?.itemSize || '80px'}, 1fr))` : 'none',
            maxWidth: '800px'
          }}
        >
          {(content.logos || []).map((logo, idx) => (
            <div key={idx} className="relative group">
              <SquircleIcon 
                className="bg-white shadow-xl border-white"
                style={{ 
                  width: content.sectionStyles?.footer?.itemSize || '5rem',
                  height: content.sectionStyles?.footer?.itemSize || '5rem'
                }}
              >
                <img src={logo} className="w-1/2 h-1/2 object-contain" alt="" />
              </SquircleIcon>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow Pill Bottom Right */}
      <div className="absolute bottom-16 right-16 w-20 h-10 bg-black rounded-full flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-105 active:scale-95">
         <span className="text-2xl font-bold">→</span>
      </div>
    </div>
  );
};

export const MinimalSplitIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative flex overflow-hidden bg-white" 
      style={{ 
        fontFamily: globalSettings.fontFamily 
      }}
    >
      <div className="w-1/2 h-full bg-[#1B1B1B] p-20 flex flex-col justify-between text-white relative">
         <div className="text-sm font-black tracking-widest uppercase text-white/40">Introduction</div>
         <div style={getSectionStyle(content.sectionStyles, 'titleSection')}>
            <h1 className="text-[6rem] font-black leading-none tracking-tighter" style={getStyle(content.styles, 'mainTitle')}>
              {content.mainTitle || 'Sales Tech Stack'}
            </h1>
         </div>
         <div style={getSectionStyle(content.sectionStyles, 'subtitleSection')}>
            <p className="text-2xl font-medium text-white/60 max-w-sm" style={getStyle(content.styles, 'subtitle')}>
              {content.subtitle || content.subheadline}
            </p>
         </div>
      </div>
      <div className="w-1/2 h-full p-20 flex flex-col justify-center items-center bg-[#F8F8F8] relative">
         <div className="absolute top-12 right-12 flex items-center gap-3">
            <span className="text-sm font-bold text-black/20 tracking-wider">COLDIQ.COM</span>
         </div>
         <div style={getSectionStyle(content.sectionStyles, 'header')} className="flex flex-col items-center">
            <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl mb-8 border-8 border-white bg-zinc-100" style={getStyle(content.styles, 'profileImage')}>
               {content.profileImage ? (
                 <img src={content.profileImage} className="w-full h-full object-cover" alt="" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center font-bold text-zinc-300">?</div>
               )}
            </div>
            <div className="text-center">
               <h3 className="text-3xl font-black text-black" style={getStyle(content.styles, 'name')}>{content.name || 'Michel Lieben'}</h3>
               <p className="text-lg font-bold text-black/40 uppercase tracking-widest mt-1" style={getStyle(content.styles, 'tagline')}>{content.tagline || 'Cold Outreach Expert'}</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export const ModernSquircleContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative p-20 px-24 flex flex-col overflow-hidden bg-[#FAD4C0]/30"
      style={{ 
        background: 'linear-gradient(180deg, #FDE6D7 0%, #FFEEE4 100%)'
      }}
    >
      <GrainOverlay />
      <GridOverlay />
      
      {/* Header Section */}
      <div style={getSectionStyle(content.sectionStyles, 'header')} className="relative z-10">
        <div style={getSectionStyle(content.sectionStyles, 'titleSection')}>
          <h1 className="text-[6.5rem] font-black text-[#1B1B1B] leading-[0.95] tracking-tighter mb-8" style={getStyle(content.styles, 'mainTitle')}>
            {(content as any).mainTitle || content.title}
          </h1>
        </div>
        <div style={getSectionStyle(content.sectionStyles, 'subtitleSection')}>
          <div className="inline-block px-8 py-4 rounded-full border border-black/10 bg-white/40 backdrop-blur-sm text-xl font-bold text-zinc-800" style={getStyle(content.styles, 'subtitle')}>
            {content.subtitle}
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div style={getSectionStyle(content.sectionStyles, 'body')} className="flex flex-col gap-10 relative z-10">
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

export const MinimalDetailsContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative p-20 flex flex-col bg-white" style={{ fontFamily: globalSettings.fontFamily }}>
       <div className="flex items-center gap-4 mb-16">
          <div className="w-3 h-12 bg-black rounded-full" />
          <h2 className="text-6xl font-black tracking-tighter" style={getStyle(content.styles, 'mainTitle')}>{content.title}</h2>
       </div>

       <div className="grid grid-cols-2 gap-10">
          {((content as any).steps || []).map((item: any, i: number) => (
            <div key={i} className="bg-zinc-50 rounded-[2.5rem] p-10 border-2 border-zinc-100 flex flex-col gap-6">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl font-black shadow-sm">
                  {i + 1}
               </div>
               <div className="flex flex-col gap-2">
                  <h3 className="text-3xl font-black">{item.title}</h3>
                  <p className="text-xl font-bold text-zinc-400 leading-tight">{item.description}</p>
               </div>
            </div>
          ))}
       </div>
    </div>
  )
}

export const ModernSquircleCTA = ({ content, globalSettings }: { content: CTAContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-20 overflow-hidden"
       style={{ background: '#FAD4C0' }}
    >
      <GrainOverlay />
      <GridOverlay />

      <div style={getSectionStyle(content.sectionStyles, 'header')} className="relative z-10 w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.2)] border border-black/5 overflow-hidden">
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

        {/* Body Section */}
        <div style={getSectionStyle(content.sectionStyles, 'body')} className="px-12 pb-14 pt-20 relative bg-white">
          <div className="absolute -top-20 left-12 w-40 h-40 rounded-full border-[10px] border-white overflow-hidden bg-zinc-200 shadow-2xl">
             {content.profileImage ? (
               <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-zinc-100 font-bold text-zinc-400">?</div>
             )}
          </div>

          <div className="flex justify-between items-start">
             <div className="max-w-[65%]">
                <h2 className="text-4xl font-black text-zinc-900 mb-2" style={getStyle(content.styles, 'name')}>{content.name || 'Your Name'}</h2>
                <p className="text-xl font-bold text-zinc-600 leading-tight" style={getStyle(content.styles, 'title')}>{content.title || 'Your Title'}</p>
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
             <button 
               className="bg-[#BA1A1A] text-white px-12 py-6 rounded-3xl text-3xl font-black shadow-[0_20px_40px_rgba(186,26,26,0.4)] hover:scale-105 transition-transform active:scale-95 border-4 border-white"
               style={getStyle((content as any).styles, 'ctaText')}
             >
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

export const MinimalCardCTA = ({ content, globalSettings }: { content: CTAContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-20 bg-black text-white" style={{ fontFamily: globalSettings.fontFamily }}>
       <div className="w-full max-w-lg flex flex-col items-center text-center">
          <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-white/10 mb-10 bg-zinc-800">
             {content.profileImage ? (
               <img src={content.profileImage} className="w-full h-full object-cover" alt="" />
             ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-white/20">?</div>
             )}
          </div>
          <h2 className="text-6xl font-black mb-2">{content.name}</h2>
          <p className="text-2xl font-bold text-white/40 mb-16">{content.title}</p>
          
          <div className="w-full py-8 border-y border-white/10 flex flex-col gap-4">
             <span className="text-sm font-black uppercase tracking-[0.3em] text-white/30">Call to action</span>
             <h3 className="text-4xl font-black italic" style={getStyle(content.styles, 'ctaText')}>{content.ctaText}</h3>
          </div>

          <button className="mt-16 bg-white text-black px-16 py-6 rounded-full text-2xl font-black hover:scale-105 transition-transform">
             Follow @{content.name?.split(' ')[0] || 'User'}
          </button>
       </div>
    </div>
  )
}
