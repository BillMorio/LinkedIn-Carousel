LinkedIn Carousel Maker - Technical Requirements Document
1. Project Overview
Purpose: Build a web-based LinkedIn carousel maker that allows users to create professional, multi-slide carousels with fully customizable themes and export-ready designs.
Key User Journey:

User creates a new carousel project
User selects a visual theme (each theme has completely unique layouts for Intro, Content, and CTA cards)
User adds/removes slides and edits content card-by-card with a dynamic form that adapts to the selected theme
User previews the full carousel
User exports slides as individual images (1080x1350px each)


2. Tech Stack

Framework: Next.js 14+ (App Router)
Language: TypeScript
Styling: Tailwind CSS
State Management: Zustand
Export: html-to-image (or similar library for rendering DOM to PNG)
Icons: Lucide React (or Heroicons)


3. Core Architectural Principle: Theme Independence
THE CRITICAL CONCEPT
Each theme is completely independent and can have totally different layouts, components, and visual structures. When a user switches themes, the content data stays the same, but the visual interpretation changes completely.
Example:

Theme A's content card might show numbered steps with connecting lines
Theme B's content card might show tool badges and a workflow section
Theme C's content card might show bullet points with icons

All three themes use the same underlying content data, but render it differently.

4. Data Model (Zustand Store)
4.1 Store Structure
typescriptinterface CarouselProject {
  id: string;
  name: string;
  themeId: string; // References a theme from ThemeRegistry
  slides: Slide[];
  globalSettings: {
    brandColor: string;
    accentColor: string;
    fontFamily: string;
  };
}

interface Slide {
  id: string;
  type: 'INTRO' | 'CONTENT' | 'CTA';
  order: number;
  content: SlideContent;
}

type SlideContent = IntroContent | ContentSlideContent | CTAContent;
4.2 Intro Content (Flexible - supports all possible intro layouts)
typescriptinterface IntroContent {
  type: 'INTRO';
  
  // Profile section
  profileImage?: string;
  name?: string;
  tagline?: string;
  companyLogo?: string;
  
  // Main content
  headline: string;
  subheadline?: string;
  description?: string;
  
  // Badges/Pills
  badgeText?: string;
  pillText?: string;
  
  // Additional elements
  backgroundPattern?: 'gradient' | 'solid' | 'dots' | 'waves';
  iconSet?: string[]; // URLs or icon names
  stats?: Array<{ label: string; value: string }>; // e.g., "10+ Years", "500+ Clients"
  
  // Layout hints
  layout?: 'centered' | 'split' | 'header-focus' | 'profile-emphasis';
  accentColor?: string;
}
Key Insight: Different themes will use different combinations of these fields. Theme A might only use profileImage, headline, and badgeText, while Theme B uses name, tagline, stats, and iconSet.
4.3 Content Slide Content (Flexible - supports all possible content layouts)
typescriptinterface ContentSlideContent {
  type: 'CONTENT';
  
  // Header section
  pillText?: string;           // "Use case 2:", "3", "Goal", "Tip #1"
  title: string;               // Main headline
  subtitle?: string;           // Optional subheadline
  categoryBadge?: string;      // "Marketing", "Sales", "Product"
  
  // Main content (multiple layout options)
  body?: string;               // Paragraph text
  
  steps?: Array<{              // For numbered/sequential steps
    number?: number;
    title: string;
    description: string;
    icon?: string;
  }>;
  
  bulletPoints?: Array<{       // For bullet lists
    text: string;
    icon?: string;
    emphasis?: boolean;
  }>;
  
  keyValue?: Array<{           // For key-value pairs
    key: string;
    value: string;
  }>;
  
  quote?: {                    // For testimonial/quote layouts
    text: string;
    author: string;
    role?: string;
  };
  
  // Tool/Icon section
  tools?: Array<{
    name: string;
    icon: string;              // URL or icon identifier
    color?: string;
  }>;
  
  // Workflow/Process section
  workflow?: Array<{
    step: string;
    description?: string;
    arrow?: boolean;           // Show arrow to next step
  }>;
  
  // Visual elements
  illustration?: string;       // URL to illustration/image
  chart?: {                    // For data visualization
    type: 'bar' | 'line' | 'pie';
    data: any[];
  };
  
  // Footer
  footerNote?: string;
  footerCTA?: string;
  
  // Layout hints
  layout?: 'steps' | 'bullets' | 'workflow' | 'paragraph' | 'split' | 'quote';
  accentColor?: string;
}
Real Example from Your Images:
Image 1 (Execution Steps theme) uses:

pillText: "Use case 2:"
title: "Find companies launching new products"
steps: [{ number: 1, title: "Apify:", description: "Use Product Hunt Collector..." }, ...]

Image 2 (Tool Workflow theme) uses:

pillText: "3"
title: "Brand Content Agent"
subtitle: "Auto-generate weekly content for founders or solopreneurs"
tools: [{ name: "Google Forms", icon: "..." }, { name: "Open AI", icon: "..." }, ...]
workflow: [{ step: "Takes brand brief input via Google Form" }, { step: "Uses OpenAI to write..." }, ...]

4.4 CTA Content (Flexible - supports all possible CTA layouts)
typescriptinterface CTAContent {
  type: 'CTA';
  
  // Profile section
  profileImage?: string;
  name?: string;
  title?: string;              // Job title
  company?: string;
  companyLogo?: string;
  
  // Social handles
  handle?: string;             // "@yourname"
  socialLinks?: Array<{
    platform: 'linkedin' | 'twitter' | 'instagram' | 'website';
    url: string;
    handle?: string;
  }>;
  
  // Call to action
  ctaText: string;             // "Follow for more", "Connect with me"
  ctaButtonText?: string;      // "Follow", "Connect", "Learn More"
  actionUrl?: string;
  secondaryCTA?: string;
  
  // Additional elements
  qrCode?: string;             // URL to QR code image
  testimonial?: {
    text: string;
    author: string;
  };
  achievements?: string[];     // "Forbes 30 Under 30", "TEDx Speaker"
  
  // Layout hints
  layout?: 'profile-centered' | 'split-screen' | 'card-style' | 'minimal';
  accentColor?: string;
}

5. Theme System Architecture
5.1 Theme Definition
Each theme is a complete design system that includes:

Visual components (React components that render the slides)
Editor configuration (which fields to show in the Properties Panel)
Default content (starter values for new slides)

typescriptinterface FieldConfig {
  key: string;                 // Maps to content object key (e.g., "headline", "steps")
  type: 'text' | 'textarea' | 'image' | 'steps' | 'bullets' | 'tools' | 'workflow' | 'color' | 'list';
  label: string;               // Display label in editor
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;             // URL to theme thumbnail
  
  // Visual components for each card type
  components: {
    IntroCard: React.ComponentType<{ content: IntroContent; globalSettings: GlobalSettings }>;
    ContentCard: React.ComponentType<{ content: ContentSlideContent; globalSettings: GlobalSettings }>;
    CTACard: React.ComponentType<{ content: CTAContent; globalSettings: GlobalSettings }>;
  };
  
  // Editor configuration: defines which fields to show in Properties Panel
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
  
  // Default styling
  defaultColors?: {
    primary: string;
    accent: string;
    background: string;
  };
}
5.2 Example Theme Configuration: "Execution Steps"
Based on your Image 1:
typescriptconst ExecutionStepsTheme: Theme = {
  id: 'execution-steps',
  name: 'Execution Steps',
  description: 'Clean, numbered step-by-step layouts with connected boxes',
  preview: '/themes/execution-steps.png',
  
  components: {
    IntroCard: ExecutionStepsIntro,      // You implement these
    ContentCard: ExecutionStepsContent,  // components however you want
    CTACard: ExecutionStepsCTA,
  },
  
  editorConfig: {
    INTRO: {
      fields: [
        { key: 'profileImage', type: 'image', label: 'Profile Photo' },
        { key: 'headline', type: 'text', label: 'Main Headline', required: true },
        { key: 'subheadline', type: 'text', label: 'Subheadline' },
        { key: 'badgeText', type: 'text', label: 'Badge Text' },
      ],
      defaultContent: {
        headline: 'Your Headline Here',
        subheadline: 'Supporting text goes here',
      },
    },
    
    CONTENT: {
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
          { number: 1, title: 'First step', description: 'Description here' },
        ],
      },
    },
    
    CTA: {
      fields: [
        { key: 'profileImage', type: 'image', label: 'Profile Photo' },
        { key: 'name', type: 'text', label: 'Your Name', required: true },
        { key: 'handle', type: 'text', label: 'Social Handle', placeholder: '@yourname' },
        { key: 'ctaText', type: 'text', label: 'Call to Action', required: true },
      ],
      defaultContent: {
        ctaText: 'Follow for more insights',
      },
    },
  },
  
  defaultColors: {
    primary: '#DC2626',
    accent: '#FED7AA',
    background: '#FED7AA',
  },
};
5.3 Example Theme Configuration: "Tool Workflow"
Based on your Image 2:
typescriptconst ToolWorkflowTheme: Theme = {
  id: 'tool-workflow',
  name: 'Tool Workflow',
  description: 'Showcase tools and processes with pill-style badges',
  preview: '/themes/tool-workflow.png',
  
  components: {
    IntroCard: ToolWorkflowIntro,
    ContentCard: ToolWorkflowContent,
    CTACard: ToolWorkflowCTA,
  },
  
  editorConfig: {
    INTRO: {
      fields: [
        { key: 'companyLogo', type: 'image', label: 'Company Logo' },
        { key: 'headline', type: 'text', label: 'Main Headline', required: true },
        { key: 'stats', type: 'list', label: 'Key Stats' },
      ],
      defaultContent: {
        headline: 'Your Solution Name',
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
      },
    },
    
    CTA: {
      fields: [
        { key: 'name', type: 'text', label: 'Your Name', required: true },
        { key: 'title', type: 'text', label: 'Job Title' },
        { key: 'socialLinks', type: 'list', label: 'Social Links' },
        { key: 'ctaText', type: 'text', label: 'Main CTA', required: true },
        { key: 'qrCode', type: 'image', label: 'QR Code (optional)' },
      ],
      defaultContent: {
        ctaText: 'Scan to connect',
      },
    },
  },
  
  defaultColors: {
    primary: '#F97316',
    accent: '#FED7AA',
    background: '#FFF7ED',
  },
};
5.4 Theme Registry
typescriptexport const ThemeRegistry: Record<string, Theme> = {
  'execution-steps': ExecutionStepsTheme,
  'tool-workflow': ToolWorkflowTheme,
  // Add more themes here...
};
```

---

## 6. UI Layout Specification

### 6.1 Main Editor Layout (3-Column Grid)
```
┌────────────────────────────────────────────────────────────────────┐
│  [Logo] LinkedIn Carousel Maker    [Theme: Execution Steps ▼] [Export ▼] │
├──────────────┬──────────────────────────────┬──────────────────────┤
│              │                              │                      │
│   SLIDE      │        CANVAS STAGE          │    PROPERTIES        │
│  NAVIGATOR   │        (1080x1350)           │      PANEL           │
│              │                              │   (Theme-Aware)      │
│              │                              │                      │
│  [+ New ▼]   │  ┌──────────────────────┐   │  📐 Theme Picker     │
│              │  │                      │   │  ┌─────────────────┐ │
│  ┌────────┐  │  │                      │   │  │ [Theme Preview] │ │
│  │ Intro  │  │  │   LIVE PREVIEW       │   │  │ Execution Steps │ │
│  │  Card  │  │  │   OF ACTIVE          │   │  └─────────────────┘ │
│  └────────┘  │  │   SLIDE              │   │  ┌─────────────────┐ │
│              │  │                      │   │  │ [Theme Preview] │ │
│  ┌────────┐  │  │  (Rendered with      │   │  │ Tool Workflow   │ │
│  │Content │  │  │   current theme      │   │  └─────────────────┘ │
│  │ Card 1 │  │  │   components)        │   │                      │
│  └────────┘  │  │                      │   │  ✏️ Edit Content     │
│              │  │                      │   │  ──────────────────   │
│  ┌────────┐  │  │                      │   │  [Dynamic fields     │
│  │Content │  │  └──────────────────────┘   │   based on theme     │
│  │ Card 2 │  │                              │   and slide type]    │
│  └────────┘  │  [◀ Previous]  [Next ▶]     │                      │
│              │                              │  Header Label:       │
│  ┌────────┐  │  Slide 2 of 5                │  [Use case 2:___]    │
│  │  CTA   │  │                              │                      │
│  │  Card  │  │                              │  Main Title:         │
│  └────────┘  │                              │  [Find companies__]  │
│              │                              │                      │
│  [🗑️ Delete] │                              │  📋 Execution Steps  │
│              │                              │  [Custom editor for  │
│              │                              │   adding/editing     │
│              │                              │   steps]             │
│              │                              │                      │
└──────────────┴──────────────────────────────┴──────────────────────┘
```

### 6.2 Left Sidebar: Slide Navigator

**Purpose**: Navigate between slides and manage slide order

**Features**:
- Display thumbnails of all slides (small previews rendered with current theme)
- Highlight active slide with colored border
- Drag-and-drop to reorder slides
- "Add New Slide" button with dropdown (Intro / Content / CTA options)
- Delete button for each slide
- Display slide counter ("Slide 2 of 5")

**Visual Example**:
```
┌──────────────┐
│  [+ New ▼]   │
├──────────────┤
│ ┌──────────┐ │ ← Thumbnail preview
│ │  Intro   │ │
│ │  Card    │ │
│ └──────────┘ │
│ ┌──────────┐ │ ← Active (blue border)
│ │ Content  │ │
│ │  Card 1  │ │
│ └──────────┘ │
│ ┌──────────┐ │
│ │ Content  │ │
│ │  Card 2  │ │
│ └──────────┘ │
│ ┌──────────┐ │
│ │   CTA    │ │
│ │   Card   │ │
│ └──────────┘ │
├──────────────┤
│ [🗑️ Delete]  │
└──────────────┘
```

### 6.3 Center: Canvas Stage

**Purpose**: Display live preview of the active slide

**Features**:
- Fixed 4:5 aspect ratio container (LinkedIn carousel dimensions: 1080x1350px)
- Renders the active slide using the selected theme's component
- Scale down to fit screen (e.g., 50% scale for viewing)
- Previous/Next navigation buttons
- Display current slide number ("Slide 2 of 5")
- Optional zoom controls

**Key Behavior**:
- When user switches to a different slide → canvas updates immediately
- When user changes theme → canvas re-renders all slides with new theme components
- When user edits content in Properties Panel → canvas updates in real-time (debounced)

### 6.4 Right Sidebar: Properties Panel (Theme-Aware)

**Purpose**: Edit content of the active slide with fields that adapt to the selected theme

**This is the critical component that makes themes flexible.**

**Key Behavior**:
1. Reads the `editorConfig` from the currently selected theme
2. Looks at the active slide's type (INTRO / CONTENT / CTA)
3. Dynamically renders form fields based on `theme.editorConfig[slideType].fields`
4. Updates the slide's content in Zustand store as user types
5. Changes completely when user switches themes (different fields appear)

**Example Scenario**:

User has a Content slide with "Execution Steps" theme:
- Properties Panel shows: `pillText`, `title`, `steps` (with a custom steps editor)

User switches to "Tool Workflow" theme:
- Properties Panel changes to show: `pillText`, `title`, `subtitle`, `tools`, `workflow`
- The content data is preserved (the text they typed stays the same)
- But the form fields adapt to what the new theme needs

**Visual Structure**:
```
┌─────────────────────────┐
│  📐 Theme Picker        │
│  ┌──────────────────┐   │
│  │ [Preview Image]  │   │
│  │ Execution Steps  │   │ ← Click to switch
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ [Preview Image]  │   │
│  │ Tool Workflow    │   │
│  └──────────────────┘   │
├─────────────────────────┤
│  ✏️ Edit Content        │
│  ─────────────────────  │
│                         │
│  [Field 1 based on      │
│   theme config]         │
│                         │
│  [Field 2 based on      │
│   theme config]         │
│                         │
│  [Custom editor for     │
│   complex fields like   │
│   steps, tools, etc]    │
│                         │
└─────────────────────────┘

7. Custom Field Editors
The Properties Panel needs custom editors for complex field types:
7.1 Field Types and Their Purpose
Field TypePurposeExample Use CasetextSingle-line text inputHeadline, title, nametextareaMulti-line text inputDescriptions, body copyimageImage upload/URL inputProfile photo, logo, QR codestepsAdd/edit numbered stepsExecution steps with title + descriptiontoolsAdd/edit tool badgesTool names with iconsworkflowAdd/edit workflow stepsSequential process stepsbulletsAdd/edit bullet pointsFeature lists, key pointscolorColor pickerAccent colors, brand colorslistSimple list of stringsSocial links, achievements, stats
7.2 Steps Editor Requirements
Purpose: Edit an array of step objects
Features Needed:

Display list of existing steps
Add new step button
Remove step button for each step
Input fields for: step number (optional), title, description
Drag-to-reorder steps

Data Structure:
typescriptsteps: Array<{
  number?: number;
  title: string;
  description: string;
}>
7.3 Tools Editor Requirements
Purpose: Edit an array of tool objects
Features Needed:

Display list of existing tools
Add new tool button
Remove tool button
Input fields for: tool name, icon URL (or icon picker)
Preview of tool badge

Data Structure:
typescripttools: Array<{
  name: string;
  icon: string;
  color?: string;
}>
7.4 Workflow Editor Requirements
Purpose: Edit an array of workflow step strings
Features Needed:

Display list of steps
Add new step button
Remove step button
Reorder steps (drag-and-drop)
Text input for each step

Data Structure:
typescriptworkflow: Array<{
  step: string;
  description?: string;
}>
```

---

## 8. Key User Interactions

### 8.1 Creating a New Slide

1. User clicks "Add New Slide" dropdown in left sidebar
2. Dropdown shows three options with visual icons:
   - "Intro Card" (with icon)
   - "Content Card" (with icon)
   - "CTA Card" (with icon)
3. User selects a type
4. System creates new slide with default content from current theme's `editorConfig[type].defaultContent`
5. New slide is added to end of slides array
6. Editor automatically switches focus to the new slide
7. Canvas shows the new slide
8. Properties Panel shows relevant fields

### 8.2 Editing Content

1. User clicks on a slide thumbnail in left sidebar
2. Canvas updates to display that slide
3. Properties Panel updates to show fields for that slide type + current theme
4. User types in input fields
5. Changes are reflected in real-time on canvas (with debouncing)
6. Changes are automatically saved to Zustand store

### 8.3 Switching Themes

**This is the most important interaction to understand.**

1. User clicks on a theme preview in Properties Panel
2. System updates `themeId` in Zustand store
3. **All slides immediately re-render** with new theme components
4. The content data (text, images, etc.) remains unchanged
5. Properties Panel updates to show fields from new theme's `editorConfig`
6. User might see different fields because the new theme uses different data
7. Canvas shows the active slide with new visual styling

**Example**:
- User has 5 slides in "Execution Steps" theme
- User switches to "Tool Workflow" theme
- All 5 slides now render with Tool Workflow components
- Content slide that had `steps` data now needs `tools` and `workflow` data
- Properties Panel shows new fields for user to fill in the missing data

### 8.4 Reordering Slides

1. User drags a slide thumbnail in left sidebar
2. Visual indicator shows where slide will be dropped
3. User drops slide in new position
4. System updates `order` property of affected slides
5. Slide navigator updates to show new order

### 8.5 Deleting a Slide

1. User clicks delete button on a slide (or presses delete key)
2. Confirmation dialog appears: "Are you sure you want to delete this slide?"
3. If confirmed, slide is removed from slides array
4. If deleted slide was active, system auto-selects previous slide (or next if first slide)
5. Canvas and Properties Panel update accordingly

### 8.6 Exporting Carousel

1. User clicks "Export" button in header
2. Dropdown shows options:
   - "Download All Slides (ZIP)" → exports all slides as PNG files in a ZIP
   - "Download Current Slide" → exports only the active slide as PNG
3. User selects option
4. System iterates through selected slides:
   - Renders each slide at full size (1080x1350px) in a hidden DOM element
   - Uses html-to-image library to convert to PNG
   - Downloads file(s)
5. Success message appears

---

## 9. File Structure
```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── editor/[projectId]/page.tsx       # Main editor
│   └── layout.tsx
│
├── components/
│   ├── Editor/
│   │   ├── EditorLayout.tsx              # 3-column grid layout
│   │   ├── SlideNavigator.tsx            # Left sidebar
│   │   ├── Canvas.tsx                    # Center preview area
│   │   └── PropertiesPanel.tsx           # Right sidebar (theme-aware)
│   │
│   ├── Cards/
│   │   ├── ExecutionSteps/               # Theme 1 components
│   │   │   ├── IntroCard.tsx
│   │   │   ├── ContentCard.tsx
│   │   │   └── CTACard.tsx
│   │   ├── ToolWorkflow/                 # Theme 2 components
│   │   │   ├── IntroCard.tsx
│   │   │   ├── ContentCard.tsx
│   │   │   └── CTACard.tsx
│   │   └── [OtherThemes]/
│   │
│   ├── FieldEditors/                     # Custom editors for Properties Panel
│   │   ├── TextInput.tsx
│   │   ├── TextareaInput.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── StepsEditor.tsx               # For editing steps array
│   │   ├── ToolsEditor.tsx               # For editing tools array
│   │   ├── WorkflowEditor.tsx            # For editing workflow array
│   │   ├── BulletPointsEditor.tsx
│   │   ├── ColorPicker.tsx
│   │   └── ListEditor.tsx
│   │
│   └── ThemePicker.tsx                   # Grid of theme previews
│
├── themes/
│   ├── index.ts                          # ThemeRegistry
│   ├── execution-steps.ts                # Theme 1 definition
│   ├── tool-workflow.ts                  # Theme 2 definition
│   └── [other-themes].ts
│
├── store/
│   └── useCarouselStore.ts               # Zustand store
│
└── types/
    └── carousel.ts                       # All TypeScript interfaces

10. Implementation Phases
Phase 1: Foundation

Set up Next.js project with TypeScript and Tailwind
Create TypeScript interfaces for all data models
Set up Zustand store with sample data
Create basic 3-column EditorLayout component

Phase 2: Slide Navigation

Build SlideNavigator component
Implement click handlers to switch active slide
Add "Add New Slide" functionality with dropdown
Add delete slide functionality
Display slide thumbnails

Phase 3: Canvas & First Theme

Create Canvas component with fixed 4:5 aspect ratio
Build one complete theme (all 3 card types: Intro, Content, CTA)
Wire up theme rendering logic (ThemeRegistry lookup)
Test theme switching

Phase 4: Dynamic Properties Panel

Build PropertiesPanel component that reads theme's editorConfig
Create field renderer that dynamically shows inputs based on field type
Build custom editors: StepsEditor, ToolsEditor, WorkflowEditor
Wire up real-time updates from inputs to Canvas

Phase 5: Theme System

Build ThemePicker component
Implement theme switching logic
Create second theme to test theme independence
Ensure content persists when switching themes

Phase 6: Polish & Export

Add drag-and-drop reordering in SlideNavigator
Build export functionality (html-to-image)
Add loading states and error handling
Improve responsive design


11. Critical Questions to Clarify

Data Persistence: Should projects be saved to localStorage, a database, or just session state?
Image Handling: Should we support image uploads or just URLs? Where are images stored?
Undo/Redo: Do we need undo/redo functionality?
Collaboration: Will multiple users edit the same carousel?
Templates: Should users be able to save their carousels as templates?
Custom Themes: Will users be able to create their own themes in the future?


12. Visual Design References
Refer to the two images provided:
Image 1 shows the "Execution Steps" theme:

Peach/beige background (#FED7AA)
Red accent color (#DC2626) for headers
Numbered steps in white rounded boxes
Vertical connecting lines between steps
Profile badge at top left
Pagination dots at bottom
Navigation arrow at bottom right

Image 2 shows theContinue5:03 PM"Tool Workflow" theme:

Similar peach background
Orange accent badges for section labels
Rounded number badge (salmon/coral color)
Horizontal pill-style tool badges with icons
Stacked workflow steps in white boxes
Arrow indicators between workflow steps
Black circular navigation buttons

Both themes share a warm, modern aesthetic but have completely different layouts and component structures.