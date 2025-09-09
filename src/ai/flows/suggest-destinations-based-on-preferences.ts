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
  travelMood: z.string().describe("The user's travel mood."),
  travelType: z.string().describe("The user's preferred travel type."),
  travelPace: z.string().describe("The user's desired travel pace."),
  budgetStyle: z.string().describe("The user's budget style."),
  travelDuration: z.string().describe("The user's desired travel duration."),
  preferredWeather: z.string().describe("The user's preferred weather conditions."),
  favoriteScenery: z.string().describe("The user's favorite scenery type."),
  preferredFoodStyle: z.string().describe("The user's preferred food style."),
  likedActivities: z.string().describe("The activities the user enjoys."),
  travelAroundPreference: z.string().describe("The user's preferred mode of transportation."),
  tripGoal: z.string().describe("The user's main goal for the trip."),
  preferredRegion: z.string().describe("The user's preferred travel region."),
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
        imageUrl: z.string().describe('A beautiful, descriptive prompt for an image of the destination.'),
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
  const result = await suggestDestinationsBasedOnPreferencesFlow(input);
  
  // Use a placeholder image service with the generated prompt
  if (result.destinations) {
    result.destinations.forEach(dest => {
      dest.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(dest.imageUrl)}/800/600`;
    });
  }

  return result;
}

const prompt = ai.definePrompt({
  name: 'suggestDestinationsBasedOnPreferencesPrompt',
  input: {schema: SuggestDestinationsBasedOnPreferencesInputSchema},
  output: {schema: SuggestDestinationsBasedOnPreferencesOutputSchema},
  prompt: `You are a travel expert. A user has answered a questionnaire with the following preferences:

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

Based on these preferences, suggest some travel destinations. For each destination, provide a name, a short description, and a beautiful, descriptive prompt for an image.

Ensure the output matches the schema exactly.
`,
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
