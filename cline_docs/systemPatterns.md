# System Patterns & Architecture

## Application Architecture
- Next.js App Router architecture
- React Server Components based structure
- Vercel AI SDK integration
- NextAuth.js authentication
- Prisma ORM for database

## Directory Structure
```
app/
  /api                # API routes
    /auth           # Auth endpoints
  /auth            # Auth pages
  /generator       # Logo generation page
  /actions        # Server actions
  /fonts         # Custom fonts (Geist)
components/
  /auth          # Authentication components
    SignIn.tsx  # Sign in form
    SignUp.tsx  # Sign up form
  /home         # Landing page components
    Hero.tsx   # Hero section
    HowItWorks.tsx # Process explanation
    Pricing.tsx    # Pricing plans
  /shared          # Shared components
prisma/
  schema.prisma    # Database schema
  migrations/     # Database migrations
lib/
  /auth          # Auth utilities
  /db           # Database utilities
  /download     # Download utilities
  /templates    # Template system
  ai-config.ts  # AI configuration
```

## Key Components
1. **Authentication Components**
   - SignIn: User authentication
   - SignUp: User registration
   - AuthProvider: Session management
   - ProtectedRoute: Route protection

2. **Database Components**
   - Prisma Client: Database access
   - Migration system: Schema versioning
   - Connection pooling: Resource management
   - Data validation: Input sanitization

3. **Landing Page Components**
   - Hero: Main marketing message and CTA
   - HowItWorks: Animated process visualization
   - Pricing: Subscription plan details
   - Shared components for layout consistency

4. **Logo Generation Components**
   - BrandForm: User input collection
   - IconDisplay: Logo preview and download
   - UI Components: shadcn/ui library integration

5. **Core Libraries**
   - lib/ai-config.ts: AI service configuration
   - lib/generate-prompt.ts: Prompt generation
   - lib/download/favicon-generator.ts: Asset generation
   - lib/templates: Template system for various use cases

## Technical Patterns
1. **Authentication Patterns**
   - JWT token management
   - Session handling
   - Protected routes
   - Social auth integration

2. **Database Patterns**
   - Repository pattern
   - Connection pooling
   - Transaction management
   - Migration strategies

3. **UI/UX Patterns**
   - Animated step visualization
   - Interactive form components
   - Real-time preview updates
   - Download state management

4. **AI Processing Pipeline**
   - Two-stage generation process
   - Text generation for concepts
   - Image generation for visuals

5. **Asset Generation Pipeline**
   - Favicon generation in multiple sizes
   - ZIP file packaging system
   - Client-side download handling

6. **State Management**
   - Form state handling
   - Generation process state
   - Download state management

## Design Decisions
1. **Authentication**
   - NextAuth.js for flexible auth
   - JWT for stateless sessions
   - Social auth providers
   - Secure password handling

2. **Database**
   - Prisma for type-safe queries
   - PostgreSQL for reliability
   - Connection pooling
   - Automated migrations

3. **UI Framework**
   - Usage of App Router for modern Next.js features
   - Integration of shadcn/ui for consistent design
   - Custom animations for better UX
   - Responsive design patterns

4. **Code Organization**
   - Feature-based component structure
   - Shared UI component library
   - Separation of concerns between UI and logic
   - Modular utility functions

5. **Performance**
   - Client-side asset generation
   - Optimized image handling
   - Progressive loading states
   - Error boundary implementation