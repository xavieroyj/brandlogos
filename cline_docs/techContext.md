# Technical Context

## Technology Stack

### Core Technologies
- Next.js 14+ (App Router)
- TypeScript
- React Server Components
- Vercel AI SDK

### UI Framework
- Tailwind CSS
- shadcn/ui components
- Custom UI components

### Development Tools
- ESLint for code quality
- PostCSS for CSS processing
- TypeScript for type safety

## Development Setup
```bash
# Required Environment Variables
OPENAI_API_KEY=           # For AI model access
```

## Project Structure
```
app/                    # Next.js app router pages
  actions/             # Server actions
  fonts/              # Custom fonts (Geist)
  layout.tsx          # Root layout
  page.tsx            # Main page
components/           # React components
  ui/                # shadcn/ui components
  BrandForm.tsx      # Main form component
  IconDisplay.tsx    # Logo display component
lib/                 # Core utilities
  ai-config.ts       # AI configuration
  generate-prompt.ts # Prompt generation
  prompt-template.ts # Prompt templates
  schema.ts         # Data validation
hooks/               # Custom React hooks
```

## Technical Constraints
1. **AI Model Limitations**
   - Rate limits on API calls
   - Generation time constraints
   - Cost considerations per request

2. **Browser Compatibility**
   - Modern browser support required
   - Client-side processing limitations

3. **Performance Considerations**
   - Image generation processing time
   - State management for large datasets
   - Network bandwidth for image transfer