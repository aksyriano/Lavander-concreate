"use client";

import ProductList from "@/components/home/ProductList";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang] || translations['en'];

  return (
    <div className="bg-background px-4 py-8 sm:py-12 lg:py-16 lg:px-8 min-h-screen">
      <div className="text-center mx-auto mb-18 space-y-3">
        <h1 className="text-primary leading-tighter text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
          {t.homeTitle}
        </h1>
        <p className="text-foreground text-base max-w-3xl mx-auto text-balance sm:text-lg">
          {t.homeSubtitle}
        </p>
      </div>
      <ProductList />
    </div>
  );
}
