'use client';

import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { questions } from '@/lib/data';
import type { FormSchema } from '@/lib/schema';
import { Loader2 } from 'lucide-react';
import { Label } from './ui/label';

interface QuestionnaireProps {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
  isLoading: boolean;
}

export default function Questionnaire({ form, onSubmit, isLoading }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = questions.length;

  const handleNext = async () => {
    const fieldName = questions[currentStep].key as keyof z.infer<typeof FormSchema>;
    const isValid = await form.trigger(fieldName);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const currentQuestion = questions[currentStep];

  const MotionCard = motion(Card);

  return (
    <AnimatePresence mode="wait">
      <MotionCard 
        key={currentStep}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full border-0 bg-card/50 shadow-2xl shadow-black/20 mt-12"
      >
        <CardHeader>
          <Progress value={((currentStep + 1) / totalSteps) * 100} className="w-full mb-6 h-1" />
          <CardTitle className="font-headline text-2xl md:text-3xl text-center">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name={currentQuestion.key as any}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {currentQuestion.options.map((option, index) => {
                        const Icon = currentQuestion.icons ? currentQuestion.icons[index] : null;
                        return (
                          <FormField
                            key={option}
                            control={form.control}
                            name={currentQuestion.key as any}
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option}
                                  className="flex-1"
                                >
                                  <Label
                                    htmlFor={`${currentQuestion.key}-${option}`}
                                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted/50 bg-transparent p-4 text-center font-body h-full transition-all duration-300 cursor-pointer hover:bg-accent/10 hover:border-accent has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:shadow-lg has-[:checked]:shadow-primary/10"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        id={`${currentQuestion.key}-${option}`}
                                        className="sr-only"
                                        checked={field.value?.includes(option)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), option])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value: string) => value !== option
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    {Icon && <Icon className="w-8 h-8 mb-2 text-primary" />}
                                    {option}
                                  </Label>
                                </FormItem>
                              );
                            }}
                          />
                        );
                      })}
                    </div>
                    <FormMessage className="text-center pt-2" />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center pt-4">
                <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                  Back
                </Button>
                <p className="text-sm text-muted-foreground">{`Step ${currentStep + 1} of ${totalSteps}`}</p>
                {currentStep < totalSteps - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Get Suggestions
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </MotionCard>
    </AnimatePresence>
  );
}
