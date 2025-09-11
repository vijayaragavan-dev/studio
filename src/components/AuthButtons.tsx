
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { LogIn } from 'lucide-react';

export default function AuthButtons() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  const onOpenChange = (open: boolean) => {
    if (!open) {
      // Reset to signin tab when closing
      setTimeout(() => setActiveTab('signin'), 150);
    }
    setIsOpen(open);
  }

  return (
    <>
      <Button variant="outline" onClick={() => onOpenChange(true)}>
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <DialogHeader className="mb-4">
                <DialogTitle>Sign In</DialogTitle>
                <DialogDescription>
                  Access your travel history and saved preferences.
                </DialogDescription>
              </DialogHeader>
              <SignInForm onSignIn={() => onOpenChange(false)} />
            </TabsContent>
            <TabsContent value="signup">
              <DialogHeader className="mb-4">
                <DialogTitle>Create an Account</DialogTitle>
                <DialogDescription>
                  Save your travel plans and build your adventure history.
                </DialogDescription>
              </DialogHeader>
              <SignUpForm onSignUp={() => onOpenChange(false)} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
