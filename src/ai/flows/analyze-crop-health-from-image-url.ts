
'use server';
/**
 * @fileOverview Analyzes crop health from an image URL, providing a label, confidence score, and a list of problems and solutions.
 * This flow passes the image URL directly to the model for analysis.
 *
 * - analyzeCropHealthFromImageUrl - A function that handles the crop health analysis process from a URL.
 * - AnalyzeCropHealthFromImageUrlInput - The input type for the function.
 * - AnalyzeCropHealthFromImageUrlOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  AnalyzeCropHealthFromImageInput,
  AnalyzeCropHealthFromImageOutput,
  AnalyzeCropHealthFromImageOutputSchema,
} from './analyze-crop-health-from-image';

const AnalyzeCropHealthFromImageUrlInputSchema = z.object({
  photoUrl: z.string().url().describe('A URL of a photo of a crop.'),
});
export type AnalyzeCropHealthFromImageUrlInput = z.infer<
  typeof AnalyzeCropHealthFromImageUrlInputSchema
>;

export type AnalyzeCropHealthFromImageUrlOutput = AnalyzeCropHealthFromImageOutput;

export async function analyzeCropHealthFromImageUrl(
  input: AnalyzeCropHealthFromImageUrlInput
): Promise<AnalyzeCropHealthFromImageUrlOutput> {
  return analyzeCropHealthFromImageUrlFlow(input);
}

// This is a new prompt that is identical to the original, but it accepts a `photoUrl` instead of a `photoDataUri`.
const analyzeCropHealthFromImageUrlPrompt = ai.definePrompt({
  name: 'analyzeCropHealthFromImageUrlPrompt',
  input: {
    schema: z.object({
      photoUrl: z
        .string()
        .url()
        .describe(
          "A URL of a photo of a crop. The model will fetch this image."
        ),
    }),
  },
  output: { schema: AnalyzeCropHealthFromImageOutputSchema },
  prompt: `You are an expert AI botanist. Analyze the provided image to diagnose crop health. 

  Analyze the following image:
  {{media url=photoUrl}}

  Return the analysis in JSON format.
  - Provide a short, specific label for the diagnosis (e.g., "Corn Leaf Blight", "Healthy").
  - Provide a confidence score for your analysis.
  - List the observed problems in a point-by-point format.
  - Recommend clear, actionable solutions for each problem in a point-by-point format.
  `,
});

// This flow takes a URL and passes it directly to the prompt. The model itself will fetch the image.
const analyzeCropHealthFromImageUrlFlow = ai.defineFlow(
  {
    name: 'analyzeCropHealthFromImageUrlFlow',
    inputSchema: AnalyzeCropHealthFromImageUrlInputSchema,
    outputSchema: z.custom<AnalyzeCropHealthFromImageUrlOutput>(),
  },
  async ({ photoUrl }) => {
    const { output } = await analyzeCropHealthFromImageUrlPrompt({ photoUrl });
    return output!;
  }
);
