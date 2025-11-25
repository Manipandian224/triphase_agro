
'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseProvider } from "@/firebase/client-provider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

// We can't use Metadata here because this is a client component.
// We can add it to a parent layout if we need it.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';

  return (
    <html lang="en" className="dark">
      <head>
        <title>Triphase Agro</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn(
        inter.className,
        "text-foreground transition-colors duration-500"
      )}>
        <div className={cn(
          "min-h-screen w-full",
          isAuthPage 
            ? 'bg-gradient-to-br from-[#0B0F0B] via-[#163832] to-[#0B0F0B]'
            : 'bg-gradient-to-br from-[#EAEF9D] via-[#B7D67A] to-[#336A29]'
        )}>
          <FirebaseProvider>
            {children}
          </FirebaseProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
