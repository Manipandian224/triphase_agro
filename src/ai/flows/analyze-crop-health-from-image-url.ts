'use server';
/**
 * @fileOverview Analyzes crop health from an image URL, providing a label, confidence score, and a list of problems and solutions.
 * This flow fetches the image from the URL on the server to avoid client-side CORS issues.
 *
 * - analyzeCropHealthFromImageUrl - A function that handles the crop health analysis process from a URL.
 * - AnalyzeCropHealthFromImageUrlInput - The input type for the function.
 * - AnalyzeCropHealthFromImageUrlOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  analyzeCropHealthFromImage,
  AnalyzeCropHealthFromImageOutput,
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

// This flow takes a URL, fetches it on the server, converts it to a data URI,
// and then calls the existing flow for analysis.
const analyzeCropHealthFromImageUrlFlow = ai.defineFlow(
  {
    name: 'analyzeCropHealthFromImageUrlFlow',
    inputSchema: AnalyzeCropHealthFromImageUrlInputSchema,
    outputSchema: z.custom<AnalyzeCropHealthFromImageUrlOutput>(),
  },
  async ({ photoUrl }) => {
    // Fetch the image from the URL on the server.
    const response = await fetch(photoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${photoUrl}`);
    }
    const blob = await response.blob();

    // Convert the image blob to a data URI.
    const reader = new FileReader();
    const photoDataUri = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      // FileReader in this context is a server-side polyfill, not browser API.
      // It needs an ArrayBuffer.
      blob.arrayBuffer().then(buffer => reader.readAsDataURL(new Blob([buffer])));
    });
    
    // Call the original analysis flow with the data URI.
    return analyzeCropHealthFromImage({ photoDataUri });
  }
);
