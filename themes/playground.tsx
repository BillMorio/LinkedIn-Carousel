import React from 'react';
import { IntroContent, ContentSlideContent, CTAContent, GlobalSettings } from '../types/carousel';

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

// Grid pattern overlay for tech aesthetic
const GridPattern = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-[0.03]" 
    style={{ 
      backgroundImage: `
        linear-gradient(to right, #BFFF00 1px, transparent 1px),
        linear-gradient(to bottom, #BFFF00 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }}
  />
);

// Grainy gradient background for intro cards
const GrainyGradientBg = () => (
  <>
    <div 
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(circle at 20% 50%, rgba(6, 78, 59, 0.8) 0%, rgba(0, 0, 0, 0.95) 50%), radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.4) 0%, rgba(0, 0, 0, 0.95) 50%), #000000',
      }}
    />
    <div 
      className="absolute inset-0 opacity-[0.15]"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}
    />
  </>
);

// Glass panel component
const GlassPanel = ({ children, className = "", style = {} }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
  <div className={`backdrop-blur-3xl bg-white/5 border border-white/10 ${className}`} style={style}>
    {children}
  </div>
);

// Technical label component
const TechLabel = ({ text, className = "", style = {} }: { text: string, className?: string, style?: React.CSSProperties }) => (
  <span 
    className={`text-[9px] font-black uppercase tracking-[0.3em] text-white/40 ${className}`}
    style={style}
  >
    {text}
  </span>
);

// Lime accent bar
const LimeAccent = ({ className = "" }: { className?: string }) => (
  <div className={`bg-[#BFFF00] ${className}`} />
);

// Style helper functions
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
  if (s.opacity !== undefined) style.opacity = s.opacity;
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

// ============================================================================
// INTRO VARIANTS
// ============================================================================

export const MagazineCoverIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Grainy Gradient Background */}
      <GrainyGradientBg />
      
      {/* Hero Image with Dark Gradient Overlay */}
      <div className="absolute inset-0">
        {content.heroImage && (
          <>
            <img 
              src={content.heroImage} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-40"
              style={getStyle(content.styles, 'heroImage')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </>
        )}
      </div>

      <GridPattern />

      {/* Top Badge */}
      <div style={getSectionStyle(content.sectionStyles, 'header')} className="absolute top-12 left-12 z-20">
        <GlassPanel className="px-6 py-3 rounded-full">
          <TechLabel text={content.badgeText || 'PLAYGROUND'} />
        </GlassPanel>
      </div>

      {/* Profile Corner */}
      <div className="absolute top-12 right-12 z-20">
        <GlassPanel className="flex items-center gap-4 px-6 py-4 rounded-[2rem]">
          {content.profileImage && (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#BFFF00]" style={getStyle(content.styles, 'profileImage')}>
              <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="text-white font-black text-sm" style={getStyle(content.styles, 'name')}>{content.name || 'Your Name'}</p>
            <TechLabel text={content.tagline || 'CREATOR'} />
          </div>
        </GlassPanel>
      </div>

      {/* Main Title Overlay (Bottom Third) */}
      <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="absolute bottom-0 left-0 right-0 p-16 z-10">
        <LimeAccent className="w-24 h-1 mb-8" />
        <h1 
          className="text-[7rem] font-black leading-[0.9] tracking-tighter mb-6 bg-clip-text text-transparent break-words w-full"
          style={{
            ...getStyle(content.styles, 'mainTitle'),
            backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
          }}
        >
          {content.mainTitle || content.headline || 'Your Magazine Title'}
        </h1>
        <p 
          className="text-3xl font-bold text-white/60 max-w-3xl break-words"
          style={getStyle(content.styles, 'subtitle')}
        >
          {content.subtitle || content.subheadline || 'Supporting headline goes here'}
        </p>
      </div>
    </div>
  );
};

export const CinematicSplitIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative flex overflow-hidden">
      <GrainyGradientBg />
      <GridPattern />

      {/* Left: Hero Image (60%) */}
      <div className="w-[60%] h-full relative">
        {content.heroImage ? (
          <>
            <img 
              src={content.heroImage} 
              alt="Hero" 
              className="w-full h-full object-cover"
              style={getStyle(content.styles, 'heroImage')}
            />
            <LimeAccent className="absolute right-0 top-0 bottom-0 w-1" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
        )}
      </div>

      {/* Right: Content (40%) */}
      <div className="w-[40%] h-full relative flex flex-col justify-center p-16">
        {/* Floating Profile Badge */}
        <div style={getSectionStyle(content.sectionStyles, 'header')} className="absolute top-12 right-12">
          <GlassPanel className="flex items-center gap-3 px-5 py-3 rounded-full">
            {content.profileImage && (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#BFFF00]" style={getStyle(content.styles, 'profileImage')}>
                <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <TechLabel text={content.name || 'CREATOR'} />
          </GlassPanel>
        </div>

        {/* Main Content */}
        <div style={getSectionStyle(content.sectionStyles, 'titleSection')}>
          <TechLabel text="INTRODUCTION" className="mb-6 block" />
          <h1 
            className="text-6xl font-black leading-tight tracking-tighter mb-8 bg-clip-text text-transparent break-words w-full"
            style={{
              ...getStyle(content.styles, 'mainTitle'),
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
            }}
          >
            {content.mainTitle || content.headline || 'Your Story Begins'}
          </h1>
          <p 
            className="text-2xl font-medium text-white/50 leading-relaxed break-words max-w-full"
            style={getStyle(content.styles, 'subtitle')}
          >
            {content.subtitle || content.subheadline || 'A cinematic introduction to your content'}
          </p>
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-16 left-16">
          <LimeAccent className="w-16 h-1" />
        </div>
      </div>
    </div>
  );
};

// Standard Intro - Text only, no images
export const StandardIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <GrainyGradientBg />
      <GridPattern />

      {/* Top Badge */}
      <div style={getSectionStyle(content.sectionStyles, 'header')} className="absolute top-12 left-12 z-20">
        <GlassPanel className="px-6 py-3 rounded-full">
          <TechLabel text={content.badgeText || 'PLAYGROUND'} />
        </GlassPanel>
      </div>

      {/* Centered Content */}
      <div className="max-w-4xl text-center px-16 relative z-10">
        <div style={getSectionStyle(content.sectionStyles, 'titleSection')}>
          <TechLabel text="INTRODUCTION" className="mb-8 block" />
          <LimeAccent className="w-32 h-1 mx-auto mb-12" />
          
          <h1 
            className="text-[8rem] font-black leading-[0.85] tracking-tighter mb-12 bg-clip-text text-transparent break-words w-full"
            style={{
              ...getStyle(content.styles, 'mainTitle'),
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
            }}
          >
            {content.mainTitle || content.headline || 'FUTURE IS NOW'}
          </h1>
          
          <p 
            className="text-4xl font-bold text-white/50 leading-tight max-w-3xl mx-auto break-words"
            style={getStyle(content.styles, 'subtitle')}
          >
            {content.subtitle || content.subheadline || 'Building tomorrow\'s innovations with cutting-edge technology'}
          </p>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
        <LimeAccent className="w-24 h-1" />
      </div>
    </div>
  );
};

// Headshot Intro - Large circular profile image + headline
export const HeadshotIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <GrainyGradientBg />
      <GridPattern />

      {/* Top Badge */}
      <div style={getSectionStyle(content.sectionStyles, 'header')} className="absolute top-12 left-12 z-20">
        <GlassPanel className="px-6 py-3 rounded-full">
          <TechLabel text={content.badgeText || 'PLAYGROUND'} />
        </GlassPanel>
      </div>

      {/* Centered Content */}
      <div className="max-w-4xl text-center px-16 relative z-10">
        {/* Large Circular Profile Image */}
        {content.profileImage && (
          <div className="mx-auto mb-16 relative" style={getSectionStyle(content.sectionStyles, 'profileSection')}>
            <div 
              className="w-80 h-80 rounded-full overflow-hidden border-8 border-[#BFFF00] shadow-2xl shadow-[#BFFF00]/20 mx-auto"
              style={getStyle(content.styles, 'profileImage')}
            >
              <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <LimeAccent className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-1" />
          </div>
        )}

        {/* Content */}
        <div style={getSectionStyle(content.sectionStyles, 'titleSection')}>
          <h1 
            className="text-7xl font-black leading-tight tracking-tighter mb-8 bg-clip-text text-transparent break-words w-full"
            style={{
              ...getStyle(content.styles, 'mainTitle'),
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
            }}
          >
            {content.mainTitle || content.headline || content.name || 'Your Name'}
          </h1>
          
          <p 
            className="text-3xl font-bold text-white/50 leading-relaxed break-words max-w-full"
            style={getStyle(content.styles, 'subtitle')}
          >
            {content.subtitle || content.subheadline || content.tagline || 'Your tagline or description'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Emoji Intro - Large emoji centered
export const EmojiIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <GrainyGradientBg />
      <GridPattern />

      {/* Top Badge */}
      <div style={getSectionStyle(content.sectionStyles, 'header')} className="absolute top-12 left-12 z-20">
        <GlassPanel className="px-6 py-3 rounded-full">
          <TechLabel text={content.badgeText || 'PLAYGROUND'} />
        </GlassPanel>
      </div>

      {/* Centered Content */}
      <div className="max-w-4xl text-center px-16 relative z-10">
        {/* Emoji Section */}
        <div className="mb-12 text-[12rem]" style={getStyle(content.styles, 'emoji')}>
          {content.description || '🚀'}
        </div>

        {/* Content */}
        <div style={getSectionStyle(content.sectionStyles, 'titleSection')}>
          <h1 
            className="text-7xl font-black leading-tight tracking-tighter mb-8 bg-clip-text text-transparent break-words w-full"
            style={{
              ...getStyle(content.styles, 'mainTitle'),
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
            }}
          >
            {content.mainTitle || content.headline || 'Your Headline'}
          </h1>
          
          <p 
            className="text-3xl font-bold text-white/50 leading-relaxed break-words max-w-full"
            style={getStyle(content.styles, 'subtitle')}
          >
            {content.subtitle || content.subheadline || 'Supporting message here'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Image Intro - Hero image with placement controls (top or right)
export const ImageIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  const imagePlacement = (content as any).imagePlacement || 'top'; // 'top' or 'right'

  if (imagePlacement === 'right') {
    // Right-side image layout
    return (
      <div className="w-full h-full relative flex overflow-hidden">
        <GrainyGradientBg />
        <GridPattern />

        {/* Left: Content (60%) */}
        <div className="w-[60%] h-full relative flex flex-col justify-center p-16">
          <div style={getSectionStyle(content.sectionStyles, 'header')} className="mb-12">
            <GlassPanel className="inline-block px-6 py-3 rounded-full">
              <TechLabel text={content.badgeText || 'PLAYGROUND'} />
            </GlassPanel>
          </div>

          <div style={getSectionStyle(content.sectionStyles, 'titleSection')}>
            <LimeAccent className="w-24 h-1 mb-8" />
            <h1 
              className="text-7xl font-black leading-tight tracking-tighter mb-8 bg-clip-text text-transparent break-words w-full"
              style={{
                ...getStyle(content.styles, 'mainTitle'),
                backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
              }}
            >
              {content.mainTitle || content.headline || 'Your Title'}
            </h1>
            <p 
              className="text-3xl font-bold text-white/50 leading-relaxed max-w-2xl break-words"
              style={getStyle(content.styles, 'subtitle')}
            >
              {content.subtitle || content.subheadline || 'Your message here'}
            </p>
          </div>
        </div>

        {/* Right: Hero Image (40%) */}
        <div className="w-[40%] h-full relative">
          {content.heroImage ? (
            <>
              <LimeAccent className="absolute left-0 top-0 bottom-0 w-1 z-10" />
              <img 
                src={content.heroImage} 
                alt="Hero" 
                className="w-full h-full object-cover"
                style={getStyle(content.styles, 'heroImage')}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-bl from-zinc-800 to-zinc-900" />
          )}
        </div>
      </div>
    );
  }

  // Top image layout (default - similar to MagazineCover)
  return (
    <div className="w-full h-full relative overflow-hidden">
      <GrainyGradientBg />
      
      <div className="absolute inset-0">
        {content.heroImage && (
          <>
            <img 
              src={content.heroImage} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-40"
              style={getStyle(content.styles, 'heroImage')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </>
        )}
      </div>

      <GridPattern />

      <div style={getSectionStyle(content.sectionStyles, 'header')} className="absolute top-12 left-12 z-20">
        <GlassPanel className="px-6 py-3 rounded-full">
          <TechLabel text={content.badgeText || 'PLAYGROUND'} />
        </GlassPanel>
      </div>

      <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="absolute bottom-0 left-0 right-0 p-16 z-10">
        <LimeAccent className="w-24 h-1 mb-8" />
        <h1 
          className="text-[7rem] font-black leading-[0.9] tracking-tighter mb-6 bg-clip-text text-transparent break-words w-full"
          style={{
            ...getStyle(content.styles, 'mainTitle'),
            backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
          }}
        >
          {content.mainTitle || content.headline || 'Your Title'}
        </h1>
        <p 
          className="text-3xl font-bold text-white/60 max-w-3xl break-words"
          style={getStyle(content.styles, 'subtitle')}
        >
          {content.subtitle || content.subheadline || 'Your message here'}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// CONTENT VARIANTS
// ============================================================================

export const HeroFeatureContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <GrainyGradientBg />
      <GridPattern />

      {/* Hero Image Top (40% height) */}
      <div className="absolute top-0 left-0 right-0 h-[40%] z-10">
        {(content as any).heroImage ? (
          <>
            <img 
              src={(content as any).heroImage} 
              alt="Feature" 
              className="w-full h-full object-cover"
              style={getStyle(content.styles, 'heroImage')}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-zinc-900/40 to-black/60" />
        )}
      </div>

      {/* Content Section */}
      <div className="absolute top-[35%] left-0 right-0 bottom-0 p-16 z-20">
        {/* Title */}
        <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="mb-12">
          <LimeAccent className="w-20 h-1 mb-6" />
          <h1 
            className="text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent break-words w-full"
            style={{
              ...getStyle(content.styles, 'mainTitle'),
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
            }}
          >
            {content.mainTitle || content.title}
          </h1>
          {content.subtitle && (
            <p className="text-xl text-white/40 font-medium break-words max-w-full" style={getStyle(content.styles, 'subtitle')}>
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Steps/Items */}
        <div style={getSectionStyle(content.sectionStyles, 'body')} className="flex flex-col gap-6">
          {(content.steps || []).slice(0, 3).map((step, i) => (
            <GlassPanel key={i} className="p-6 rounded-[2.5rem] flex items-start gap-6 hover:bg-white/10 transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#BFFF00]/20 border border-[#BFFF00] flex items-center justify-center">
                  <span className="text-[#BFFF00] font-black text-xl">{i + 1}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-black text-white mb-2 break-words">{step.title}</h3>
                <p className="text-lg text-white/50 font-medium break-words">{step.description}</p>
              </div>
            </GlassPanel>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-16 right-16 flex justify-between items-center">
          <TechLabel text={content.footerNote || 'PLAYGROUND'} />
          <TechLabel text={content.footerCTA || 'CONTINUE'} />
        </div>
      </div>
    </div>
  );
};

export const ImageGridContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative p-16 overflow-hidden">
      <GrainyGradientBg />
      <GridPattern />

      {/* Title */}
      <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="mb-12 relative z-10">
        <TechLabel text="FEATURED CONTENT" className="mb-4 block" />
        <h1 
          className="text-6xl font-black tracking-tighter mb-2 bg-clip-text text-transparent"
          style={{
            ...getStyle(content.styles, 'mainTitle'),
            backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
          }}
        >
          {content.mainTitle || content.title}
        </h1>
        <LimeAccent className="w-32 h-1" />
      </div>

      {/* 2x2 Grid */}
      <div style={getSectionStyle(content.sectionStyles, 'body')} className="grid grid-cols-2 gap-6 h-[calc(100%-250px)] relative z-10">
        {(content.steps || []).slice(0, 4).map((step, i) => (
          <div key={i} className="relative group overflow-hidden rounded-[2.5rem] border border-white/5">
            {/* Image */}
            {step.icon ? (
              <img src={step.icon} alt={step.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-800/40 to-zinc-900/40" />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-100 group-hover:opacity-90 transition-opacity" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#BFFF00]/20 border border-[#BFFF00] flex items-center justify-center">
                  <span className="text-[#BFFF00] font-black text-sm">{i + 1}</span>
                </div>
                <LimeAccent className="flex-1 h-px opacity-30" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight break-words">{step.title}</h3>
              <p className="text-sm text-white/50 font-medium leading-relaxed break-words">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Text-Only Content - No images, pure text layout
export const TextOnlyContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative p-16 overflow-hidden flex flex-col">
      <GrainyGradientBg />
      <GridPattern />

      {/* Title */}
      <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="mb-16 relative z-10">
        <TechLabel text="CONTENT" className="mb-6 block" />
        <LimeAccent className="w-24 h-1 mb-8" />
        <h1 
          className="text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent break-words w-full"
          style={{
            ...getStyle(content.styles, 'mainTitle'),
            backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
          }}
        >
          {content.mainTitle || content.title}
        </h1>
        {content.subtitle && (
          <p className="text-2xl text-white/40 font-medium max-w-2xl break-words" style={getStyle(content.styles, 'subtitle')}>
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Content Items */}
      <div style={getSectionStyle(content.sectionStyles, 'body')} className="flex-1 flex flex-col gap-8 relative z-10">
        {(content.steps || []).slice(0, 4).map((step, i) => (
          <div key={i} className="flex items-start gap-8 group">
            {/* Number Badge */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#BFFF00]/20 border-2 border-[#BFFF00] flex items-center justify-center group-hover:bg-[#BFFF00]/30 transition-all">
                <span className="text-[#BFFF00] font-black text-2xl">{i + 1}</span>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 pt-2 min-w-0">
              <h3 className="text-3xl font-black text-white mb-3 leading-tight tracking-tight break-words">{step.title}</h3>
              <p className="text-xl text-white/50 font-medium leading-relaxed break-words">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 flex justify-between items-center relative z-10">
        <TechLabel text={content.footerNote || 'PLAYGROUND'} />
        <TechLabel text={content.footerCTA || 'CONTINUE'} />
      </div>
    </div>
  );
};

// Image-Only Content - Showcase of images with minimal text
export const ImageOnlyContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  const gridLayout = (content as any).gridLayout || '2x2'; // '2x2', '3-col', or 'showcase'

  if (gridLayout === 'showcase') {
    // Single large showcase image
    return (
      <div className="w-full h-full relative bg-black overflow-hidden">
        <GridPattern />

        {/* Large Showcase Image */}
        <div className="absolute inset-0">
          {(content.steps?.[0]?.icon || (content as any).heroImage) ? (
            <>
              <img 
                src={content.steps?.[0]?.icon || (content as any).heroImage} 
                alt="Showcase" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black" />
          )}
        </div>

        {/* Top Title */}
        <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="absolute top-16 left-16 right-16 z-10">
          <GlassPanel className="inline-block px-8 py-4 rounded-[2rem]">
            <h1 
              className="text-5xl font-black tracking-tighter bg-clip-text text-transparent break-words max-w-full"
              style={{
                ...getStyle(content.styles, 'mainTitle'),
                backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
              }}
            >
              {content.mainTitle || content.title}
            </h1>
          </GlassPanel>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-16 left-16 right-16 z-10">
          <LimeAccent className="w-32 h-1 mb-6" />
          {content.subtitle && (
            <p className="text-3xl font-bold text-white/80 max-w-3xl break-words" style={getStyle(content.styles, 'subtitle')}>
              {content.subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (gridLayout === '3-col') {
    // 3-column grid
    return (
      <div className="w-full h-full relative bg-black p-16 overflow-hidden">
        <GridPattern />

        {/* Title */}
        <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="mb-12">
          <TechLabel text="GALLERY" className="mb-4 block" />
          <h1 
            className="text-6xl font-black tracking-tighter mb-2 bg-clip-text text-transparent break-words w-full"
            style={{
              ...getStyle(content.styles, 'mainTitle'),
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
            }}
          >
            {content.mainTitle || content.title}
          </h1>
          <LimeAccent className="w-32 h-1" />
        </div>

        {/* 3-Column Grid */}
        <div style={getSectionStyle(content.sectionStyles, 'body')} className="grid grid-cols-3 gap-6 h-[calc(100%-200px)]">
          {(content.steps || []).slice(0, 6).map((step, i) => (
            <div key={i} className="relative group overflow-hidden rounded-[2rem]">
              {step.icon ? (
                <img src={step.icon} alt={step.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 min-w-0">
                <LimeAccent className="w-12 h-px mb-3" />
                <h3 className="text-xl font-black text-white break-words">{step.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default 2x2 grid (similar to ImageGridContent)
  return (
    <div className="w-full h-full relative bg-black p-16 overflow-hidden">
      <GridPattern />

      <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="mb-12">
        <TechLabel text="FEATURED" className="mb-4 block" />
        <h1 
          className="text-6xl font-black tracking-tighter mb-2 bg-clip-text text-transparent"
          style={{
            ...getStyle(content.styles, 'mainTitle'),
            backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
          }}
        >
          {content.mainTitle || content.title}
        </h1>
        <LimeAccent className="w-32 h-1" />
      </div>

      <div style={getSectionStyle(content.sectionStyles, 'body')} className="grid grid-cols-2 gap-6 h-[calc(100%-200px)]">
        {(content.steps || []).slice(0, 4).map((step, i) => (
          <div key={i} className="relative group overflow-hidden rounded-[2rem]">
            {step.icon ? (
              <img src={step.icon} alt={step.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#BFFF00]/20 border-2 border-[#BFFF00] flex items-center justify-center">
                  <span className="text-[#BFFF00] font-black text-lg">{i + 1}</span>
                </div>
                <LimeAccent className="flex-1 h-px" />
              </div>
              <h3 className="text-3xl font-black text-white mb-2 break-words">{step.title}</h3>
              {step.description && (
                <p className="text-base text-white/60 font-medium break-words">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tech Timeline Content - Vertical flow with glass cards
export const TechTimelineContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative p-16 overflow-hidden flex flex-col">
      <GrainyGradientBg />
      <GridPattern />

      {/* Title Section */}
      <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="mb-12 relative z-10">
        <TechLabel text="TIMELINE / PHASE" className="mb-4 block" />
        <h1 
          className="text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent break-words w-full"
          style={{
            ...getStyle(content.styles, 'mainTitle'),
            backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
          }}
        >
          {content.mainTitle || content.title}
        </h1>
        <LimeAccent className="w-32 h-1" />
      </div>

      {/* Timeline Section */}
      <div style={getSectionStyle(content.sectionStyles, 'body')} className="flex-1 relative z-10">
        {/* Vertical Line */}
        <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-[#BFFF00] via-[#BFFF00]/20 to-transparent" />
        
        <div className="flex flex-col gap-10">
          {(content.steps || []).slice(0, 4).map((step, i) => (
            <div key={i} className="flex items-start gap-12 relative">
              {/* Dot */}
              <div className="flex-shrink-0 relative z-20">
                <div className="w-20 h-20 rounded-2xl bg-black border-2 border-[#BFFF00] flex items-center justify-center shadow-[0_0_20px_rgba(191,255,0,0.3)]">
                  <span className="text-[#BFFF00] font-black text-2xl">{i + 1}</span>
                </div>
              </div>

              {/* Card */}
              <GlassPanel className="flex-1 p-8 rounded-[2.5rem] border-white/10 hover:border-[#BFFF00]/30 transition-all min-w-0">
                <h3 className="text-3xl font-black text-white mb-3 break-words">{step.title}</h3>
                <p className="text-xl text-white/50 font-medium leading-relaxed break-words">{step.description}</p>
              </GlassPanel>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// Floating Modules Content - Asymmetrical grid of glass cards
export const FloatingModulesContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative p-16 overflow-hidden flex flex-col">
      <GrainyGradientBg />
      <GridPattern />

      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#BFFF00]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="mb-12 relative z-20">
        <TechLabel text="MODULAR OVERVIEW" className="mb-4 block" />
        <h1 
          className="text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent break-words w-full"
          style={{
            ...getStyle(content.styles, 'mainTitle'),
            backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
          }}
        >
          {content.mainTitle || content.title}
        </h1>
        <div className="flex items-center gap-4">
          <LimeAccent className="w-16 h-1" />
          <TechLabel text="UNSTRUCTURED DATA" />
        </div>
      </div>

      {/* Modules Area */}
      <div style={getSectionStyle(content.sectionStyles, 'body')} className="flex-1 relative z-10">
        <div className="grid grid-cols-12 grid-rows-6 gap-6 h-full">
          {(content.steps || []).slice(0, 4).map((step, i) => {
            const gridConfig = [
              'col-span-12 lg:col-span-7 row-span-3',
              'col-span-12 lg:col-span-5 row-span-2',
              'col-span-12 lg:col-span-5 row-span-4',
              'col-span-12 lg:col-span-7 row-span-3'
            ];
            return (
              <GlassPanel key={i} className={`${gridConfig[i]} p-8 rounded-[3rem] border-white/10 hover:bg-white/10 transition-all group overflow-hidden relative`}>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-auto">
                     <TechLabel text={`MODULE 0${i + 1}`} className="text-[#BFFF00]/60 mb-4 block" />
                     <h3 className="text-3xl font-black text-white mb-3 tracking-tight break-words">{step.title}</h3>
                  </div>
                  <p className="text-lg text-white/50 font-medium leading-relaxed break-words line-clamp-3">{step.description}</p>
                </div>
                {/* Visual Accent */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#BFFF00]/5 rounded-full blur-2xl group-hover:bg-[#BFFF00]/20 transition-all" />
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Comparison Versus Content - High-contrast split for comparison
export const ComparisonVersusContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col">
      <GrainyGradientBg />
      <GridPattern />

      {/* Content */}
      <div className="flex-1 flex flex-col p-16 relative z-10">
        <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="mb-16">
          <TechLabel text="COMPARISON / VERSUS" className="mb-4 block" />
          <h1 
            className="text-7xl font-black tracking-tighter bg-clip-text text-transparent break-words w-full"
            style={{
              ...getStyle(content.styles, 'mainTitle'),
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
            }}
          >
            {content.mainTitle || content.title}
          </h1>
        </div>

        <div style={getSectionStyle(content.sectionStyles, 'body')} className="flex-1 flex gap-10 items-center">
          {(content.steps || []).slice(0, 2).map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex-1 h-full flex flex-col justify-center">
                <GlassPanel className={`p-10 rounded-[4rem] h-[500px] flex flex-col border-white/10 ${i === 1 ? 'border-[#BFFF00]/30 shadow-[0_0_50px_rgba(191,255,0,0.05)]' : ''}`}>
                  <div className="mb-8">
                    <span className={`text-sm font-black uppercase tracking-[0.4em] ${i === 0 ? 'text-zinc-500' : 'text-[#BFFF00]'}`}>
                      {i === 0 ? 'TRADITIONAL' : 'OPTIMIZED'}
                    </span>
                    <h3 className="text-4xl font-black text-white mt-4 break-words">{step.title}</h3>
                  </div>
                  <div className="flex-1 flex items-center">
                    <p className="text-2xl text-white/50 font-medium leading-relaxed break-words">{step.description}</p>
                  </div>
                  <div className={`w-full h-1 mt-8 ${i === 0 ? 'bg-zinc-800' : 'bg-[#BFFF00]'}`} />
                </GlassPanel>
              </div>
              {i === 0 && (
                <div className="flex-shrink-0 z-20">
                  <div className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-3xl border border-white/20 flex items-center justify-center">
                    <span className="text-white font-black text-2xl tracking-widest italic">VS</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CTA VARIANTS
// ============================================================================

export const ProfileSpotlightCTA = ({ content, globalSettings }: { content: CTAContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      <GrainyGradientBg />
      {/* Background Hero Image */}
      <div className="absolute inset-0">
        {(content as any).heroImage ? (
          <>
            <img 
              src={(content as any).heroImage} 
              alt="Background" 
              className="w-full h-full object-cover"
              style={getStyle(content.styles, 'heroImage')}
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900/40 to-black/60" />
        )}
      </div>

      <GridPattern />

      {/* CTA Card */}
      <div style={getSectionStyle(content.sectionStyles, 'body')} className="relative z-10 w-full px-16">
        <GlassPanel className="p-16 rounded-[4rem] max-w-2xl mx-auto text-center border-white/20">
          {/* Profile Image */}
          {content.profileImage && (
            <div className="mx-auto mb-8 w-32 h-32 rounded-full overflow-hidden border-4 border-[#BFFF00] shadow-2xl shadow-[#BFFF00]/20" style={getStyle(content.styles, 'profileImage')}>
              <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Name & Title */}
          <div style={getSectionStyle(content.sectionStyles, 'header')} className="mb-8 min-w-0">
            <h2 
              className="text-5xl font-black text-white mb-3 tracking-tighter break-words"
              style={getStyle(content.styles, 'name')}
            >
              {content.name || 'Your Name'}
            </h2>
            <TechLabel 
              text={content.title || 'CREATOR'} 
              className="text-lg opacity-60 break-words"
              style={getStyle(content.styles, 'title')}
            />
          </div>

          {/* CTA Message */}
          <p 
            className="text-4xl font-black text-white mb-10 leading-tight tracking-tight bg-clip-text text-transparent break-words w-full"
            style={{
              ...getStyle(content.styles, 'ctaText'),
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
            }}
          >
            {content.ctaText || 'Let\'s connect and create something amazing'}
          </p>

          {/* CTA Button */}
          <button 
            className="bg-[#BFFF00] text-black px-12 py-6 rounded-full text-2xl font-black hover:scale-105 transition-all shadow-2xl shadow-[#BFFF00]/30 active:scale-95"
            style={getStyle(content.styles, 'ctaButtonText')}
          >
            {content.ctaButtonText || 'FOLLOW NOW'}
          </button>
        </GlassPanel>
      </div>
    </div>
  );
};

export const MinimalTechCTA = ({ content, globalSettings }: { content: CTAContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <GrainyGradientBg />
      <GridPattern />

      {/* Centered Content */}
      <div className="relative z-10 max-w-2xl text-center px-16">
        {/* Profile Image */}
        {content.profileImage && (
          <div className="mx-auto mb-12 relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#BFFF00]/30 shadow-2xl shadow-[#BFFF00]/10" style={getStyle(content.styles, 'profileImage')}>
              <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <LimeAccent className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1" />
          </div>
        )}

        {/* Name */}
        <div style={getSectionStyle(content.sectionStyles, 'header')} className="mb-6 min-w-0">
          <h1 
            className="text-7xl font-black text-white mb-4 tracking-tighter bg-clip-text text-transparent break-words w-full"
            style={{
              ...getStyle(content.styles, 'name'),
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.4))',
            }}
          >
            {content.name || 'Your Name'}
          </h1>
          <TechLabel text={content.title || 'CREATOR / BUILDER'} className="text-[11px] break-words" />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-px bg-[#BFFF00]/20" />
          <TechLabel text="CALL TO ACTION" />
          <div className="flex-1 h-px bg-[#BFFF00]/20" />
        </div>

        {/* CTA Message */}
        <p 
          className="text-4xl font-black text-white mb-12 leading-tight tracking-tight break-words max-w-full"
          style={getStyle(content.styles, 'ctaText')}
        >
          {content.ctaText || 'Join me on this journey'}
        </p>

        {/* CTA Button */}
        <GlassPanel className="inline-block px-12 py-6 rounded-full hover:bg-[#BFFF00]/10 border-[#BFFF00]/20 transition-all group cursor-pointer shadow-2xl shadow-[#BFFF00]/5">
          <span 
            className="text-2xl font-black text-[#BFFF00] group-hover:text-white transition-colors"
            style={getStyle(content.styles, 'ctaButtonText')}
          >
            {content.ctaButtonText || 'CONNECT NOW →'}
          </span>
        </GlassPanel>
      </div>
    </div>
  );
};
