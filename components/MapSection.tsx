"use client";

import React, { useEffect, useRef } from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.src =
      'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A6eb1fd3666c567ea826d0fd8cd85e87e2c5cdf5d75964b7eb2dfeab31af49d13&width=100%25&height=467&lang=ru_RU&scroll=true';
    mapRef.current.appendChild(script);
  }, []);

  return (
    <div className="relative w-full" style={{ height: 467 }}>

      {/* Карта */}
      <div
        ref={mapRef}
        className="absolute inset-0 [&_iframe]:!w-full [&_iframe]:!h-full"
      />

      {/* Карточка поверх карты — справа */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-2xl p-3 md:p-5 w-44 md:w-60 flex flex-col gap-2 md:gap-4">
        <p className="text-[#1C1A19] font-black text-base md:text-xl uppercase tracking-tight">Men&apos;s Cave</p>

        <a href="tel:+79219998862" className="flex items-center gap-2 md:gap-3 group">
          <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent flex items-center justify-center shrink-0">
            <Phone size={13} className="text-white" />
          </div>
          <span className="text-[#1C1A19] font-bold text-xs md:text-sm group-hover:text-accent transition-colors">
            +7 (921) 999-88-62
          </span>
        </a>

        <div className="flex items-start gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent flex items-center justify-center shrink-0">
            <MapPin size={13} className="text-white" />
          </div>
          <p className="text-[#1C1A19] text-xs md:text-sm font-medium leading-snug">
            Воронцовский бульвар, 22
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent flex items-center justify-center shrink-0">
            <Clock size={13} className="text-white" />
          </div>
          <span className="text-[#1C1A19] font-bold text-xs md:text-sm">10:00 – 22:00</span>
        </div>
      </div>

    </div>
  );
}
