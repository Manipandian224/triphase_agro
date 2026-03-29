'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center text-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-theme-start to-theme-end"></div>
      
      <Leaf className="mx-auto mb-6 h-16 w-16 text-primary" />
      
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-slate-100 mb-4" style={{textShadow: '0 2px 10px rgba(0,0,0,0.3)'}}>
        Welcome to Triphase Agro
      </h1>
      
      <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
        Your all-in-one solution for smart farm management. Monitor sensors, analyze crop health, and get expert AI advice instantly.
      </p>
      
      <Button
        onClick={() => router.push('/auth')}
        className="h-12 px-8 text-lg font-bold bg-gradient-to-r from-primary to-green-400 text-primary-foreground rounded-full hover:shadow-glow-primary transition-shadow"
      >
        Get Started
      </Button>
    </div>
  );
}
