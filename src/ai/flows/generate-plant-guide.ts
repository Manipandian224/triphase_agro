'use server';
/**
 * @fileOverview Generates a comprehensive guide for a given plant, including images.
 *
 * - generatePlantGuide - A function that handles the plant guide generation.
 */

import { ai } from '@/ai/genkit';
import {
  GeneratePlantGuideInput,
  GeneratePlantGuideInputSchema,
  GeneratePlantGuideOutput,
  GeneratePlantGuideOutputSchema,
  DiseaseInfoSchema,
} from '@/ai/schemas/generate-plant-guide';
import { z } from 'zod';

export async function generatePlantGuide(
  input: GeneratePlantGuideInput
): Promise<GeneratePlantGuideOutput> {
  if (!input.plantName) {
    throw new Error('Please provide the plant name.');
  }
  return generatePlantGuideFlow(input);
}

// Internal schema for the text-based part of the guide
const PlantGuideTextOutputSchema = z.object({
  plantDetails: z.object({
    plantName: z.string().describe('The common name of the plant.'),
    botanicalName: z.string().describe('The botanical (Latin) name of the plant.'),
    category: z.string().describe('Category (e.g., Indoor, Outdoor, Succulent, Crop).'),
    waterRequirement: z.string().describe('General watering needs.'),
    sunlightRequirement: z.string().describe('General sunlight needs (e.g., Full Sun, Partial Shade).'),
  }),
  growthDuration: z.object({
    germinationTime: z.string().describe('Typical time for seed germination.'),
    seedlingStageDuration: z.string().describe('Duration of the seedling stage.'),
    vegetativeGrowthDuration: z.string().describe('Duration of the vegetative growth stage.'),
    floweringDuration: z.string().describe('Duration of the flowering stage.'),
    fullMaturityDuration: z.string().describe('Time to reach full maturity.'),
    averageHeightAndSpread: z.string().describe('Average height and spread at maturity.'),
  }),
  commonDiseases: z
    .array(DiseaseInfoSchema)
    .min(6)
    .max(10)
    .describe('A list of 6 to 10 common diseases affecting the plant.'),
  summary: z.object({
    easyCareTips: z.string().describe('A few simple care tips.'),
    idealSoilType: z.string().describe('The ideal soil composition.'),
    idealTemperatureAndHumidity: z.string().describe('Ideal temperature and humidity ranges.'),
    fertilizerCycle: z.string().describe('Recommended fertilizer schedule.'),
  }),
});

const plantGuidePrompt = ai.definePrompt({
  name: 'plantGuidePrompt',
  input: { schema: GeneratePlantGuideInputSchema },
  output: { schema: PlantGuideTextOutputSchema },
  prompt: `You are a world-class botanist and agricultural expert. A user has requested a detailed guide for a specific plant.

  Plant Name: {{plantName}}

  Generate a comprehensive guide covering the following sections. Be thorough and accurate.

  1.  **Plant Details**: Common Name, Botanical Name, Category, Water Requirement, Sunlight Requirement.
  2.  **Growth Duration & Stages**: Germination, Seedling, Vegetative, Flowering, Full Maturity times, and Average Height/Spread.
  3.  **Common Diseases**: Provide a list of 6-10 common diseases. For each disease, detail the Name, Symptoms (point-by-point), Cause (fungal, bacterial, etc.), Severity (Low/Medium/High), Treatment (point-by-point), and Prevention tips (point-by-point).
  4.  **Summary**: Easy care tips, Ideal Soil Type, Ideal Temperature/Humidity, and Fertilizer Cycle.

  Return the entire output in a single, valid JSON object.`,
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
    
    // Step 2: Return content without images.
    return {
      plantImage: '', // Placeholder, will not be generated
      plantDetails: guideContent.plantDetails,
      growthDuration: guideContent.growthDuration,
      commonDiseases: guideContent.commonDiseases.map(disease => ({
        ...disease,
        diseaseImage: '', // Placeholder, will not be generated
      })),
      summary: guideContent.summary,
    };
  }
);
