"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Globe, Phone, MessageCircle, X } from 'lucide-react';

const BOOKING_URL = "https://n1001306.yclients.com/company/929070/personal/menu?o=";
const PHONE_URL = "tel:+79219998862";
const TG_URL = "https://t.me/menscaveMurino";
const MAX_URL = "https://max.ru/u/f9LHodD0cOJhrReEVmIyWpPpJeK3XI70CODDaX4YI2vwRIVPHw1b5gcTtWg";

// Иконка Telegram (та же, что в футере)
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.02 9.524c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.98l-2.95-.924c-.642-.2-.655-.642.136-.953l11.527-4.447c.535-.194 1.003.13.659.592z" />
  </svg>
);

type Action = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  image?: string; // готовый логотип со своим фоном (показывается без цветного кружка)
  bg?: string;
};

// Порядок сверху вниз: онлайн-запись → телефон → Telegram → MAX
const actions: Action[] = [
  {
    label: "Онлайн-запись",
    href: BOOKING_URL,
    icon: <Globe className="w-6 h-6" />,
    bg: "bg-[#1c1c1c]",
  },
  {
    label: "Позвонить",
    href: PHONE_URL,
    icon: <Phone className="w-6 h-6" />,
    bg: "bg-[#1c1c1c]",
  },
  {
    label: "Написать в Telegram",
    href: TG_URL,
    icon: <TelegramIcon className="w-7 h-7" />,
    bg: "bg-[#29B6F6]",
  },
  {
    label: "Написать в MAX",
    href: MAX_URL,
    image: "/max.png",
  },
];

export default function BookingWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Подложка: клик мимо закрывает меню */}
      {open && (
        <div
          className="fixed inset-0 z-[190]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="fixed right-5 bottom-6 z-[200] flex flex-col items-center gap-4">
        {/* Пункты меню (всплывают сверху) */}
        <div className={`flex flex-col items-center gap-4 ${open ? '' : 'pointer-events-none'}`}>
          {actions.map((a, i) => {
            const isTel = a.href.startsWith('tel:');
            return (
              <a
                key={a.href}
                href={a.href}
                {...(isTel ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                onClick={() => setOpen(false)}
                aria-label={a.label}
                className={`group/item relative flex items-center transition-all duration-300 ease-out ${
                  open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
              >
                {/* Подсказка слева (как на фото) — при наведении */}
                <span className="pointer-events-none absolute right-full mr-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0">
                  <span className="relative block rounded-lg bg-[#2e2e2e] px-3.5 py-2 text-sm font-semibold text-white shadow-lg whitespace-nowrap">
                    {a.label}
                    <span className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-[#2e2e2e]" />
                  </span>
                </span>

                {/* Круглая иконка-кнопка */}
                {a.image ? (
                  <span className="w-14 h-14 rounded-full overflow-hidden shadow-lg shrink-0 transition-transform group-hover/item:scale-105">
                    <Image
                      src={a.image}
                      alt={a.label}
                      width={56}
                      height={56}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </span>
                ) : (
                  <span
                    className={`w-14 h-14 rounded-full ${a.bg} shadow-lg flex items-center justify-center text-white shrink-0 transition-transform group-hover/item:scale-105`}
                  >
                    {a.icon}
                  </span>
                )}
              </a>
            );
          })}
        </div>

        {/* Главная кнопка «Связаться с барбершопом» */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Связаться с барбершопом"
          aria-expanded={open}
          className="relative w-16 h-16 flex items-center justify-center group"
        >
          {/* Пульсация — только когда меню закрыто, чтобы привлекать внимание */}
          {!open && (
            <>
              <span className="absolute w-[80px] h-[80px] rounded-full border-2 border-accent opacity-60 animate-ping-slow" />
              <span className="absolute w-[80px] h-[80px] rounded-full border border-accent/40" />
            </>
          )}

          <span
            className={`relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
              open
                ? 'bg-white text-[#1c1c1c] rotate-90'
                : 'bg-accent text-white shadow-accent/40 group-hover:scale-110 group-hover:bg-[#d4641f]'
            }`}
          >
            {open ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
          </span>
        </button>
      </div>
    </>
  );
}
