'use server';
/**
 * @fileOverview A conversational AI flow for expert crop health analysis.
 *
 * - askCropExpert - A function that handles the conversational chat logic.
 * - AskCropExpertInput - The input type for the function.
 * - AskCropExpertOutput - The return type for the function.
 * - ChatMessage - The type for a single message in the chat history.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MediaPartSchema = z.object({
    url: z.string().describe('The data URI of the media.'),
});

const ContentPartSchema = z.object({
  text: z.string().optional(),
  media: MediaPartSchema.optional(),
});

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(ContentPartSchema),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const AskCropExpertInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The chat history.'),
  question: z
    .string()
    .describe('The user\'s latest question.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of a crop, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  targetLanguage: z.string().describe('The target language code for the response (e.g., "en", "es").'),
});
export type AskCropExpertInput = z.infer<typeof AskCropExpertInputSchema>;

const AskCropExpertOutputSchema = z.object({
  answer: z.string().describe('The AI\'s response to the user\'s question.'),
});
export type AskCropExpertOutput = z.infer<typeof AskCropExpertOutputSchema>;

export async function askCropExpert(
  input: AskCropExpertInput
): Promise<AskCropExpertOutput> {
  return askCropExpertFlow(input);
}

const cropExpertPrompt = ai.definePrompt({
  name: 'askCropExpertPrompt',
  input: { schema: AskCropExpertInputSchema },
  output: { schema: AskCropExpertOutputSchema },
  prompt: `You are an expert AI botanist and agriculture assistant named AgriBot. Your goal is to provide helpful, concise, and accurate advice to farmers.

  - If an image is provided, analyze it in detail.
  - If the user asks for solutions or identifies a problem, provide solutions in a clear, point-by-point list.
  - Keep your responses friendly and easy to understand for a non-expert.
  - Always respond in the user's target language: {{targetLanguage}}.

  Current Question: {{question}}
  {{#if photoDataUri}}
  Image for Analysis: {{media url=photoDataUri}}
  {{/if}}
  `,
});

const askCropExpertFlow = ai.defineFlow(
  {
    name: 'askCropExpertFlow',
    inputSchema: AskCropExpertInputSchema,
    outputSchema: AskCropExpertOutputSchema,
  },
  async (input) => {
    const { history, question, photoDataUri, targetLanguage } = input;

    const { output } = await cropExpertPrompt(
      { question, photoDataUri, targetLanguage },
      { history }
    );
    return output!;
  }
);
