import { mandatos, indicadores, slugMandato } from '../lib/data.js';

// ponytail: sitemap a mano (13 rutas estáticas). Sin @astrojs/sitemap: una dependencia no se justifica.
export function GET({ site }) {
  const base = site ?? new URL('https://colombiaendatos.co');
  const rutas = [
    '', 'congreso', 'gabinete', 'comparar', 'acerca',
    ...mandatos.map((m) => `presidente/${slugMandato(m)}`),
    ...indicadores.map((i) => `indicador/${i.id}`),
  ];
  const urls = rutas
    .map((r) => `  <url><loc>${new URL(r, base).href}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
