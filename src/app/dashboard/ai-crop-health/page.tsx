"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  analyzeCropHealthFromImage,
  type AnalyzeCropHealthFromImageOutput,
} from "@/ai/flows/analyze-crop-health-from-image";
import { translateText } from "@/ai/flows/translate-text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  BrainCircuit,
  Languages,
  ListChecks,
  Loader2,
  Upload,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useFirebase } from "@/firebase/client-provider";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type TranslatedContent = {
  problems: string[];
  solutions: string[];
};

export default function AiCropHealthPage() {
  const { rtdb } = useFirebase();

  const [imageFromDb, setImageFromDb] = useState<string | null>(null);
  const [analysis, setAnalysis] =
    useState<AnalyzeCropHealthFromImageOutput | null>(null);
  const [translatedContent, setTranslatedContent] =
    useState<TranslatedContent | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState("en");

  // Effect to listen for image URL from Realtime Database
  useEffect(() => {
    if (!rtdb) return;

    const db = getDatabase();
    const imageRef = ref(db, "SmartFarm/cropImageURL");

    const unsubscribe = onValue(imageRef, (snapshot) => {
      const url = snapshot.val();
      if (url && url !== imageFromDb) {
        setImageFromDb(url);
        setAnalysis(null);
        setTranslatedContent(null);
        setError(null);
        setTargetLang("en");
      }
    });

    return () => off(imageRef, "value", unsubscribe);
  }, [rtdb, imageFromDb]);

  // Effect to automatically analyze when a new image is set from the DB
  useEffect(() => {
    const handleAutoAnalyze = async () => {
      if (!imageFromDb) return;

      setIsAnalyzing(true);
      setError(null);

      try {
        const result = await analyzeCropHealthFromImage({
          photoDataUri: imageFromDb,
        });
        setAnalysis(result);
      } catch (e) {
        setError("Failed to analyze image. Please try again.");
        console.error(e);
      } finally {
        setIsAnalyzing(false);
      }
    };

    handleAutoAnalyze();
  }, [imageFromDb]);

  // Effect to handle translation when language or analysis changes
  useEffect(() => {
    const handleTranslate = async () => {
      if (!analysis || targetLang === "en") {
        setTranslatedContent(null);
        return;
      }

      setIsTranslating(true);
      try {
        const [translatedProblems, translatedSolutions] = await Promise.all([
          translateText({
            text: analysis.problems.join("\n"),
            targetLanguage: targetLang,
          }),
          translateText({
            text: analysis.solutions.join("\n"),
            targetLanguage: targetLang,
          }),
        ]);

        setTranslatedContent({
          problems: translatedProblems.translatedText.split("\n"),
          solutions: translatedSolutions.translatedText.split("\n"),
        });
      } catch (e) {
        console.error("Translation failed:", e);
        setError("Failed to translate analysis.");
      } finally {
        setIsTranslating(false);
      }
    };

    handleTranslate();
  }, [targetLang, analysis]);

  const getBadgeVariant = (
    label: string
  ): "default" | "destructive" | "secondary" | "success" => {
    if (label.toLowerCase() === "healthy") {
      return "success";
    }
    return "destructive";
  };

  const displayedProblems = translatedContent?.problems || analysis?.problems;
  const displayedSolutions =
    translatedContent?.solutions || analysis?.solutions;

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Automated Crop Health Analysis</CardTitle>
          <CardDescription>
            Live image from your field is automatically analyzed by AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            {imageFromDb ? (
              <Image
                src={imageFromDb}
                alt="Latest crop from field"
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-muted/50">
                <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Waiting for image from your field...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8 lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(isAnalyzing || !imageFromDb) && !analysis && (
              <div className="flex items-center space-x-2 text-muted-foreground justify-center py-8 text-center">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>
                  {imageFromDb
                    ? "Analyzing new image..."
                    : "Waiting for image..."}
                </span>
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
                  <Badge
                    variant={getBadgeVariant(analysis.label)}
                    className="text-sm capitalize"
                  >
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
                  <Progress
                    value={analysis.confidence * 100}
                    className="h-2"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <XCircle className="text-destructive h-5 w-5" />
                      Problems Identified
                    </h3>
                    <ul className="space-y-1 list-disc list-inside text-muted-foreground text-sm pl-2">
                      {displayedProblems?.map((item, i) => (
                        <li key={`problem-${i}`}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <CheckCircle className="text-success h-5 w-5" />
                      Recommended Solutions
                    </h3>
                    <ul className="space-y-1 list-disc list-inside text-muted-foreground text-sm pl-2">
                      {displayedSolutions?.map((item, i) => (
                        <li key={`solution-${i}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label
                    htmlFor="language-select"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <Languages className="h-4 w-4" /> Translate Analysis
                  </Label>
                  <Select
                    value={targetLang}
                    onValueChange={setTargetLang}
                    disabled={isTranslating}
                  >
                    <SelectTrigger id="language-select">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                    </SelectContent>
                  </Select>
                  {isTranslating && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin" /> Translating...
                    </p>
                  )}
                </div>
              </div>
            )}
            {!analysis && !isAnalyzing && !error && imageFromDb && (
              <div className="text-center text-muted-foreground py-8">
                <BrainCircuit className="mx-auto h-12 w-12" />
                <p className="mt-2">Ready for analysis.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
