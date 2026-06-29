"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Menu, Phone, ChevronDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
}

const branches = [
  { name: 'Филиал в Мурино', href: 'https://n1001306.yclients.com/company/929070/personal/menu?o=' },
  { name: 'Филиал в Буграх', href: 'https://n1001306.yclients.com/company/929070/personal/menu?o=' },
];

const navLinks = [
  { name: 'Услуги', href: '/#services' },
  { name: 'О нас', href: '/#about' },
  { name: 'Отзывы', href: '/#reviews' },
  { name: 'До/После', href: '/#about' },
  { name: 'Статьи', href: '/blog' },
  { name: 'Контакты', href: '/#footer' },
];

export default function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const [branchOpen, setBranchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-dark/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 lg:h-20 flex items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-md bg-white flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="Men's Cave" width={56} height={56} className="object-cover w-full h-full scale-[1.3]" unoptimized />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base lg:text-xl font-black uppercase tracking-tighter">Men&apos;s Cave</span>
              <span className="text-[9px] lg:text-[10px] text-white/50 uppercase tracking-[0.2em]">Барбершоп</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {/* Филиал — выпадающий на ховер */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-white/80 hover:text-accent transition-colors py-1">
                Филиал
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-[#252220] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[200px]">
                  {branches.map((b) => (
                    <a
                      key={b.name}
                      href={b.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-5 py-3 text-sm font-bold text-white/70 hover:text-accent hover:bg-white/5 transition-colors"
                    >
                      {b.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-bold uppercase tracking-wide text-white/80 hover:text-accent transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a href="tel:+79219998862" className="hidden md:flex items-center gap-2 font-black text-base lg:text-lg tracking-tight">
              <Phone size={16} className="text-accent" />
              +7 (921) 999-88-62
            </a>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 -mr-2">
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Выезжающее меню */}
      <div className={`fixed inset-0 z-[1000] transition-all duration-500 ${isMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        <div className={`absolute top-0 right-0 h-full w-full max-w-[320px] bg-dark border-l border-white/10 shadow-2xl transition-transform duration-500 p-8 flex flex-col justify-between ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div>
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-black uppercase tracking-tighter">Men&apos;s Cave</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-0">
              {/* Филиал — выпадающий */}
              <div>
                <button
                  onClick={() => setBranchOpen(!branchOpen)}
                  className="flex items-center justify-between w-full text-lg font-black uppercase tracking-tight text-white/90 py-3"
                >
                  Филиал
                  <ChevronDown
                    size={18}
                    className={`text-accent transition-transform duration-300 ${branchOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${branchOpen ? 'max-h-40' : 'max-h-0'}`}>
                  <div className="flex flex-col gap-1 pl-3 pb-3 border-l border-accent/40 ml-1 mb-2">
                    {branches.map((b) => (
                      <a
                        key={b.name}
                        href={b.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-base font-bold text-white/70 hover:text-accent transition-colors py-1.5"
                      >
                        {b.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Остальные ссылки */}
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-black uppercase tracking-tight text-white/90 py-3"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <a href="tel:+79219998862" className="flex items-center gap-2 text-lg font-black">
              <Phone size={18} className="text-accent" />
              +7 (921) 999-88-62
            </a>
            <div className="flex flex-col gap-1.5">
              <a href="https://yandex.ru/maps/-/CTEDfJP1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-accent transition-colors">
                Найти на Яндекс.Картах <ArrowUpRight size={11} />
              </a>
              <a href="https://2gis.ru/spb/firm/70000001080534156?m=30.429488%2C60.067465%2F16" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-accent transition-colors">
                Найти на 2GIS <ArrowUpRight size={11} />
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://t.me/menscavespb" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#29B6F6] flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.02 9.524c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.98l-2.95-.924c-.642-.2-.655-.642.136-.953l11.527-4.447c.535-.194 1.003.13.659.592z"/>
                </svg>
              </a>
              <a href="https://max.ru/u/f9LHodD0cOJhrReEVmIyWpPpJeK3XI70CODDaX4YI2vwRIVPHw1b5gcTtWg" target="_blank" rel="noopener noreferrer" aria-label="MAX" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#6C5CE7] flex items-center justify-center transition-colors">
                <Image src="/max-white.png" alt="MAX" width={24} height={24} unoptimized className="w-6 h-6 opacity-90" />
              </a>
              <a href="https://vk.com/menscave_barbershop_spb" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#2787F5] flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.61v1.575c0 .44-.14.703-1.295.703-1.905 0-4.013-1.15-5.498-3.3C4.897 11.232 4.3 9.156 4.3 8.65c0-.254.102-.49.61-.49h1.744c.457 0 .627.203.813.678.889 2.57 2.37 4.826 2.98 4.826.228 0 .33-.103.33-.67v-2.62c-.066-1.193-.7-1.295-.7-1.727 0-.203.166-.407.432-.407h2.745c.381 0 .51.203.51.652v3.54c0 .38.17.508.28.508.228 0 .42-.128.838-.547 1.295-1.447 2.218-3.677 2.218-3.677.127-.254.33-.49.788-.49h1.744c.525 0 .64.27.525.65-.22.99-2.37 4.09-2.37 4.09-.178.304-.254.44 0 .78.178.254.762.775 1.15 1.244.712.81 1.26 1.49 1.41 1.955.127.457-.102.69-.59.69z"/>
                </svg>
              </a>
            </div>
            <a
              href="https://n1001306.yclients.com/company/929070/personal/menu?o="
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="block text-center w-full bg-accent text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest"
            >
              Записаться
            </a>
          </div>
        </div>
      </div>

      {/* Отступ под фиксированную шапку */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
}
