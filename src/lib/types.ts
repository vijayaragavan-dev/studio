import type { FormSchema } from './schema';
import type { z } from 'zod';

export interface Question {
  id: number;
  question: string;
  options: string[];
  key: string;
  icons?: React.FC<React.SVGProps<SVGSVGElement>>[];
  selectType: 'single' | 'multiple';
}

export interface Destination {
  name: string;
  description: string;
  imageUrl: string;
}

export interface HistoryItem {
  id: string;
  createdAt: Date;
  preferences: z.infer<typeof FormSchema>;
  suggestions: Destination[];
}
