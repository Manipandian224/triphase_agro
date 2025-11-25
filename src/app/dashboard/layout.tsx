
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import {
  Menu,
  LayoutGrid,
  HeartPulse,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

  if (isMobile === undefined) {
    return null; // or a loading skeleton
  }

  return (
    <div className="flex min-h-screen w-full">
      {!isMobile && <Sidebar />}
      <main className="flex-1 flex flex-col bg-transparent relative">
         <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #EAEF9D20, transparent 40%)',
          }}
        />
        <div className={`flex-1 overflow-y-auto ${isMobile ? 'pb-24' : ''} relative z-10`}>
            {children}
        </div>
      </main>
      {isMobile ? <BottomNavBar /> : <AiChatBot />}
    </div>
  );
}

function Sidebar() {
  return (
    <div className="w-72 border-r border-white/20 bg-transparent z-20">
      <SidebarContent />
    </div>
  );
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-center border-b border-white/20">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <Leaf className="h-7 w-7 text-foreground" />
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
       <div className="p-4 mt-auto">
          <AiChatBot />
      </div>
    </div>
  );
}


function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2">
       <div className="relative">
         <AiChatBot />
       </div>
      <nav className="mx-auto max-w-sm rounded-full border border-white/20 bg-card/80 backdrop-blur-lg p-2">
        <div className="flex justify-around items-center">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-20 h-14 rounded-full transition-all text-foreground/60',
                pathname === link.href ? 'text-primary' : 'hover:bg-white/10'
              )}
            >
              <link.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{link.label}</span>
               {pathname === link.href && (
                <div className="w-1/2 h-0.5 bg-primary rounded-full mt-1"></div>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

