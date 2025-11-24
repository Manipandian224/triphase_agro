
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star, Plus, Minus, Droplets, Sun, Thermometer, Wind, ShoppingCart } from 'lucide-react';
import productsData from '@/lib/products.json';

const GlowText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-primary" style={{ textShadow: '0 0 12px hsl(var(--primary))' }}>
    {children}
  </span>
);

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const product = productsData.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const [mainImage, setMainImage] = useState(product.images[0]);

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-card rounded-2xl overflow-hidden shadow-soft border border-white/10">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img, index) => (
                <div 
                  key={index}
                  className={`relative aspect-square w-1/4 bg-card rounded-lg overflow-hidden cursor-pointer border-2 ${mainImage === img ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setMainImage(img)}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">{product.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <span className="text-muted-foreground">(132 reviews)</span>
          </div>
          <p className="text-lg text-muted-foreground">{product.longDescription}</p>
          
          <div className="text-5xl font-bold text-primary">
            <GlowText>${product.price.toFixed(2)}</GlowText>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border border-border rounded-full p-1">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-bold text-lg">{quantity}</span>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQuantity(q => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" className="flex-1 rounded-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow-primary transition-shadow">
              <ShoppingCart className="mr-3 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
          
          <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4 mt-8">
              <h3 className="text-xl font-bold mb-2">Care Guide</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <CareItem icon={Droplets} label="Watering" value={product.care.water} />
                <CareItem icon={Sun} label="Sunlight" value={product.care.light} />
                <CareItem icon={Thermometer} label="Temperature" value={product.care.temperature} />
                <CareItem icon={Wind} label="Fertilizer" value={product.care.fertilizer} />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CareItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <div className="bg-secondary p-2 rounded-full mt-1">
        <Icon className="h-4 w-4 text-primary" />
    </div>
    <div>
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-muted-foreground">{value}</p>
    </div>
  </div>
)
