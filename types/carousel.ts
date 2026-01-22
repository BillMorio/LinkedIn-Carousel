// Removed unused LucideIcon

export type SlideType = 'INTRO' | 'CONTENT' | 'CTA';

export interface GlobalSettings {
  brandColor: string;
  accentColor: string;
  fontFamily: string;
  backgroundColor: string;
  aspectRatio: 'square' | 'portrait';
  dimensions?: { width: number; height: number };
}

export interface ProfileInfo {
  name?: string;
  tagline?: string;
  profileImage?: string;
  companyLogo?: string;
  handle?: string;
}

export interface Step {
  number?: number;
  title: string;
  description: string;
  icon?: string;
}

export interface Tool {
  name: string;
  icon: string;
  color?: string;
}

export interface WorkflowStep {
  step: string;
  description?: string;
  arrow?: boolean;
}

export interface BulletPoint {
  text: string;
  icon?: string;
  emphasis?: boolean;
}

export interface ElementStyle {
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  fontStyle?: 'normal' | 'italic';
  color?: string;
  width?: string;
  height?: string;
  opacity?: number;
}

export interface SectionStyle {
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  opacity?: number;
  backgroundColor?: string;
  borderRadius?: string;
  gap?: string;
  layout?: 'grid' | 'row' | 'stack' | 'wrap';
  itemGap?: string;
  itemSize?: string;
}

export interface SectionConfig {
  id: string;
  label: string;
}

export interface IntroContent {
  type: 'INTRO';
  profileImage?: string;
  name?: string;
  tagline?: string;
  companyLogo?: string;
  headline: string;
  subheadline?: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  pillText?: string;
  backgroundPattern?: 'gradient' | 'solid' | 'dots' | 'waves';
  stats?: Array<{ label: string; value: string }>;
  logos?: string[];
  layout?: 'centered' | 'split' | 'header-focus' | 'profile-emphasis';
  mainTitle?: string;
  styles?: Record<string, ElementStyle>;
  sectionStyles?: Record<string, SectionStyle>;
}

export interface ContentSlideContent {
  type: 'CONTENT';
  pillText?: string;
  title: string;
  subtitle?: string;
  categoryBadge?: string;
  body?: string;
  steps?: Step[];
  bulletPoints?: BulletPoint[];
  keyValue?: Array<{ key: string; value: string }>;
  quote?: {
    text: string;
    author: string;
    role?: string;
  };
  tools?: Tool[];
  workflow?: WorkflowStep[];
  illustration?: string;
  footerNote?: string;
  footerCTA?: string;
  layout?: 'steps' | 'bullets' | 'workflow' | 'paragraph' | 'split' | 'quote';
  mainTitle?: string;
  styles?: Record<string, ElementStyle>;
  sectionStyles?: Record<string, SectionStyle>;
}

export interface CTAContent {
  type: 'CTA';
  profileImage?: string;
  name?: string;
  title?: string;
  company?: string;
  companyLogo?: string;
  handle?: string;
  socialLinks?: Array<{
    platform: 'linkedin' | 'twitter' | 'instagram' | 'website';
    url: string;
    handle?: string;
  }>;
  ctaText: string;
  ctaButtonText?: string;
  actionUrl?: string;
  secondaryCTA?: string;
  qrCode?: string;
  testimonial?: {
    text: string;
    author: string;
  };
  achievements?: string[];
  layout?: 'profile-centered' | 'split-screen' | 'card-style' | 'minimal';
  styles?: Record<string, ElementStyle>;
  sectionStyles?: Record<string, SectionStyle>;
}

export type SlideContent = IntroContent | ContentSlideContent | CTAContent;

export interface Slide {
  id: string;
  type: SlideType;
  order: number;
  content: SlideContent;
  variantId?: string;
  aiContext?: {
    purpose?: string;
    bestUsedFor?: string;
    recommendedDimensions?: { width: number; height: number };
  };
}

export interface CarouselProject {
  id: string;
  name: string;
  themeId: string;
  slides: Slide[];
  globalSettings: GlobalSettings;
}

export type FieldType = 'text' | 'textarea' | 'image' | 'steps' | 'bullets' | 'tools' | 'workflow' | 'color' | 'list' | 'icon-grid' | 'font-controls' | 'image-size' | 'section-controls';

export interface FieldConfig {
  key: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  hasStyleControls?: boolean;
}

export interface ThemeVariant {
  id: string;
  name: string;
  purpose?: string;
  bestUsedFor?: string;
  component: React.ComponentType<{ content: any; globalSettings: GlobalSettings }>;
  editorConfig: {
    fields: FieldConfig[];
    sections?: SectionConfig[];
    defaultContent: any;
  };
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  thumbnail?: string;
  variants: Record<SlideType, ThemeVariant[]>;
  defaultColors: {
    primary: string;
    accent: string;
    background: string;
  };
}
