"use client";

import { useLanguage } from "@/context/LanguageContext";
import React from "react";

export default function FloatingContact() {
  const { lang } = useLanguage();

  const contacts = [

    {
      name: "Facebook",
      tooltip: lang === "ar" ? "تابعنا على فيسبوك" : "Follow us on Facebook",
      url: "https://www.facebook.com/profile.php?id=61559354652582&mibextid=ZbWKwL",
      color: "bg-[#1877F2] hover:bg-[#166fe5]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      tooltip: lang === "ar" ? "تابعنا على إنستغرام" : "Follow us on Instagram",
      url: "https://www.instagram.com/lavanderconcrete?igsh=NWxyazFveDJyajh4",
      color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      tooltip: lang === "ar" ? "تابعنا على تيك توك" : "Follow us on TikTok",
      url: "https://www.tiktok.com/@lavender.concrete2",
      color: "bg-[#010101] hover:bg-[#111111] border border-gray-800",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.62 4.15.94 1.09 2.26 1.8 3.71 2v3.74c-1.78-.17-3.45-.89-4.75-2.12-.07.03-.13.07-.2.1v9.89c.07 4.38-3.23 8.16-7.6 8.24-4.57.08-8.31-3.61-8.23-8.18.08-4.22 3.47-7.64 7.69-7.68h1.24v3.73c-2.13.06-3.86 1.85-3.84 3.99.02 2.14 1.8 3.86 3.94 3.84 2.1-.02 3.79-1.72 3.81-3.82V.02z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto z-50 flex flex-col-reverse gap-3">
      {contacts.map((contact) => (
        <a
          key={contact.name}
          href={contact.url}
          target="_blank"
          rel="noopener noreferrer"
          title={contact.tooltip}
          className={`group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 active:scale-95 ${contact.color}`}
        >
          {contact.icon}

          {/* Tooltip */}
          <span className="absolute hidden group-hover:block whitespace-nowrap bg-gray-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md transition-all duration-200 -top-10 left-1/2 -translate-x-1/2 z-10">
            {contact.tooltip}
          </span>
        </a>
      ))}
    </div>
  );
}
