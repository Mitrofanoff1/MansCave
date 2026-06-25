import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles, type Article } from "@/app/blog/articles";
import ArticleCard from "./blog/ArticleCard";

// Самые важные статьи для главной (коммерческие посадочные + тренды)
const FEATURED = [
  "muzhskaya-strizhka-murino",
  "barbershop-devyatkino",
  "top-10-muzhskih-strizhek-2026",
];

export default function BlogPreview() {
  const items = FEATURED.map((s) => articles.find((a) => a.slug === s)).filter(
    (a): a is Article => Boolean(a)
  );

  return (
    <section id="blog" className="px-4 py-12 lg:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8 lg:mb-12">
          <div>
            <p className="text-[10px] text-accent font-bold uppercase tracking-[0.2em] mb-3">
              Блог Men&apos;s Cave
            </p>
            <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter leading-tight">
              Журнал<span className="inline-block w-[0.28em]" /><span className="text-accent">барбершопа</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-accent font-black uppercase text-xs tracking-widest transition-colors shrink-0"
          >
            Все статьи <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
