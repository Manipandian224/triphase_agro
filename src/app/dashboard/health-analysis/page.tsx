
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  Info,
  Lightbulb,
  Upload,
} from 'lucide-react';
import {
  analyzeCropHealthFromImage,
  AnalyzeCropHealthFromImageOutput,
} from '@/ai/flows/analyze-crop-health-from-image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

export default function HealthAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeCropHealthFromImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultImage = PlaceHolderImages.find(img => img.id === 'crop-leaf');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null); // Clear previous results
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!selectedImage) {
      setError('Please select an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeCropHealthFromImage({ photoDataUri: selectedImage });
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
          AI Crop Health Analysis
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
          Upload an image of a crop leaf to get an instant health diagnosis and
          actionable solutions from our AI.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Image Upload & Display */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Crop Image</CardTitle>
            <CardDescription>
              Upload or select an image for analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full bg-secondary rounded-lg overflow-hidden border">
              <Image
                src={selectedImage || defaultImage?.imageUrl || ''}
                alt="Crop for analysis"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
                variant="outline"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <Button
                onClick={handleAnalyzeClick}
                disabled={isLoading || !selectedImage}
                className="flex-1"
              >
                {isLoading ? (
                  'Analyzing...'
                ) : (
                  <>
                    <HeartPulse className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Analysis Results */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Analysis Report</CardTitle>
            <CardDescription>
              Review the diagnosis and recommended actions below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <AnalysisLoadingSkeleton />}
            {error && <p className="text-destructive">{error}</p>}
            {!isLoading && !analysisResult && (
              <div className="text-center text-muted-foreground py-12">
                <Info className="mx-auto h-12 w-12 mb-4" />
                <p>Your analysis report will appear here.</p>
              </div>
            )}
            {analysisResult && <AnalysisResultView result={analysisResult} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalysisResultView({ result }: { result: AnalyzeCropHealthFromImageOutput }) {
  const isHealthy = result.label.toLowerCase().includes('healthy');
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold flex items-center">
            {isHealthy ? (
              <CheckCircle2 className="mr-2 h-6 w-6 text-green-500" />
            ) : (
              <AlertCircle className="mr-2 h-6 w-6 text-yellow-500" />
            )}
            Diagnosis: {result.label}
          </h3>
           <span
              className={`font-bold text-lg ${
                confidencePercent > 80 ? 'text-green-500' : 'text-yellow-500'
              }`}
            >
              {confidencePercent}%
            </span>
        </div>
        <Progress value={confidencePercent} className="h-2" indicatorClassName={confidencePercent < 80 ? "bg-yellow-500" : ""} />
        <p className="text-xs text-muted-foreground mt-1">AI Confidence Score</p>
      </div>

      {!isHealthy && (
        <div>
          <h4 className="font-bold text-lg mb-2 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-destructive" /> Identified Problems
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {result.problems.map((problem, index) => (
              <li key={index}>{problem}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="font-bold text-lg mb-2 flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-primary" /> Recommended Solutions
        </h4>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          {result.solutions.map((solution, index) => (
            <li key={index}>{solution}</li>
          ))}
        </ul>
      </div>

       <div className="text-right mt-4">
            <Button variant="link" className="text-primary">
                Learn More <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}

function AnalysisLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
        <div>
            <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-7 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
        </div>
      <div>
        <Skeleton className="h-6 w-32 mb-3" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <div>
        <Skeleton className="h-6 w-40 mb-3" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}
