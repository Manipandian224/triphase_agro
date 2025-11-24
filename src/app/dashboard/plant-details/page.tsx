
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, ChevronRight, Droplets, Sun, Thermometer, Leaf as FertilizerIcon, Clock, CloudSun } from 'lucide-react';
import plantData from '@/lib/plant-data.json';
import { cn } from '@/lib/utils';

const GlowText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-primary" style={{ textShadow: '0 0 12px hsl(var(--primary))' }}>
    {children}
  </span>
);

export default function PlantDetailsPage() {
  const { heroPlant, topSelling, growthDetails } = plantData;

  const careIcons = {
    "Water Schedule": Droplets,
    "Sunlight": Sun,
    "Temperature": Thermometer,
    "Fertilizer": FertilizerIcon,
  };

  return (
    <div className="w-full text-foreground space-y-12">
      {/* Hero Banner Section */}
      <section className="relative -mt-8 -mx-8">
        <div className="container mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 items-center gap-8">
          <div className="space-y-6 text-left">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
              {heroPlant.name.split(' ').slice(0, -1).join(' ')} <GlowText>{heroPlant.name.split(' ').slice(-1)}</GlowText>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              {heroPlant.description}
            </p>
            <div className="flex items-center gap-6 pt-4">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(var(--primary))] transition-shadow">
                Explore Details
              </Button>
            </div>
          </div>
          <div className="relative h-96 md:h-auto md:aspect-square">
            <Image
              src={heroPlant.image}
              alt={heroPlant.name}
              fill
              className="object-contain"
              data-ai-hint="plant transparent background"
            />
          </div>
        </div>
      </section>

      {/* Popular Plants Section */}
      <section className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8">
          Explore <GlowText>[Popular Plants]</GlowText>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {topSelling.map((plant) => (
            <Card key={plant.name} className="bg-card/80 backdrop-blur-sm border-white/10 rounded-2xl overflow-hidden group">
              <CardContent className="p-4 space-y-3 flex flex-col h-full">
                <div className="relative aspect-[4/3] w-full bg-secondary rounded-lg overflow-hidden">
                   <Image
                    src={plant.image}
                    alt={plant.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    data-ai-hint="plant transparent background"
                  />
                </div>
                <div className='flex-grow mt-4'>
                    <h3 className="font-bold text-xl">{plant.name}</h3>
                    <p className="text-sm text-muted-foreground">{plant.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Plant Growth Details Section */}
      <section className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8">
          Growth <GlowText>& Care</GlowText>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-card/80 backdrop-blur-sm border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-2xl mb-4">Growth Duration</h3>
             <div className="relative flex items-center justify-between my-6 px-2">
                {growthDetails.stages.map((stage, index) => (
                    <div key={stage.name} className="flex flex-col items-center z-10 text-center">
                        <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-background"></div>
                        <p className="font-semibold mt-2 text-sm">{stage.name}</p>
                    </div>
                ))}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
            </div>
             <div className="text-center mt-6">
                <p className="text-muted-foreground">Total Time to Full Maturity</p>
                <p className="text-2xl font-bold text-primary"><GlowText>{growthDetails.totalDays} Days</GlowText></p>
            </div>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-white/10 rounded-2xl p-6">
             <h3 className="font-bold text-2xl mb-4">Care Requirements</h3>
             <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {growthDetails.care.map((item, index) => {
                    const Icon = careIcons[item.name as keyof typeof careIcons] || FertilizerIcon;
                    return (
                        <AccordionItem key={item.name} value={`item-${index}`} className={cn(index === growthDetails.care.length - 1 && 'border-b-0')}>
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className='flex items-center gap-3'>
                                    <Icon className="h-5 w-5 text-primary"/>
                                    <span>{item.name}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pl-8">
                                {item.description}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
          </Card>
        </div>
      </section>
    </div>
  );
}
