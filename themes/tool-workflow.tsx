import { 
  IntroContent, 
  ContentSlideContent, 
  CTAContent, 
  GlobalSettings, 
  Theme 
} from '../types/carousel';
import { Settings, ArrowRight, Scan } from 'lucide-react';

// --- Components ---

export const StandardIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div 
      className="relative flex h-full w-full flex-col items-center justify-between p-20 text-center"
      style={{ backgroundColor: globalSettings.backgroundColor }}
    >
      <div className="flex flex-col items-center">
        {content.companyLogo ? (
          <img src={content.companyLogo} className="h-16 mb-8" alt="Logo" />
        ) : (
          <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white mb-8">
            <Settings size={32} />
          </div>
        )}
        <h1 className="text-7xl font-black tracking-tight leading-[1.1] break-words max-w-full" style={{ color: '#000000' }}>
          {content.mainTitle || content.headline || 'Your Headline'}
        </h1>
        {(content.subtitle || content.subheadline) && (
          <p className="mt-8 text-2xl font-bold text-zinc-400 uppercase tracking-widest break-words max-w-full">
            {content.subtitle || content.subheadline}
          </p>
        )}
      </div>

      {content.stats && content.stats.length > 0 && (
        <div className="flex gap-12 border-t-2 border-zinc-100 pt-12">
          {content.stats.map((stat, i) => (
            <div key={i} className="flex flex-col min-w-0">
              <span className="text-4xl font-black break-words" style={{ color: globalSettings.brandColor }}>{stat.value}</span>
              <span className="text-lg font-bold text-zinc-400 uppercase tracking-widest break-words">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const EmojiIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div 
      className="relative flex h-full w-full flex-col items-center justify-center p-20 text-center"
      style={{ backgroundColor: globalSettings.backgroundColor }}
    >
      <div className="text-[12rem] mb-12">
        {content.description || '🚀'}
      </div>
      <h1 className="text-6xl font-black tracking-tight leading-[1.1] break-words max-w-full" style={{ color: '#000000' }}>
        {content.mainTitle || content.headline}
      </h1>
      <div className="mt-8 inline-block px-6 py-2 rounded-xl bg-zinc-900 text-white text-xl font-bold uppercase tracking-widest break-words max-w-full">
        {content.subtitle || content.subheadline || 'Workflow guide'}
      </div>
    </div>
  );
};

export const HeadshotIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div 
      className="relative flex h-full w-full flex-col items-center justify-center p-20 text-center"
      style={{ backgroundColor: globalSettings.backgroundColor }}
    >
      <div className="relative mb-12">
        <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl bg-zinc-100 border-8 border-white p-2">
          {content.profileImage ? (
            <img src={content.profileImage} className="w-full h-full object-cover rounded-2xl" alt="Profile" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-zinc-200 text-6xl">?</div>
          )}
        </div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl text-white" style={{ backgroundColor: globalSettings.brandColor }}>
           <Settings size={40} />
        </div>
      </div>
      <h1 className="text-6xl font-black text-black mb-4 tracking-tight break-words max-w-full">
        {content.mainTitle || content.headline || content.name || 'Your Name'}
      </h1>
      <p className="text-2xl font-bold text-zinc-400 uppercase tracking-widest break-words max-w-full">
        {content.subtitle || content.subheadline || content.tagline}
      </p>
    </div>
  );
};

export const ImageIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
  return (
    <div 
      className="relative flex h-full w-full bg-white overflow-hidden"
    >
      <div className="w-1/2 h-full flex flex-col justify-center p-16" style={{ backgroundColor: globalSettings.backgroundColor }}>
         <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white mb-8">
            <Settings size={32} />
         </div>
          <h1 className="text-6xl font-black leading-tight tracking-tight mb-8 text-black break-words max-w-full">
            {content.mainTitle || content.headline}
          </h1>
          <p className="text-2xl font-bold text-zinc-400 uppercase tracking-widest break-words max-w-full">
            {content.subtitle || content.subheadline}
          </p>
      </div>
      <div className="w-1/2 h-full relative">
         {content.heroImage ? (
           <img src={content.heroImage} className="w-full h-full object-cover" alt="Hero" />
         ) : (
           <div className="w-full h-full bg-zinc-50 flex items-center justify-center font-bold text-zinc-200">Image Placeholder</div>
         )}
         <div className="absolute top-12 left-0 w-4 h-32 rounded-r-xl" style={{ backgroundColor: globalSettings.brandColor }} />
      </div>
    </div>
  );
};

const ToolWorkflowContent = ({ content, globalSettings }: { content: ContentSlideContent, globalSettings: GlobalSettings }) => {
  return (
    <div 
      className="relative flex h-full w-full flex-col p-16"
      style={{ backgroundColor: globalSettings.backgroundColor }}
    >
      <div className="flex justify-between items-start mb-12">
        <h2 className="text-5xl font-black leading-tight tracking-tight text-black max-w-[70%] break-words">
          {content.title}
        </h2>
        {content.pillText && (
          <div 
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-black text-white"
            style={{ backgroundColor: globalSettings.brandColor }}
          >
            {content.pillText}
          </div>
        )}
      </div>

      {content.subtitle && (
        <p className="text-2xl font-bold text-zinc-500 mb-12 uppercase tracking-wide break-words max-w-full">
          {content.subtitle}
        </p>
      )}

      {/* Tools Section */}
      {content.tools && content.tools.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-12">
           {content.tools.map((tool, i) => (
             <div key={i} className="flex items-center gap-3 bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-3">
               <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: tool.color || globalSettings.brandColor }}>
                  {tool.name[0]}
               </div>
               <span className="text-xl font-bold text-zinc-800 break-words">{tool.name}</span>
             </div>
           ))}
        </div>
      )}

      {/* Workflow Section */}
      <div className="flex flex-col gap-4">
        {content.workflow?.map((item, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex items-center gap-4 bg-white border-2 border-zinc-100 rounded-3xl p-6 shadow-sm min-w-0">
              <div className="flex-1 text-2xl font-bold text-zinc-900 break-words min-w-0">{item.step}</div>
              {item.arrow !== false && i < (content.workflow?.length || 0) - 1 && (
                 <ArrowRight className="text-zinc-300" size={32} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ToolWorkflowCTA = ({ content, globalSettings }: { content: CTAContent, globalSettings: GlobalSettings }) => {
  return (
    <div 
      className="relative flex h-full w-full flex-col items-center justify-center p-20 text-center"
      style={{ backgroundColor: globalSettings.backgroundColor }}
    >
      <div className="mb-12">
        <h2 className="text-6xl font-black text-black mb-4 break-words max-w-full">
          {content.name || 'Your Name'}
        </h2>
        <div className="inline-block bg-zinc-900 text-white px-6 py-2 rounded-xl text-xl font-bold italic tracking-wider break-words max-w-full">
           {content.title || 'Job Title'}
        </div>
      </div>

      <div className="mb-16">
        <h3 className="text-4xl font-extrabold text-zinc-900 mb-8 leading-tight break-words max-w-full">
          {content.ctaText}
        </h3>
        
        {content.qrCode ? (
           <img src={content.qrCode} className="h-48 w-48 mx-auto border-8 border-white shadow-2xl rounded-3xl" alt="QR Code" />
        ) : (
          <div className="h-48 w-48 mx-auto bg-zinc-50 border-8 border-white shadow-2xl rounded-3xl flex items-center justify-center text-zinc-200">
             <Scan size={80} />
          </div>
        )}
      </div>

      <div className="flex gap-12 font-black text-2xl italic uppercase tracking-tighter text-zinc-200">
         <span>Connect</span>
         <span>Share</span>
         <span>Save</span>
      </div>
    </div>
  );
};

// --- Theme Definition ---

export const ToolWorkflowTheme: Theme = {
  id: 'tool-workflow',
  name: 'Tool Workflow',
  description: 'Showcase tools and processes with pill-style badges',
  preview: '/previews/tool-workflow.png',
  
  variants: {
    INTRO: [
      {
        id: 'standard',
        name: 'Standard',
        icon: 'Type',
        component: StandardIntro,
        editorConfig: {
          fields: [
            { key: 'companyLogo', type: 'image', label: 'Company Logo' },
            { key: 'mainTitle', type: 'text', label: 'Main Headline', required: true },
            { key: 'subtitle', type: 'text', label: 'Subtitle' },
            { key: 'stats', type: 'list', label: 'Key Stats' },
          ],
          defaultContent: {
            mainTitle: 'AI Agent Workflow',
            stats: [
              { label: 'Efficiency', value: '10x' },
              { label: 'Accuracy', value: '99%' },
            ],
          },
        },
      },
      {
        id: 'emoji',
        name: 'Emoji',
        icon: 'Smile',
        component: EmojiIntro,
        editorConfig: {
          fields: [
            { key: 'description', type: 'text', label: 'Emoji (e.g. 🚀)' },
            { key: 'mainTitle', type: 'text', label: 'Headline', required: true },
            { key: 'subtitle', type: 'text', label: 'Subtitle' },
          ],
          defaultContent: {
            mainTitle: 'Workflow Tips',
            description: '⚡',
          },
        },
      },
      {
        id: 'headshot',
        name: 'Headshot',
        icon: 'User',
        component: HeadshotIntro,
        editorConfig: {
          fields: [
            { key: 'profileImage', type: 'image', label: 'Profile Photo' },
            { key: 'name', type: 'text', label: 'Your Name', required: true },
            { key: 'tagline', type: 'text', label: 'Tagline' },
            { key: 'mainTitle', type: 'text', label: 'Headline' },
          ],
          defaultContent: {
            name: 'Tech Founder',
            tagline: 'CEO @ AI Lab',
          },
        },
      },
      {
        id: 'image',
        name: 'Image',
        icon: 'ImageIcon',
        component: ImageIntro,
        editorConfig: {
          fields: [
            { key: 'heroImage', type: 'image', label: 'Hero Image' },
            { key: 'mainTitle', type: 'text', label: 'Headline', required: true },
            { key: 'subtitle', type: 'text', label: 'Subtitle' },
          ],
          defaultContent: {
            mainTitle: 'The Visual Flow',
            subtitle: 'Optimizing for scale',
          },
        },
      }
    ],
    CONTENT: [{
      id: 'default',
      name: 'Default',
      component: ToolWorkflowContent,
      editorConfig: {
        fields: [
          { key: 'pillText', type: 'text', label: 'Badge Number', placeholder: '3' },
          { key: 'title', type: 'text', label: 'Agent/Process Name', required: true },
          { key: 'subtitle', type: 'text', label: 'Goal Description' },
          { 
            key: 'tools', 
            type: 'tools', 
            label: 'Tools Used',
            helpText: 'Add tools with icons and names'
          },
          { 
            key: 'workflow', 
            type: 'workflow', 
            label: 'Workflow Steps',
            helpText: 'Sequential process steps'
          },
        ],
        defaultContent: {
          title: 'Content Agent',
          subtitle: 'Auto-generate content for your needs',
          pillText: '3',
          tools: [{ name: 'Zapier', icon: 'zap' }, { name: 'OpenAI', icon: 'bot' }],
          workflow: [{ step: 'Takes brand brief input' }, { step: 'Uses OpenAI to write' }],
        },
      },
    }],
    CTA: [{
      id: 'default',
      name: 'Default',
      component: ToolWorkflowCTA,
      editorConfig: {
        fields: [
          { key: 'name', type: 'text', label: 'Your Name', required: true },
          { key: 'title', type: 'text', label: 'Job Title' },
          { key: 'ctaText', type: 'text', label: 'Main CTA', required: true },
          { key: 'qrCode', type: 'image', label: 'QR Code (optional)' },
        ],
        defaultContent: {
          ctaText: 'Scan to connect with my AI agents',
          name: 'Tech Founder',
          title: 'CEO @ AI Lab',
        },
      },
    }],
  },
  
  defaultColors: {
    primary: '#F97316',
    accent: '#FED7AA',
    background: '#FFFFFF',
  },
};
