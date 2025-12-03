
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Menu, Leaf, Loader, LayoutDashboard, HeartPulse, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AiChatBot } from '@/components/ai-chat-bot';
import { useUser } from '@/firebase/auth/use-user';
import { LanguageProvider } from '@/context/language-context';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/health-analysis', label: 'Health Analysis', icon: HeartPulse },
  { href: '/dashboard/plant-details', label: 'Plants & Crops', icon: Leaf },
  { href: '/dashboard/user', label: 'Profile', icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router, isClient]);

  if (!isClient || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return null;
  }

  return (
    <LanguageProvider>
      <div className="flex min-h-screen w-full flex-col">
        <div
          className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-theme-start to-theme-end"
        />
        <TopNavBar />
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {children}
        </main>
        <AiChatBot />
        <BottomNavBar />
      </div>
    </LanguageProvider>
  );
}

function TopNavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-24 items-center justify-center px-4 md:px-6">
      <div className="flex items-center justify-between w-full max-w-7xl h-16 px-4 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-lg shadow-black/20">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="text-slate-100">Triphase Agro</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-5 py-2 rounded-full transition-colors duration-300 text-slate-300 hover:text-white'
                )}
              >
                <span className="relative z-10 tracking-wider">{link.label}</span>
                {isActive && (
                   <motion.span
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-primary/20 rounded-full border border-primary/50"
                    style={{ borderRadius: 9999 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div className='hidden md:flex w-24' />
      </div>
    </header>
  );
}


function BottomNavBar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/50 backdrop-blur-2xl border-t border-white/10 md:hidden z-40">
            <div className="flex h-full items-center justify-around">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href} className="flex flex-col items-center justify-center gap-1 text-xs">
                             <link.icon className={cn("h-6 w-6 transition-colors", isActive ? "text-primary" : "text-slate-400")} />
                             <span className={cn("transition-colors", isActive ? "text-slate-100" : "text-slate-400")}>{link.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
