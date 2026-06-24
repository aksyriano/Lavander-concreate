'use client';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

interface TranslateProps {
  k: string;
  children?: React.ReactNode;
}

export default function Translate({ k, children }: TranslateProps) {
  const { lang } = useLanguage();
  const t = translations[lang] || translations['en'];
  
  // Return translation if exists, otherwise fallback to children or the key itself
  return <>{t[k] || children || k}</>;
}
