import * as z from 'zod';
import { questions } from './data';

const schemaFields = questions.reduce(
  (acc, q) => {
    acc[q.key] = z.string({
      required_error: 'Please make a selection.',
    });
    return acc;
  },
  {} as Record<string, z.ZodString>
);

export const FormSchema = z.object(schemaFields);
