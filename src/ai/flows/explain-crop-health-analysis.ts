'use server';

/**
 * @fileOverview Explains the AI's reasoning behind a crop health analysis.
 *
 * - explainCropHealthAnalysis - A function that explains the AI's reasoning for a crop health analysis.
 * - ExplainCropHealthAnalysisInput - The input type for the explainCropHealthAnalysis function.
 * - ExplainCropHealthAnalysisOutput - The return type for the explainCropHealthAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCropHealthAnalysisInputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      'A URL of a crop image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  label: z.string().describe('The AI-predicted label for the crop image (e.g., leaf-blight, healthy).'),
  confidence: z.number().describe('The confidence score (0-1) of the AI prediction.'),
  sensorSnapshot: z
    .object({
      soilMoisture: z.number().optional(),
      airTemp: z.number().optional(),
    })
    .optional()
    .describe('A snapshot of sensor data taken at the time of image capture.'),
});
export type ExplainCropHealthAnalysisInput = z.infer<typeof ExplainCropHealthAnalysisInputSchema>;

const ExplainCropHealthAnalysisOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'An explanation of the key features (e.g., leaf discoloration, spots) that triggered the AI prediction.'
    ),
  confidenceReasoning: z
    .string()
    .describe('Explanation of how sensor data and image analysis influenced the AI confidence score'),
});
export type ExplainCropHealthAnalysisOutput = z.infer<typeof ExplainCropHealthAnalysisOutputSchema>;

export async function explainCropHealthAnalysis(
  input: ExplainCropHealthAnalysisInput
): Promise<ExplainCropHealthAnalysisOutput> {
  return explainCropHealthAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCropHealthAnalysisPrompt',
  input: {schema: ExplainCropHealthAnalysisInputSchema},
  output: {schema: ExplainCropHealthAnalysisOutputSchema},
  prompt: `You are an expert AI assistant specializing in explaining the reasoning behind AI-powered crop health analysis. Given an image, its AI-predicted label, confidence score, and associated sensor data, you will generate a clear and concise explanation of the key features that led to the prediction.

  Consider the following information when formulating your response:

  Image URL: {{imageUrl}}
  Predicted Label: {{label}}
  Confidence Score: {{confidence}}
  Sensor Snapshot: {{sensorSnapshot}}

  Provide a detailed explanation of the key visual features (e.g., leaf discoloration, spots, lesions) in the image that contributed to the AI prediction. 
  Explain how the confidence score was influenced by the image analysis and sensor readings.
  Focus on providing actionable insights that a farm manager can use to understand the AI's reasoning.

  Explanation:
  `,
});

const explainCropHealthAnalysisFlow = ai.defineFlow(
  {
    name: 'explainCropHealthAnalysisFlow',
    inputSchema: ExplainCropHealthAnalysisInputSchema,
    outputSchema: ExplainCropHealthAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
