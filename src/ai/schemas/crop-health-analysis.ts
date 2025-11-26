import { z } from 'genkit';

export const AnalyzeCropHealthFromImageOutputSchema = z.object({
  label: z
    .string()
    .describe('The AI analysis label (e.g., "Corn Leaf Blight", "Healthy").'),
  confidence: z
    .number()
    .describe('The confidence score of the AI analysis (0-1).'),
  problems: z
    .array(z.string())
    .describe(
      'A point-by-point list of problems identified in the crop.'
    ),
  solutions: z
    .array(z.string())
    .describe(
      'A point-by-point list of recommended solutions for the identified problems.'
    ),
});

export type AnalyzeCropHealthFromImageOutput = z.infer<
  typeof AnalyzeCropHealthFromImageOutputSchema
>;
