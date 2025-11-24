
"use client";

import React from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { products } from "@/lib/products";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function ProductsPage() {

  const categories = ["BARBER", "COFLORASY", "ELECTRONICS", "FASHION", "FOOD"];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-64 w-full rounded-2xl overflow-hidden">
        <Image
          src="https://picsum.photos/seed/product-hero/1200/400"
          alt="Products hero"
          fill
          className="object-cover"
          data-ai-hint="leaves background"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-white tracking-tight">Products</h1>
          <p className="text-lg text-white/80 mt-2">Home / Products</p>
        </div>
      </div>
      
      {/* Categories and Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {categories.map(cat => (
              <Button key={cat} variant={cat === "COFLORASY" ? "ghost" : "ghost"} className={cn("text-muted-foreground hover:text-primary", cat === "COFLORASY" && "text-primary font-semibold border-b-2 border-primary rounded-none")}>
                {cat}
              </Button>
            ))}
             <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                &gt;
              </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="CATEGORIES" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="succulent">Succulent</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="COLOR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="SIZE" />
              </SelectTrigger>
               <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="PRICE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low-to-high">$ - $$$</SelectItem>
                <SelectItem value="high-to-low">$$$ - $</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-grow"></div>
             <Select defaultValue="default">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default sorting</SelectItem>
                <SelectItem value="popularity">Sort by popularity</SelectItem>
                <SelectItem value="rating">Sort by average rating</SelectItem>
                <SelectItem value="newness">Sort by newness</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden text-center">
            <CardContent className="p-0">
               <div className="relative aspect-square w-full bg-gray-100">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={product.imageHint}
                />
                 {product.discount && (
                  <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)'}}>{product.discount}%</div>
                )}
               </div>
               <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    {product.originalPrice && <p className="text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>}
                    <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Pagination */}
       <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
