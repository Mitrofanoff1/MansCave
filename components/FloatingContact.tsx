"use client";

import React from 'react';
import { Phone } from 'lucide-react';

export default function FloatingContact() {
  return (
    <a
      href="tel:+79219998862"
      aria-label="Позвонить в Men's Cave"
      className="fixed bottom-5 left-5 z-50 w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl shadow-accent/40 hover:scale-110 active:scale-95 transition-transform animate-pulse-slow"
    >
      <Phone size={24} className="fill-white" />
    </a>
  );
}
