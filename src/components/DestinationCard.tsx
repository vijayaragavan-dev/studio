'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getDestinationDetailsAction } from '@/app/actions';
import type { Destination } from '@/lib/types';
import { Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState<{ summary: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCardClick = async () => {
    setIsOpen(true);
    if (!details) {
      setIsLoading(true);
      try {
        const result = await getDestinationDetailsAction(destination.name, destination.imageUrl);
        setDetails(result);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load destination details.',
        });
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const placeholderImage = `https://picsum.photos/seed/${destination.name.replace(/\s/g, '')}/600/400`;

  return (
    <>
      <Card
        className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer group border-transparent hover:border-primary"
        onClick={handleCardClick}
      >
        <CardHeader className="p-0">
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={destination.imageUrl || placeholderImage}
              alt={destination.name}
              data-ai-hint={`${destination.name} landscape`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow flex flex-col">
          <CardTitle className="font-headline text-2xl mb-2">{destination.name}</CardTitle>
          <CardDescription className="font-body flex-grow text-muted-foreground">{destination.description}</CardDescription>
          <div className="text-primary font-semibold mt-4 self-start group-hover:underline">
            View Details
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{destination.name}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden my-4">
             <Image
              src={destination.imageUrl || placeholderImage}
              alt={destination.name}
              data-ai-hint={`${destination.name} scenery`}
              fill
              className="object-cover"
            />
          </div>
          {isLoading && (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          {details && (
            <DialogDescription className="font-body text-base">{details.summary}</DialogDescription>
          )}
           <Button asChild className="mt-4">
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent(destination.name)}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Learn More on Google <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
