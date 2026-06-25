"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const photos = [
  '/work-1.jpg',
  '/work-2.jpg',
  '/work-3.jpg',
  '/work-4.jpg',
  '/work-5.jpg',
];

const AUTOPLAY_DELAY = 4000;

export default function Works() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const activeRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  activeRef.current = active;

  useEffect(() => {
    photos.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const scheduleNext = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const next = (activeRef.current + 1) % photos.length;
      setDirection(1);
      setActive(next);
    }, AUTOPLAY_DELAY);
  }, []);

  const go = useCallback((i: number, dir?: number) => {
    const next = (i + photos.length) % photos.length;
    setDirection(dir ?? (next > activeRef.current ? 1 : -1));
    setActive(next);
    scheduleNext();
  }, [scheduleNext]);

  useEffect(() => {
    scheduleNext();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [scheduleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      go(activeRef.current + (diff > 0 ? 1 : -1), diff > 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  return (
    <section id="works" className="px-4 py-12 lg:py-20">
      <div className="container mx-auto">

        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter">
            Наши<span className="inline-block w-3 lg:w-4" /><span className="text-accent">работы</span>
          </h2>
        </div>

        {/* Слайдер */}
        <div
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[854/480] cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="sync" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, scale: 1.07, x: direction * 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: direction * -30 }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <Image
                src={photos[active]}
                alt={`Работа барбера ${active + 1} — до и после`}
                fill
                className="object-cover animate-ken-burns"
                unoptimized
                priority={active === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Стрелки поверх фото */}
          <button
            onClick={() => go(active - 1, -1)}
            aria-label="Предыдущая работа"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(active + 1, 1)}
            aria-label="Следующая работа"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Полоски-индикаторы */}
        <div className="flex gap-1.5 max-w-5xl mx-auto mt-5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Работа ${i + 1}`}
              className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden"
            >
              <motion.span
                className="block h-full rounded-full bg-accent"
                initial={false}
                animate={{ width: i === active ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-8 lg:mt-10">
          <a
            href="https://n1001306.yclients.com/company/929070/personal/menu?o="
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent hover:bg-[#d4641f] text-white font-extrabold py-4 px-12 lg:py-5 lg:px-16 rounded-full transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 uppercase tracking-wider text-base animate-pulse-slow"
          >
            Записаться
          </a>
        </div>

      </div>
    </section>
  );
}
