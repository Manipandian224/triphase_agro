
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
  { href: '/dashboard/health-analysis', label: 'Health Analysis', icon: HeartPulse },
  { href: '/dashboard/plant-details', label: 'Plant Details', icon: Leaf },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isMobile === undefined) {
    return null; // or a loading skeleton
  }

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen w-full">
      {isMobile ? (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-transparent border-r border-white/10">
             <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Main navigation links for the Triphase Agro dashboard.
              </SheetDescription>
            </SheetHeader>
            <SidebarContent onLinkClick={closeMenu} />
          </SheetContent>
        </Sheet>
      ) : (
        <Sidebar />
      )}
      <main className="flex-1 flex flex-col bg-transparent relative">
         <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #EAEF9D20, transparent 40%)',
          }}
        />
        <div className={`flex-1 overflow-y-auto ${isMobile ? 'pt-16' : ''} relative z-10`}>
            {children}
        </div>
      </main>
      <AiChatBot />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="w-72 border-r border-white/20 bg-black/10 z-20">
      <SidebarContent />
    </div>
  );
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-center border-b border-white/20">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
          <Leaf className="h-7 w-7 text-white" />
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
              'flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium transition-all text-white/70 hover:bg-white/10 hover:text-white',
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
