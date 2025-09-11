
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getHistory } from '@/lib/firestore';
import type { HistoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Loader2, Home, Plane } from 'lucide-react';
import SuggestionResults from '@/components/SuggestionResults';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          const userHistory = await getHistory(user.uid);
          setHistory(userHistory);
        } catch (error) {
          console.error('Failed to fetch history:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleViewSuggestions = (item: HistoryItem) => {
    setSelectedItem(item);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBackToHistory = () => {
      setSelectedItem(null);
  }

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">Please sign in to view your travel history.</p>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Link>
        </Button>
      </div>
    );
  }

  if (selectedItem) {
      return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
             <Button onClick={handleBackToHistory} variant="outline" className="mb-8">
                Back to History
            </Button>
            <SuggestionResults 
                suggestions={selectedItem.suggestions} 
                onRefine={() => {
                    // This could link back to the form with pre-filled data in a future version
                     window.location.href = '/';
                }} 
            />
        </div>
      );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Your Travel History</h1>
        <Button asChild variant="outline">
          <Link href="/">
             <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No history yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your saved travel plans will appear here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Start a new search</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>
                  Trip from {item.createdAt.toLocaleDateString()}
                </CardTitle>
                 <CardDescription>
                  You received {item.suggestions.length} destination suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleViewSuggestions(item)}>
                  View Suggestions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
