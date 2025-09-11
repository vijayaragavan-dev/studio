
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Destination } from './types';
import type { z } from 'zod';
import type { FormSchema } from './schema';
import type { HistoryItem } from './types';

export const saveHistory = async (
  userId: string,
  data: {
    preferences: z.infer<typeof FormSchema>;
    suggestions: Destination[];
  }
) => {
  try {
    const historyCollection = collection(db, 'users', userId, 'history');
    await addDoc(historyCollection, {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving history: ', error);
    throw new Error('Could not save history to Firestore.');
  }
};

export const getHistory = async (userId: string): Promise<HistoryItem[]> => {
    try {
      const historyCollection = collection(db, 'users', userId, 'history');
      const q = query(historyCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          preferences: data.preferences,
          suggestions: data.suggestions,
        };
      });
    } catch (error) {
      console.error('Error getting history: ', error);
      throw new Error('Could not fetch history from Firestore.');
    }
};
