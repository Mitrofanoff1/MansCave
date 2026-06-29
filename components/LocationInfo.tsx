"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const locations = [
  // current: true — филиал, на сайте которого мы сейчас (подсвечен как выбранный)
  { name: 'Филиал в Мурино:', address: 'Воронцовский бульвар, 22', href: '/', current: true },
  // TODO: вписать ссылку на сайт филиала в Буграх, когда он будет готов
  { name: 'Филиал в Буграх:', address: 'улица Шекспира, 1к1', href: '#', current: false },
];

export default function LocationInfo() {
  return (
    <section className="relative z-20 -mt-12 lg:-mt-16 px-4 pb-12 lg:pb-20">
      <div className="container mx-auto">
        <div className="bg-[#252220] rounded-3xl border border-white/10 shadow-2xl p-6 lg:p-8 flex flex-col gap-8 lg:gap-0 lg:flex-row lg:divide-x lg:divide-white/10">

          {/* Адреса */}
          <div className="flex items-center justify-between gap-3 lg:pr-8 lg:flex-1">
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              {locations.map((loc) =>
                loc.current ? (
                  // Текущий филиал — подсвечен (тонкая оранжевая полоска + акцентный цвет)
                  <div key={loc.name} aria-current="true" className="relative pl-3">
                    <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-accent" />
                    <p className="text-sm font-black uppercase tracking-wide text-accent">{loc.name}</p>
                    <p className="text-sm lg:text-base text-white/80 font-medium">{loc.address}</p>
                  </div>
                ) : (
                  // Другой филиал — приглушён, переключается (стрелка + подсветка на ховере)
                  <a key={loc.name} href={loc.href} className="group relative block pl-3">
                    <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-white/10 transition-colors group-hover:bg-accent/60" />
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-black uppercase tracking-wide text-white/40 transition-colors group-hover:text-accent">{loc.name}</p>
                      <ArrowUpRight size={14} className="shrink-0 text-white/25 transition-colors group-hover:text-accent" />
                    </div>
                    <p className="text-sm lg:text-base text-white/45 font-medium transition-colors group-hover:text-white/70">{loc.address}</p>
                  </a>
                )
              )}
            </div>
            <div className="w-14 lg:w-16 flex justify-end shrink-0">
              <Image
                src="/location-badge.png"
                alt=""
                width={270}
                height={434}
                className="h-20 lg:h-24 w-auto opacity-25 grayscale pointer-events-none select-none"
                unoptimized
              />
            </div>
          </div>

          {/* Разделитель */}
          <div className="lg:hidden h-px w-2/3 bg-white/10" />

          {/* Рейтинг */}
          <div className="flex items-center justify-between lg:px-8 lg:flex-1">
            <div className="min-w-0">
              <p className="text-2xl font-black leading-tight">5,0</p>
              <p className="text-xs text-white/50 uppercase tracking-wide">Рейтинг в Яндекс</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Награда «Хорошее место» 2026</p>
            </div>
            <div className="flex justify-end shrink-0">
              <Image
                src="/yandex-badge.png"
                alt=""
                width={260}
                height={350}
                className="h-20 lg:h-24 w-auto opacity-25 grayscale pointer-events-none select-none"
                unoptimized
              />
            </div>
          </div>

          {/* Разделитель */}
          <div className="lg:hidden h-px w-2/3 bg-white/10" />

          {/* Время работы */}
          <div className="flex items-center justify-between gap-3 lg:pl-8 lg:flex-1">
            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-wide leading-tight">Работаем</p>
              <p className="text-xl font-black leading-tight">10:00 – 22:00</p>
            </div>
            <div className="w-14 lg:w-16 flex justify-end shrink-0">
              <Image
                src="/time-badge.png"
                alt=""
                width={312}
                height={320}
                className="h-20 lg:h-24 w-auto opacity-25 grayscale pointer-events-none select-none"
                unoptimized
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
