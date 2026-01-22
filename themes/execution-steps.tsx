import { 
  IntroContent, 
  ContentSlideContent, 
  CTAContent, 
  GlobalSettings, 
  Theme 
} from '../types/carousel';
import { User, CheckCircle2, ChevronRight } from 'lucide-react';

// --- Components ---

const ExecutionStepsIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div 
      className="relative flex h-full w-full flex-col items-center justify-center p-16 text-center"
      style={{ backgroundColor: globalSettings.backgroundColor }}
    >
      <div className="absolute top-12 left-12 flex items-center gap-3">
        {content.profileImage ? (
          <img src={content.profileImage} className="h-12 w-12 rounded-full border-2 border-white shadow-sm" alt="Profile" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 border-2 border-white shadow-sm font-bold text-zinc-400">
             <User size={24} />
          </div>
        )}
        {content.badgeText && (
          <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: globalSettings.brandColor }}>
            {content.badgeText}
          </span>
        )}
      </div>

      <h1 className="text-6xl font-black leading-tight tracking-tighter" style={{ color: '#1B1B1B' }}>
        {content.headline}
      </h1>
      {content.subheadline && (
        <p className="mt-6 text-2xl font-medium text-zinc-600">
          {content.subheadline}
        </p>
      )}

      {/* Pagination dots placeholder */}
      <div className="absolute bottom-12 flex gap-2">
        <div className="h-2 w-8 rounded-full" style={{ backgroundColor: globalSettings.brandColor }}></div>
        <div className="h-2 w-2 rounded-full bg-zinc-200"></div>
        <div className="h-2 w-2 rounded-full bg-zinc-200"></div>
      </div>
    </div>
  );
};

const ExecutionStepsContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div 
      className="relative flex h-full w-full flex-col p-16"
      style={{ backgroundColor: globalSettings.backgroundColor }}
    >
      {content.pillText && (
        <div 
          className="inline-block self-start rounded-md px-4 py-2 text-xl font-bold text-white shadow-md mb-8"
          style={{ backgroundColor: globalSettings.brandColor }}
        >
          {content.pillText}
        </div>
      )}

      <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-zinc-900 mb-12">
        {content.title}
      </h2>

      <div className="flex flex-col gap-8 relative">
        {/* Connecting Line */}
        {content.steps && content.steps.length > 1 && (
           <div className="absolute left-6 top-8 bottom-8 w-1 bg-zinc-100 -z-10" />
        )}
        
        {content.steps?.map((step, idx) => (
          <div key={idx} className="flex gap-6 items-start">
            <div 
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-lg border-2 border-zinc-50 font-black text-2xl"
              style={{ color: globalSettings.brandColor }}
            >
              {step.number || idx + 1}
            </div>
            <div className="flex flex-col pt-1">
              <h3 className="text-2xl font-bold text-zinc-900 leading-none mb-2">{step.title}</h3>
              <p className="text-xl font-medium text-zinc-500 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-12 right-12">
         <div className="p-3 rounded-full shadow-lg bg-white border-2 border-zinc-50" style={{ color: globalSettings.brandColor }}>
            <ChevronRight size={32} />
         </div>
      </div>
    </div>
  );
};

const ExecutionStepsCTA = ({ content, globalSettings }: { content: CTAContent, globalSettings: GlobalSettings }) => {
  return (
    <div 
      className="relative flex h-full w-full flex-col items-center justify-center p-16 text-center"
      style={{ backgroundColor: globalSettings.backgroundColor }}
    >
      {content.profileImage ? (
          <img src={content.profileImage} className="h-32 w-32 rounded-full border-4 border-white shadow-xl mb-8" alt="Profile" />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-zinc-100 border-4 border-white shadow-xl font-bold text-zinc-400 mb-8">
             <User size={64} />
          </div>
        )}

      <h2 className="text-5xl font-black text-zinc-900 mb-2">
        {content.name || 'Your Name'}
      </h2>
      <p className="text-2xl font-bold mb-12" style={{ color: globalSettings.brandColor }}>
        {content.handle || '@yourname'}
      </p>

      <div 
        className="rounded-3xl px-12 py-6 text-3xl font-black text-white shadow-2xl transition-transform hover:scale-105"
        style={{ backgroundColor: globalSettings.brandColor }}
      >
        {content.ctaText}
      </div>

      <div className="mt-12 flex gap-4 text-zinc-400">
        <div className="rounded-lg bg-zinc-50 p-2"><CheckCircle2 size={24} /></div>
        <div className="rounded-lg bg-zinc-50 p-2"><CheckCircle2 size={24} /></div>
        <div className="rounded-lg bg-zinc-50 p-2"><CheckCircle2 size={24} /></div>
      </div>
    </div>
  );
};

// --- Theme Definition ---

export const ExecutionStepsTheme: Theme = {
  id: 'execution-steps',
  name: 'Execution Steps',
  description: 'Clean, numbered step-by-step layouts with connected boxes',
  preview: '/previews/execution-steps.png',
  
  variants: {
    INTRO: [{
      id: 'default',
      name: 'Default',
      purpose: 'Clean, step-by-step introduction for guides.',
      bestUsedFor: 'Starting a tutorial or process walkthrough with a clear headline.',
      component: ExecutionStepsIntro,
      editorConfig: {
        fields: [
          { key: 'profileImage', type: 'image', label: 'Profile Photo' },
          { key: 'headline', type: 'text', label: 'Main Headline', required: true },
          { key: 'subheadline', type: 'text', label: 'Subheadline' },
          { key: 'badgeText', type: 'text', label: 'Badge Text' },
        ],
        defaultContent: {
          headline: 'Your Headline Here',
          subheadline: 'Supporting text goes here',
          badgeText: 'New Guide',
        },
      },
    }],
    CONTENT: [{
      id: 'default',
      name: 'Default',
      purpose: 'Listing sequential steps or process phases.',
      bestUsedFor: 'Execution steps, how-to guides, and procedural content with numbered tracks.',
      component: ExecutionStepsContent,
      editorConfig: {
        fields: [
          { key: 'pillText', type: 'text', label: 'Header Label', placeholder: 'Use case 2:' },
          { key: 'title', type: 'text', label: 'Main Title', required: true },
          { 
            key: 'steps', 
            type: 'steps', 
            label: 'Execution Steps',
            helpText: 'Add numbered steps with titles and descriptions'
          },
        ],
        defaultContent: {
          title: 'Your process title',
          steps: [
            { title: 'First step', description: 'Description here' },
          ],
        },
      },
    }],
    CTA: [{
      id: 'default',
      name: 'Default',
      purpose: 'Standard personal brand call-to-action.',
      bestUsedFor: 'Concluding a guide with a prompt to follow or check out more resources.',
      component: ExecutionStepsCTA,
      editorConfig: {
        fields: [
          { key: 'profileImage', type: 'image', label: 'Profile Photo' },
          { key: 'name', type: 'text', label: 'Your Name', required: true },
          { key: 'handle', type: 'text', label: 'Social Handle', placeholder: '@yourname' },
          { key: 'ctaText', type: 'text', label: 'Call to Action', required: true },
        ],
        defaultContent: {
          ctaText: 'Follow for more insights',
          name: 'LinkedIn User',
          handle: '@linkedinuser',
        },
      },
    }],
  },
  
  defaultColors: {
    primary: '#DC2626',
    accent: '#FED7AA',
    background: '#FED7AA',
  },
};
