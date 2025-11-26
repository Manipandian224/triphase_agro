
'use client';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { translateText } from '@/ai/flows/translate-text';
import { useLanguage } from '@/context/language-context';

const cache = new Map<string, string>();

export function useTranslation() {
  const { language } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const translate = useCallback(
    async (text: string, targetLanguage: string) => {
      if (!text || targetLanguage === 'en') {
        return text;
      }
      const cacheKey = `${targetLanguage}:${text}`;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }

      setIsLoading(true);
      try {
        const response = await translateText({ text, targetLanguage });
        cache.set(cacheKey, response.translatedText);
        return response.translatedText;
      } catch (error) {
        console.error('Translation failed:', error);
        return text; // Fallback to original text on error
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const translateAndStore = useCallback(
    async (key: string, text: string) => {
      const translated = await translate(text, language);
      setTranslatedTexts(prev => ({ ...prev, [key]: translated }));
    },
    [language, translate]
  );
  
  const initialKeys = useMemo(
    () => ({
      title: 'AI Crop Health Analysis',
      subtitle: 'Use your camera, upload an image, or view the live feed to get an instant health diagnosis.',
      imageSourceTitle: 'Image Source',
      imageSourceDesc: 'The latest image from your smart farm is shown. You can also upload or capture a new one.',
      cancel: 'Cancel',
      capture: 'Capture',
      uploadFile: 'Upload File',
      useCamera: 'Use Camera',
      analyzing: 'Analyzing...',
      analyzeImage: 'Analyze Image',
      reportTitle: 'Analysis Report',
      reportDesc: 'Review the diagnosis and recommended actions below.',
      reportPlaceholder: 'Your analysis report will appear here.',
      diagnosisLabel: 'Diagnosis',
      confidenceScore: 'AI Confidence Score',
      problemsTitle: 'Identified Problems',
      solutionsTitle: 'Recommended Solutions',
      learnMore: 'Learn More',
      chatTitle: 'AgriBot Assistant',
      chatPlaceholder: 'Ask a question...',
    }),
    []
  );

  useEffect(() => {
    const translateAll = async () => {
        setIsLoading(true);
        const translations: Record<string, string> = {};
        for (const key in initialKeys) {
            const text = initialKeys[key as keyof typeof initialKeys];
            translations[key] = await translate(text, language);
        }
        setTranslatedTexts(translations);
        setIsLoading(false);
    };
    translateAll();
  }, [language, translate, initialKeys]);

  return { translate, translatedTexts, translateAndStore, isLoading };
}
