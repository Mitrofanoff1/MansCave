"use client";

import React from 'react';

export default function BookingWidget() {
  return (
    <a
      href="https://n1001306.yclients.com/company/929070/personal/menu?o="
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Онлайн запись"
      className="fixed right-5 bottom-6 z-[200] flex items-center justify-center group"
    >
      {/* Внешнее кольцо с пульсацией */}
      <span className="absolute w-[88px] h-[88px] rounded-full border-2 border-accent opacity-60 animate-ping-slow" />
      <span className="absolute w-[88px] h-[88px] rounded-full border border-accent/40" />

      {/* Основная кнопка */}
      <div className="relative w-[72px] h-[72px] rounded-full bg-accent group-hover:bg-[#d4641f] shadow-2xl shadow-accent/40 transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
        <span className="text-white font-black text-[10px] uppercase tracking-widest leading-tight text-center">
          Онлайн<br />запись
        </span>
      </div>
    </a>
  );
}
