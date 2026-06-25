"use client";

import React from 'react';
import Image from 'next/image';

const banners = [
  {
    src: '/banner-vk.jpg',
    alt: 'Перейти на страницу ВКонтакте',
    href: 'https://vk.com/menscave_barbershop_spb',
    target: '_blank',
    label: 'Перейти в VK',
  },
  {
    src: '/banner-tg.jpg',
    alt: 'Перейти в группу Telegram',
    href: 'https://t.me/menscavespb',
    label: 'Перейти в TG',
  },
];

export default function Social() {
  return (
    <section className="px-4 pt-4 pb-12 lg:pt-6 lg:pb-16">
      <div className="container mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
          {banners.map((b) => (
            <a
              key={b.href}
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-white/70 underline underline-offset-4 group-hover:text-accent transition-colors">
                {b.label}
              </p>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
