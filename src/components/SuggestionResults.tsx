'use client';

import { Button } from '@/components/ui/button';
import type { Destination } from '@/lib/types';
import DestinationCard from './DestinationCard';
import { motion, AnimatePresence } from 'framer-motion';

interface SuggestionResultsProps {
  suggestions: Destination[];
  onRefine: () => void;
}

export default function SuggestionResults({ suggestions, onRefine }: SuggestionResultsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Your Travel Suggestions</h2>
        <p className="text-muted-foreground mt-2">Here are some destinations tailored to your preferences.</p>
        <Button onClick={onRefine} variant="outline" className="mt-4">
          Refine Choices
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {suggestions.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <DestinationCard destination={destination} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
