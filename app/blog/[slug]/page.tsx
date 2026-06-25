import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, ChevronRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ArticleContent from "@/components/blog/ArticleContent";
import ArticleCard from "@/components/blog/ArticleCard";
import { articles, getArticle, getRelated, SITE_URL } from "../articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Статья не найдена | Men's Cave" };

  return {
    title: a.metaTitle,
    description: a.metaDescription,
    keywords: a.keywords.join(", "),
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      title: a.metaTitle,
      description: a.metaDescription,
      url: `${SITE_URL}/blog/${a.slug}`,
      siteName: "Men's Cave Барбершоп",
      type: "article",
      publishedTime: a.date,
      locale: "ru_RU",
      images: [{ url: "/og-about.jpg", width: 1200, height: 630, alt: a.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: a.metaTitle,
      description: a.metaDescription,
      images: ["/og-about.jpg"],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = getRelated(slug);

  // ── JSON-LD: статья, хлебные крошки, FAQ ──
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    image: `${SITE_URL}/og-about.jpg`,
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: "Men's Cave — Барбершоп в Мурино", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Men's Cave — Барбершоп в Мурино",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${article.slug}` },
    keywords: article.keywords.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Блог", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/blog/${article.slug}` },
    ],
  };

  const faqLd = article.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <main className="min-h-screen bg-dark">
      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      <article className="container mx-auto px-4 max-w-3xl py-10 md:py-16">
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-[11px] text-white/40 font-bold uppercase tracking-wider mb-8 flex-wrap">
          <Link href="/" className="hover:text-accent transition-colors">
            Главная
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-accent transition-colors">
            Блог
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white/25 normal-case tracking-normal truncate max-w-[200px]">
            {article.clusterLabel}
          </span>
        </nav>

        {/* Заголовок статьи */}
        <header className="mb-8">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-accent/15 text-accent mb-5">
            {article.clusterLabel}
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[1.08] text-white mb-5">
            {article.title}
          </h1>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-6">{article.lead}</p>
          <div className="flex items-center gap-5 text-[11px] text-white/30 font-bold uppercase tracking-wider pb-6 border-b border-white/10">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {article.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {article.readingTime} мин чтения
            </span>
          </div>
        </header>

        {/* Контент */}
        <ArticleContent blocks={article.content} />

        {/* FAQ */}
        {article.faq && article.faq.length > 0 && (
          <section className="mt-14 pt-10 border-t border-white/10">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-7">
              Частые вопросы
            </h2>
            <div className="space-y-4">
              {article.faq.map((f, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
                  <p className="text-white font-extrabold text-base md:text-lg mb-2.5">{f.q}</p>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ключевые слова — для тематической полноты */}
        <div className="mt-12 flex flex-wrap gap-2">
          {article.keywords.map((k) => (
            <span
              key={k}
              className="text-[11px] text-white/35 bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
            >
              {k}
            </span>
          ))}
        </div>
      </article>

      {/* Похожие статьи */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 max-w-6xl pb-16 md:pb-24">
          <div className="flex items-center gap-3 mb-7">
            <span className="w-8 h-[2px] bg-accent rounded-full" />
            <h2 className="text-sm font-black uppercase tracking-widest text-white/80">
              Читайте также
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/50 hover:text-accent font-black uppercase text-xs tracking-widest transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Все статьи
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
