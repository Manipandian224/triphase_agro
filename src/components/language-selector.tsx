
'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage, languages } from '@/context/language-context';
import { Languages } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-auto bg-transparent border-0 text-white focus:ring-0">
         <div className='flex items-center gap-2'>
            <Languages className="h-5 w-5" />
            <SelectValue placeholder="Language" />
         </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map(lang => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
