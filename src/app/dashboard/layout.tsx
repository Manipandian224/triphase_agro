
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Menu, Leaf, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AiChatBot } from '@/components/ai-chat-bot';
import { useUser } from '@/firebase/auth/use-user';
import { LanguageProvider } from '@/context/language-context';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/health-analysis', label: 'Health Analysis' },
  { href: '/dashboard/plant-details', label: 'Plants & Crops' },
  { href: '/dashboard/user', label: 'Profile' },
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
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <AiChatBot />
      </div>
    </LanguageProvider>
  );
}

function TopNavBar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

        <div className='flex items-center gap-2'>
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className='text-slate-100'>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-black/60 backdrop-blur-xl border-r-white/10 p-0">
                   <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                   <SidebarContent onLinkClick={() => setIsSheetOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}


function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-center border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <Leaf className="h-7 w-7 text-primary" />
          <span className='text-slate-100'>Triphase Agro</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              'flex items-center justify-center gap-3 rounded-full px-4 py-3 text-lg font-medium transition-all',
              'text-slate-300 hover:bg-white/20 hover:text-white',
               pathname === link.href
                ? 'bg-white/20 text-white shadow-lg'
                : 'bg-white/10'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
