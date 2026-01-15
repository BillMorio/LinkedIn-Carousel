import { 
  IntroContent, 
  ContentSlideContent, 
  CTAContent, 
  GlobalSettings, 
  Theme 
} from '../types/carousel';
import { Settings, ArrowRight, Scan } from 'lucide-react';

// --- Components ---

const ToolWorkflowIntro = ({ content, globalSettings }: { content: IntroContent, globalSettings: GlobalSettings }) => {
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
        <h1 className="text-7xl font-black tracking-tight leading-[1.1]" style={{ color: '#000000' }}>
          {content.headline}
        </h1>
      </div>

      {content.stats && content.stats.length > 0 && (
        <div className="flex gap-12 border-t-2 border-zinc-100 pt-12">
          {content.stats.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-4xl font-black" style={{ color: globalSettings.brandColor }}>{stat.value}</span>
              <span className="text-lg font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
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
        <h2 className="text-5xl font-black leading-tight tracking-tight text-black max-w-[70%]">
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
        <p className="text-2xl font-bold text-zinc-500 mb-12 uppercase tracking-wide">
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
               <span className="text-xl font-bold text-zinc-800">{tool.name}</span>
             </div>
           ))}
        </div>
      )}

      {/* Workflow Section */}
      <div className="flex flex-col gap-4">
        {content.workflow?.map((item, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex items-center gap-4 bg-white border-2 border-zinc-100 rounded-3xl p-6 shadow-sm">
              <div className="flex-1 text-2xl font-bold text-zinc-900">{item.step}</div>
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
        <h2 className="text-6xl font-black text-black mb-4">
          {content.name || 'Your Name'}
        </h2>
        <div className="inline-block bg-zinc-900 text-white px-6 py-2 rounded-xl text-xl font-bold italic tracking-wider">
           {content.title || 'Job Title'}
        </div>
      </div>

      <div className="mb-16">
        <h3 className="text-4xl font-extrabold text-zinc-900 mb-8 leading-tight">
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
  
  components: {
    INTRO: ToolWorkflowIntro,
    CONTENT: ToolWorkflowContent,
    CTA: ToolWorkflowCTA,
  },
  
  editorConfig: {
    INTRO: {
      fields: [
        { key: 'companyLogo', type: 'image', label: 'Company Logo' },
        { key: 'headline', type: 'text', label: 'Main Headline', required: true },
        { key: 'stats', type: 'list', label: 'Key Stats' },
      ],
      defaultContent: {
        headline: 'AI Agent Workflow',
        stats: [
          { label: 'Efficiency', value: '10x' },
          { label: 'Accuracy', value: '99%' },
        ],
      },
    },
    
    CONTENT: {
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
    
    CTA: {
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
  },
  
  defaultColors: {
    primary: '#F97316',
    accent: '#FED7AA',
    background: '#FFFFFF',
  },
};
