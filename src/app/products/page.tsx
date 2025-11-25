
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import products from '@/lib/products.json';

const GlowText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-primary" style={{ textShadow: '0 0 12px hsl(var(--primary))' }}>
    {children}
  </span>
);

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter">
          Our <GlowText>Collection</GlowText>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
          Explore our hand-picked selection of beautiful, healthy houseplants, ready to bring life to your space.
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-2 md:gap-4 mb-12">
        <FilterDropdown title="Category" items={['Foliage', 'Succulent', 'Vining', 'Tree']} />
        <FilterDropdown title="Price" items={['Under $25', '$25 - $50', '$50 - $75', 'Over $75']} />
        <FilterDropdown title="Size" items={['Small', 'Medium', 'Large']} />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((plant) => (
          <Card key={plant.id} className="bg-card border-white/10 rounded-2xl overflow-hidden group shadow-soft transition-transform hover:-translate-y-2">
            <CardContent className="p-0">
              <Link href={`/products/${plant.id}`}>
                <div className="relative aspect-square w-full bg-secondary/50 overflow-hidden cursor-pointer">
                  <Image
                    src={plant.images[0]}
                    alt={plant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="plant clean background"
                  />
                </div>
              </Link>
              <div className='p-6 space-y-3'>
                <Link href={`/products/${plant.id}`}>
                  <h3 className="font-bold text-2xl cursor-pointer hover:text-primary transition-colors">{plant.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground h-10">{plant.shortDescription}</p>
                <div className="flex justify-between items-center pt-2">
                  <p className="text-2xl font-bold text-primary"><GlowText>${plant.price}</GlowText></p>
                  <Button size="icon" variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/10">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const FilterDropdown = ({ title, items }: { title: string, items: string[] }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full border-primary/20 bg-card hover:border-primary/40 hover:bg-secondary">
                {title}
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-popover border-border w-56">
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {items.map(item => (
                <DropdownMenuCheckboxItem key={item}>
                    {item}
                </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
)
