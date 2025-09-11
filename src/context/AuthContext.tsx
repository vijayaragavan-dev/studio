
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { SignInFormSchema, SignUpFormSchema } from '@/lib/schema';
import type { z } from 'zod';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (data: z.infer<typeof SignInFormSchema>) => Promise<void>;
  signUp: (data: z.infer<typeof SignUpFormSchema>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (data: z.infer<typeof SignInFormSchema>) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: 'Signed In',
        description: `Welcome back, ${userCredential.user.displayName || userCredential.user.email}!`,
      });
    } catch (error: any) {
      console.error("Error signing in: ", error);
      toast({
        variant: 'destructive',
        title: 'Sign-in Failed',
        description: error.message || 'Could not sign in. Please check your credentials and try again.',
      });
      throw error; // Re-throw to be caught by the form handler
    }
  };

  const signUp = async (data: z.infer<typeof SignUpFormSchema>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, { displayName: data.name });

      // Create user document in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        displayName: data.name,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      }, { merge: true });

      toast({
        title: 'Account Created',
        description: `Welcome, ${data.name}! You are now signed in.`,
      });
    } catch (error: any) {
      console.error("Error signing up: ", error);
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: error.message || 'Could not create an account. Please try again.',
      });
       throw error; // Re-throw to be caught by the form handler
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        variant: 'destructive',
        title: 'Sign-out Failed',
        description: 'Could not sign out. Please try again.',
      });
    }
  };

  const value = { user, loading, signIn, signUp, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
