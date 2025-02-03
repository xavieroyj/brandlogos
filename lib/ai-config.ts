import { createFal } from '@ai-sdk/fal';
import { createGroq } from '@ai-sdk/groq';

// Create FAL provider
export const fal = createFal({
  apiKey: process.env.FAL_API_KEY,
});

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Initialize the models
export const textModel = groq('llama3-70b-8192');
export const imageModel = fal.image('fal-ai/flux/schnell');