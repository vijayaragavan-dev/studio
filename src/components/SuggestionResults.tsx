
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-12">
        <motion.h2 
          className="font-headline text-3xl md:text-4xl font-bold"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Your Personalized Travel Suggestions
        </motion.h2>
        <motion.p 
          className="text-muted-foreground mt-2 max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Based on your preferences, here are some destinations you might love. Click on a card to learn more.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button onClick={onRefine} variant="outline" className="mt-6">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refine My Choices
          </Button>
        </motion.div>
      </div>

      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {suggestions.map((destination) => (
            <motion.div
              key={destination.name}
              variants={itemVariants}
              exit={{ opacity: 0, y: -20 }}
            >
              <DestinationCard destination={destination} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
