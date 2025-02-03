# System Patterns & Architecture

## Application Architecture
- Next.js App Router architecture
- React Server Components based structure
- Vercel AI SDK integration

## Key Components
1. **Frontend Components**
   - BrandForm.tsx: Main form component for user input
   - IconDisplay.tsx: Component for displaying generated logos
   - UI Components: Comprehensive shadcn/ui component library integration

2. **Core Libraries**
   - lib/ai-config.ts: AI service configuration
   - lib/generate-prompt.ts: Prompt generation logic
   - lib/prompt-template.ts: Template system for AI prompts
   - lib/schema.ts: Data validation schemas
   - lib/helper.ts: Utility functions
   - lib/styles.ts: Styling utilities

## Technical Patterns
1. **AI Processing Pipeline**
   - Two-stage generation process
   - Text generation for concept development
   - Image generation for visual output

2. **Asset Generation Pipeline**
   - Favicon generation in multiple sizes
   - ZIP file packaging system
   - Client-side download handling

3. **State Management**
   - Form state handling
   - Generation process state
   - Display state management
   - Download state handling

4. **Directory Structure**
   ```
   app/ - Next.js app router pages
   components/ - React components
   lib/ - Core utilities
     /download/ - Download utilities
     /favicon/ - Favicon generation
   hooks/ - Custom React hooks
   ```

## Design Decisions
- Usage of App Router for modern Next.js features
- Integration of shadcn/ui for consistent UI
- Separation of AI configuration and business logic
- Modular prompt template system