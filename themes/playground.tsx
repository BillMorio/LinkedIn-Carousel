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

// Glass panel component
const GlassPanel = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`backdrop-blur-3xl bg-white/5 border border-white/10 ${className}`}>
    {children}
  </div>
);

// Technical label component
const TechLabel = ({ text, className = "" }: { text: string, className?: string }) => (
  <span className={`text-[9px] font-black uppercase tracking-[0.3em] text-white/40 ${className}`}>
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
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* Hero Image with Dark Gradient Overlay */}
      <div className="absolute inset-0">
        {content.heroImage ? (
          <>
            <img 
              src={content.heroImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
              style={getStyle(content.styles, 'heroImage')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black" />
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
          className="text-[7rem] font-black text-white leading-[0.9] tracking-tighter mb-6"
          style={getStyle(content.styles, 'mainTitle')}
        >
          {content.mainTitle || content.headline || 'Your Magazine Title'}
        </h1>
        <p 
          className="text-3xl font-bold text-white/60 max-w-3xl"
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
    <div className="w-full h-full relative flex bg-black overflow-hidden">
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
            className="text-6xl font-black text-white leading-tight tracking-tighter mb-8"
            style={getStyle(content.styles, 'mainTitle')}
          >
            {content.mainTitle || content.headline || 'Your Story Begins'}
          </h1>
          <p 
            className="text-2xl font-medium text-white/50 leading-relaxed"
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

// ============================================================================
// CONTENT VARIANTS
// ============================================================================

export const HeroFeatureContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      <GridPattern />

      {/* Hero Image Top (40% height) */}
      <div className="absolute top-0 left-0 right-0 h-[40%]">
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
          <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-black" />
        )}
      </div>

      {/* Content Section */}
      <div className="absolute top-[35%] left-0 right-0 bottom-0 p-16">
        {/* Title */}
        <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="mb-12">
          <LimeAccent className="w-20 h-1 mb-6" />
          <h1 
            className="text-6xl font-black text-white tracking-tighter mb-4"
            style={getStyle(content.styles, 'mainTitle')}
          >
            {content.mainTitle || content.title}
          </h1>
          {content.subtitle && (
            <p className="text-xl text-white/40 font-medium" style={getStyle(content.styles, 'subtitle')}>
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Steps/Items */}
        <div style={getSectionStyle(content.sectionStyles, 'body')} className="flex flex-col gap-6">
          {(content.steps || []).slice(0, 3).map((step, i) => (
            <GlassPanel key={i} className="p-6 rounded-[2rem] flex items-start gap-6 hover:bg-white/10 transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#BFFF00]/20 border border-[#BFFF00] flex items-center justify-center">
                  <span className="text-[#BFFF00] font-black text-xl">{i + 1}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-2">{step.title}</h3>
                <p className="text-lg text-white/50 font-medium">{step.description}</p>
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
    <div className="w-full h-full relative bg-black p-16 overflow-hidden">
      <GridPattern />

      {/* Title */}
      <div style={getSectionStyle(content.sectionStyles, 'titleSection')} className="mb-12">
        <TechLabel text="FEATURED CONTENT" className="mb-4 block" />
        <h1 
          className="text-6xl font-black text-white tracking-tighter mb-2"
          style={getStyle(content.styles, 'mainTitle')}
        >
          {content.mainTitle || content.title}
        </h1>
        <LimeAccent className="w-32 h-1" />
      </div>

      {/* 2x2 Grid */}
      <div style={getSectionStyle(content.sectionStyles, 'body')} className="grid grid-cols-2 gap-6 h-[calc(100%-200px)]">
        {(content.steps || []).slice(0, 4).map((step, i) => (
          <div key={i} className="relative group overflow-hidden rounded-[2rem]">
            {/* Image */}
            {step.icon ? (
              <img src={step.icon} alt={step.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-100 group-hover:opacity-90 transition-opacity" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#BFFF00]/20 border border-[#BFFF00] flex items-center justify-center">
                  <span className="text-[#BFFF00] font-black text-sm">{i + 1}</span>
                </div>
                <LimeAccent className="flex-1 h-px" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{step.title}</h3>
              <p className="text-sm text-white/60 font-medium">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// CTA VARIANTS
// ============================================================================

export const ProfileSpotlightCTA = ({ content, globalSettings }: { content: CTAContent, globalSettings: GlobalSettings }) => {
  return (
    <div className="w-full h-full relative bg-black overflow-hidden flex items-center justify-center">
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
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black" />
        )}
      </div>

      <GridPattern />

      {/* CTA Card */}
      <div style={getSectionStyle(content.sectionStyles, 'body')} className="relative z-10">
        <GlassPanel className="p-16 rounded-[4rem] max-w-2xl text-center">
          {/* Profile Image */}
          {content.profileImage && (
            <div className="mx-auto mb-8 w-32 h-32 rounded-full overflow-hidden border-4 border-[#BFFF00] shadow-2xl shadow-[#BFFF00]/20" style={getStyle(content.styles, 'profileImage')}>
              <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Name & Title */}
          <div style={getSectionStyle(content.sectionStyles, 'header')} className="mb-8">
            <h2 
              className="text-5xl font-black text-white mb-3"
              style={getStyle(content.styles, 'name')}
            >
              {content.name || 'Your Name'}
            </h2>
            <p 
              className="text-xl text-white/50 font-bold"
              style={getStyle(content.styles, 'title')}
            >
              {content.title || 'Your Title'}
            </p>
          </div>

          {/* CTA Message */}
          <p 
            className="text-3xl font-black text-white mb-10 leading-tight"
            style={getStyle(content.styles, 'ctaText')}
          >
            {content.ctaText || 'Let\'s connect and create something amazing'}
          </p>

          {/* CTA Button */}
          <button 
            className="bg-[#BFFF00] text-black px-12 py-6 rounded-full text-2xl font-black hover:scale-105 transition-transform shadow-2xl shadow-[#BFFF00]/30"
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
    <div className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden">
      <GridPattern />

      {/* Centered Content */}
      <div className="relative z-10 max-w-2xl text-center px-16">
        {/* Profile Image */}
        {content.profileImage && (
          <div className="mx-auto mb-12 relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl" style={getStyle(content.styles, 'profileImage')}>
              <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <LimeAccent className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1" />
          </div>
        )}

        {/* Name */}
        <div style={getSectionStyle(content.sectionStyles, 'header')} className="mb-6">
          <h2 
            className="text-6xl font-black text-white mb-4 tracking-tighter"
            style={getStyle(content.styles, 'name')}
          >
            {content.name || 'Your Name'}
          </h2>
          <TechLabel text={content.title || 'CREATOR / BUILDER'} className="text-[11px]" />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-px bg-white/10" />
          <TechLabel text="CALL TO ACTION" />
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* CTA Message */}
        <p 
          className="text-4xl font-black text-white mb-12 leading-tight"
          style={getStyle(content.styles, 'ctaText')}
        >
          {content.ctaText || 'Join me on this journey'}
        </p>

        {/* CTA Button */}
        <GlassPanel className="inline-block px-12 py-6 rounded-full hover:bg-white/10 transition-all group cursor-pointer">
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
