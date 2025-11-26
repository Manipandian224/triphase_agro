
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu, Leaf, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AiChatBot } from '@/components/ai-chat-bot';
import { useUser } from '@/firebase/auth/use-user';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/health-analysis', label: 'Health Analysis' },
  { href: '/dashboard/plant-details', label: 'Plant Details' },
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
  );
}

function TopNavBar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-24 items-center justify-center px-4 md:px-6">
      <div className="flex items-center justify-between w-full max-w-7xl h-16 px-4 bg-black/30 backdrop-blur-lg rounded-full border border-white/10 shadow-lg">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="text-slate-100">Triphase Agro</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium bg-black/20 p-1 rounded-full border border-white/10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-5 py-2 rounded-full transition-colors duration-300 text-slate-300 hover:text-white',
                  isActive ? 'text-white' : ''
                )}
              >
                <span className="relative z-10 tracking-wider">{link.label}</span>
                {isActive && (
                   <span 
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-blue-400 rounded-full"
                    style={{boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)'}}
                  ></span>
                )}
              </Link>
            );
          })}
        </nav>

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
               <SidebarContent onLinkClick={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>
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
