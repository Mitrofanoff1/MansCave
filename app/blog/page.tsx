import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/blog/ArticleCard";
import { articles, SITE_URL } from "./articles";

export const metadata: Metadata = {
  title: "Блог барбершопа Men's Cave — статьи о мужских стрижках и уходе | Мурино",
  description:
    "Полезные статьи о мужских стрижках, уходе за бородой и выборе барбершопа. Гид по барбершопам в Мурино и рядом с метро Девяткино от мастеров Men's Cave.",
  keywords:
    "барбершоп мурино, мужская стрижка мурино, барбершоп девяткино, уход за бородой, как выбрать барбершоп, модные мужские стрижки",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Блог барбершопа Men's Cave — статьи о мужских стрижках и уходе",
    description:
      "Полезные статьи о мужских стрижках, уходе за бородой и выборе барбершопа в Мурино и рядом с метро Девяткино.",
    url: `${SITE_URL}/blog`,
    siteName: "Men's Cave Барбершоп",
    images: [{ url: "/og-about.jpg", width: 1200, height: 630 }],
    locale: "ru_RU",
    type: "website",
  },
};

export default function BlogPage() {
  const commercial = articles.filter((a) => a.category === "commercial");
  const info = articles.filter((a) => a.category === "info");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Блог барбершопа Men's Cave",
    description:
      "Статьи о мужских стрижках, уходе за бородой и выборе барбершопа в Мурино и рядом с метро Девяткино.",
    url: `${SITE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Men's Cave — Барбершоп в Мурино",
      url: SITE_URL,
    },
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: `${SITE_URL}/blog/${a.slug}`,
      datePublished: a.date,
      description: a.excerpt,
    })),
  };

  return (
    <main className="min-h-screen bg-dark">
      <SiteHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-accent font-black uppercase text-[10px] tracking-[0.2em] mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> На главную
        </Link>

        {/* Заголовок */}
        <header className="mb-14 md:mb-20 max-w-3xl">
          <p className="text-[10px] text-accent font-bold uppercase tracking-[0.2em] mb-4">
            Men&apos;s Cave · Барбершоп в Мурино
          </p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[1.05] text-white mb-6">
            Статьи о мужском <span className="text-accent">груминге</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            Гид по мужским стрижкам, уходу за бородой и выбору барбершопа. Делимся опытом
            барберов Men&apos;s Cave — для тех, кто стрижётся в Мурино и рядом с метро Девяткино.
          </p>
        </header>

        {/* Коммерческие — услуги и где подстричься */}
        <section className="mb-16 md:mb-24">
          <div className="flex items-center gap-3 mb-7">
            <span className="w-8 h-[2px] bg-accent rounded-full" />
            <h2 className="text-sm font-black uppercase tracking-widest text-white/80">
              Услуги и где подстричься
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5 md:gap-6">
            {commercial.map((a) => (
              <ArticleCard key={a.slug} article={a} featured />
            ))}
          </div>
        </section>

        {/* Информационные — полезные статьи */}
        <section>
          <div className="flex items-center gap-3 mb-7">
            <span className="w-8 h-[2px] bg-accent rounded-full" />
            <h2 className="text-sm font-black uppercase tracking-widest text-white/80">
              Полезные статьи
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {info.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
