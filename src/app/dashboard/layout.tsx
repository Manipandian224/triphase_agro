"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bell,
  BrainCircuit,
  History,
  LayoutDashboard,
  Map,
  Menu,
  Power,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/field-view", icon: Map, label: "Field View" },
  { href: "/dashboard/ai-crop-health", icon: BrainCircuit, label: "AI Crop Health" },
  { href: "/dashboard/pump-control", icon: Power, label: "Pump Control" },
  { href: "/dashboard/logs", icon: History, label: "Logs" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

function VerticalNavbar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-60 border-r border-gray-100 bg-white md:flex flex-col">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <LeafIcon className="w-8 h-8 text-primary" />
        <span className="text-[17px] font-semibold text-[#1C1C1E]">AgriVision Pro</span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link href={item.href} key={item.label} passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full flex items-center justify-start gap-3 px-4 py-2 rounded-[8px] text-[15px] font-medium text-gray-900/70 hover:bg-[#E6F2FF] hover:text-primary transition-colors duration-200 ease-in-out",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(10,132,255,0.28)]",
                 pathname === item.href && "bg-[#E6F2FF] text-primary"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-gray-100">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 rounded-md p-2 hover:bg-gray-50/50">
                    <Avatar className="h-8 w-8">
                    <AvatarImage
                        src="https://picsum.photos/seed/user/32/32"
                        alt="@user"
                        data-ai-hint="profile avatar"
                    />
                    <AvatarFallback>FM</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                        <p className="text-[15px] font-medium text-[#1C1C1E]">Farm Manager</p>
                         <p className="text-[13px] text-gray-400">View Profile</p>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mb-2 w-56">
                <DropdownMenuLabel>Farm Manager</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/">
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}


function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 md:justify-end">
      <div className="w-full flex-1 md:hidden">
        <MobileNav />
      </div>
      <Button variant="outline" size="icon" className="h-8 w-8">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
      <div className="hidden md:block">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                <AvatarImage
                    src="https://picsum.photos/seed/user/32/32"
                    alt="@user"
                    data-ai-hint="profile avatar"
                />
                <AvatarFallback>FM</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Farm Manager</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/">
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </Link>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex flex-col w-60">
                 <div className="p-6 flex items-center gap-3 border-b">
                    <LeafIcon className="w-8 h-8 text-primary" />
                    <span className="text-[17px] font-semibold text-[#1C1C1E]">AgriVision Pro</span>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {navItems.map((item) => (
                    <Link href={item.href} key={item.label} passHref>
                        <Button
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "w-full flex items-center justify-start gap-3 px-4 py-2 rounded-[8px] text-[15px] font-medium text-gray-900/70 hover:bg-[#E6F2FF] hover:text-primary transition-colors duration-200 ease-in-out",
                            pathname === item.href && "bg-[#E6F2FF] text-primary"
                        )}
                        >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                        </Button>
                    </Link>
                    ))}
                </nav>
                 <div className="p-4 border-t border-gray-100">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-full flex items-center gap-3 rounded-md p-2 hover:bg-gray-50/50">
                                <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src="https://picsum.photos/seed/user/32/32"
                                    alt="@user"
                                    data-ai-hint="profile avatar"
                                />
                                <AvatarFallback>FM</AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                    <p className="text-[15px] font-medium text-[#1C1C1E]">Farm Manager</p>
                                    <p className="text-[13px] text-gray-400">View Profile</p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="mb-2 w-56">
                            <DropdownMenuLabel>Farm Manager</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Link href="/">
                                <DropdownMenuItem>Logout</DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background">
      <VerticalNavbar />
      <div className="flex flex-col md:ml-60">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
