import { z } from 'zod';

export const GeneratePlantGuideInputSchema = z.object({
  plantName: z.string().describe('The common name of the plant.'),
});
export type GeneratePlantGuideInput = z.infer<typeof GeneratePlantGuideInputSchema>;


const PlantImageSchema = z.object({
    url: z.string().describe('URL of the generated plant image.'),
}).optional();

const DiseaseImageSchema = z.object({
    url: z.string().describe('URL of the generated disease image.'),
}).optional();


export const GeneratePlantGuideOutputSchema = z.object({
  plantImage: PlantImageSchema,
  details: z.object({
    plantName: z.string(),
    botanicalName: z.string(),
    category: z.string(),
    waterRequirement: z.string(),
    sunlightRequirement: z.string(),
  }),
  growth: z.object({
    germinationTime: z.string(),
    seedlingStageDuration: z.string(),
    vegetativeGrowthDuration: z.string(),
    floweringDuration: z.string(),
    fullMaturityDuration: z.string(),
    averageHeightAndSpread: z.string(),
  }),
  commonDiseases: z.array(
    z.object({
      name: z.string(),
      symptoms: z.string(),
      cause: z.string(),
      severity: z.string(),
      treatment: z.string(),
      prevention: z.string(),
      diseaseImage: DiseaseImageSchema,
    })
  ),
  summary: z.object({
    easyCareTips: z.string(),
    idealSoilType: z.string(),
    idealTemperatureHumidity: z.string(),
    fertilizerCycle: z.string(),
  }),
});
export type GeneratePlantGuideOutput = z.infer<typeof GeneratePlantGuideOutputSchema>;
