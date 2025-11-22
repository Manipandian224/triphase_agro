"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

function LeafIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 4 13q0-4.5 4.5-5.5A7 7 0 0 1 18 10a7 7 0 0 1-7 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background font-sans relative overflow-hidden">
        <Image 
            src="https://images.unsplash.com/photo-1597992953285-a56b57f57335?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmYXJtJTIwYWVyaWFsfGVufDB8fHx8MTc2MjI5ODk4N3ww&ixlib=rb-4.1.0&q=80&w=1920"
            alt="Aerial view of a farm"
            fill
            className="absolute inset-0 z-0 opacity-20 object-cover"
            data-ai-hint="farm aerial"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>

        <div className="w-full max-w-md z-20">
            <div className="flex justify-center mb-8">
            <Link
                href="#"
                className="flex items-center gap-2.5 text-foreground"
                prefetch={false}
            >
                <LeafIcon className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold tracking-tight">AgriVision Pro</span>
            </Link>
            </div>
            <Card className="rounded-3xl shadow-soft-depth-lg border-white/20 bg-white/70 backdrop-blur-xl">
            <CardHeader className="space-y-2 text-center p-8">
                <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
                <CardDescription className="text-muted-foreground pt-1">
                Enter your credentials to access your farm dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8 pt-0">
                <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="manager@farm.com"
                    required
                    className="rounded-lg bg-white/50 border-white/50 h-12"
                    suppressHydrationWarning
                />
                </div>
                <div className="space-y-2">
                 <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input 
                    id="password" 
                    type="password"
                    required 
                    className="rounded-lg bg-white/50 border-white/50 h-12"
                    suppressHydrationWarning
                />
                </div>
                <div className="space-y-4 pt-4">
                <Link href="/dashboard" className="w-full" passHref>
                    <Button 
                    className="w-full font-semibold text-base h-14 rounded-xl shadow-soft-depth bg-primary/90 text-primary-foreground hover:bg-primary hover:shadow-glow-primary transition-all duration-fast active:translate-y-px"
                    suppressHydrationWarning
                    >
                    Sign In
                    </Button>
                </Link>
                <Button variant="outline" className="w-full h-14 rounded-xl border-primary/30 text-primary bg-white/50 hover:bg-white/80 hover:text-primary hover:border-primary/50">
                    Sign in with Google
                </Button>
                </div>
            </CardContent>
            </Card>
            <div className="mt-8 text-center text-sm text-foreground/60">
            Don&apos;t have an account?{" "}
            <Link href="#" className="font-medium text-primary/90 hover:text-primary hover:underline" prefetch={false}>
                Sign up
            </Link>
            </div>
        </div>
    </div>
  );
}
