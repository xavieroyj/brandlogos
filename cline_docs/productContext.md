# Product Context: BrandLogos

## Purpose
BrandLogos is a Next.js application designed to help startups generate professional logos using AI technology. The application leverages a two-step AI process to create unique and meaningful brand identities.

## Problem Statement
- Startups often struggle with creating professional logos
- Traditional logo design services can be expensive and time-consuming
- Need for quick, AI-powered logo generation that understands brand context

## Core Functionality
1. **Text Generation Phase**
   - Takes user input about their brand/startup
   - Uses AI text model to generate logo concepts and ideas
   
2. **Image Generation Phase**
   - Takes the text-generated concepts
   - Transforms ideas into visual logos using AI image generation

## Expected Behavior
- User provides brand information through a form interface
- System processes input through text generation model for ideation
- Text output is used to generate visual logo options
- User can view and select from generated logos
- User can download selected logos as a zip package containing:
  - Original logo file
  - Ready-to-use favicon package in standard sizes
  - Web-optimized versions

## Asset Generation
- **Favicon Package**
  - Standard sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
  - ICO format for wide browser compatibility
  - PNG format for modern web usage
  - Web manifest sizes (192x192, 512x512)
  - Apple touch icon sizes