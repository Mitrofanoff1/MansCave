"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const photos = [
  '/about-4.webp',
  '/about-1.webp',
  '/about-2.webp',
  '/about-3.webp',
  '/about-5.webp',
];

const AUTOPLAY_DELAY = 4000;

export default function About() {
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
    <section id="about" className="px-4 py-12 lg:py-20 overflow-hidden">
      <div className="container mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Текст */}
        <div>
          <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter mb-6 leading-[1.1]">
            О нашем <span className="text-accent">барбершопе</span> Men&apos;s Cave
          </h2>
          <div className="space-y-4 text-sm lg:text-base text-white/70 leading-relaxed max-w-xl">
            <p>Men&apos;s Cave — барбершоп в Мурино, где занимаются исключительно мужскими стрижками и знают, как подобрать форму под твои волосы, внешность и стиль.</p>
            <p>У нас работают только опытные барберы — <strong className="font-bold text-white">никаких новичков, которые учатся на клиентах</strong>. Мастер внимательно выслушает твои пожелания и сделает именно то, за чем ты пришел. А если ты еще не определился со стрижкой — предложит образ, который действительно тебе подойдет.</p>
            <p>
              <span className="hidden lg:inline">Здесь тебя встретят с улыбкой, поддержат разговор и помогут перезагрузиться. </span>
              Профессиональная мужская стрижка, хороший сервис и душевная атмосфера — <strong className="font-bold text-white">рядом с домом, без поездок в центр</strong>.
            </p>
          </div>
        </div>

        {/* Фото-слайдер */}
        <div>
          <div className="flex gap-3 lg:gap-4">

            {/* Главное фото */}
            <div
              className="relative flex-1 aspect-[4/3] lg:aspect-[5/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="sync" custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  initial={{ opacity: 0, scale: 1.06, x: direction * 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.96, x: direction * -20 }}
                  transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0"
                >
                  <Image
                    key={active}
                    src={photos[active]}
                    alt="Барбершоп Men's Cave"
                    fill
                    className="object-cover animate-ken-burns"
                    unoptimized
                    priority={active === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Следующее фото — превью */}
            <div className="relative hidden sm:block w-16 lg:w-24 rounded-3xl overflow-hidden border border-white/10 shrink-0">
              <AnimatePresence mode="sync">
                <motion.div
                  key={(active + 1) % photos.length}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={photos[(active + 1) % photos.length]}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/55" />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Управление */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => go(active - 1, -1)}
              aria-label="Предыдущее фото"
              className="w-11 h-11 shrink-0 rounded-full border border-white/15 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Фото ${i + 1}`}
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
            <button
              onClick={() => go(active + 1, 1)}
              aria-label="Следующее фото"
              className="w-11 h-11 shrink-0 rounded-full border border-white/15 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
