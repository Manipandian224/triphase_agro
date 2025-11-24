
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Leaf, MessageCircle, Star, ShoppingCart } from 'lucide-react';
import products from '@/lib/products.json';

const GlowText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-primary" style={{ textShadow: '0 0 12px hsl(var(--primary))' }}>
    {children}
  </span>
);

export default function HomePage() {
  const topSelling = products.slice(0, 3);
  const featuredProduct = products[4];

  return (
    <div className="w-full text-foreground space-y-24 md:space-y-32 py-16 md:py-24">
      {/* Hero Section */}
      <section className="container mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-12">
          <div className="space-y-6 text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
              Bring Nature <GlowText>Indoors</GlowText>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Discover our curated collection of premium houseplants. Elevate your space with a touch of green.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="rounded-full h-14 px-8 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow-primary transition-shadow">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="rounded-full h-14 px-8 text-lg font-semibold">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative h-96 md:h-auto md:aspect-square">
            <Image
              src={featuredProduct.images[0]}
              alt={featuredProduct.name}
              fill
              className="object-contain"
              data-ai-hint="plant transparent background"
            />
          </div>
        </div>
      </section>

      {/* Top Selling Section */}
      <section className="container mx-auto" id="products">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Our <GlowText>Top Selling</GlowText> Plants
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topSelling.map((plant) => (
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
        <div className="text-center mt-12">
            <Link href="/products">
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg font-semibold border-primary/30 text-primary hover:bg-primary/10">
                    View All Products
                </Button>
            </Link>
        </div>
      </section>

       {/* Why Choose Us Section */}
      <section className="container mx-auto" id="about">
         <h2 className="text-4xl font-bold mb-12 text-center">
          Why <GlowText>Choose Us?</GlowText>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl text-center shadow-soft border-white/10">
                <Leaf className="h-12 w-12 text-primary mx-auto mb-4"/>
                <h3 className="text-xl font-bold mb-2">Expertly Curated</h3>
                <p className="text-muted-foreground">Every plant is hand-picked by our specialists to ensure the highest quality.</p>
            </div>
             <div className="bg-card p-8 rounded-2xl text-center shadow-soft border-white/10">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4"/>
                <h3 className="text-xl font-bold mb-2">Health Guarantee</h3>
                <p className="text-muted-foreground">Your plant arrives happy and healthy, or we'll make it right.</p>
            </div>
             <div className="bg-card p-8 rounded-2xl text-center shadow-soft border-white/10">
                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4"/>
                <h3 className="text-xl font-bold mb-2">Lifetime Support</h3>
                <p className="text-muted-foreground">Our plant experts are here to help you with any questions, anytime.</p>
            </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="container mx-auto" id="contact">
        <div className="bg-card rounded-2xl shadow-soft border-white/10 p-8 md:p-12 text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400"/>)}
            </div>
            <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6">"I'm in love with my new Monstera from AuraFlora! It arrived in perfect condition and has completely transformed my living room. The quality and customer service are unmatched."</p>
            <div className="flex items-center justify-center gap-4">
                <Image src="https://picsum.photos/seed/user-review/48/48" width={48} height={48} alt="Customer photo" className="rounded-full" data-ai-hint="person avatar"/>
                <div>
                    <p className="font-bold">Jessica L.</p>
                    <p className="text-sm text-muted-foreground">Verified Customer</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
