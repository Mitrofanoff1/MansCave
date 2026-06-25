"use client";

import React, { useEffect } from 'react';

export default function Reviews() {
  useEffect(() => {
    if (document.querySelector('script[src*="smartwidgets"]')) return;
    const script = document.createElement('script');
    script.src = 'https://res.smartwidgets.ru/app.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <section id="reviews" className="px-4 py-12 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter">
            Отзывы<span className="inline-block w-[0.28em]" /><span className="text-accent">клиентов</span>
          </h2>
        </div>
        <div className="sw-app" data-app="e64b424c670160517ef9f87034d1b2d2"></div>
      </div>
    </section>
  );
}
