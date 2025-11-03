'use server';
/**
 * @fileOverview Analyzes crop health from an image, providing a label, confidence score, bounding boxes (if available), and recommended actions.
 *
 * - analyzeCropHealthFromImage - A function that handles the crop health analysis process.
 * - AnalyzeCropHealthFromImageInput - The input type for the analyzeCropHealthFromImage function.
 * - AnalyzeCropHealthFromImageOutput - The return type for the analyzeCropHealthFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCropHealthFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCropHealthFromImageInput = z.infer<typeof AnalyzeCropHealthFromImageInputSchema>;

const AnalyzeCropHealthFromImageOutputSchema = z.object({
  label: z.string().describe('The AI analysis label (disease/healthy).'),
  confidence: z.number().describe('The confidence score of the AI analysis (0-1).'),
  boundingBoxes: z
    .array(
      z.object({
        x: z.number().describe('The x coordinate of the bounding box (0-1).'),
        y: z.number().describe('The y coordinate of the bounding box (0-1).'),
        w: z.number().describe('The width of the bounding box (0-1).'),
        h: z.number().describe('The height of the bounding box (0-1).'),
      })
    )
    .optional()
    .describe('The bounding boxes identifying the area of interest.'),
  recommendedActions: z.string().describe('Recommended actions based on the AI analysis.'),
});
export type AnalyzeCropHealthFromImageOutput = z.infer<typeof AnalyzeCropHealthFromImageOutputSchema>;

export async function analyzeCropHealthFromImage(
  input: AnalyzeCropHealthFromImageInput
): Promise<AnalyzeCropHealthFromImageOutput> {
  return analyzeCropHealthFromImageFlow(input);
}

const analyzeCropHealthFromImagePrompt = ai.definePrompt({
  name: 'analyzeCropHealthFromImagePrompt',
  input: {schema: AnalyzeCropHealthFromImageInputSchema},
  output: {schema: AnalyzeCropHealthFromImageOutputSchema},
  prompt: `You are an AI expert in diagnosing crop health from images. Analyze the provided image and provide a label (disease/healthy), confidence score, bounding boxes (if available), and recommended actions.

  Analyze the following image:
  {{media url=photoDataUri}}

  Return the analysis in JSON format. Include bounding boxes if the image contains identifiable areas of interest related to the diagnosis.
  `,
});

const analyzeCropHealthFromImageFlow = ai.defineFlow(
  {
    name: 'analyzeCropHealthFromImageFlow',
    inputSchema: AnalyzeCropHealthFromImageInputSchema,
    outputSchema: AnalyzeCropHealthFromImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeCropHealthFromImagePrompt(input);
    return output!;
  }
);
