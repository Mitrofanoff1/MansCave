"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const aboutPhotos = [
  '/about-4.webp',
  '/about-1.webp',
  '/about-2.webp',
  '/about-3.webp',
  '/about-5.webp',
];

const workPhotos = [
  '/work-1.jpg',
  '/work-2.jpg',
  '/work-3.jpg',
  '/work-4.jpg',
  '/work-5.jpg',
];

const AUTOPLAY_DELAY = 4000;

export default function About() {
  const [aboutActive, setAboutActive] = useState(0);
  const [aboutDir, setAboutDir] = useState(0);
  const aboutActiveRef = useRef(0);
  const aboutIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aboutTouchX = useRef<number | null>(null);

  const [workActive, setWorkActive] = useState(0);
  const [workDir, setWorkDir] = useState(0);
  const workActiveRef = useRef(0);
  const workTouchX = useRef<number | null>(null);

  aboutActiveRef.current = aboutActive;
  workActiveRef.current = workActive;

  useEffect(() => {
    [...aboutPhotos, ...workPhotos].forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const scheduleAbout = useCallback(() => {
    if (aboutIntervalRef.current) clearInterval(aboutIntervalRef.current);
    aboutIntervalRef.current = setInterval(() => {
      const next = (aboutActiveRef.current + 1) % aboutPhotos.length;
      setAboutDir(1);
      setAboutActive(next);
    }, AUTOPLAY_DELAY);
  }, []);

  const goAbout = useCallback((i: number, dir?: number) => {
    const next = (i + aboutPhotos.length) % aboutPhotos.length;
    setAboutDir(dir ?? (next > aboutActiveRef.current ? 1 : -1));
    setAboutActive(next);
    scheduleAbout();
  }, [scheduleAbout]);

  useEffect(() => {
    scheduleAbout();
    return () => { if (aboutIntervalRef.current) clearInterval(aboutIntervalRef.current); };
  }, [scheduleAbout]);

  const goWork = useCallback((i: number, dir?: number) => {
    const next = (i + workPhotos.length) % workPhotos.length;
    setWorkDir(dir ?? (next > workActiveRef.current ? 1 : -1));
    setWorkActive(next);
  }, []);

  const handleAboutTouchStart = (e: React.TouchEvent) => { aboutTouchX.current = e.touches[0].clientX; };
  const handleAboutTouchEnd = (e: React.TouchEvent) => {
    if (aboutTouchX.current === null) return;
    const diff = aboutTouchX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goAbout(aboutActiveRef.current + (diff > 0 ? 1 : -1), diff > 0 ? 1 : -1);
    aboutTouchX.current = null;
  };

  const handleWorkTouchStart = (e: React.TouchEvent) => { workTouchX.current = e.touches[0].clientX; };
  const handleWorkTouchEnd = (e: React.TouchEvent) => {
    if (workTouchX.current === null) return;
    const diff = workTouchX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goWork(workActiveRef.current + (diff > 0 ? 1 : -1), diff > 0 ? 1 : -1);
    workTouchX.current = null;
  };

  return (
    <section id="about" className="px-4 py-12 lg:py-20 overflow-hidden">
      <div className="container mx-auto">

        {/* === О нас === */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
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

          {/* Фото-слайдер О нас (автослайд) */}
          <div>
            <div className="flex gap-3 lg:gap-4">
              <div
                className="relative flex-1 aspect-[4/3] lg:aspect-[5/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-grab active:cursor-grabbing"
                onTouchStart={handleAboutTouchStart}
                onTouchEnd={handleAboutTouchEnd}
              >
                <AnimatePresence mode="sync" custom={aboutDir}>
                  <motion.div
                    key={aboutActive}
                    custom={aboutDir}
                    initial={{ opacity: 0, scale: 1.06, x: aboutDir * 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.96, x: aboutDir * -20 }}
                    transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={aboutPhotos[aboutActive]}
                      alt="Барбершоп Men's Cave"
                      fill
                      className="object-cover animate-ken-burns"
                      unoptimized
                      priority={aboutActive === 0}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="relative hidden sm:block w-16 lg:w-24 rounded-3xl overflow-hidden border border-white/10 shrink-0">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={(aboutActive + 1) % aboutPhotos.length}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={aboutPhotos[(aboutActive + 1) % aboutPhotos.length]}
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

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => goAbout(aboutActive - 1, -1)}
                aria-label="Предыдущее фото"
                className="w-11 h-11 shrink-0 rounded-full border border-white/15 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex-1 flex gap-1.5">
                {aboutPhotos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goAbout(i)}
                    aria-label={`Фото ${i + 1}`}
                    className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden"
                  >
                    <motion.span
                      className="block h-full rounded-full bg-accent"
                      initial={false}
                      animate={{ width: i === aboutActive ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => goAbout(aboutActive + 1, 1)}
                aria-label="Следующее фото"
                className="w-11 h-11 shrink-0 rounded-full border border-white/15 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* === Наши работы (ручное переключение, без автослайда) === */}
        <div className="mt-14 lg:mt-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-4xl font-black uppercase tracking-tighter">
              Наши<span className="inline-block w-2 lg:w-3" /><span className="text-accent">работы</span>
            </h3>
          </div>

          <div
            className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[854/480] cursor-grab active:cursor-grabbing"
            onTouchStart={handleWorkTouchStart}
            onTouchEnd={handleWorkTouchEnd}
          >
            <AnimatePresence mode="sync" custom={workDir}>
              <motion.div
                key={workActive}
                custom={workDir}
                initial={{ opacity: 0, scale: 1.07, x: workDir * 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: workDir * -30 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0"
              >
                <Image
                  src={workPhotos[workActive]}
                  alt={`Работа барбера ${workActive + 1} — до и после`}
                  fill
                  className="object-cover animate-ken-burns"
                  unoptimized
                  priority={workActive === 0}
                />
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => goWork(workActive - 1, -1)}
              aria-label="Предыдущая работа"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goWork(workActive + 1, 1)}
              aria-label="Следующая работа"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex gap-1.5 max-w-5xl mx-auto mt-5">
            {workPhotos.map((_, i) => (
              <button
                key={i}
                onClick={() => goWork(i)}
                aria-label={`Работа ${i + 1}`}
                className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden"
              >
                <motion.span
                  className="block h-full rounded-full bg-accent"
                  initial={false}
                  animate={{ width: i === workActive ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-white/50 mt-6">
            Ознакомиться с реальными работами наших мастеров можно тут
          </p>

          <div className="flex justify-center mt-6">
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

      </div>
    </section>
  );
}
