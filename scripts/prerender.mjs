import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { render, site, pages, businessSchema } from '../dist-ssr/entry-server.js';

const template = await readFile('dist/index.html', 'utf8');
const schema = JSON.stringify(businessSchema).replace(/</g, '\\u003c');
const hash = createHash('sha256').update(schema).digest('base64');
const escapeHtml = (text) => text.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

for (const page of pages) {
  const url = `${site.origin}${page.path === '/404' ? '/' : page.path}`;
  const head = `
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="robots" content="${page.index ? 'index, follow' : 'noindex, follow'}" />
    ${page.path === '/404' ? '' : `<link rel="canonical" href="${url}" />`}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${site.origin}${site.image}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Мануфактура — бар и кухня, Барнаул, Льва Толстого, 36" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${site.origin}${site.image}" />
    <script type="application/ld+json">${schema}</script>`;
  const html = template.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace('<!--page-head-->', head)
    .replace('<!--page-html-->', render(page.path));
  await writeFile(page.path === '/' ? 'dist/index.html' : `dist${page.path}.html`, html);
}

const headers = (await readFile('public/_headers', 'utf8')).replace('__SCHEMA_HASH__', `'sha256-${hash}'`);
await writeFile('dist/_headers', headers);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
const sitemap = pages.filter((page) => page.index).map((page) => `  <url><loc>${site.origin}${page.path}</loc></url>`).join('\n');
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`);
console.log(`Pre-rendered ${pages.length} pages with metadata, sitemap and security headers.`);
