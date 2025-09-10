import {genkit, GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins: GenkitPlugin[] = [];
if (process.env.GEMINI_API_KEY) {
  plugins.push(googleAI());
}

export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.5-flash',
});
