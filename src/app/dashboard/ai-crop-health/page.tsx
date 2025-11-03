"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  analyzeCropHealthFromImage,
  type AnalyzeCropHealthFromImageOutput,
} from "@/ai/flows/analyze-crop-health-from-image";
import {
  explainCropHealthAnalysis,
  type ExplainCropHealthAnalysisOutput,
} from "@/ai/flows/explain-crop-health-analysis";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BrainCircuit, Info, Loader2, Upload } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";

const exampleImage = PlaceHolderImages.find((p) => p.id === "crop-leaf")!;

export default function AiCropHealthPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(
    exampleImage.imageUrl
  );
  const [analysis, setAnalysis] =
    useState<AnalyzeCropHealthFromImageOutput | null>(null);
  const [explanation, setExplanation] =
    useState<ExplainCropHealthAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAnalysis(null);
        setExplanation(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!imagePreview) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setExplanation(null);

    try {
      const result = await analyzeCropHealthFromImage({
        photoDataUri: imagePreview,
      });
      setAnalysis(result);
    } catch (e) {
      setError("Failed to analyze image. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainClick = async () => {
    if (!imagePreview || !analysis) return;

    setIsExplaining(true);
    try {
      const result = await explainCropHealthAnalysis({
        imageUrl: imagePreview,
        label: analysis.label,
        confidence: analysis.confidence,
      });
      setExplanation(result);
    } catch (e) {
      setError("Failed to get explanation. Please try again.");
      console.error(e);
    } finally {
      setIsExplaining(false);
    }
  };

  const getBadgeVariant = (
    label: string
  ): "default" | "destructive" | "secondary" => {
    if (label.toLowerCase() === "healthy") {
      return "default";
    }
    return "destructive";
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Crop Health Analyzer</CardTitle>
          <CardDescription>
            Upload an image of a crop leaf to get an AI-powered health
            analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Crop preview"
                  fill
                  className="object-contain"
                  data-ai-hint={exampleImage.imageHint}
                />
                {analysis?.boundingBoxes?.map((box, index) => (
                  <div
                    key={index}
                    className="absolute border-2 border-destructive rounded-sm"
                    style={{
                      left: `${box.x * 100}%`,
                      top: `${box.y * 100}%`,
                      width: `${box.w * 100}%`,
                      height: `${box.h * 100}%`,
                    }}
                  />
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-muted/50">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Image preview will appear here
                </p>
              </div>
            )}
          </div>

          <Input
            id="picture"
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </CardContent>
        <CardFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" /> Change Image
          </Button>
          <Button
            onClick={handleAnalyzeClick}
            disabled={isLoading || !imagePreview}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Analyze
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-8 lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing...</span>
              </div>
            )}
            {error && (
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            {analysis && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status</span>
                  <Badge variant={getBadgeVariant(analysis.label)} className="text-sm capitalize">
                    {analysis.label}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Confidence</span>
                    <span className="text-muted-foreground">
                      {(analysis.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={analysis.confidence * 100} className="h-2" />
                </div>

                <Separator />

                <h3 className="font-semibold">Recommended Actions</h3>
                <p className="text-sm text-muted-foreground">
                  {analysis.recommendedActions}
                </p>

                <Button
                  onClick={handleExplainClick}
                  disabled={isExplaining}
                  variant="secondary"
                  className="w-full"
                >
                  {isExplaining ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Info className="mr-2 h-4 w-4" />
                  )}
                  Explain This Analysis
                </Button>
              </div>
            )}
            {!analysis && !isLoading && !error && (
              <div className="text-center text-muted-foreground py-8">
                <BrainCircuit className="mx-auto h-12 w-12" />
                <p className="mt-2">Analysis results will be shown here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {explanation && (
          <Card>
            <CardHeader>
              <CardTitle>AI Explanation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Key Features Identified</h4>
                <p className="text-muted-foreground">{explanation.explanation}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Confidence Reasoning</h4>
                <p className="text-muted-foreground">
                  {explanation.confidenceReasoning}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
