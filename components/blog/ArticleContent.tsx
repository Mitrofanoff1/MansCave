import React from "react";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import type { ContentBlock } from "@/app/blog/articles";
import { BOOKING_URL } from "@/app/blog/articles";
import ArticleImage from "./ArticleImage";

// Инлайн-разметка внутри абзацев: **жирный** и [текст](/ссылка)
function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\[(.+?)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) nodes.push(text.slice(lastIndex, m.index));

    if (m[1] !== undefined) {
      nodes.push(
        <strong key={key++} className="font-bold text-white">
          {m[1]}
        </strong>
      );
    } else if (m[2] !== undefined && m[3] !== undefined) {
      const href = m[3];
      if (href.startsWith("/")) {
        nodes.push(
          <Link
            key={key++}
            href={href}
            className="text-accent underline underline-offset-2 hover:text-white transition-colors"
          >
            {m[2]}
          </Link>
        );
      } else {
        nodes.push(
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:text-white transition-colors"
          >
            {m[2]}
          </a>
        );
      }
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderBlock(block: ContentBlock, i: number): React.ReactNode {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={i}
          className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-12 mb-5 leading-tight"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} className="text-lg md:text-xl font-extrabold text-white mt-8 mb-3">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="text-white/70 text-base md:text-lg leading-relaxed mb-5">
          {parseInline(block.text)}
        </p>
      );
    case "list":
      return block.ordered ? (
        <ol key={i} className="mb-6 space-y-3 counter-reset list-none">
          {block.items.map((it, j) => (
            <li key={j} className="flex gap-3 text-white/70 text-base md:text-lg leading-relaxed">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-black flex items-center justify-center mt-0.5">
                {j + 1}
              </span>
              <span>{parseInline(it)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul key={i} className="mb-6 space-y-3">
          {block.items.map((it, j) => (
            <li key={j} className="flex gap-3 text-white/70 text-base md:text-lg leading-relaxed">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-3" />
              <span>{parseInline(it)}</span>
            </li>
          ))}
        </ul>
      );
    case "image":
      return <ArticleImage key={i} src={block.src} alt={block.alt} caption={block.caption} />;
    case "quote":
      return (
        <blockquote
          key={i}
          className="my-8 pl-6 border-l-2 border-accent text-white/80 text-lg md:text-xl italic leading-relaxed"
        >
          <Quote className="w-6 h-6 text-accent mb-2" />
          {parseInline(block.text)}
          {block.author && (
            <cite className="block mt-3 text-sm text-white/40 not-italic">— {block.author}</cite>
          )}
        </blockquote>
      );
    case "callout":
      return (
        <div
          key={i}
          className="my-8 rounded-2xl border border-accent/25 bg-accent/[0.07] p-6 md:p-7"
        >
          <p className="text-accent font-black uppercase text-xs tracking-widest mb-3">
            {block.title}
          </p>
          <p className="text-white/80 text-base md:text-lg leading-relaxed">
            {parseInline(block.text)}
          </p>
        </div>
      );
    case "cta":
      return (
        <div
          key={i}
          className="my-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-7 md:p-9 text-center"
        >
          <p className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-2">
            Men&apos;s Cave · Барбершоп в Мурино
          </p>
          <p className="text-white/50 text-sm md:text-base mb-6 max-w-md mx-auto">
            Мужские стрижки, борода и бритьё опасной бритвой рядом с метро Девяткино
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent hover:bg-[#d4641f] text-white font-extrabold py-4 px-10 rounded-full transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 active:scale-95 uppercase tracking-wider text-sm"
          >
            {block.text ?? "Записаться онлайн"}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      );
    default:
      return null;
  }
}

export default function ArticleContent({ blocks }: { blocks: ContentBlock[] }) {
  return <div className="article-body">{blocks.map((b, i) => renderBlock(b, i))}</div>;
}
