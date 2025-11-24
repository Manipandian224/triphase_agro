'use server';
/**
 * @fileOverview Generates a comprehensive plant care guide using AI.
 *
 * - generatePlantGuide - The main function to generate the guide.
 * - generatePlantGuideFlow - The underlying Genkit flow.
 */

import { ai } from '@/ai/genkit';
import {
  GeneratePlantGuideInputSchema,
  GeneratePlantGuideOutputSchema,
  type GeneratePlantGuideInput,
  type GeneratePlantGuideOutput,
} from '@/ai/schemas/generate-plant-guide';
import { z } from 'zod';

export async function generatePlantGuide(
  input: GeneratePlantGuideInput
): Promise<GeneratePlantGuideOutput> {
  return generatePlantGuideFlow(input);
}

// Define the schema for the text-only part of the guide.
const PlantGuideContentSchema = GeneratePlantGuideOutputSchema.omit({
  plantImage: true,
  commonDiseases: true,
}).extend({
  commonDiseases: z.array(
    z.object({
      name: z.string(),
      symptoms: z.string(),
      cause: z.string(),
      severity: z.string(),
      treatment: z.string(),
      prevention: z.string(),
    })
  ),
});

// Prompt to generate the main text content of the guide.
const plantGuidePrompt = ai.definePrompt({
  name: 'plantGuidePrompt',
  input: { schema: GeneratePlantGuideInputSchema },
  output: { schema: PlantGuideContentSchema },
  prompt: `Generate a comprehensive plant care guide for "{{plantName}}".
  
  Provide the following details:
  1.  **Plant Details**: Plant Name, Botanical Name, Category (e.g., Indoor, Outdoor, Succulent), Water and Sunlight requirements.
  2.  **Growth Duration & Stages**: Germination time, Seedling stage, Vegetative growth, Flowering, Full maturity duration, and Average height & spread.
  3.  **Common Diseases**: List 6-8 common diseases. For each, provide the Name, Symptoms, Cause (e.g., fungal, bacterial), Severity (low/medium/high), Treatment, and Prevention tips.
  4.  **Summary**: Easy care tips, ideal soil type, ideal temperature/humidity, and fertilizer cycle.
  
  Format the output as clean, well-structured JSON.`,
});

const generatePlantGuideFlow = ai.defineFlow(
  {
    name: 'generatePlantGuideFlow',
    inputSchema: GeneratePlantGuideInputSchema,
    outputSchema: GeneratePlantGuideOutputSchema,
  },
  async (input) => {
    // Step 1: Generate the text-based guide content.
    const guideContentResponse = await plantGuidePrompt(input);
    const guideContent = guideContentResponse.output;

    if (!guideContent) {
      throw new Error('Failed to generate plant guide content.');
    }

    // Step 2: Use placeholder images.
    const plantImage = {
      url: `https://picsum.photos/seed/${input.plantName}/500/500`,
    };
    
    const diseasesWithPlaceholders = guideContent.commonDiseases.map(
      (disease) => ({
        ...disease,
        diseaseImage: {
          url: `https://picsum.photos/seed/${disease.name}/64/64`,
        },
      })
    );

    // Step 3: Combine text content with placeholder images.
    return {
      plantImage,
      details: guideContent.details,
      growth: guideContent.growth,
      commonDiseases: diseasesWithPlaceholders,
      summary: guideContent.summary,
    };
  }
);
