'use client';

import { useState, useRef, useCallback } from 'react';
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
  Camera,
  X,
} from 'lucide-react';
import {
  analyzeCropHealthFromImage,
  AnalyzeCropHealthFromImageOutput,
} from '@/ai/flows/analyze-crop-health-from-image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import Webcam from 'react-webcam';
import { useFirebase } from '@/firebase/client-provider';
import { useRtdbValue } from '@/hooks/use-rtdb-value';
import { ref } from 'firebase/database';
import { analyzeCropHealthFromImageUrl } from '@/ai/flows/analyze-crop-health-from-image-url';


export default function HealthAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeCropHealthFromImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const { rtdb } = useFirebase();
  const dbRef = rtdb ? ref(rtdb, 'SmartFarm/cropImageURL') : null;
  const { data: firebaseImageUrl } = useRtdbValue<string>(dbRef);

  const displayImage = selectedImage || firebaseImageUrl;

  const defaultImage = PlaceHolderImages.find(img => img.id === 'crop-leaf');
  const takePhotoImage = PlaceHolderImages.find(img => img.id === 'take-photo');


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null); 
        setError(null);
        setShowCamera(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelectedImage(imageSrc);
      setShowCamera(false);
      setAnalysisResult(null);
      setError(null);
    }
  }, [webcamRef]);

  const handleAnalyzeClick = async () => {
    let imageToAnalyze = selectedImage || firebaseImageUrl;
    
    if (!imageToAnalyze) {
      setError('Please select, capture, or ensure an image is available from the database.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      // If the image is a URL (from Firebase), use the server-side flow.
      if (imageToAnalyze.startsWith('http')) {
        result = await analyzeCropHealthFromImageUrl({ photoUrl: imageToAnalyze });
      } else {
        // If it's a data URI (from upload/camera), use the direct flow.
        result = await analyzeCropHealthFromImage({ photoDataUri: imageToAnalyze });
      }
      setAnalysisResult(result);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment"
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
          AI Crop Health Analysis
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
          Use your camera, upload an image, or view the live feed to get an instant health diagnosis.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Image Source */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Image Source</CardTitle>
            <CardDescription>
              The latest image from your smart farm is shown. You can also upload or capture a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {showCamera ? (
                 <div className='space-y-4'>
                    <div className="w-full aspect-video bg-secondary rounded-lg overflow-hidden border">
                       <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className='flex gap-2'>
                        <Button onClick={() => setShowCamera(false)} variant='outline' className='flex-1'>Cancel</Button>
                        <Button onClick={capture} className='flex-1'><Camera className='mr-2 h-4 w-4'/>Capture</Button>
                    </div>
                 </div>
            ) : (
                <div className='space-y-4'>
                    <div className="relative aspect-video w-full bg-secondary rounded-lg overflow-hidden border">
                        <Image
                            id="analysis-image"
                            src={displayImage || takePhotoImage?.imageUrl || ''}
                            alt="Selected or placeholder crop"
                            fill
                            className="object-cover"
                            data-ai-hint={takePhotoImage?.imageHint || 'take photo illustration'}
                            crossOrigin='anonymous'
                        />
                        {selectedImage && (
                             <Button 
                                variant='destructive' 
                                size='icon' 
                                className='absolute top-2 right-2 rounded-full h-8 w-8'
                                onClick={() => setSelectedImage(null)}
                              >
                                <X className='h-4 w-4'/>
                             </Button>
                        )}
                    </div>
                     <div className="flex gap-2">
                         <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1"
                            variant="outline"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload File
                        </Button>
                        <Button onClick={() => setShowCamera(true)} className="flex-1" variant="outline">
                            <Camera className="mr-2 h-4 w-4" />
                            Use Camera
                        </Button>
                        <Input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                </div>
            )}
             
              <Button
                onClick={handleAnalyzeClick}
                disabled={isLoading || !displayImage}
                className="w-full h-12 text-lg"
              >
                {isLoading ? (
                  'Analyzing...'
                ) : (
                  <>
                    <HeartPulse className="mr-2 h-5 w-5" />
                    Analyze Image
                  </>
                )}
              </Button>
          </CardContent>
        </Card>

        {/* Right Column: Analysis Results */}
        <Card className="shadow-lg min-h-[500px]">
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
