import * as z from 'zod';
import { questions } from './data';

const schemaFields = questions.reduce(
  (acc, q) => {
    acc[q.key] = z.array(z.string()).superRefine((val, ctx) => {
      if (val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Please make at least one selection.`,
        });
      }
    });
    return acc;
  },
  {} as Record<string, z.ZodArray<z.ZodString>>
);

export const FormSchema = z.object(schemaFields);
