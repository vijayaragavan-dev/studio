'use client';

import { useState, useRef, useEffect } from 'react';
import type { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plane, Compass, Star } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

import type { Destination } from '@/lib/types';
import { FormSchema } from '@/lib/schema';
import { getSuggestionsAction } from '@/app/actions';
import Questionnaire from '@/components/Questionnaire';
import SuggestionResults from '@/components/SuggestionResults';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { questions } from '@/lib/data';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [view, setView] = useState<'form' | 'suggestions'>('form');
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const questionnaireRef = useRef<HTMLDivElement>(null);

  const [showForm, setShowForm] = useState(false);
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [controls]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: questions.reduce((acc, q) => {
      // @ts-ignore
      acc[q.key] = [];
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
        setShowForm(false);
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
    setShowForm(true);
    setTimeout(() => {
      questionnaireRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleStart = () => {
    setShowForm(true);
    setTimeout(() => {
      questionnaireRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto max-w-4xl text-center py-8 px-4">
        <h1 className="font-headline text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
          <Plane className="w-10 h-10 text-primary" />
          Wanderlust Wizard
        </h1>
      </header>

      <main className="flex-grow container mx-auto max-w-4xl px-4 pb-12">
        {view === 'suggestions' ? (
          <SuggestionResults suggestions={suggestions} onRefine={handleRefine} />
        ) : (
          <>
            {!showForm && (
                 <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={controls}
                 className="text-center p-8 rounded-lg bg-card/30"
               >
                 <Compass className="w-16 h-16 text-primary mx-auto mb-4" />
                 <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Discover Your Next Adventure</h2>
                 <p className="font-body text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                   Tired of endless scrolling for travel ideas? Answer a few simple questions, and our AI will curate a list of personalized travel destinations just for you. From hidden gems to popular hotspots, let's find your perfect getaway.
                 </p>
                 <Button size="lg" onClick={handleStart}>
                   <Star className="mr-2" />
                   Start the Magic
                 </Button>
               </motion.div>
            )}
            <div ref={questionnaireRef}>
              {showForm && (
                <Questionnaire form={form} onSubmit={onSubmit} isLoading={isLoading} />
              )}
            </div>
          </>
        )}
      </main>

      <footer className="text-center p-4 text-muted-foreground text-sm font-body">
        <p>&copy; {new Date().getFullYear()} Wanderlust Wizard. All rights reserved.</p>
      </footer>
      <Toaster />
    </div>
  );
}
