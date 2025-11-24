/**
 * @fileOverview Zod schemas and TypeScript types for the generatePlantGuide flow.
 *
 * - GeneratePlantGuideInputSchema, GeneratePlantGuideInput
 * - GeneratePlantGuideOutputSchema, GeneratePlantGuideOutput
 * - DiseaseInfoSchema, DiseaseInfo
 */

import { z } from 'zod';

export const GeneratePlantGuideInputSchema = z.object({
  plantName: z.string().describe('The name of the plant to generate a guide for.'),
});
export type GeneratePlantGuideInput = z.infer<typeof GeneratePlantGuideInputSchema>;

export const DiseaseInfoSchema = z.object({
  name: z.string().describe('The common name of the disease.'),
  symptoms: z.string().describe('A point-by-point list of symptoms.'),
  cause: z
    .string()
    .describe('The cause of the disease (e.g., fungal, bacterial, viral, pest, nutrient deficiency).'),
  severity: z.enum(['Low', 'Medium', 'High']).describe('The typical severity level of the disease.'),
  treatment: z.string().describe('A point-by-point list of treatment recommendations.'),
  prevention: z.string().describe('A point-by-point list of prevention tips.'),
});
export type DiseaseInfo = z.infer<typeof DiseaseInfoSchema>;

const DiseaseInfoWithImageSchema = DiseaseInfoSchema.extend({
  diseaseImage: z.string().describe('A data URI of an AI-generated image showing the disease symptoms.'),
});
type DiseaseInfoWithImage = z.infer<typeof DiseaseInfoWithImageSchema>;

export const GeneratePlantGuideOutputSchema = z.object({
  plantImage: z.string().describe('A data URI of the AI-generated, product-style plant image.'),
  plantDetails: z.object({
    plantName: z.string(),
    botanicalName: z.string(),
    category: z.string(),
    waterRequirement: z.string(),
    sunlightRequirement: z.string(),
  }),
  growthDuration: z.object({
    germinationTime: z.string(),
    seedlingStageDuration: z.string(),
    vegetativeGrowthDuration: z.string(),
    floweringDuration: z.string(),
    fullMaturityDuration: z.string(),
    averageHeightAndSpread: z.string(),
  }),
  commonDiseases: z
    .array(DiseaseInfoWithImageSchema)
    .describe('A list of common diseases with details and a reference image for the first two.'),
  summary: z.object({
    easyCareTips: z.string(),
    idealSoilType: z.string(),
    idealTemperatureAndHumidity: z.string(),
    fertilizerCycle: z.string(),
  }),
});
export type GeneratePlantGuideOutput = z.infer<typeof GeneratePlantGuideOutputSchema>;
