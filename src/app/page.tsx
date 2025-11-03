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
    <div className="flex items-center justify-center min-h-screen bg-background p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link
            href="#"
            className="flex items-center gap-2.5 text-foreground"
            prefetch={false}
          >
            <LeafIcon className="h-7 w-7 text-primary" />
            <span className="text-2xl font-semibold tracking-tight">AgriVision Pro</span>
          </Link>
        </div>
        <Card className="rounded-lg shadow-card">
          <CardHeader className="space-y-2 text-center p-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-[#1C1C1E]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="manager@farm.com"
                required
                className="rounded-sm !border-gray-100 focus:glow"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-sm font-semibold text-[#1C1C1E]">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm text-primary hover:underline"
                  prefetch={false}
                >
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" required className="rounded-sm !border-gray-100 focus:glow" />
            </div>
            <div className="space-y-3">
               <Link href="/dashboard" className="w-full" passHref>
                <Button 
                  className="w-full font-semibold text-[15px] h-11 rounded-md shadow-button hover:bg-primary-hover transition-transform duration-normal active:translate-y-px"
                >
                  Sign In
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-11 rounded-md border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                Sign in with Google
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="#" className="font-medium text-primary hover:underline" prefetch={false}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
