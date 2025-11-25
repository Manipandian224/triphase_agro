
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import {
  Menu,
  LayoutGrid,
  HeartPulse,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AiChatBot } from '@/components/ai-chat-bot';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/dashboard/health-analysis', label: 'Analysis', icon: HeartPulse },
  { href: '/dashboard/plant-details', label: 'Plants', icon: Leaf },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
       <TopNavBar />
      <main className="flex-1 overflow-y-auto relative z-10">
         <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #EAEF9D20, transparent 40%)',
          }}
        />
        <div className="relative z-10">
            {children}
        </div>
      </main>
      <AiChatBot />
    </div>
  );
}

function TopNavBar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
     <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/20 bg-background/80 px-4 backdrop-blur-lg md:px-6">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
        <Leaf className="h-7 w-7 text-primary" />
        <span>Triphase Agro</span>
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 text-lg font-medium">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'transition-colors hover:text-primary',
              pathname === link.href ? 'text-primary' : 'text-foreground/70'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-background/95">
             <SidebarContent onLinkClick={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}


function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-center border-b border-white/20">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <Leaf className="h-7 w-7 text-primary" />
          <span>Triphase Agro</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium transition-all text-foreground/70 hover:bg-white/10 hover:text-foreground',
              pathname === link.href
                ? 'bg-[#336A29] text-white shadow-lg'
                : ''
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
