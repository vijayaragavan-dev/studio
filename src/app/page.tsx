'use client';

import { useState } from 'react';
import type { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plane } from 'lucide-react';

import type { Destination } from '@/lib/types';
import { FormSchema } from '@/lib/schema';
import { getSuggestionsAction } from '@/app/actions';
import Questionnaire from '@/components/Questionnaire';
import SuggestionResults from '@/components/SuggestionResults';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { questions } from '@/lib/data';

export default function Home() {
  const [view, setView] = useState<'form' | 'suggestions'>('form');
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: questions.reduce((acc, q) => {
      // @ts-ignore
      acc[q.key] = q.options[0];
      return acc;
    }, {} as z.infer<typeof FormSchema>),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const result = await getSuggestionsAction(data);
      if (result && result.destinations && result.destinations.length > 0) {
        setSuggestions(result.destinations);
        setView('suggestions');
      } else {
        toast({
          variant: 'destructive',
          title: 'No suggestions found',
          description: "We couldn't find any destinations matching your preferences. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Something went wrong while getting your suggestions. Please try again later.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRefine = () => {
    setView('form');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto max-w-4xl text-center py-8 px-4">
        <h1 className="font-headline text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
          <Plane className="w-10 h-10 text-primary" />
          Wanderlust Wizard
        </h1>
        <p className="font-body text-muted-foreground mt-2 text-lg">
          Your personal AI-powered travel destination finder.
        </p>
      </header>

      <main className="flex-grow container mx-auto max-w-4xl px-4 pb-12">
        {view === 'form' ? (
          <Questionnaire form={form} onSubmit={onSubmit} isLoading={isLoading} />
        ) : (
          <SuggestionResults suggestions={suggestions} onRefine={handleRefine} />
        )}
      </main>

      <footer className="text-center p-4 text-muted-foreground text-sm font-body">
        <p>&copy; {new Date().getFullYear()} Wanderlust Wizard. All rights reserved.</p>
      </footer>
      <Toaster />
    </div>
  );
}
