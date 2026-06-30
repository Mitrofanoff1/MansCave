"use client";

import { useEffect, useState } from 'react';
import { fallbackContent, fetchSiteContent, type SiteContent } from './content';

// Возвращает контент сайта: сначала запечённый (мгновенно), затем — свежий
// из Supabase, как только подгрузится. Правки в /admin видны без пересборки.
export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(fallbackContent);

  useEffect(() => {
    let alive = true;
    fetchSiteContent().then((c) => {
      if (alive) setContent(c);
    });
    return () => {
      alive = false;
    };
  }, []);

  return content;
}
