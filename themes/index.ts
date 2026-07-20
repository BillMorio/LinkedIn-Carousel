import { Theme } from '../types/carousel';
import * as ExecutionSteps from './execution-steps';
import * as ToolWorkflow from './tool-workflow';
import * as SalesStack from './sales-stack';
import * as Playground from './playground';
import * as KingdomCreative from './kingdom-creative';

export const ThemeRegistry: Record<string, Theme> = {
  'kingdom-creative': {
    id: 'kingdom-creative',
    name: 'Kingdom Creative',
    thumbnail: '/generated/cover-diamond-hand.png',
    description: 'Dark, cinematic "the.creativegeorge" aesthetic — molten-orange glow imagery on near-black, condensed display type, and handwritten flourishes.',
    preview: '/generated/cover-diamond-hand.png',
    variants: {
      INTRO: [
        {
          id: 'cover',
          name: 'Cover',
          icon: 'LayoutPanelLeft',
          purpose: 'High-impact series opener with a giant condensed headline and full-bleed hero image.',
          bestUsedFor: 'Carousel covers and hooks with a bold statement and one striking visual.',
          component: KingdomCreative.CoverIntro,
          editorConfig: {
            fields: [
              { key: 'brandName', type: 'text', label: 'Handle (white)' },
              { key: 'brandAccent', type: 'text', label: 'Handle (accent)' },
              { key: 'titleSection', type: 'section-controls', label: 'Headline Section' },
              { key: 'mainTitle', type: 'text', label: 'Headline', required: true, hasStyleControls: true },
              { key: 'highlight', type: 'text', label: 'Highlighted Words (orange)' },
              { key: 'scriptAccent', type: 'text', label: 'Script Accent (e.g. Part 3)' },
              { key: 'heroImage', type: 'image', label: 'Hero Image', hasStyleControls: true },
            ],
            defaultContent: {
              brandName: 'the.creative',
              brandAccent: 'george',
              mainTitle: 'HOW I COME UP WITH CONCEPTS AS A ',
              highlight: 'KINGDOM CREATIVE',
              scriptAccent: 'Part 3',
              heroImage: '/generated/cover-diamond-hand.png',
            },
          },
        },
      ],
      CONTENT: [
        {
          id: 'glow-object',
          name: 'Glow Object',
          icon: 'GitCommit',
          purpose: 'Numbered teaching point or body copy with a molten object bleeding off the bottom-right.',
          bestUsedFor: 'Core content slides ("3. Mindset"), body paragraphs, and emphasis statements.',
          component: KingdomCreative.GlowObjectContent,
          editorConfig: {
            fields: [
              { key: 'number', type: 'text', label: 'Number (optional)' },
              { key: 'title', type: 'text', label: 'Title (optional)', hasStyleControls: true },
              { key: 'body', type: 'textarea', label: 'Body' },
              { key: 'emphasis', type: 'textarea', label: 'Bold Emphasis Line (optional)' },
              { key: 'body2', type: 'textarea', label: 'Body (continued, optional)' },
              { key: 'heroImage', type: 'image', label: 'Hero Image', hasStyleControls: true },
              { key: 'titleSection', type: 'section-controls', label: 'Text Block' },
            ],
            defaultContent: {
              brandName: 'the.creative',
              brandAccent: 'george',
              number: '3',
              title: 'Mindset',
              body: 'As creatives, one of the most powerful tools we have at our disposal is our mind.',
              body2: 'What goes through your mind will largely affect the outcome of any project you embark on.',
              heroImage: '/generated/brain-column.png',
            },
          },
        },
        {
          id: 'question',
          name: 'Question',
          icon: 'ArrowLeftRight',
          purpose: 'Pose a question with a script flourish and an asterisk bullet list over a scene image.',
          bestUsedFor: 'Reflective prompts, self-talk lists, and engagement questions.',
          component: KingdomCreative.QuestionContent,
          editorConfig: {
            fields: [
              { key: 'body', type: 'textarea', label: 'Lead-in Question' },
              { key: 'scriptLine', type: 'text', label: 'Script Line (handwritten)' },
              { key: 'steps', type: 'steps', label: 'Bullet Points (use Title field)' },
              { key: 'heroImage', type: 'image', label: 'Scene Image', hasStyleControls: true },
              { key: 'titleSection', type: 'section-controls', label: 'Text Block' },
            ],
            defaultContent: {
              brandName: 'the.creative',
              brandAccent: 'george',
              body: 'What type of mindset do you approach every project you work on:',
              scriptLine: 'Do These Thoughts Ring Aloud?',
              steps: [
                { title: 'Am I Good Enough?', description: '' },
                { title: 'Can I Really Do It?', description: '' },
              ],
              heroImage: '/generated/figure-trail.png',
            },
          },
        },
        {
          id: 'reference',
          name: 'Reference',
          icon: 'Layers',
          purpose: 'Point readers to a previous post with a rotated polaroid of the linked content.',
          bestUsedFor: 'Cross-referencing earlier parts of a series.',
          component: KingdomCreative.ReferenceContent,
          editorConfig: {
            fields: [
              { key: 'title', type: 'text', label: 'Heading', required: true, hasStyleControls: true },
              { key: 'heroImage', type: 'image', label: 'Polaroid Image', hasStyleControls: true },
            ],
            defaultContent: {
              brandName: 'the.creative',
              brandAccent: 'george',
              title: 'Kindly Check Out My Previous Post For Part 2',
              heroImage: '/generated/prev-post-card.png',
            },
          },
        },
      ],
      CTA: [
        {
          id: 'outro',
          name: 'Outro',
          icon: 'User',
          purpose: 'Series wrap-up with a bold CTA over a wide cinematic bottom band.',
          bestUsedFor: 'Closing slides that drive comments, follows, or shares.',
          component: KingdomCreative.OutroCTA,
          editorConfig: {
            fields: [
              { key: 'body', type: 'textarea', label: 'Wrap-up Line' },
              { key: 'ctaHighlight', type: 'text', label: 'CTA Bold Words' },
              { key: 'ctaText', type: 'text', label: 'CTA Remainder', hasStyleControls: true },
              { key: 'heroImage', type: 'image', label: 'Scene Image', hasStyleControls: true },
              { key: 'titleSection', type: 'section-controls', label: 'Text Block' },
            ],
            defaultContent: {
              brandName: 'the.creative',
              brandAccent: 'george',
              body: 'And that is the end of this series. It has been fun all the way.',
              ctaHighlight: 'Comment Below',
              ctaText: 'on what really stood out for you in this series.',
              heroImage: '/generated/outro-leap.png',
            },
          },
        },
      ],
    },
    defaultColors: {
      primary: '#FF3B00',
      accent: '#FF3B00',
      background: '#0A0A0A',
    },
  },
  'execution-steps': {
    ...ExecutionSteps.ExecutionStepsTheme,
    variants: {
      ...ExecutionSteps.ExecutionStepsTheme.variants,
      INTRO: ExecutionSteps.ExecutionStepsTheme.variants.INTRO.map(v => ({
        ...v,
        icon: v.id === 'standard' ? 'Type' : 
              v.id === 'emoji' ? 'Smile' : 
              v.id === 'headshot' ? 'User' : 
              v.id === 'image' ? 'ImageIcon' : undefined
      }))
    }
  },
  'tool-workflow': {
    ...ToolWorkflow.ToolWorkflowTheme,
    variants: {
      ...ToolWorkflow.ToolWorkflowTheme.variants,
      INTRO: ToolWorkflow.ToolWorkflowTheme.variants.INTRO.map(v => ({
        ...v,
        icon: v.id === 'standard' ? 'Type' : 
              v.id === 'emoji' ? 'Smile' : 
              v.id === 'headshot' ? 'User' : 
              v.id === 'image' ? 'ImageIcon' : undefined
      }))
    }
  },
  'sales-stack': {
    id: 'sales-stack',
    name: 'Sales Stack',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop',
    description: 'Michel Lieben / ColdIQ inspired aesthetic with grainy backgrounds and squircles.',
    preview: '/previews/sales-stack.png',
    variants: {
      INTRO: [
        {
          id: 'standard',
          name: 'Standard',
          icon: 'Type',
          purpose: 'Clean text-only introduction with Sales Stack aesthetic.',
          bestUsedFor: 'Direct headlines with high-impact typography.',
          component: SalesStack.StandardIntro,
          editorConfig: {
            fields: [
              { key: 'mainTitle', type: 'text', label: 'Main Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
              { key: 'logoText', type: 'text', label: 'Logo / Brand Text' },
            ],
            defaultContent: {
              mainTitle: 'Sales Technology Stack',
              subtitle: 'The 2024 Blueprint',
              logoText: 'COLDIQ',
            },
          },
        },
        {
          id: 'emoji',
          name: 'Emoji',
          icon: 'Smile',
          purpose: 'Expressive intro with large emoji and squircle background.',
          bestUsedFor: 'Mood-setting openers for sales guides.',
          component: SalesStack.EmojiIntro,
          editorConfig: {
            fields: [
              { key: 'description', type: 'text', label: 'Emoji (e.g. 🚀)', hasStyleControls: true },
              { key: 'mainTitle', type: 'text', label: 'Main Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
            ],
            defaultContent: {
              mainTitle: 'Big Moves',
              description: '🔥',
            },
          },
        },
        {
          id: 'headshot',
          name: 'Headshot',
          icon: 'User',
          purpose: 'Classic circular headshot for personal branding.',
          bestUsedFor: 'Introductions where the face builds immediate trust.',
          component: SalesStack.HeadshotIntro,
          editorConfig: {
            fields: [
              { key: 'profileImage', type: 'image', label: 'Profile Photo', hasStyleControls: true },
              { key: 'name', type: 'text', label: 'Name', hasStyleControls: true },
              { key: 'tagline', type: 'text', label: 'Tagline', hasStyleControls: true },
              { key: 'mainTitle', type: 'text', label: 'Headline', hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
            ],
            defaultContent: {
              name: 'Michel Lieben',
              tagline: 'website.com',
            },
          },
        },
        {
          id: 'image',
          name: 'Image',
          icon: 'ImageIcon',
          purpose: 'Split-screen layout with hero image.',
          bestUsedFor: 'Showcasing product shots or workflow visualizations.',
          component: SalesStack.ImageIntro,
          editorConfig: {
            fields: [
              { key: 'heroImage', type: 'image', label: 'Hero Image', hasStyleControls: true },
              { key: 'mainTitle', type: 'text', label: 'Main Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
            ],
            defaultContent: {
              mainTitle: 'Building Stacks',
              subtitle: 'Step-by-step guide',
            },
          },
        },
        {
          id: 'modern-squircle',
          name: 'Modern Squircle',
          icon: 'LayoutPanelLeft',
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
              subtitle: 'Build your',
              logos: [],
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
          icon: 'Type',
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
              mainTitle: 'FUTURE IS NOW',
              subtitle: 'Building tomorrow\'s innovations with cutting-edge technology',
              badgeText: 'PLAYGROUND',
            },
          },
        },
        {
          id: 'emoji',
          name: 'Emoji',
          icon: 'Smile',
          purpose: 'Fun, expressive intro with a large emoji.',
          bestUsedFor: 'Casual or high-energy carousels with a specific mood.',
          component: Playground.EmojiIntro,
          editorConfig: {
            fields: [
              { key: 'header', type: 'section-controls', label: 'Top Badge Section' },
              { key: 'badgeText', type: 'text', label: 'Badge Text' },
              { key: 'description', type: 'text', label: 'Emoji (e.g. 🚀)', hasStyleControls: true },
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Main Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
            ],
            defaultContent: {
              mainTitle: 'BIG ENERGY',
              description: '🔥',
              badgeText: 'PLAYGROUND',
            },
          },
        },
        {
          id: 'headshot',
          name: 'Headshot',
          icon: 'User',
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
              mainTitle: 'Your Name',
              badgeText: 'PLAYGROUND',
            },
          },
        },
        {
          id: 'image',
          name: 'Image',
          icon: 'ImageIcon',
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
              mainTitle: 'Your Title',
              badgeText: 'PLAYGROUND',
              imagePlacement: 'top',
            },
          },
        },
        {
          id: 'magazine-cover',
          name: 'Magazine Cover',
          icon: 'LayoutPanelLeft',
          purpose: 'High-impact editorial cover.',
          bestUsedFor: 'Dramatic hooks and storytelling openers.',
          component: Playground.MagazineCoverIntro,
          editorConfig: {
            fields: [
              { key: 'heroImage', type: 'image', label: 'Hero Image', hasStyleControls: true },
              { key: 'header', type: 'section-controls', label: 'Badge Section' },
              { key: 'badgeText', type: 'text', label: 'Badge Text' },
              { key: 'profileCorner', type: 'section-controls', label: 'Profile Corner' },
              { key: 'profileImage', type: 'image', label: 'Profile Photo', hasStyleControls: true },
              { key: 'name', type: 'text', label: 'Name', hasStyleControls: true },
              { key: 'tagline', type: 'text', label: 'Tagline', hasStyleControls: true },
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Main Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
            ],
            defaultContent: {
              mainTitle: 'THE FUTURE',
              subtitle: 'How artificial intelligence is changing everything we know about creation.',
              badgeText: 'PLAYGROUND',
              name: 'Creative Director',
              tagline: 'VOLUME 01',
            },
          },
        },
        {
          id: 'cinematic-split',
          name: 'Cinematic Split',
          icon: 'RectangleVertical',
          purpose: 'Modern split-screen layout.',
          bestUsedFor: 'Introductions where the visual and text share equal importance.',
          component: Playground.CinematicSplitIntro,
          editorConfig: {
            fields: [
              { key: 'heroImage', type: 'image', label: 'Hero Image', hasStyleControls: true },
              { key: 'header', type: 'section-controls', label: 'Floating Badge Section' },
              { key: 'name', type: 'text', label: 'Name Label' },
              { key: 'profileImage', type: 'image', label: 'Profile Photo', hasStyleControls: true },
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Main Title', required: true, hasStyleControls: true },
              { key: 'subtitle', type: 'text', label: 'Subtitle', hasStyleControls: true },
            ],
            defaultContent: {
              mainTitle: 'Cinematic Story',
              subtitle: 'A high-end introduction to your latest breakthrough.',
              name: 'STORYTELLER',
            },
          },
        },
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
              mainTitle: 'Content Title',
              steps: [
                { title: 'Item 1', description: 'Description here' },
              ],
            },
          },
        },
        {
          id: 'hero-feature',
          name: 'Hero Feature',
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
              mainTitle: 'Feature Title',
              steps: [
                { title: 'Feature 1', description: 'Description here' },
              ],
            },
          },
        },
        {
          id: 'image-grid',
          name: 'Image Grid',
          purpose: '2x2 grid showcase.',
          bestUsedFor: 'Comparing items or showcasing multiple visual features.',
          component: Playground.ImageGridContent,
          editorConfig: {
            fields: [
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Title', required: true, hasStyleControls: true },
              { key: 'body', type: 'section-controls', label: 'Grid Items' },
              { key: 'steps', type: 'steps', label: 'Grid Items (max 4, use icon field for image URLs)' },
            ],
            defaultContent: {
              mainTitle: 'Visual Showcase',
              steps: [
                { title: 'Item 1', description: 'Details here', icon: '' },
              ],
            },
          },
        },
        {
          id: 'image-only',
          name: 'Image Only',
          purpose: 'Image showcase with minimal text and layout options.',
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
              mainTitle: 'Image Gallery',
              gridLayout: '2x2',
              steps: [
                { title: 'Image 1', description: 'Description', icon: '' },
              ],
            },
          },
        },
        {
          id: 'tech-timeline',
          name: 'Tech Timeline',
          icon: 'GitCommit',
          purpose: 'Vertical flow with neon accents and glass cards.',
          bestUsedFor: 'Sequential steps, roadmaps, or evolution of tech.',
          component: Playground.TechTimelineContent,
          editorConfig: {
            fields: [
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Title', required: true, hasStyleControls: true },
              { key: 'body', type: 'section-controls', label: 'Timeline Section' },
              { key: 'steps', type: 'steps', label: 'Timeline Steps (max 4)' },
            ],
            defaultContent: {
              mainTitle: 'Project Roadmap',
              steps: [
                { title: 'Phase 01', description: 'Initial development and prototyping.' },
                { title: 'Phase 02', description: 'Modular architecture implementation.' },
              ],
            },
          },
        },
        {
          id: 'floating-modules',
          name: 'Floating Modules',
          icon: 'LayoutGrid',
          purpose: 'Non-linear asymmetrical layout for dynamic content.',
          bestUsedFor: 'Highlighting key pillars, features, or unstructured technical tips.',
          component: Playground.FloatingModulesContent,
          editorConfig: {
            fields: [
              { key: 'titleSection', type: 'section-controls', label: 'Header Section' },
              { key: 'mainTitle', type: 'text', label: 'Slide Title', required: true, hasStyleControls: true },
              { key: 'body', type: 'section-controls', label: 'Modules Section' },
              { key: 'steps', type: 'steps', label: 'Modular Items (max 4)' },
            ],
            defaultContent: {
              mainTitle: 'Core Capabilities',
              steps: [
                { title: 'Scalable', description: 'Built on serverless infra.' },
                { title: 'Secure', description: 'End-to-end encryption.' },
              ],
            },
          },
        },
        {
          id: 'comparison-versus',
          name: 'Comparison/Versus',
          icon: 'ArrowLeftRight',
          purpose: 'High-contrast comparison layout for before/after or A/B.',
          bestUsedFor: 'Optimized vs Traditional, Good vs Bad, or feature comparisons.',
          component: Playground.ComparisonVersusContent,
          editorConfig: {
            fields: [
              { key: 'titleSection', type: 'section-controls', label: 'Title Section' },
              { key: 'mainTitle', type: 'text', label: 'Slide Title', required: true, hasStyleControls: true },
              { key: 'body', type: 'section-controls', label: 'Comparison Section' },
              { key: 'steps', type: 'steps', label: 'Comparison Items (max 2)' },
            ],
            defaultContent: {
              mainTitle: 'The Upgrade',
              steps: [
                { title: 'Manual Flow', description: 'Slow, error-prone, high cost.' },
                { title: 'AI Workflow', description: 'Fast, automated, 10x cheaper.' },
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
