// Removed unused LucideIcon

export type SlideType = 'INTRO' | 'CONTENT' | 'CTA';

export interface GlobalSettings {
  brandColor: string;
  accentColor: string;
  fontFamily: string;
  backgroundColor: string;
  aspectRatio: 'square' | 'portrait';
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

export interface IntroContent {
  type: 'INTRO';
  profileImage?: string;
  name?: string;
  tagline?: string;
  companyLogo?: string;
  headline: string;
  subheadline?: string;
  description?: string;
  badgeText?: string;
  pillText?: string;
  backgroundPattern?: 'gradient' | 'solid' | 'dots' | 'waves';
  stats?: Array<{ label: string; value: string }>;
  logos?: string[];
  layout?: 'centered' | 'split' | 'header-focus' | 'profile-emphasis';
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
}

export type SlideContent = IntroContent | ContentSlideContent | CTAContent;

export interface Slide {
  id: string;
  type: SlideType;
  order: number;
  content: SlideContent;
}

export interface CarouselProject {
  id: string;
  name: string;
  themeId: string;
  slides: Slide[];
  globalSettings: GlobalSettings;
}

export type FieldType = 'text' | 'textarea' | 'image' | 'steps' | 'bullets' | 'tools' | 'workflow' | 'color' | 'list' | 'icon-grid';

export interface FieldConfig {
  key: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  components: {
    INTRO: React.ComponentType<{ content: IntroContent; globalSettings: GlobalSettings }>;
    CONTENT: React.ComponentType<{ content: ContentSlideContent; globalSettings: GlobalSettings }>;
    CTA: React.ComponentType<{ content: CTAContent; globalSettings: GlobalSettings }>;
  };
  editorConfig: {
    INTRO: {
      fields: FieldConfig[];
      defaultContent: Partial<IntroContent>;
    };
    CONTENT: {
      fields: FieldConfig[];
      defaultContent: Partial<ContentSlideContent>;
    };
    CTA: {
      fields: FieldConfig[];
      defaultContent: Partial<CTAContent>;
    };
  };
  defaultColors: {
    primary: string;
    accent: string;
    background: string;
  };
}
