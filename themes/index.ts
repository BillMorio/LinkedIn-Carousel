import { Theme } from '../types/carousel';
import * as ExecutionSteps from './execution-steps';
import * as ToolWorkflow from './tool-workflow';
import * as SalesStack from './sales-stack';
import * as Playground from './playground';

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
  'playground': {
    id: 'playground',
    name: 'Playground',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    description: 'Cinematic, high-tech magazine-style layouts with hero images, glassmorphism, and electric lime accents.',
    preview: '/previews/playground.png',
    variants: {
      INTRO: [
        {
          id: 'standard',
          name: 'Standard',
          purpose: 'Text-only introduction without images.',
          bestUsedFor: 'Clean, focused introductions emphasizing the headline and message.',
          component: Playground.StandardIntro,
          editorConfig: {
            fields: [
              { key: 'header', type: 'section-controls', label: 'Top Badge Section' },
              { key: 'badgeText', type: 'text', label: 'Badge Text' },
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Main Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
            ],
            defaultContent: {
              headline: 'FUTURE IS NOW',
              mainTitle: 'FUTURE IS NOW',
              subtitle: 'Building tomorrow\'s innovations with cutting-edge technology',
              badgeText: 'PLAYGROUND',
            },
          },
        },
        {
          id: 'headshot',
          name: 'Headshot',
          purpose: 'Large circular profile image with headline.',
          bestUsedFor: 'Personal brand introductions with strong visual identity.',
          component: Playground.HeadshotIntro,
          editorConfig: {
            fields: [
              { key: 'header', type: 'section-controls', label: 'Top Badge Section' },
              { key: 'badgeText', type: 'text', label: 'Badge Text' },
              { key: 'profileSection', type: 'section-controls', label: 'Profile Image Section' },
              { key: 'profileImage', type: 'image', label: 'Profile Photo', hasStyleControls: true },
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Main Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Tagline/Description', hasStyleControls: true },
            ],
            defaultContent: {
              headline: 'Your Name',
              mainTitle: 'Your Name',
              badgeText: 'PLAYGROUND',
            },
          },
        },
        {
          id: 'image',
          name: 'Image',
          purpose: 'Hero image with title overlay and placement controls.',
          bestUsedFor: 'Magazine-style covers with dramatic imagery.',
          component: Playground.ImageIntro,
          editorConfig: {
            fields: [
              { key: 'heroImage', type: 'image', label: 'Hero Image', hasStyleControls: true },
              { 
                key: 'imagePlacement', 
                type: 'select', 
                label: 'Image Placement',
                options: [
                  { value: 'top', label: 'Top (Cover Style)' },
                  { value: 'right', label: 'Right Side' },
                ],
              },
              { key: 'header', type: 'section-controls', label: 'Badge Section' },
              { key: 'badgeText', type: 'text', label: 'Badge Text' },
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Main Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
            ],
            defaultContent: {
              headline: 'Your Title',
              mainTitle: 'Your Title',
              badgeText: 'PLAYGROUND',
              imagePlacement: 'top',
            },
          },
        }
      ],
      CONTENT: [
        {
          id: 'text-only',
          name: 'Text Only',
          purpose: 'Pure text content without images.',
          bestUsedFor: 'Information-dense content, lists, or step-by-step guides.',
          component: Playground.TextOnlyContent,
          editorConfig: {
            fields: [
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
              { key: 'body', type: 'section-controls', label: 'Content Items' },
              { key: 'steps', type: 'steps', label: 'Content Items (max 4)' },
              { key: 'footerNote', type: 'text', label: 'Footer Left' },
              { key: 'footerCTA', type: 'text', label: 'Footer Right' },
            ],
            defaultContent: {
              title: 'Content Title',
              mainTitle: 'Content Title',
              steps: [
                { title: 'Item 1', description: 'Description here' },
              ],
            },
          },
        },
        {
          id: 'text-image',
          name: 'Text + Image',
          purpose: 'Content with supporting hero image.',
          bestUsedFor: 'Feature highlights with visual context.',
          component: Playground.HeroFeatureContent,
          editorConfig: {
            fields: [
              { key: 'heroImage', type: 'image', label: 'Hero Image (Top)', hasStyleControls: true },
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
              { key: 'body', type: 'section-controls', label: 'Content Items' },
              { key: 'steps', type: 'steps', label: 'Feature Items (max 3)' },
              { key: 'footerNote', type: 'text', label: 'Footer Left' },
              { key: 'footerCTA', type: 'text', label: 'Footer Right' },
            ],
            defaultContent: {
              title: 'Feature Title',
              mainTitle: 'Feature Title',
              steps: [
                { title: 'Feature 1', description: 'Description here' },
              ],
            },
          },
        },
        {
          id: 'image-only',
          name: 'Image Only',
          purpose: 'Image showcase with minimal text.',
          bestUsedFor: 'Visual portfolios, galleries, or image-heavy content.',
          component: Playground.ImageOnlyContent,
          editorConfig: {
            fields: [
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
              { 
                key: 'gridLayout', 
                type: 'select', 
                label: 'Grid Layout',
                options: [
                  { value: '2x2', label: '2x2 Grid (4 images)' },
                  { value: '3-col', label: '3 Columns (6 images)' },
                  { value: 'showcase', label: 'Single Showcase' },
                ],
              },
              { key: 'body', type: 'section-controls', label: 'Grid Layout' },
              { key: 'steps', type: 'steps', label: 'Images (use icon field for image URLs)' },
            ],
            defaultContent: {
              title: 'Image Gallery',
              mainTitle: 'Image Gallery',
              gridLayout: '2x2',
              steps: [
                { title: 'Image 1', description: 'Description', icon: '' },
              ],
            },
          },
        }
      ],
      CTA: [
        {
          id: 'profile-spotlight',
          name: 'Profile Spotlight',
          purpose: 'Personal brand CTA with hero image.',
          bestUsedFor: 'Driving engagement with a dramatic background and centered CTA.',
          component: Playground.ProfileSpotlightCTA,
          editorConfig: {
            fields: [
              { key: 'heroImage', type: 'image', label: 'Background Hero Image', hasStyleControls: true },
              { key: 'profileImage', type: 'image', label: 'Profile Photo', hasStyleControls: true },
              { key: 'header', type: 'section-controls', label: 'Profile Section' },
              { key: 'name', type: 'text', label: 'Name', required: true, hasStyleControls: true },
              { key: 'title', type: 'text', label: 'Title/Role', hasStyleControls: true },
              { key: 'body', type: 'section-controls', label: 'CTA Section' },
              { key: 'ctaText', type: 'text', label: 'CTA Message', hasStyleControls: true },
              { key: 'ctaButtonText', type: 'text', label: 'Button Text', hasStyleControls: true },
            ],
            defaultContent: {
              name: 'Your Name',
              ctaText: 'Let\'s connect and create something amazing',
              ctaButtonText: 'FOLLOW NOW',
            },
          },
        },
        {
          id: 'minimal-tech',
          name: 'Minimal Tech',
          purpose: 'Clean, focused CTA.',
          bestUsedFor: 'Direct call-to-action with minimal distractions.',
          component: Playground.MinimalTechCTA,
          editorConfig: {
            fields: [
              { key: 'profileImage', type: 'image', label: 'Profile Photo', hasStyleControls: true },
              { key: 'header', type: 'section-controls', label: 'Profile Section' },
              { key: 'name', type: 'text', label: 'Name', required: true, hasStyleControls: true },
              { key: 'title', type: 'text', label: 'Title/Role' },
              { key: 'ctaText', type: 'text', label: 'CTA Message', hasStyleControls: true },
              { key: 'ctaButtonText', type: 'text', label: 'Button Text', hasStyleControls: true },
            ],
            defaultContent: {
              name: 'Your Name',
              title: 'CREATOR / BUILDER',
              ctaText: 'Join me on this journey',
              ctaButtonText: 'CONNECT NOW →',
            },
          },
        }
      ],
    },
    defaultColors: {
      primary: '#BFFF00',
      accent: '#FFFFFF',
      background: '#000000',
    },
  },
};

export const getTheme = (id: string): Theme => {
  return ThemeRegistry[id] || ThemeRegistry['execution-steps'];
};
