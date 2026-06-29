"use client";

import React from 'react';
import Image from 'next/image';
import { Check, ArrowUpRight } from 'lucide-react';

const locations = [
  // current: true — филиал, на сайте которого мы сейчас (выбранная кнопка)
  { name: 'Филиал в Мурино', address: 'Воронцовский бульвар, 22', href: '/', current: true },
  // TODO: вписать ссылку на сайт филиала в Буграх, когда он будет готов
  { name: 'Филиал в Буграх', address: 'улица Шекспира, 1к1', href: '#', current: false },
];

export default function LocationInfo() {
  return (
    <section className="relative z-20 -mt-12 lg:-mt-16 px-4 pb-12 lg:pb-20">
      <div className="container mx-auto">
        <div className="bg-[#252220] rounded-3xl border border-white/10 shadow-2xl p-6 lg:p-8 flex flex-col gap-8 lg:gap-0 lg:flex-row lg:divide-x lg:divide-white/10">

          {/* Адреса */}
          <div className="flex items-center justify-between gap-3 lg:pr-8 lg:flex-1">
            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
              {locations.map((loc) =>
                loc.current ? (
                  // Выбранный филиал (текущий сайт)
                  <div
                    key={loc.name}
                    aria-current="true"
                    className="relative rounded-xl bg-accent/15 ring-1 ring-accent/50 px-3.5 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-black uppercase tracking-wide text-accent">{loc.name}</p>
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                        <Check size={10} strokeWidth={3} /> Вы здесь
                      </span>
                    </div>
                    <p className="text-sm lg:text-base text-white font-semibold mt-0.5">{loc.address}</p>
                  </div>
                ) : (
                  // Другой филиал — переключаемый
                  <a
                    key={loc.name}
                    href={loc.href}
                    className="group rounded-xl border border-white/10 px-3.5 py-2.5 hover:border-accent/40 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-black uppercase tracking-wide text-white/45 group-hover:text-accent transition-colors">{loc.name}</p>
                      <ArrowUpRight size={15} className="shrink-0 text-white/30 group-hover:text-accent transition-colors" />
                    </div>
                    <p className="text-sm lg:text-base text-white/55 font-medium mt-0.5">{loc.address}</p>
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
