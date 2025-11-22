
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Camera } from 'lucide-react';

export default function MyProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            View and manage your personal information and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage
                  src="https://picsum.photos/seed/user/96/96"
                  alt="@user"
                  data-ai-hint="profile avatar"
                />
                <AvatarFallback>FM</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change photo</span>
              </Button>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Farm Manager</h2>
              <p className="text-muted-foreground">manager@farm.com</p>
              <p className="text-sm text-primary font-medium pt-1">Administrator</p>
            </div>
          </div>
          <Separator className="my-6" />
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue="Farm Manager" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="manager@farm.com" disabled />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Administrator" disabled />
            </div>

            <Separator className="my-6" />

             <div>
                <h3 className="text-lg font-semibold">Change Password</h3>
                <p className="text-sm text-muted-foreground mb-4">Enter your current and new password to update.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

