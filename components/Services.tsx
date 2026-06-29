"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import siteContent from '@/content/site-content.json';

// Прайс берётся из Supabase (запекается в content/site-content.json при сборке)
type PriceItem = { name: string; barber: string | null; top: string | null };
const categories = siteContent.categories as { name: string; items: PriceItem[] }[];

export default function Services() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  const select = (i: number) => {
    tabRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    if (i === active) return;
    setDirection(i > active ? 1 : -1);
    setActive(i);
  };

  // Свайп по прайс-листу: влево — следующая категория, вправо — предыдущая
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) select(Math.min(active + 1, categories.length - 1));
      else select(Math.max(active - 1, 0));
    }
    touchStartX.current = null;
  };

  return (
    <section id="services" className="px-4 py-12 lg:py-20">
      <div className="container mx-auto">

        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter">
            Наши<span className="inline-block w-[0.28em]" /><span className="text-accent">услуги</span>
          </h2>
        </div>

        {/* Переключатель категорий */}
        <div className="flex justify-start md:justify-center gap-2 mb-8 lg:mb-10 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              ref={(el) => { tabRefs.current[i] = el; }}
              onClick={() => select(i)}
              className="relative shrink-0 text-xs lg:text-sm font-bold uppercase tracking-wide px-5 py-2.5 rounded-full transition-colors"
            >
              {i === active && (
                <motion.span
                  layoutId="services-active-pill"
                  className="absolute inset-0 bg-accent rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className={`relative z-10 ${i === active ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                {cat.name}
              </span>
              {i !== active && (
                <span className="absolute inset-0 rounded-full border border-white/10 hover:border-accent/50 transition-colors" />
              )}
            </button>
          ))}
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-stretch">
          {/* Прайс-лист */}
          <div
            className="relative bg-[#252220] rounded-3xl border border-white/10 shadow-2xl p-5 lg:p-10 max-w-3xl mx-auto lg:max-w-none lg:mx-0 overflow-hidden lg:min-h-[640px] touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-between gap-3 lg:gap-6 mb-3 pb-3 border-b border-white/10 whitespace-nowrap">
              <span className="text-sm lg:text-base uppercase font-black text-white/40">Прайс-лист</span>
              <div className="flex items-center gap-3 lg:gap-6 shrink-0 text-[9px] lg:text-xs uppercase text-white/40 font-bold">
                <span className="w-16 lg:w-20 text-center">Барбер</span>
                <span className="w-16 lg:w-20 text-center">Топ-барбер</span>
              </div>
            </div>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ x: direction * 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -40, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="divide-y divide-white/5"
              >
                {categories[active].items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-3 py-3 lg:py-4">
                    <p className="text-sm lg:text-base font-medium text-white/90 min-w-0">{item.name}</p>
                    <div className="flex items-center gap-3 lg:gap-6 shrink-0">
                      <span className="w-16 lg:w-20 text-center text-sm lg:text-base font-black text-accent">{item.barber ?? '—'}</span>
                      <span className="w-16 lg:w-20 text-center text-sm lg:text-base font-black text-accent">{item.top ?? '—'}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Фото владельца */}
          <div className="relative hidden lg:block rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/owner.jpg"
              alt="Георгий Сердюков — владелец барбершопа Man's Cave"
              fill
              className="object-cover"
              unoptimized
            />
            {/* Затемнение фото */}
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />

            {/* Плашка с именем */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#252220]/80 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4">
              <p className="font-black uppercase tracking-wide text-lg">Георгий Сердюков</p>
              <p className="text-sm text-white/60">Владелец барбершопа Man&apos;s Cave</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 lg:mt-10">
          <a
            href="https://n1001306.yclients.com/company/929070/personal/menu?o="
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent hover:bg-[#d4641f] text-white font-extrabold py-4 px-12 lg:py-6 lg:px-20 rounded-full transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 uppercase tracking-wider text-base lg:text-xl animate-pulse-slow"
          >
            <span className="lg:hidden">Записаться</span>
            <span className="hidden lg:inline">Записаться на услугу</span>
          </a>
        </div>

      </div>
    </section>
  );
}
