'use client';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Droplets,
  Feather,
  Sun,
  Thermometer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import plantData from '@/lib/plant-data.json';

const GlowText = ({ children }: { children: React.ReactNode }) => (
  <span
    className="text-primary"
    style={{ textShadow: '0 0 12px hsl(var(--primary))' }}
  >
    {children}
  </span>
);

export default function PlantDetailsPage() {
  const featuredPlant = plantData.find(p => p.id === 'monstera-deliciosa');
  const popularPlants = plantData.filter(p => p.id !== 'monstera-deliciosa').slice(0, 6);

  if (!featuredPlant) return null;

  return (
    <div className="w-full space-y-20 md:space-y-28 py-16 md:py-24 text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-12">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
              <GlowText>{featuredPlant.name}</GlowText>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
              {featuredPlant.description}
            </p>
            <div className="flex items-center gap-4 pt-4 justify-center md:justify-start">
              <Button
                size="lg"
                className="rounded-full h-14 px-8 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow-primary transition-shadow"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="relative h-96 md:h-auto md:aspect-square">
            <Image
              src={featuredPlant.image}
              alt={featuredPlant.name}
              fill
              className="object-contain drop-shadow-2xl"
              data-ai-hint="plant transparent background"
            />
          </div>
        </div>
      </section>

      {/* Popular Plants Section */}
      <section className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Explore <GlowText>Popular Plants</GlowText>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {popularPlants.map(plant => (
            <div
              key={plant.id}
              className="bg-card/50 rounded-2xl p-4 text-center group transition-all hover:bg-card hover:scale-105"
            >
              <div className="relative aspect-square mb-4">
                <Image
                  src={plant.image}
                  alt={plant.name}
                  fill
                  className="object-contain"
                  data-ai-hint="plant clean background"
                />
              </div>
              <h3 className="font-bold text-lg">{plant.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Growth & Care Section */}
      <section className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold mb-12 text-center">
          <GlowText>Growth</GlowText> & Care
        </h2>
        <div className="space-y-12">
          {/* Growth Timeline */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-center">
              Growth Stages
            </h3>
            <div className="relative flex justify-between items-start w-full">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary/70 -translate-y-1/2 animate-pulse"></div>

              {featuredPlant.growth.stages.map((stage, index) => (
                <div
                  key={stage.name}
                  className="relative z-10 flex flex-col items-center w-1/4"
                >
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full bg-card border-2 border-primary mb-3',
                      'bg-primary'
                    )}
                  ></div>
                  <p className="font-bold text-center text-sm md:text-base">
                    {stage.name}
                  </p>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {stage.duration}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Care Accordion */}
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-bold">
                Care Requirements
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <CareItem
                    icon={Droplets}
                    title="Water"
                    value={featuredPlant.care.water}
                  />
                  <CareItem
                    icon={Sun}
                    title="Sunlight"
                    value={featuredPlant.care.sunlight}
                  />
                  <CareItem
                    icon={Thermometer}
                    title="Temperature"
                    value={featuredPlant.care.temperature}
                  />
                  <CareItem
                    icon={Feather}
                    title="Fertilizer"
                    value={featuredPlant.care.fertilizer}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-bold">
                Common Problems
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 pt-2 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Yellowing Leaves:</strong> Often a sign of
                    overwatering. Ensure the soil has proper drainage.
                  </li>
                  <li>
                    <strong>Brown, Crispy Edges:</strong> Indicates low
                    humidity or underwatering. Mist the leaves regularly.
                  </li>
                  <li>
                    <strong>Pests:</strong> Watch out for common pests like
                    spider mites or mealybugs. Treat with neem oil if found.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}

const CareItem = ({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-secondary rounded-full mt-1">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <p className="font-bold text-foreground">{title}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  </div>
);
