"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import type { Article } from "@/app/blog/articles";

interface Props {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: Props) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-accent/40 hover:bg-white/[0.04] transition-all"
    >
      {/* Плейсхолдер обложки */}
      <div className="relative w-full aspect-[16/10] bg-[#111010] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/blog/${article.slug}/hero.jpg`}
          alt={article.heroAlt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
              article.category === "commercial"
                ? "bg-accent text-white"
                : "bg-white/10 text-white/70 backdrop-blur-sm"
            }`}
          >
            {article.clusterLabel}
          </span>
        </div>
      </div>

      {/* Текст */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        <h3
          className={`font-black uppercase tracking-tight text-white leading-tight mb-3 group-hover:text-accent transition-colors ${
            featured ? "text-xl md:text-2xl" : "text-base md:text-lg"
          }`}
        >
          {article.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">{article.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-white/30 font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" /> {article.readingTime} мин · {article.dateLabel}
          </span>
          <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-accent transition-colors" />
        </div>
      </div>
    </Link>
  );
}
