// Тянет прайс и тексты из Supabase и запекает их в content/site-content.json.
// Запускается ПЕРЕД сборкой (см. package.json -> build).
// Если Supabase недоступен — оставляет прежний content (сайт не ломается).
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SUPABASE_URL = 'https://nuypnadvzoshqdhjdwre.supabase.co';
// anon-ключ публичный и работает только на ЧТЕНИЕ (защищено RLS) — безопасно держать в коде.
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eXBuYWR2em9zaHFkaGpkd3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NTUzMzQsImV4cCI6MjA5ODMzMTMzNH0.pbfpf6zrqKH8HRPoVWG7ybOKYjtSmvg9IJfS-A52Gnw';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'content');
const OUT = join(OUT_DIR, 'site-content.json');

async function sb(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
  return res.json();
}

try {
  const [items, settings] = await Promise.all([
    sb('price_items?select=category,name,barber,top,sort&order=sort.asc'),
    sb('settings?select=key,value'),
  ]);

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('прайс пустой — не перезаписываю');
  }

  // Группируем услуги по категориям, сохраняя порядок появления.
  const categories = [];
  const byName = new Map();
  for (const it of items) {
    let cat = byName.get(it.category);
    if (!cat) {
      cat = { name: it.category, items: [] };
      byName.set(it.category, cat);
      categories.push(cat);
    }
    cat.items.push({ name: it.name, barber: it.barber, top: it.top });
  }

  const s = Object.fromEntries((settings || []).map((r) => [r.key, r.value]));
  const offer = {
    before: s.offer_before ?? '',
    gift: s.offer_gift ?? '',
    after: s.offer_after ?? '',
    note: s.offer_note ?? '',
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT, JSON.stringify({ categories, offer }, null, 2) + '\n', 'utf8');
  console.log(`✓ content обновлён из Supabase: ${items.length} услуг, оффер загружен`);
} catch (e) {
  if (existsSync(OUT)) {
    console.warn(`⚠ Supabase недоступен (${e.message}). Использую прежний content/site-content.json`);
  } else {
    console.error(`✗ Supabase недоступен и нет резервной копии content: ${e.message}`);
    process.exit(1);
  }
}
