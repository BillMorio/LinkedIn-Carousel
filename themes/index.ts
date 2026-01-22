import { Theme } from '../types/carousel';
import * as ExecutionSteps from './execution-steps';
import * as ToolWorkflow from './tool-workflow';
import * as SalesStack from './sales-stack';

export const ThemeRegistry: Record<string, Theme> = {
  'execution-steps': ExecutionSteps.ExecutionStepsTheme,
  'tool-workflow': ToolWorkflow.ToolWorkflowTheme,
  'sales-stack': {
    id: 'sales-stack',
    name: 'Sales Stack',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop',
    description: 'Michel Lieben / ColdIQ inspired aesthetic with grainy backgrounds and squircles.',
    preview: '/previews/sales-stack.png',
    variants: {
      INTRO: [
        {
          id: 'modern-squircle',
          name: 'Modern Squircle',
          purpose: 'High-impact hook for LinkedIn carousels.',
          bestUsedFor: 'Broad topic introductions with visual branding and tech stack logos.',
          component: SalesStack.ModernSquircleIntro,
          editorConfig: {
            fields: [
              { key: 'header', type: 'section-controls', label: 'Header Section' },
              { key: 'profileImage', type: 'image', label: 'Profile Photo', hasStyleControls: true },
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Main Title', required: true, hasStyleControls: true },
              { key: 'subtitleSection', type: 'section-controls', label: 'Subtitle Section' },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
              { key: 'footer', type: 'section-controls', label: 'Logo Grid Section' },
              { key: 'logos', type: 'icon-grid', label: 'Tech Stack Logos' },
            ],
            defaultContent: {
              mainTitle: 'Sales Technology Stack',
              subheadline: 'Build your',
              logos: [],
            },
          },
        },
        {
          id: 'minimal-split',
          name: 'Minimal Split',
          purpose: 'Clean, professional introduction.',
          bestUsedFor: 'Personal brand intros where the profile photo is as important as the title.',
          component: SalesStack.MinimalSplitIntro,
          editorConfig: {
            fields: [
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Main Title', required: true, hasStyleControls: true },
              { key: 'subtitleSection', type: 'section-controls', label: 'Subtitle Section' },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
              { key: 'header', type: 'section-controls', label: 'Profile Controls' },
              { key: 'name', type: 'text', label: 'Name', hasStyleControls: true },
              { key: 'tagline', type: 'text', label: 'Tagline', hasStyleControls: true },
              { key: 'profileImage', type: 'image', label: 'Profile Photo', hasStyleControls: true },
            ],
            defaultContent: {
              mainTitle: 'Building My Stack',
              subtitle: 'Here is how I do it in 2024',
            },
          },
        }
      ],
      CONTENT: [
        {
          id: 'modern-squircle',
          name: 'Modern Squircle',
          purpose: 'Showcasing a list of 3-4 tools or steps.',
          bestUsedFor: 'Tools lists, step-by-step guides, or feature summaries with high visual punch.',
          component: SalesStack.ModernSquircleContent,
          editorConfig: {
            fields: [
              { key: 'header', type: 'section-controls', label: 'Header Section' },
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Slide Title', required: true, hasStyleControls: true },
              { key: 'subtitleSection', type: 'section-controls', label: 'Subtitle Section' },
              { key: 'subtitle', type: 'text', label: 'Pill Note', hasStyleControls: true },
              { key: 'body', type: 'section-controls', label: 'Tech Items Section' },
              { key: 'steps', type: 'steps', label: 'Tech Items' },
            ],
            defaultContent: {
              mainTitle: 'Data Enrichment',
              subtitle: 'Second, you might want to enrich more data points',
              steps: [
                { title: 'Prospeo', description: 'starts at $39/mo' },
              ],
            },
          },
        },
        {
          id: 'minimal-details',
          name: 'Minimal Details',
          purpose: 'Information-dense grid layout.',
          bestUsedFor: 'Comparing detailed features or listing 4 items in a compact space.',
          component: SalesStack.MinimalDetailsContent,
          editorConfig: {
            fields: [
              { key: 'title', type: 'text', label: 'Title', required: true, hasStyleControls: true },
              { key: 'steps', type: 'steps', label: 'List Items' },
            ],
            defaultContent: {
              title: 'Key Features',
              steps: [
                { title: 'Feature 1', description: 'Description' },
              ],
            },
          },
        }
      ],
      CTA: [
        {
          id: 'modern-squircle',
          name: 'Modern Squircle',
          purpose: 'Classic LinkedIn profile banner style CTA.',
          bestUsedFor: 'Driving followers and building community credibility.',
          component: SalesStack.ModernSquircleCTA,
          editorConfig: {
            fields: [
              { key: 'header', type: 'section-controls', label: 'Profile Header' },
              { key: 'titleSection', type: 'section-controls', label: 'Name Section' },
              { key: 'name', type: 'text', label: 'Name', required: true, hasStyleControls: true },
              { key: 'subtitleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'title', type: 'text', label: 'Title/Role', hasStyleControls: true },
              { key: 'body', type: 'section-controls', label: 'CTA Section' },
              { key: 'ctaText', type: 'text', label: 'CTA Text', hasStyleControls: true },
            ],
            defaultContent: {
              name: 'Michel Lieben',
              title: 'Founder / CEO @ ColdIQ',
              ctaText: 'Follow for more insights',
            },
          },
        },
        {
          id: 'minimal-card',
          name: 'Minimal Card',
          purpose: 'Direct, centered call-to-action.',
          bestUsedFor: 'Driving a specific action like "Book a Call" or "Download Guide" with a personal touch.',
          component: SalesStack.MinimalCardCTA,
          editorConfig: {
            fields: [
              { key: 'name', type: 'text', label: 'Name', required: true, hasStyleControls: true },
              { key: 'title', type: 'text', label: 'Title', hasStyleControls: true },
              { key: 'ctaText', type: 'text', label: 'CTA Text', hasStyleControls: true },
              { key: 'profileImage', type: 'image', label: 'Profile Photo', hasStyleControls: true },
            ],
            defaultContent: {
              name: 'Michel Lieben',
              title: 'CEO @ ColdIQ',
              ctaText: 'Let\'s build together',
            },
          },
        }
      ],
    },
    defaultColors: {
      primary: '#BA1A1A',
      accent: '#FAD4C0',
      background: '#FFEDE1',
    },
  },
};

export const getTheme = (id: string): Theme => {
  return ThemeRegistry[id] || ThemeRegistry['execution-steps'];
};
