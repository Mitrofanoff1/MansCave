"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MapPin, Map } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer">

      {/* Основной футер */}
      <div className="bg-[#111010] border-t border-white/10 px-4 py-10 lg:py-14">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

          {/* Бренд */}
          <div>
            <p className="text-xl font-black uppercase tracking-tighter mb-1">Men&apos;s Cave</p>
            <p className="text-xs text-white/40 uppercase tracking-[0.2em] mb-4">Барбершоп</p>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Мужские стрижки в Мурино. Только опытные барберы и душевная атмосфера.
            </p>
          </div>

          {/* Контакты */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Контакты</p>
            <a href="tel:+79219998862" className="flex items-center gap-2 font-black text-lg mb-3 hover:text-accent transition-colors">
              <Phone size={16} className="text-accent" />
              +7 (921) 999-88-62
            </a>
            <div className="space-y-1 text-sm text-white/50">
              <p>Воронцовский бульвар, 22</p>
            </div>
          </div>

          {/* Время / Запись */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Режим работы</p>
            <p className="text-2xl font-black mb-1">10:00 – 22:00</p>
            <p className="text-sm text-white/40 mb-5">Ежедневно, без выходных</p>
            <a
              href="https://n1001306.yclients.com/company/929070/personal/menu?o="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent hover:bg-[#d4641f] text-white font-extrabold py-3 px-8 rounded-full transition-all uppercase tracking-wider text-sm"
            >
              Записаться
            </a>
          </div>

        </div>

        <div className="container mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p className="text-xs text-white/25">© 2026 Men&apos;s Cave. Все права защищены.</p>
            <p className="text-xs text-white/20">ИП Сердюков Георгий Арташесович · ИНН: 780242452310 · ОГРНИП: 323784700326980</p>
            <Link href="/privacy" className="text-xs text-white/25 hover:text-accent transition-colors underline underline-offset-2 mt-1 w-fit mx-auto md:mx-0">
              Политика конфиденциальности
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {/* Telegram */}
            <a href="https://t.me/menscaveMurino" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#29B6F6] flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white/60">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.02 9.524c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.98l-2.95-.924c-.642-.2-.655-.642.136-.953l11.527-4.447c.535-.194 1.003.13.659.592z"/>
              </svg>
            </a>
            {/* MAX */}
            <a href="https://max.ru/u/f9LHodD0cOJhrReEVmIyWpPpJeK3XI70CODDaX4YI2vwRIVPHw1b5gcTtWg" target="_blank" rel="noopener noreferrer" aria-label="MAX" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#6C5CE7] flex items-center justify-center transition-colors">
              <Image src="/max-white.png" alt="MAX" width={20} height={20} unoptimized className="w-5 h-5 opacity-60" />
            </a>
            {/* ВКонтакте */}
            <a href="https://vk.com/menscave_barbershop_spb" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#2787F5] flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white/60">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.61v1.575c0 .44-.14.703-1.295.703-1.905 0-4.013-1.15-5.498-3.3C4.897 11.232 4.3 9.156 4.3 8.65c0-.254.102-.49.61-.49h1.744c.457 0 .627.203.813.678.889 2.57 2.37 4.826 2.98 4.826.228 0 .33-.103.33-.67v-2.62c-.066-1.193-.7-1.295-.7-1.727 0-.203.166-.407.432-.407h2.745c.381 0 .51.203.51.652v3.54c0 .38.17.508.28.508.228 0 .42-.128.838-.547 1.295-1.447 2.218-3.677 2.218-3.677.127-.254.33-.49.788-.49h1.744c.525 0 .64.27.525.65-.22.99-2.37 4.09-2.37 4.09-.178.304-.254.44 0 .78.178.254.762.775 1.15 1.244.712.81 1.26 1.49 1.41 1.955.127.457-.102.69-.59.69z"/>
              </svg>
            </a>
            {/* Яндекс Карты */}
            <a href="https://yandex.ru/maps/-/CTEDfJP1" target="_blank" rel="noopener noreferrer" aria-label="Яндекс.Карты" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#FC3F1D] flex items-center justify-center transition-colors">
              <MapPin size={16} className="text-white/60" />
            </a>
            {/* 2ГИС */}
            <a href="https://2gis.ru/spb/firm/70000001080534156?m=30.429488%2C60.067465%2F16" target="_blank" rel="noopener noreferrer" aria-label="2ГИС" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#1CA355] flex items-center justify-center transition-colors">
              <Map size={16} className="text-white/60" />
            </a>
          </div>
          <p className="text-xs text-white/25">* акция при первом посещении</p>
        </div>
      </div>

    </footer>
  );
}
