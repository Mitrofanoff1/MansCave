// Post-build: делаем КАЖДЫЙ HTML полностью самодостаточным.
// Берём CSS-файлы, на которые ссылается страница, встраиваем их содержимое
// прямо в <head> как <style>, и УБИРАЕМ внешние <link rel="stylesheet">.
//
// Зачем: на iOS Safari (особенно на кастомном домене .рф) подгрузка CSS
// отдельным запросом не срабатывала — страница открывалась без стилей.
// Если CSS встроен в HTML, он применяется всегда, без сетевых подзапросов.
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'out');

function inlineCssInHtml(htmlPath) {
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Находим все <link rel="stylesheet" href="...">
  const linkRegex = /<link[^>]*rel="stylesheet"[^>]*>/g;
  const links = html.match(linkRegex) || [];

  let inlinedCount = 0;
  for (const link of links) {
    const hrefMatch = link.match(/href="([^"]+)"/);
    if (!hrefMatch) continue;
    let href = hrefMatch[1];

    // Только локальные css (игнорируем внешние домены)
    if (/^https?:\/\//.test(href)) continue;

    const cssFsPath = path.join(outDir, href.replace(/^\//, '').split('?')[0]);
    if (!fs.existsSync(cssFsPath)) continue;

    const css = fs.readFileSync(cssFsPath, 'utf8');
    // Заменяем <link> на <style> с содержимым CSS
    html = html.replace(link, `<style data-inlined="${path.basename(cssFsPath)}">${css}</style>`);
    inlinedCount++;
  }

  // На всякий случай вычищаем data-precedence, если где-то остался
  html = html.replace(/ data-precedence="[^"]*"/g, '');

  fs.writeFileSync(htmlPath, html);
  console.log(`✓ ${path.relative(outDir, htmlPath)} — встроено CSS: ${inlinedCount}`);
}

function walkHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full);
    else if (entry.name.endsWith('.html')) inlineCssInHtml(full);
  }
}

walkHtml(outDir);
console.log('✓ patch-html: CSS встроен в HTML, внешние ссылки на CSS убраны');
