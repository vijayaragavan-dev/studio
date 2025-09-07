
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const suggestDestinationsCode = `
'use server';

/**
 * @fileOverview A travel destination suggestion AI agent based on user preferences.
 *
 * - suggestDestinationsBasedOnPreferences - A function that handles the travel destination suggestion process.
 * - SuggestDestinationsBasedOnPreferencesInput - The input type for the suggestDestinationsBasedOnPreferences function.
 * - SuggestDestinationsBasedOnPreferencesOutput - The return type for the suggestDestinationsBasedOnPreferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDestinationsBasedOnPreferencesInputSchema = z.object({
  travelMood: z.string().describe('The user\\'s travel mood.'),
  travelType: z.string().describe('The user\\'s preferred travel type.'),
  travelPace: z.string().describe('The user\\'s desired travel pace.'),
  budgetStyle: z.string().describe('The user\\'s budget style.'),
  travelDuration: z.string().describe('The user\\'s desired travel duration.'),
  preferredWeather: z.string().describe('The user\\'s preferred weather conditions.'),
  favoriteScenery: z.string().describe('The user\\'s favorite scenery type.'),
  preferredFoodStyle: z.string().describe('The user\\'s preferred food style.'),
  likedActivities: z.string().describe('The activities the user enjoys.'),
  travelAroundPreference: z.string().describe('The user\\'s preferred mode of transportation.'),
  tripGoal: z.string().describe('The user\\'s main goal for the trip.'),
  preferredRegion: z.string().describe('The user\\'s preferred travel region.'),
});

export type SuggestDestinationsBasedOnPreferencesInput = z.infer<
  typeof SuggestDestinationsBasedOnPreferencesInputSchema
>;

const SuggestDestinationsBasedOnPreferencesOutputSchema = z.object({
  destinations: z
    .array(
      z.object({
        name: z.string().describe('The name of the destination.'),
        description: z.string().describe('A short description of the destination.'),
        imageUrl: z.string().describe('A URL of an image of the destination.'),
      })
    )
    .describe('An array of suggested travel destinations.'),
});

export type SuggestDestinationsBasedOnPreferencesOutput = z.infer<
  typeof SuggestDestinationsBasedOnPreferencesOutputSchema
>;

export async function suggestDestinationsBasedOnPreferences(
  input: SuggestDestinationsBasedOnPreferencesInput
): Promise<SuggestDestinationsBasedOnPreferencesOutput> {
  return suggestDestinationsBasedOnPreferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDestinationsBasedOnPreferencesPrompt',
  input: {schema: SuggestDestinationsBasedOnPreferencesInputSchema},
  output: {schema: SuggestDestinationsBasedOnPreferencesOutputSchema},
  prompt: \`You are a travel expert. A user has answered a questionnaire with the following preferences:

Travel Mood: {{{travelMood}}}
Travel Type: {{{travelType}}}
Travel Pace: {{{travelPace}}}
Budget Style: {{{budgetStyle}}}
Travel Duration: {{{travelDuration}}}
Preferred Weather: {{{preferredWeather}}}
Favorite Scenery: {{{favoriteScenery}}}
Preferred Food Style: {{{preferredFoodStyle}}}
Liked Activities: {{{likedActivities}}}
Travel Around Preference: {{{travelAroundPreference}}}
Trip Goal: {{{tripGoal}}}
Preferred Region: {{{preferredRegion}}}

Based on these preferences, suggest some travel destinations. For each destination, provide a name, a short description, and a URL of an image.

Ensure the output matches the schema exactly.  The imageUrl should be a stable URL pointing to an actual image.  Do not include URLs that might expire or change.
\`,
});

const suggestDestinationsBasedOnPreferencesFlow = ai.defineFlow(
  {
    name: 'suggestDestinationsBasedOnPreferencesFlow',
    inputSchema: SuggestDestinationsBasedOnPreferencesInputSchema,
    outputSchema: SuggestDestinationsBasedOnPreferencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
`;

const destinationDetailsCode = `
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
  prompt: \`You are a travel expert who provides brief summaries of destinations.

  Provide a one-sentence summary of the following destination:

  Destination Name: {{{destinationName}}}
  Image URL: {{{imageUrl}}}
  \`,
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
`;

export default function BackendCodePage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold">Backend Code</h1>
        <p className="text-muted-foreground mt-2">
          Here is the Genkit code that powers the AI suggestions.
        </p>
        <Link href="/" className="text-primary hover:underline mt-4 inline-block">
          &larr; Back to Home
        </Link>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>src/ai/flows/suggest-destinations-based-on-preferences.ts</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{suggestDestinationsCode}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>src/ai/flows/display-destination-details-with-genai-brief.ts</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{destinationDetailsCode}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
