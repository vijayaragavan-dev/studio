'use client';

import { Button } from '@/components/ui/button';
import type { Destination } from '@/lib/types';
import DestinationCard from './DestinationCard';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

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
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Your Personalized Travel Suggestions</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Based on your preferences, here are some destinations you might love. Click on a card to learn more.</p>
        <Button onClick={onRefine} variant="outline" className="mt-6">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refine My Choices
        </Button>
      </div>

      <div className="space-y-8">
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
