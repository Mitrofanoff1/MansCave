"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const leftFaqs = [
  {
    q: 'Чем барбершоп отличается от обычной парикмахерской?',
    a: <>Барбершоп специализируется исключительно на <strong className="text-white/80">мужских стрижках, оформлении бороды и мужском уходе</strong>. Барберы ежедневно работают с мужскими образами и знают, как подобрать стрижку под форму головы, тип волос и стиль.</>,
  },
  {
    q: 'Могу ли я принести фото стрижки и попросить сделать так же?',
    a: <>Конечно. Покажите фотографию — барбер оценит <strong className="text-white/80">структуру ваших волос и форму лица</strong>, объяснит, как адаптировать образ именно под вас. В большинстве случаев результат максимально близок к референсу.</>,
  },
  {
    q: 'Можно ли сделать камуфляж седины бороды и волос?',
    a: <>Да. Камуфляж выполняется <strong className="text-white/80">как на волосах, так и на бороде</strong>. Процедура выглядит естественно и не создаёт эффекта окрашенных волос.</>,
  },
  {
    q: 'Как часто нужно стричься, чтобы причёска держала форму?',
    a: <>В среднем рекомендуется обновлять стрижку <strong className="text-white/80">каждые 3–5 недель</strong>. Короткие стрижки — раз в 2–3 недели, более длинные — раз в 4–6 недель.</>,
  },
];

const rightFaqs = [
  {
    q: 'Делаете ли вы биозавивку и сколько она занимает?',
    a: <>Да. Перед процедурой рекомендуем <strong className="text-white/80">бесплатную консультацию с барбером</strong>. В среднем биозавивка занимает от 2 до 4 часов в зависимости от длины и желаемого результата.</>,
  },
  {
    q: 'Как выбрать стайлинг: гель, воск, помада или глина?',
    a: <><strong className="text-white/80">Глина</strong> — матовая текстура для коротких стрижек. <strong className="text-white/80">Помада</strong> — блеск для классики. <strong className="text-white/80">Воск</strong> — универсален на каждый день. <strong className="text-white/80">Гель</strong> — сильная фиксация для гладких укладок. Барберы помогут подобрать под ваш тип волос.</>,
  },
  {
    q: 'Что делать, если не знаю, какая стрижка мне подойдёт?',
    a: <>Просто расскажите барберу о предпочтениях и сколько времени готовы уделять укладке. Мы оценим <strong className="text-white/80">форму лица, структуру и густоту волос</strong> и подберём стрижку, которая будет хорошо смотреться именно на вас.</>,
  },
  {
    q: 'Можно ли прийти с ребёнком?',
    a: <>Да. Мы стрижём и взрослых, и детей. Есть комплекс <strong className="text-white/80">«Мужская и детская стрижка»</strong> — сделаете две прически за одно посещение. Удобно и экономит время.</>,
  },
];

function FAQItem({ item, open, onToggle }: {
  item: { q: string; a: React.ReactNode };
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className={`text-sm lg:text-base font-bold leading-snug transition-colors duration-200 ${open ? 'text-accent' : 'text-white/80 group-hover:text-white'}`}>
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="shrink-0 mt-0.5"
        >
          <ChevronDown size={18} className={`transition-colors duration-200 ${open ? 'text-accent' : 'text-white/30 group-hover:text-white/60'}`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm lg:text-[15px] text-white/50 leading-relaxed">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openLeft, setOpenLeft] = useState<number | null>(null);
  const [openRight, setOpenRight] = useState<number | null>(null);

  return (
    <section className="px-4 py-12 lg:py-20">
      <div className="container mx-auto max-w-6xl">

        <div className="text-center mb-10 lg:mb-14">
          <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter">
            Частые вопросы к <span className="text-accent">барбершопу</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16">
          <div className="border-t border-white/10">
            {leftFaqs.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                open={openLeft === i}
                onToggle={() => setOpenLeft(openLeft === i ? null : i)}
              />
            ))}
          </div>

          <div className="border-t border-white/10">
            {rightFaqs.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                open={openRight === i}
                onToggle={() => setOpenRight(openRight === i ? null : i)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
