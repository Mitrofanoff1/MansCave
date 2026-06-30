"use client";

import React from 'react';
import { Play } from 'lucide-react';
import { useSiteContent } from '@/lib/useSiteContent';

export default function Hero() {
  const { offer } = useSiteContent();
  return (
    <section id="hero" className="relative overflow-hidden bg-dark text-white py-12 lg:py-24 min-h-[640px] lg:min-h-[720px] flex items-center">
      <div id="booking" className="absolute top-0" />
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/promo.mp4" type="video/mp4" media="(min-width: 768px)" />
        <source src="/promo-mobile.mp4" type="video/mp4" />
      </video>
      {/* Затемнение фото */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent lg:from-dark lg:via-dark/70 lg:to-dark/10" />
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">

          <div className="inline-block mb-5 max-w-full">
            <span className="block bg-accent px-5 py-2.5 rounded-full text-[11px] md:text-sm font-bold uppercase tracking-wide shadow-lg">
              Барбершоп в Мурино для тех, кто ценит стиль и качество
            </span>
          </div>

          <h1 className="text-[1.7rem] leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 uppercase tracking-tighter">
            {offer.before} <span className="text-accent">{offer.gift}</span> {offer.after}<span className="text-accent">*</span>
          </h1>


          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-6">
            <a
              href="https://n1001306.yclients.com/company/929070/personal/menu?o="
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-64 text-center bg-accent hover:bg-[#d4641f] font-extrabold py-4 rounded-full transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 uppercase tracking-wider text-base"
            >
              Записаться сейчас
            </a>
          </div>

          {/* Видео-кнопка на мобильном — в потоке под кнопкой */}
          <div className="flex justify-center lg:hidden">
            <a
              href="https://vk.com/menscave_barbershop_spb?z=video-222868352_456239019"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Смотреть видео о барбершопе"
              className="flex items-center justify-center group"
            >
              <div className="relative w-24 h-24 flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
                  <path id="circlePath" fill="none" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
                  <text fill="#E8732A" fontSize="12" fontWeight="700" letterSpacing="2">
                    <textPath href="#circlePath">
                      ВИДЕО О БАРБЕРШОПЕ • ВИДЕО О БАРБЕРШОПЕ •
                    </textPath>
                  </text>
                </svg>
                <span className="absolute w-10 h-10 rounded-full bg-accent/60 animate-ping" />
                <div className="relative w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-2xl">
                  <Play size={16} className="text-white fill-white" />
                </div>
              </div>
            </a>
          </div>

        </div>
      </div>

      {/* Видео-кнопка на десктопе — абсолютная позиция */}
      <a
        href="https://vk.com/menscave_barbershop_spb?z=video-222868352_456239019"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Смотреть видео о барбершопе"
        className="hidden lg:flex absolute right-36 bottom-16 z-10 items-center justify-center group"
      >
        <div className="relative w-44 h-44 flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
            <path id="circlePath2" fill="none" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
            <text fill="#E8732A" fontSize="12" fontWeight="700" letterSpacing="2">
              <textPath href="#circlePath2">
                ВИДЕО О БАРБЕРШОПЕ • ВИДЕО О БАРБЕРШОПЕ •
              </textPath>
            </text>
          </svg>
          <span className="absolute w-20 h-20 rounded-full bg-accent/60 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-2xl">
            <Play size={28} className="text-white fill-white" />
          </div>
        </div>
      </a>
    </section>
  );
}
