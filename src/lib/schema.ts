import * as z from 'zod';
import { questions } from './data';

const schemaFields = questions.reduce(
  (acc, q) => {
    if (q.selectType === 'single') {
      acc[q.key] = z.string({
        required_error: 'Please make a selection.',
      });
    } else {
      acc[q.key] = z.array(z.string()).superRefine((val, ctx) => {
        if (val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Please make at least one selection.`,
          });
        }
      });
    }
    return acc;
  },
  {} as Record<string, z.ZodType>
);

export const FormSchema = z.object(schemaFields);
