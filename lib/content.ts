import { supabase } from './supabaseClient';
import baked from '@/content/site-content.json';

export type PriceItem = { name: string; barber: string | null; top: string | null };
export type Category = { name: string; items: PriceItem[] };
export type Offer = { before: string; gift: string; after: string; note: string };
export type SiteContent = { categories: Category[]; offer: Offer };

// Запечённый при сборке контент — мгновенный фолбэк (нет пустых мест + SEO).
export const fallbackContent = baked as SiteContent;

// Тянет актуальные оффер и прайс из Supabase прямо в браузере.
// Если что-то не так — возвращает запечённый фолбэк, сайт не ломается.
export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    const [itemsRes, settingsRes] = await Promise.all([
      supabase.from('price_items').select('category,name,barber,top,sort').order('sort', { ascending: true }),
      supabase.from('settings').select('key,value'),
    ]);

    const items = itemsRes.data;
    if (itemsRes.error || !Array.isArray(items) || items.length === 0) {
      return fallbackContent;
    }

    // Группируем услуги по категориям, сохраняя порядок появления.
    const categories: Category[] = [];
    const byName = new Map<string, Category>();
    for (const it of items as { category: string; name: string; barber: string | null; top: string | null }[]) {
      let cat = byName.get(it.category);
      if (!cat) {
        cat = { name: it.category, items: [] };
        byName.set(it.category, cat);
        categories.push(cat);
      }
      cat.items.push({ name: it.name, barber: it.barber, top: it.top });
    }

    const s = Object.fromEntries(((settingsRes.data as { key: string; value: string }[]) || []).map((r) => [r.key, r.value]));
    const offer: Offer = {
      before: s.offer_before ?? fallbackContent.offer.before,
      gift: s.offer_gift ?? fallbackContent.offer.gift,
      after: s.offer_after ?? fallbackContent.offer.after,
      note: s.offer_note ?? fallbackContent.offer.note,
    };

    return { categories, offer };
  } catch {
    return fallbackContent;
  }
}
