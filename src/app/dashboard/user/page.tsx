'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { User, Bell, Palette } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { updateProfile } from 'firebase/auth';
import { useFirebase } from '@/firebase/client-provider';
import { useToast } from '@/hooks/use-toast';

export default function UserProfilePage() {
  const { user } = useUser();
  const { auth } = useFirebase();
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user || !auth) {
      toast({
        variant: 'destructive',
        title: 'Not authenticated',
        description: 'You must be logged in to save changes.',
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(user, {
        displayName: name,
      });
      
      // Note: Updating email requires re-authentication and is a more complex flow.
      // We will only update the display name for now.

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not save your changes.',
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-100">
          User Profile
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mt-2">
          Manage your account settings and preferences.
        </p>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: User Info */}
        <div className="md:col-span-1 flex flex-col items-center text-center">
          <Avatar className="w-32 h-32 mb-4 border-4 border-primary/50">
            <AvatarImage src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fDE?w=200"} />
            <AvatarFallback>
              <User className="w-16 h-16" />
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-slate-100">{user?.displayName || 'User'}</h2>
          <p className="text-slate-400">{user?.email}</p>
        </div>

        {/* Right Column: Settings */}
        <div className="md:col-span-2">
          <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-100">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* General Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center text-slate-200">
                  <User className="mr-3 h-5 w-5 text-primary" /> General
                </h3>
                <div className="grid gap-4 text-slate-300">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-black/20 border-white/20 text-slate-100"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                    <Input id="email" type="email" value={email} disabled className="bg-black/20 border-white/20 text-slate-100 disabled:opacity-70"/>
                  </div>
                </div>
              </div>

              <Separator className="border-white/10"/>

              {/* Notification Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center text-slate-200">
                  <Bell className="mr-3 h-5 w-5 text-primary" /> Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-slate-300">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    {isClient && <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />}
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    {isClient && <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications}/>}
                  </div>
                </div>
              </div>

              <div className="pt-4 text-right">
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
    