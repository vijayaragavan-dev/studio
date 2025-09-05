// src/ai/flows/display-destination-details-with-genai-brief.ts
'use server';
/**
 * @fileOverview A flow to display destination details with a brief AI-generated summary.
 *
 * - displayDestinationDetailsWithGenAIBrief - A function that handles the process of displaying destination details with an AI-generated brief.
 * - DisplayDestinationDetailsWithGenAIBriefInput - The input type for the displayDestinationDetailsWithGenAIBrief function.
 * - DisplayDestinationDetailsWithGenAIBriefOutput - The return type for the displayDestinationDetailsWithGenAIBrief function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisplayDestinationDetailsWithGenAIBriefInputSchema = z.object({
  destinationName: z.string().describe('The name of the destination.'),
  imageUrl: z.string().describe('The URL of an image of the destination.'),
});
export type DisplayDestinationDetailsWithGenAIBriefInput = z.infer<typeof DisplayDestinationDetailsWithGenAIBriefInputSchema>;

const DisplayDestinationDetailsWithGenAIBriefOutputSchema = z.object({
  destinationName: z.string().describe('The name of the destination.'),
  imageUrl: z.string().describe('The URL of an image of the destination.'),
  summary: z.string().describe('A brief AI-generated summary of the destination.'),
});
export type DisplayDestinationDetailsWithGenAIBriefOutput = z.infer<typeof DisplayDestinationDetailsWithGenAIBriefOutputSchema>;

export async function displayDestinationDetailsWithGenAIBrief(input: DisplayDestinationDetailsWithGenAIBriefInput): Promise<DisplayDestinationDetailsWithGenAIBriefOutput> {
  return displayDestinationDetailsWithGenAIBriefFlow(input);
}

const prompt = ai.definePrompt({
  name: 'displayDestinationDetailsWithGenAIBriefPrompt',
  input: {schema: DisplayDestinationDetailsWithGenAIBriefInputSchema},
  output: {schema: DisplayDestinationDetailsWithGenAIBriefOutputSchema},
  prompt: `You are a travel expert who provides brief summaries of destinations.

  Provide a one-sentence summary of the following destination:

  Destination Name: {{{destinationName}}}
  Image URL: {{{imageUrl}}}`,
});

const displayDestinationDetailsWithGenAIBriefFlow = ai.defineFlow(
  {
    name: 'displayDestinationDetailsWithGenAIBriefFlow',
    inputSchema: DisplayDestinationDetailsWithGenAIBriefInputSchema,
    outputSchema: DisplayDestinationDetailsWithGenAIBriefOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
