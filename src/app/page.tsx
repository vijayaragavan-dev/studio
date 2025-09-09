
'use client';

import { useState, useRef } from 'react';
import type { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plane, Compass, Star, ArrowRight, Lightbulb, Bot, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import type { Destination } from '@/lib/types';
import { FormSchema } from '@/lib/schema';
import { getSuggestionsAction } from '@/app/actions';
import Questionnaire from '@/components/Questionnaire';
import SuggestionResults from '@/components/SuggestionResults';
import { useToast } from '@/hooks/use-toast';
import { questions } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const [view, setView] = useState<'home' | 'form' | 'suggestions'>('home');
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const questionnaireRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
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

  const handleStart = () => {
    setView('form');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };
  
  const handleRefine = () => {
    setView('form');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="container mx-auto max-w-5xl text-center py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Plane className="w-8 h-8 text-primary" />
          <span className="font-headline text-2xl font-bold">Wanderlust Wizard</span>
        </div>
      </header>

      <main className="flex-grow">
        {view === 'home' && (
          <div className="flex flex-col items-center">
            {/* Hero Section */}
            <motion.section 
              className="relative w-full h-[60vh] flex items-center justify-center text-center text-white"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Image 
                src="https://picsum.photos/1600/900"
                alt="Beautiful travel destination"
                data-ai-hint="travel landscape"
                fill
                className="object-cover brightness-50"
                priority
              />
              <div className="relative z-10 p-4">
                <h1 className="font-headline text-4xl md:text-6xl font-bold mb-4">Find Your Next Dream Destination</h1>
                <p className="font-body text-lg md:text-xl max-w-3xl mx-auto mb-8">
                  Answer a few questions, and let our AI create a personalized list of travel spots just for you.
                </p>
                <Button size="lg" onClick={handleStart} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Plan My Trip
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.section>
            
            {/* How it Works Section */}
            <motion.section 
              className="container mx-auto max-w-5xl py-16 md:py-24 px-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={staggerContainer}
            >
              <h2 className="font-headline text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Tell us your travel preferences → We suggest the best destinations → Explore maps, transport, and culture.</p>
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div variants={staggerItem} className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <Compass className="w-8 h-8" />
                  </div>
                  <h3 className="font-headline text-xl font-semibold mb-2">1. Share Preferences</h3>
                  <p className="text-muted-foreground">Answer our intuitive questionnaire about your travel style.</p>
                </motion.div>
                <motion.div variants={staggerItem} className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <Star className="w-8 h-8" />
                  </div>
                  <h3 className="font-headline text-xl font-semibold mb-2">2. Get Suggestions</h3>
                  <p className="text-muted-foreground">Receive AI-powered destination recommendations tailored to you.</p>
                </motion.div>
                <motion.div variants={staggerItem} className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <Plane className="w-8 h-8" />
                  </div>
                  <h3 className="font-headline text-xl font-semibold mb-2">3. Explore & Go</h3>
                  <p className="text-muted-foreground">Discover details and plan your perfect adventure.</p>
                </motion.div>
              </div>
            </motion.section>
            
            {/* Why Us Section */}
            <motion.section
              className="w-full bg-card/50 py-16 md:py-24"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={staggerContainer}
            >
              <div className="container mx-auto max-w-5xl px-4 text-center">
                <h2 className="font-headline text-3xl font-bold mb-12">Why Use Wanderlust Wizard?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <motion.div variants={staggerItem} className="p-6 rounded-lg">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-headline text-xl font-semibold mb-2">Easy</h3>
                    <p className="text-muted-foreground">A simple, guided process that saves you time and effort.</p>
                  </motion.div>
                  <motion.div variants={staggerItem} className="p-6 rounded-lg">
                    <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="font-headline text-xl font-semibold mb-2">Smart</h3>
                    <p className="text-muted-foreground">Intelligent matching that considers all your preferences.</p>
                  </motion.div>
                  <motion.div variants={staggerItem} className="p-6 rounded-lg">
                    <Bot className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-headline text-xl font-semibold mb-2">AI-Powered</h3>
                    <p className="text-muted-foreground">Leveraging Gemini AI for unique and personalized suggestions.</p>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          </div>
        )}
        
        {view === 'form' && (
          <div ref={questionnaireRef} className="container mx-auto max-w-4xl px-4 py-12">
            <Questionnaire form={form} onSubmit={onSubmit} isLoading={isLoading} />
          </div>
        )}
        
        {view === 'suggestions' && (
          <div className="container mx-auto max-w-5xl px-4 py-12">
            <SuggestionResults suggestions={suggestions} onRefine={handleRefine} />
          </div>
        )}
      </main>

      <footer className="text-center p-6 text-muted-foreground text-sm font-body border-t border-border">
        <p>&copy; {new Date().getFullYear()} Wanderlust Wizard. All rights reserved.</p>
        <Link href="/backend-code" className="text-primary hover:underline mt-2 inline-block">
          View Backend Code
        </Link>
      </footer>
    </div>
  );
}
