"use client";

import React from 'react';
import Image from 'next/image';

const locations = [
  { name: 'Филиал в Мурино:', address: 'Воронцовский бульвар, 22', mapLink: '#' },
  { name: 'Филиал в Буграх:', address: 'улица Шекспира, 1к1', mapLink: '#' },
];

export default function LocationInfo() {
  return (
    <section className="relative z-20 -mt-12 lg:-mt-16 px-4 pb-12 lg:pb-20">
      <div className="container mx-auto">
        <div className="bg-[#252220] rounded-3xl border border-white/10 shadow-2xl p-6 lg:p-8 flex flex-col gap-8 lg:gap-0 lg:flex-row lg:divide-x lg:divide-white/10">

          {/* Адреса */}
          <div className="flex items-center justify-between gap-3 lg:pr-8 lg:flex-1">
            <div className="flex flex-col gap-3 min-w-0">
              {locations.map((loc) => (
                <a
                  key={loc.name}
                  href={loc.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group -m-2 p-2 rounded-xl transition-colors hover:bg-white/5"
                >
                  <p className="text-sm font-black uppercase tracking-wide text-accent">{loc.name}</p>
                  <p className="text-sm lg:text-base text-white/70 font-medium transition-colors group-hover:text-white">{loc.address}</p>
                </a>
              ))}
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
            <div className="w-14 lg:w-16 flex justify-end shrink-0">
              <Image
                src="/yandex-badge.png"
                alt=""
                width={794}
                height={1078}
                className="h-20 lg:h-24 w-auto opacity-25 grayscale pointer-events-none select-none rotate-[14deg]"
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
