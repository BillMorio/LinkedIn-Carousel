import { create } from 'zustand';
import { 
  CarouselProject, 
  Slide, 
  SlideType, 
  SlideContent, 
  GlobalSettings,
  IntroContent,
  ContentSlideContent,
  CTAContent
} from '../types/carousel';
import { ThemeRegistry, getTheme } from '../themes';

interface CarouselState {
  project: CarouselProject;
  activeSlideId: string | null;
  
  // Actions
  setTheme: (themeId: string) => void;
  setActiveSlide: (slideId: string) => void;
  setAspectRatio: (ratio: 'square' | 'portrait') => void;
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  
  addSlide: (type: SlideType, content: Partial<SlideContent>) => void;
  updateSlideContent: (slideId: string, content: Partial<SlideContent>) => void;
  setSlideVariant: (slideId: string, variantId: string) => void;
  removeSlide: (slideId: string) => void;
  reorderSlides: (startIndex: number, endIndex: number) => void;
  
  updateProjectName: (name: string) => void;
  importProject: (projectJson: any) => { success: boolean, error?: string };
  exportProject: () => void;
}

const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  brandColor: '#DC2626',
  accentColor: '#FED7AA',
  fontFamily: 'Inter',
  backgroundColor: '#FFFFFF',
  aspectRatio: 'portrait',
};

const createDefaultSlide = (type: SlideType, order: number, themeId: string, contentOverrides: Partial<SlideContent> = {}): Slide => {
  const id = crypto.randomUUID();
  const theme = getTheme(themeId);
  const variants = theme.variants[type];
  const defaultVariant = variants?.[0];
  
  const baseContent = defaultVariant?.editorConfig.defaultContent || {};
  
  const dynamicContent: SlideContent = {
    ...baseContent,
    ...contentOverrides,
    type,
  } as SlideContent;

  return {
    id,
    type,
    order,
    content: dynamicContent,
    variantId: defaultVariant?.id || 'default',
    aiContext: {
      purpose: defaultVariant?.purpose,
      bestUsedFor: defaultVariant?.bestUsedFor,
    }
  };
};

export const useCarouselStore = create<CarouselState>((set) => ({
  project: {
    id: 'default-project',
    name: 'Untitled Carousel',
    themeId: 'sales-stack',
    slides: [
      createDefaultSlide('INTRO', 0, 'sales-stack', { headline: 'How to Build a Carousel Builder' }),
      createDefaultSlide('CONTENT', 1, 'sales-stack', { title: 'Step 1: Set up the Store' }),
      createDefaultSlide('CTA', 2, 'sales-stack', { ctaText: 'Follow for more dev tips!' }),
    ],
    globalSettings: DEFAULT_GLOBAL_SETTINGS,
  },
  activeSlideId: null,

  setTheme: (themeId) => set((state) => ({
    project: { ...state.project, themeId }
  })),

  setActiveSlide: (slideId) => set({ activeSlideId: slideId }),

  setAspectRatio: (ratio) => set((state) => ({
    project: {
      ...state.project,
      globalSettings: { ...state.project.globalSettings, aspectRatio: ratio }
    }
  })),

  updateGlobalSettings: (settings) => set((state) => ({
    project: {
      ...state.project,
      globalSettings: { ...state.project.globalSettings, ...settings }
    }
  })),

  addSlide: (type, content) => set((state) => {
    const newSlide = createDefaultSlide(type, state.project.slides.length, state.project.themeId, content);
    return {
      project: {
        ...state.project,
        slides: [...state.project.slides, newSlide]
      },
      activeSlideId: newSlide.id
    };
  }),

  updateSlideContent: (slideId, content) => set((state) => ({
    project: {
      ...state.project,
      slides: state.project.slides.map((s) => 
        s.id === slideId ? { ...s, content: { ...s.content, ...content } as SlideContent } : s
      )
    }
  })),

  setSlideVariant: (slideId, variantId) => set((state) => {
    const slide = state.project.slides.find(s => s.id === slideId);
    if (!slide) return state;

    const theme = getTheme(state.project.themeId);
    const variant = theme.variants[slide.type].find(v => v.id === variantId);
    if (!variant) return state;

    return {
      project: {
        ...state.project,
        slides: state.project.slides.map((s) => 
          s.id === slideId ? { 
            ...s, 
            variantId,
            content: { ...variant.editorConfig.defaultContent, ...s.content, type: s.type } as SlideContent,
            aiContext: {
              ...s.aiContext,
              purpose: variant.purpose,
              bestUsedFor: variant.bestUsedFor
            }
          } : s
        )
      }
    };
  }),

  removeSlide: (slideId) => set((state) => {
    const filteredSlides = state.project.slides.filter((s) => s.id !== slideId);
    // Re-order remaining slides
    const reorderedSlides = filteredSlides.map((s, index) => ({ ...s, order: index }));
    
    let nextActiveId = state.activeSlideId;
    if (state.activeSlideId === slideId) {
      nextActiveId = reorderedSlides.length > 0 ? reorderedSlides[0].id : null;
    }

    return {
      project: {
        ...state.project,
        slides: reorderedSlides
      },
      activeSlideId: nextActiveId
    };
  }),

  reorderSlides: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.project.slides);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    return {
      project: {
        ...state.project,
        slides: result.map((s, index) => ({ ...s, order: index }))
      }
    };
  }),

  updateProjectName: (name) => set((state) => ({
    project: { ...state.project, name }
  })),

  importProject: (projectJson: any) => {
    try {
      if (!projectJson || typeof projectJson !== 'object') throw new Error('Invalid JSON');
      if (!projectJson.themeId || !Array.isArray(projectJson.slides)) throw new Error('Missing core properties');

      const theme = getTheme(projectJson.themeId);
      if (!theme) throw new Error(`Theme ${projectJson.themeId} not found`);

      const slides = projectJson.slides.map((s: any, idx: number) => {
        const variants = theme.variants[s.type as SlideType];
        const variant = variants?.find((v: any) => v.id === s.variantId) || variants?.[0];
        
        if (!variant) throw new Error(`Invalid slide type or variant for slide ${idx}`);

        const defaultContent = variant.editorConfig.defaultContent || {};
        const importedContent = s.content || {};

        return {
          ...s,
          id: s.id || crypto.randomUUID(),
          order: s.order ?? idx,
          variantId: variant.id,
          content: {
            ...defaultContent,
            ...importedContent,
            styles: {
              ...(defaultContent.styles || {}),
              ...(importedContent.styles || {})
            },
            sectionStyles: {
              ...(defaultContent.sectionStyles || {}),
              ...(importedContent.sectionStyles || {})
            },
            type: s.type
          },
          aiContext: {
            ...s.aiContext,
            purpose: variant.purpose,
            bestUsedFor: variant.bestUsedFor
          }
        };
      });

      const newProject: CarouselProject = {
        ...projectJson,
        id: projectJson.id || crypto.randomUUID(),
        name: projectJson.name || 'Imported Project',
        slides,
        globalSettings: {
          ...DEFAULT_GLOBAL_SETTINGS,
          ...projectJson.globalSettings
        }
      };

      set({ 
        project: newProject,
        activeSlideId: slides.length > 0 ? slides[0].id : null
      });

      return { success: true };
    } catch (err: any) {
      console.error('Import failed:', err);
      return { success: false, error: err.message };
    }
  },

  exportProject: () => {
    const state = useCarouselStore.getState();
    
    // Calculate final dimensions context for AI
    const dimensions = state.project.globalSettings.aspectRatio === 'portrait' 
      ? { width: 1080, height: 1350 } 
      : { width: 1080, height: 1080 };

    const enrichedProject = {
      ...state.project,
      globalSettings: {
        ...state.project.globalSettings,
        dimensions
      },
      slides: state.project.slides.map(slide => ({
        ...slide,
        aiContext: {
          ...slide.aiContext,
          recommendedDimensions: dimensions
        }
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(enrichedProject, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `${state.project.name.toLowerCase().replace(/\s+/g, '-')}-enriched.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

}));
