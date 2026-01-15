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
  removeSlide: (slideId: string) => void;
  reorderSlides: (startIndex: number, endIndex: number) => void;
  
  updateProjectName: (name: string) => void;
}

const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  brandColor: '#DC2626',
  accentColor: '#FED7AA',
  fontFamily: 'Inter',
  backgroundColor: '#FFFFFF',
  aspectRatio: 'portrait',
};

const createDefaultSlide = (type: SlideType, order: number, content: Partial<SlideContent>): Slide => {
  const id = crypto.randomUUID();
  
  let dynamicContent: SlideContent;
  
  switch (type) {
    case 'INTRO':
      dynamicContent = {
        type: 'INTRO',
        headline: 'Your Headline Here',
        subheadline: 'Supporting text goes here',
        ...content as Partial<IntroContent>
      };
      break;
    case 'CONTENT':
      dynamicContent = {
        type: 'CONTENT',
        title: 'Your process title',
        steps: [
          { title: 'First step', description: 'Description here' },
        ],
        ...content as Partial<ContentSlideContent>
      };
      break;
    case 'CTA':
      dynamicContent = {
        type: 'CTA',
        ctaText: 'Follow for more insights',
        ...content as Partial<CTAContent>
      };
      break;
  }

  return {
    id,
    type,
    order,
    content: dynamicContent,
  };
};

export const useCarouselStore = create<CarouselState>((set) => ({
  project: {
    id: 'default-project',
    name: 'Untitled Carousel',
    themeId: 'execution-steps',
    slides: [
      createDefaultSlide('INTRO', 0, { headline: 'How to Build a Carousel Builder' }),
      createDefaultSlide('CONTENT', 1, { title: 'Step 1: Set up the Store' }),
      createDefaultSlide('CTA', 2, { ctaText: 'Follow for more dev tips!' }),
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
    const newSlide = createDefaultSlide(type, state.project.slides.length, content);
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
}));
