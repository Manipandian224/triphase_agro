'use server';
/**
 * @fileOverview Analyzes crop health from an image, providing a label, confidence score, and a list of problems and solutions.
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
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type AnalyzeCropHealthFromImageInput = z.infer<typeof AnalyzeCropHealthFromImageInputSchema>;

const AnalyzeCropHealthFromImageOutputSchema = z.object({
  label: z.string().describe('The AI analysis label (e.g., "Corn Leaf Blight", "Healthy").'),
  confidence: z.number().describe('The confidence score of the AI analysis (0-1).'),
  problems: z
    .array(z.string())
    .describe('A point-by-point list of problems identified in the crop.'),
  solutions: z
    .array(z.string())
    .describe('A point-by-point list of recommended solutions for the identified problems.'),
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
  prompt: `You are an expert AI botanist. Analyze the provided image to diagnose crop health. 

  Analyze the following image:
  {{media url=photoDataUri}}

  Return the analysis in JSON format.
  - Provide a short, specific label for the diagnosis (e.g., "Corn Leaf Blight", "Healthy").
  - Provide a confidence score for your analysis.
  - List the observed problems in a point-by-point format.
  - Recommend clear, actionable solutions for each problem in a point-by-point format.
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
