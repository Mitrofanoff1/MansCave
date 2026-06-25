"use client";

import React, { useState } from "react";
import { ImageIcon } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

// Картинка статьи с плейсхолдером: пока файла по пути src нет,
// показывается аккуратная рамка с описанием. Как только владелец
// загрузит фото по этому пути — оно отобразится автоматически.
export default function ArticleImage({ src, alt, caption, className = "" }: Props) {
  const [error, setError] = useState(false);

  return (
    <figure className={`my-8 ${className}`}>
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-[#111010]">
        {!error ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center px-6">
            <ImageIcon className="w-9 h-9 text-white/20" />
            <span className="text-xs text-white/35 max-w-sm leading-relaxed">{alt}</span>
            <span className="text-[10px] text-white/15 font-mono break-all">{src}</span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-white/40">{caption}</figcaption>
      )}
    </figure>
  );
}
