
'use client';

import { useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
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
  const [summary, setSummary] = useState<z.infer<typeof FormSchema> | null>(null);
  const totalSteps = questions.length;

  const handleNext = async () => {
    const fieldName = questions[currentStep].key as keyof z.infer<typeof FormSchema>;
    const isValid = await form.trigger(fieldName);
    if (isValid) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setSummary(form.getValues());
      }
    }
  };

  const handleBack = () => {
    if (summary) {
      setSummary(null);
      return;
    }
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        if (summary) {
          if (!isLoading) {
            onSubmit(summary);
          }
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentStep, summary, isLoading]);

  const currentQuestion = questions[currentStep];

  const MotionCard = motion(Card);

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  if (summary) {
    return (
      <MotionCard
        initial="initial"
        animate="animate"
        exit="exit"
        variants={cardVariants}
        className="w-full bg-card shadow-2xl shadow-black/20"
      >
        <CardHeader>
          <CardTitle className="font-headline text-2xl md:text-3xl text-center">Summary of Your Preferences</CardTitle>
          <CardDescription className="text-center">Review your choices before we find your perfect destination.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((q) => (
              <motion.div 
                key={q.key} 
                className="bg-muted/30 p-3 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: questions.indexOf(q) * 0.05 }}
              >
                <p className="font-semibold text-base mb-1">{q.question}</p>
                <p className="text-muted-foreground text-sm">
                  {(summary[q.key as keyof typeof summary] as string[]).join(', ')}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4">
          <Button type="button" variant="outline" onClick={handleBack}>
            Back to Questions
          </Button>
          <div className="flex items-center gap-2">
             <span className="text-xs text-muted-foreground hidden sm:inline">Press Enter</span>
            <Button type="button" onClick={() => onSubmit(summary)} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit & Find Destinations
            </Button>
          </div>
        </CardFooter>
      </MotionCard>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <MotionCard 
        key={currentStep}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={cardVariants}
        className="w-full border-0 bg-card shadow-2xl shadow-black/20"
      >
        <CardHeader>
          <Progress value={((currentStep + 1) / totalSteps) * 100} className="w-full mb-6 h-2" />
          <CardTitle className="font-headline text-2xl md:text-3xl text-center">
            {currentQuestion.question}
          </CardTitle>
          <CardDescription className="text-center">Select one or more options that apply.</CardDescription>
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
                            render={({ field: checkboxField }) => {
                              return (
                                <FormItem key={option} className="flex-1">
                                  <Label
                                    htmlFor={`${currentQuestion.key}-${option}`}
                                    className="flex flex-col items-center justify-center rounded-lg border-2 bg-transparent p-4 text-center font-body h-full transition-all duration-300 cursor-pointer hover:bg-accent/10 hover:border-accent has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:shadow-md has-[:checked]:scale-105"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        id={`${currentQuestion.key}-${option}`}
                                        className="sr-only"
                                        checked={checkboxField.value?.includes(option)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? checkboxField.onChange([...(checkboxField.value || []), option])
                                            : checkboxField.onChange(
                                                checkboxField.value?.filter(
                                                  (value: string) => value !== option
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    {Icon && <Icon className="w-8 h-8 mb-3 text-primary" />}
                                    <span className="font-semibold">{option}</span>
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
                  Previous
                </Button>
                <p className="text-sm text-muted-foreground">{`Step ${currentStep + 1} of ${totalSteps}`}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:inline">Press Enter</span>
                  <Button type="button" onClick={handleNext}>
                    {currentStep < totalSteps - 1 ? 'Next' : 'Show Summary'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </MotionCard>
    </AnimatePresence>
  );
}
