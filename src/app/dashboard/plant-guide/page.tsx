'use client';

import { useState } from 'react';
import Image from 'next/image';
import { generatePlantGuide } from '@/ai/flows/generate-plant-guide';
import type {
  GeneratePlantGuideOutput,
  DiseaseInfo,
} from '@/ai/schemas/generate-plant-guide';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, AlertTriangle, BookOpen, Sprout, Leaf, Sun, Droplets, Clock, ArrowRight, Bug, HeartPulse, ShieldCheck, Microscope } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PlantGuidePage() {
  const [plantName, setPlantName] = useState('');
  const [guide, setGuide] = useState<GeneratePlantGuideOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName.trim()) {
      setError('Please enter a plant name.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGuide(null);

    try {
      const result = await generatePlantGuide({ plantName });
      setGuide(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate the guide. The AI model may be busy or the plant name is not recognized. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityVariant = (severity: 'Low' | 'Medium' | 'High') => {
    switch (severity) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'secondary';
      case 'High':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  const parsePointByPoint = (text: string) => {
    return text.split(/\s*-\s+|\s*\*\s+/).filter(s => s.trim().length > 0);
  }

  return (
    <div className="container mx-auto p-0">
      <Card className="mb-8 shadow-soft-depth-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Sprout className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold tracking-tight">AI Plant Guide Generator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Enter a plant name to generate a comprehensive care and disease guide.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateGuide} className="flex gap-4">
            <Input
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g., Tomato, Rose, Monstera Deliciosa"
              className="flex-grow h-12 rounded-lg text-base"
              disabled={isLoading}
            />
            <Button type="submit" className="h-12 rounded-lg text-base font-semibold px-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Guide
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && <GuideSkeleton />}

      {guide && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image and Summary */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardContent className="p-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={guide.plantImage || "https://picsum.photos/seed/plant/600/600"}
                    alt={`AI generated image of ${guide.plantDetails.plantName}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    data-ai-hint="plant product"
                  />
                </div>
              </CardContent>
              <CardHeader className="pt-2">
                  <CardTitle>{guide.plantDetails.plantName}</CardTitle>
                  <CardDescription className="italic">{guide.plantDetails.botanicalName}</CardDescription>
              </CardHeader>
               <CardContent>
                <div className="space-y-3 text-sm">
                   <div className="flex items-center gap-3"><Leaf className="h-4 w-4 text-primary"/><span>Category: <strong>{guide.plantDetails.category}</strong></span></div>
                   <div className="flex items-center gap-3"><Droplets className="h-4 w-4 text-primary"/><span>Water: <strong>{guide.plantDetails.waterRequirement}</strong></span></div>
                   <div className="flex items-center gap-3"><Sun className="h-4 w-4 text-primary"/><span>Sunlight: <strong>{guide.plantDetails.sunlightRequirement}</strong></span></div>
                </div>
               </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><HeartPulse className="h-5 w-5"/>Care Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p><strong>Easy Tips:</strong> {guide.summary.easyCareTips}</p>
                <p><strong>Soil:</strong> {guide.summary.idealSoilType}</p>
                <p><strong>Temp/Humidity:</strong> {guide.summary.idealTemperatureAndHumidity}</p>
                <p><strong>Fertilizer:</strong> {guide.summary.fertilizerCycle}</p>
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Details and Diseases */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5"/>Growth Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Germination", value: guide.growthDuration.germinationTime },
                  { label: "Seedling", value: guide.growthDuration.seedlingStageDuration },
                  { label: "Vegetative", value: guide.growthDuration.vegetativeGrowthDuration },
                  { label: "Flowering", value: guide.growthDuration.floweringDuration },
                  { label: "Maturity", value: guide.growthDuration.fullMaturityDuration },
                ].map((stage, i, arr) => (
                   <div key={stage.label} className="flex items-center">
                    <div className="flex items-center gap-2 w-32">
                        <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <span className="font-semibold">{stage.label}</span>
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground">{stage.value}</div>
                    {i < arr.length -1 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />}
                  </div>
                ))}
                 <Separator className="my-4"/>
                 <p className="text-sm text-center text-muted-foreground pt-2">Avg. Height & Spread at Maturity: <strong>{guide.growthDuration.averageHeightAndSpread}</strong></p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Microscope className="h-5 w-5"/>Common Diseases & Pests</CardTitle>
                 <CardDescription>A list of common issues that may affect your {guide.plantDetails.plantName}.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {guide.commonDiseases.map((disease, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full pr-4">
                           <span className="font-semibold">{disease.name}</span>
                           <Badge variant={getSeverityVariant(disease.severity)}>{disease.severity}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
                            <div className="md:col-span-1 space-y-4">
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                    <Image src={disease.diseaseImage || `https://picsum.photos/seed/disease${index}/600/400`} alt={`Placeholder image for ${disease.name}`} fill className="object-cover" data-ai-hint="plant disease" />
                                </div>
                                <p className="text-sm"><strong>Cause:</strong> {disease.cause}</p>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-1 flex items-center gap-2"><Bug className="h-4 w-4 text-destructive"/>Symptoms</h4>
                                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                                        {parsePointByPoint(disease.symptoms).map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1 flex items-center gap-2"><HeartPulse className="h-4 w-4 text-blue-500"/>Treatment</h4>
                                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                                        {parsePointByPoint(disease.treatment).map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                 <div>
                                    <h4 className="font-semibold mb-1 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success"/>Prevention</h4>
                                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                                        {parsePointByPoint(disease.prevention).map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            </div>
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

const GuideSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-1 space-y-8">
      <Card>
        <CardContent className="p-4">
          <Skeleton className="aspect-square w-full" />
        </CardContent>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
    <div className="lg:col-span-2 space-y-8">
       <Card>
        <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);
