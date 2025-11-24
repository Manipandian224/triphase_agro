'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  generatePlantGuide,
  type GeneratePlantGuideOutput,
} from '@/ai/flows/generate-plant-guide';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertCircle,
  Loader2,
  Sprout,
  Sun,
  Thermometer,
  Trees,
  Droplets,
  Clock,
  FlaskConical,
  HeartPulse,
} from 'lucide-react';

export default function PlantGuidePage() {
  const [plantName, setPlantName] = useState('');
  const [guide, setGuide] = useState<GeneratePlantGuideOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName.trim()) {
      setError('Please provide a plant name.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGuide(null);

    try {
      const result = await generatePlantGuide({ plantName });
      setGuide(result);
    } catch (e: any) {
      console.error('Failed to generate plant guide:', e);
      setError(e.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto p-0 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            AI Plant Guide Generator
          </CardTitle>
          <CardDescription>
            Enter a plant name to generate a detailed care and disease guide.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="flex items-center gap-4">
            <Input
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g., Tomato, Rose, Basil..."
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </form>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {isLoading && <LoadingSkeleton />}

      {guide && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image and Details */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardContent className="p-4">
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={guide.plantImage?.url || 'https://picsum.photos/seed/placeholder/500/500'}
                    alt={guide.details.plantName}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plant Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">Botanical Name</span>
                  <span className="text-muted-foreground">{guide.details.botanicalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Category</span>
                  <span className="text-muted-foreground">{guide.details.category}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                   <span className="font-semibold flex items-center gap-2"><Droplets className="h-4 w-4 text-primary"/>Water</span>
                  <span className="text-muted-foreground">{guide.details.waterRequirement}</span>
                </div>
                 <div className="flex justify-between">
                   <span className="font-semibold flex items-center gap-2"><Sun className="h-4 w-4 text-primary"/>Sunlight</span>
                  <span className="text-muted-foreground">{guide.details.sunlightRequirement}</span>
                </div>
              </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-start">
                        <span className="font-semibold flex items-center gap-2"><Sprout className="h-4 w-4 text-primary"/>Easy Care Tips</span>
                        <p className="text-muted-foreground text-right">{guide.summary.easyCareTips}</p>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold flex items-center gap-2"><Trees className="h-4 w-4 text-primary"/>Ideal Soil</span>
                        <span className="text-muted-foreground">{guide.summary.idealSoilType}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold flex items-center gap-2"><Thermometer className="h-4 w-4 text-primary"/>Ideal Temp/Humidity</span>
                        <span className="text-muted-foreground">{guide.summary.idealTemperatureHumidity}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold flex items-center gap-2"><FlaskConical className="h-4 w-4 text-primary"/>Fertilizer Cycle</span>
                        <span className="text-muted-foreground">{guide.summary.fertilizerCycle}</span>
                    </div>
                </CardContent>
             </Card>

          </div>

          {/* Right Column: Growth and Diseases */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Growth Duration & Stages</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {[
                  { label: "Germination", value: guide.growth.germinationTime, icon: Clock },
                  { label: "Seedling Stage", value: guide.growth.seedlingStageDuration, icon: Clock },
                  { label: "Vegetative Growth", value: guide.growth.vegetativeGrowthDuration, icon: Clock },
                  { label: "Flowering", value: guide.growth.floweringDuration, icon: Clock },
                  { label: "Full Maturity", value: guide.growth.fullMaturityDuration, icon: Clock },
                  { label: "Avg Height & Spread", value: guide.growth.averageHeightAndSpread, icon: Sprout },
                ].map(item => (
                   <div key={item.label} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                        <item.icon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <p className="font-semibold">{item.label}</p>
                            <p className="text-muted-foreground">{item.value}</p>
                        </div>
                    </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><HeartPulse className="h-5 w-5"/>Common Diseases</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {guide.commonDiseases.map((disease, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>
                        <div className='flex items-center gap-4'>
                           <Image src={disease.diseaseImage?.url || 'https://picsum.photos/seed/disease/64/64'} alt={disease.name} width={48} height={48} className="rounded-md object-cover bg-gray-200" />
                           <div className='text-left'>
                             <p className="font-semibold">{disease.name}</p>
                             <div className='flex items-center gap-2 mt-1'>
                               <Badge variant={getSeverityBadge(disease.severity)}>{disease.severity}</Badge>
                               <Badge variant="outline">{disease.cause}</Badge>
                             </div>
                           </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div>
                          <Label className="font-semibold">Symptoms</Label>
                          <p className="text-muted-foreground text-sm">{disease.symptoms}</p>
                        </div>
                         <div>
                          <Label className="font-semibold">Treatment</Label>
                          <p className="text-muted-foreground text-sm">{disease.treatment}</p>
                        </div>
                         <div>
                          <Label className="font-semibold">Prevention</Label>
                          <p className="text-muted-foreground text-sm">{disease.prevention}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardContent className="p-4">
                        <Skeleton className="aspect-square w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
                <Card>
                     <CardHeader>
                         <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                         <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                     <CardContent className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
