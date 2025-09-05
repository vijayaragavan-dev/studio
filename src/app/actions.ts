'use server';

import type { z } from 'zod';
import {
  suggestDestinationsBasedOnPreferences,
  type SuggestDestinationsBasedOnPreferencesInput,
} from '@/ai/flows/suggest-destinations-based-on-preferences';
import { displayDestinationDetailsWithGenAIBrief } from '@/ai/flows/display-destination-details-with-genai-brief';

import type { FormSchema } from '@/lib/schema';
import { keyMapping } from '@/lib/data';

export async function getSuggestionsAction(data: z.infer<typeof FormSchema>) {
  const input: SuggestDestinationsBasedOnPreferencesInput = Object.entries(data).reduce(
    (acc, [key, value]) => {
      const aiKey = keyMapping[key];
      if (aiKey) {
        // @ts-ignore
        acc[aiKey] = value;
      }
      return acc;
    },
    {} as SuggestDestinationsBasedOnPreferencesInput
  );

  try {
    const result = await suggestDestinationsBasedOnPreferences(input);
    return result;
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw new Error('Failed to fetch suggestions.');
  }
}

export async function getDestinationDetailsAction(destinationName: string, imageUrl: string) {
  try {
    const result = await displayDestinationDetailsWithGenAIBrief({ destinationName, imageUrl });
    return result;
  } catch (error) {
    console.error('Error getting destination details:', error);
    throw new Error('Failed to fetch destination details.');
  }
}
