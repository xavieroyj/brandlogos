# Technical Context

## Technology Stack

### Core Technologies
- Next.js 14+ (App Router)
- TypeScript
- React Server Components
- Vercel AI SDK
- Prisma ORM
- NextAuth.js

### UI Framework
- Tailwind CSS
- shadcn/ui components
- Custom UI components
- Custom animations (AnimatedBeam)

### Development Tools
- ESLint for code quality
- PostCSS for CSS processing
- TypeScript for type safety
- JSZip for package generation
- Prisma Studio for database management

## Development Setup
```bash
# Required Environment Variables
OPENAI_API_KEY=           # For AI model access
DATABASE_URL=             # PostgreSQL database connection
NEXTAUTH_SECRET=          # NextAuth.js secret key
NEXTAUTH_URL=             # NextAuth.js URL
```

## Project Structure
```
app/                    # Next.js app router pages
  /api                 # API routes
    /auth             # Authentication endpoints
  /auth              # Auth pages
  /generator         # Logo generation page
  /actions          # Server actions
  /fonts           # Custom fonts (Geist)
components/         # React components
  /auth           # Authentication components
  /home           # Landing page components
  /shared         # Shared layout components
  /ui            # shadcn/ui components
prisma/            # Prisma database
  schema.prisma   # Database schema
components/           # React components
  /home             # Landing page components
  /shared           # Shared layout components
  /ui              # shadcn/ui components
  BrandForm.tsx    # Logo generation form
  IconDisplay.tsx  # Logo preview component
lib/                # Core utilities
  /download        # Download utilities
  /templates       # Template system
  ai-config.ts     # AI configuration
  generate-prompt.ts # Prompt generation
hooks/              # Custom React hooks
```

## Technical Dependencies
1. **UI Components**
   - shadcn/ui: Base component library
   - lucide-react: Icon system
   - Tailwind CSS: Styling
   - Custom animations

2. **Asset Generation**
   - JSZip: Package creation
   - Canvas API: Image resizing
   - File API: Download handling

3. **State Management**
   - React hooks
   - Server components
   - Form state

4. **Authentication & Database**
   - NextAuth.js: Authentication system
   - Prisma: Database ORM
   - PostgreSQL: Database
   - bcrypt: Password hashing

## Technical Constraints
1. **AI Model Limitations**
   - Rate limits on API calls
   - Generation time constraints
   - Cost considerations per request

2. **Browser Compatibility**
   - Modern browser support required
   - Canvas API support needed
   - Client-side processing limitations

3. **Performance Considerations**
   - Image generation processing time
   - Asset package creation overhead
   - Network bandwidth for transfers
   - Memory usage during processing

4. **Database Operations**
   - Connection pool limits
   - Transaction timeouts
   - Migration considerations
   - Backup requirements

## Code Standards
1. **TypeScript Usage**
   - Strict type checking
   - Interface definitions
   - Type safety in components

2. **Component Structure**
   - Server vs Client components
   - Shared UI components
   - Props interface definitions

3. **State Management**
   - React hooks best practices
   - Form state handling
   - Loading state management

4. **Error Handling**
   - AI generation errors
   - Network failures
   - Asset generation issues
   - User feedback system

5. **Database Patterns**
   - Prisma best practices
   - Migration strategies
   - Data validation
   - Relationship management