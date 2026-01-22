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
    components: {
      INTRO: SalesStack.Intro,
      CONTENT: SalesStack.ContentSlide,
      CTA: SalesStack.CTA,
    },
    editorConfig: {
      INTRO: {
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
      CONTENT: {
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
      CTA: {
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
    defaultColors: {
      primary: '#BA1A1A',
      accent: '#FAD4C0',
      background: '#FFEDE1',
    },
    description: 'Michel Lieben / ColdIQ inspired aesthetic with grainy backgrounds and squircles.',
    preview: '/previews/sales-stack.png',
  },
};

export const getTheme = (id: string): Theme => {
  return ThemeRegistry[id] || ThemeRegistry['execution-steps'];
};
