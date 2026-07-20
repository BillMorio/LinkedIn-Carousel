import React from 'react';
import { GlobalSettings } from '../types/carousel';

// ============================================================================
// KINGDOM CREATIVE THEME
// Inspired by "the.creativegeorge" — near-black slides, film grain + faint grid,
// vermilion-orange accents, molten-glow hero imagery bleeding off the bottom edge,
// heavy condensed display type + clean body sans + handwritten script flourishes.
// ============================================================================

const ACCENT = '#FF3B00';
const BG = '#0A0A0A';
const F_DISPLAY = 'var(--font-display), "Arial Narrow", sans-serif';
const F_BODY = 'var(--font-body), system-ui, sans-serif';
const F_SCRIPT = 'var(--font-script), cursive';

// ---- style helpers (per-element / per-section overrides) -------------------
const getStyle = (styles: any, key: string): React.CSSProperties => {
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

const getSectionStyle = (sectionStyles: any, key: string): React.CSSProperties => {
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
  return style;
};

// ---- shared chrome ---------------------------------------------------------
const NOISE =
  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';

const GrainTexture = () => (
  <div
    className="absolute inset-0 pointer-events-none z-50 opacity-[0.10]"
    style={{ backgroundImage: NOISE, backgroundRepeat: 'repeat', backgroundSize: '220px 220px' }}
  />
);

const GridLines = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.05]"
    style={{
      backgroundImage:
        'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
      backgroundSize: '92px 92px',
    }}
  />
);

const Wordmark = ({ content }: { content: any }) => (
  <div className="absolute top-[56px] left-[64px] right-[64px] z-30 flex items-center gap-5">
    <span className="whitespace-nowrap font-extrabold tracking-tight" style={{ fontFamily: F_BODY, fontSize: '1.55rem' }}>
      <span className="text-white">{content.brandName || 'the.creative'}</span>
      <span style={{ color: ACCENT }}>{content.brandAccent || 'george'}</span>
    </span>
    <div className="flex-1 h-[2px]" style={{ background: `linear-gradient(to right, ${ACCENT}88, rgba(255,255,255,0.15))` }} />
  </div>
);

const SwipeArrow = ({ color = '#FFFFFF', className = '' }: { color?: string; className?: string }) => (
  <svg className={className} width="190" height="44" viewBox="0 0 190 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 22 H168 M146 7 L172 22 L146 37" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-full relative overflow-hidden" style={{ background: BG }}>
    <GridLines />
    {children}
    <GrainTexture />
  </div>
);

// ============================================================================
// INTRO — Cover
// Giant condensed headline at top; full-width molten hero image bleeding off
// the bottom edge (overlaps lower half of the headline).
// ============================================================================
export const CoverIntro = ({ content }: { content: any; globalSettings: GlobalSettings }) => (
  <Frame>
    {/* Hero image — full width, anchored to bottom */}
    <div className="absolute bottom-0 left-0 right-0 h-[58%] z-10">
      {content.heroImage && (
        <>
          <img src={content.heroImage} alt="" className="w-full h-full object-cover object-center" style={getStyle(content.styles, 'heroImage')} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 24%, transparent 82%, #0A0A0A 100%)' }} />
        </>
      )}
    </div>

    <Wordmark content={content} />

    {/* Headline */}
    <div className="absolute top-[150px] left-[64px] right-[64px] z-20" style={getSectionStyle(content.sectionStyles, 'titleSection')}>
      <h1 className="uppercase" style={{ fontFamily: F_DISPLAY, fontSize: '5.4rem', lineHeight: 1.0, letterSpacing: '0.01em', color: '#fff', ...getStyle(content.styles, 'mainTitle') }}>
        {content.mainTitle || 'HOW I COME UP WITH CONCEPTS AS A '}
        <span style={{ color: ACCENT }}>{content.highlight || 'KINGDOM CREATIVE'}</span>
        {content.scriptAccent && (
          <span className="ml-5 inline-block" style={{ fontFamily: F_SCRIPT, fontSize: '3.4rem', lineHeight: 1, color: '#fff', letterSpacing: 0, transform: 'translateY(0.1em)' }}>
            {content.scriptAccent}
          </span>
        )}
      </h1>
      <div className="mt-14">
        <SwipeArrow />
      </div>
    </div>
  </Frame>
);

// ============================================================================
// CONTENT — Glow Object  (covers "3. Mindset", "4. Mastery", body+emphasis)
// Text upper-left; molten object bleeding off the bottom-right.
// ============================================================================
export const GlowObjectContent = ({ content }: { content: any; globalSettings: GlobalSettings }) => (
  <Frame>
    {/* Image bottom-right bleed */}
    <div className="absolute bottom-0 right-0 w-[64%] h-[70%] z-10">
      {content.heroImage && (
        <>
          <img src={content.heroImage} alt="" className="w-full h-full object-cover object-bottom" style={getStyle(content.styles, 'heroImage')} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0A0A0A 0%, transparent 38%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, transparent 72%, #0A0A0A 100%)' }} />
        </>
      )}
    </div>

    <Wordmark content={content} />

    {/* Text */}
    <div className="absolute top-[195px] left-[64px] right-[64px] z-20 max-w-[640px]" style={getSectionStyle(content.sectionStyles, 'titleSection')}>
      {(content.number || content.title) && (
        <h2 className="mb-9" style={{ fontFamily: F_BODY, fontSize: '2.7rem', color: '#fff', ...getStyle(content.styles, 'title') }}>
          {content.number && <span style={{ fontWeight: 300 }}>{content.number}. </span>}
          <span style={{ fontWeight: 700 }}>{content.title}</span>
        </h2>
      )}
      <div className="flex flex-col gap-7">
        {content.body && (
          <p style={{ fontFamily: F_BODY, fontSize: '1.7rem', lineHeight: 1.45, fontWeight: 400, color: 'rgba(255,255,255,0.86)', ...getStyle(content.styles, 'body') }}>{content.body}</p>
        )}
        {content.emphasis && (
          <p style={{ fontFamily: F_BODY, fontSize: '1.7rem', lineHeight: 1.45, fontWeight: 700, color: '#fff' }}>{content.emphasis}</p>
        )}
        {content.body2 && (
          <p style={{ fontFamily: F_BODY, fontSize: '1.7rem', lineHeight: 1.45, fontWeight: 400, color: 'rgba(255,255,255,0.86)' }}>{content.body2}</p>
        )}
      </div>
      <div className="mt-12">
        <SwipeArrow />
      </div>
    </div>
  </Frame>
);

// ============================================================================
// CONTENT — Question  (script line + asterisk bullet list)
// Text upper-left; scene image as a full-width bottom band.
// ============================================================================
export const QuestionContent = ({ content }: { content: any; globalSettings: GlobalSettings }) => (
  <Frame>
    <div className="absolute bottom-0 left-0 right-0 h-[55%] z-10">
      {content.heroImage && (
        <>
          <img src={content.heroImage} alt="" className="w-full h-full object-cover object-bottom" style={getStyle(content.styles, 'heroImage')} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, transparent 58%, #0A0A0A 100%)' }} />
        </>
      )}
    </div>

    <Wordmark content={content} />

    <div className="absolute top-[195px] left-[64px] right-[64px] z-20" style={getSectionStyle(content.sectionStyles, 'titleSection')}>
      {content.body && (
        <p className="max-w-[640px]" style={{ fontFamily: F_BODY, fontSize: '1.8rem', lineHeight: 1.4, fontWeight: 400, color: 'rgba(255,255,255,0.92)', ...getStyle(content.styles, 'body') }}>{content.body}</p>
      )}
      {content.scriptLine && (
        <p className="mt-6" style={{ fontFamily: F_SCRIPT, fontSize: '2.9rem', color: '#fff' }}>{content.scriptLine}</p>
      )}
      <div className="mt-7 flex flex-col gap-3.5">
        {(content.steps || []).map((s: any, i: number) => (
          <div key={i} className="flex items-center gap-3.5">
            <span style={{ color: ACCENT, fontSize: '1.4rem', lineHeight: 1 }}>✷</span>
            <span className="italic" style={{ fontFamily: F_BODY, fontSize: '1.5rem', fontWeight: 500, color: '#fff' }}>{s.title}</span>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <SwipeArrow />
      </div>
    </div>
  </Frame>
);

// ============================================================================
// CONTENT — Reference  ("Check out my previous post" + rotated polaroid)
// ============================================================================
export const ReferenceContent = ({ content }: { content: any; globalSettings: GlobalSettings }) => (
  <Frame>
    <Wordmark content={content} />

    <div className="absolute top-[185px] left-[64px] z-20 max-w-[560px]" style={getSectionStyle(content.sectionStyles, 'titleSection')}>
      <h2 style={{ fontFamily: F_DISPLAY, fontSize: '4.6rem', lineHeight: 0.96, color: '#fff', ...getStyle(content.styles, 'title') }}>
        {content.title || 'Kindly Check Out My Previous Post For Part 2'}
      </h2>
      <div className="mt-12">
        <SwipeArrow color={ACCENT} />
      </div>
    </div>

    {/* Rotated polaroid */}
    <div className="absolute z-10" style={{ bottom: '120px', right: '76px', transform: 'rotate(-8deg)' }}>
      <div className="bg-white shadow-2xl" style={{ width: '440px', padding: '16px 16px 60px' }}>
        {content.heroImage ? (
          <img src={content.heroImage} alt="" className="w-full object-cover" style={{ height: '440px', ...getStyle(content.styles, 'heroImage') }} />
        ) : (
          <div className="w-full bg-zinc-800" style={{ height: '440px' }} />
        )}
      </div>
    </div>
  </Frame>
);

// ============================================================================
// CTA — Outro  (series wrap-up + wide bottom scene band, no swipe arrow)
// ============================================================================
export const OutroCTA = ({ content }: { content: any; globalSettings: GlobalSettings }) => (
  <Frame>
    <div className="absolute bottom-0 left-0 right-0 h-[48%] z-10">
      {content.heroImage && (
        <>
          <img src={content.heroImage} alt="" className="w-full h-full object-cover object-center" style={getStyle(content.styles, 'heroImage')} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, transparent 62%, #0A0A0A 100%)' }} />
        </>
      )}
    </div>

    <Wordmark content={content} />

    <div className="absolute top-[230px] left-[64px] right-[64px] z-20 max-w-[660px]" style={getSectionStyle(content.sectionStyles, 'titleSection')}>
      {content.body && (
        <p style={{ fontFamily: F_BODY, fontSize: '1.9rem', lineHeight: 1.4, fontWeight: 400, color: 'rgba(255,255,255,0.9)', ...getStyle(content.styles, 'body') }}>{content.body}</p>
      )}
      <p className="mt-9" style={{ fontFamily: F_BODY, fontSize: '2.1rem', lineHeight: 1.35, color: '#fff', ...getStyle(content.styles, 'ctaText') }}>
        <span style={{ fontWeight: 800 }}>{content.ctaHighlight || 'Comment Below'}</span>{' '}
        {content.ctaText || 'on what really stood out for you in this series'}
      </p>
    </div>
  </Frame>
);
