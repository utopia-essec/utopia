import { readFile, writeFile, mkdir } from 'node:fs/promises'
const root = new URL('../', import.meta.url)
const seo = JSON.parse(await readFile(new URL('src/seo.json', root), 'utf8'))
const template = await readFile(new URL('dist/index.html', root), 'utf8')
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
const siteUrl = process.env.SITE_URL
  ? new URL(process.env.SITE_URL).origin
  : null
if (siteUrl && !siteUrl.startsWith('https://'))
  throw new Error('SITE_URL must use HTTPS')
for (const [route, metadata] of Object.entries(seo)) {
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(metadata.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escape(metadata.description)}" />`,
    )
  html = html.replace(
    '</head>',
    `<meta property="og:type" content="website" /><meta property="og:site_name" content="Utopia ESSEC" /><meta property="og:title" content="${escape(metadata.title)}" /><meta property="og:description" content="${escape(metadata.description)}" /><meta name="twitter:card" content="summary" /><meta name="twitter:title" content="${escape(metadata.title)}" /><meta name="twitter:description" content="${escape(metadata.description)}" /></head>`,
  )
  if (siteUrl) {
    const canonical = escape(`${siteUrl}${route}`)
    html = html.replace(
      '</head>',
      `<link rel="canonical" href="${canonical}" /><meta property="og:url" content="${canonical}" /></head>`,
    )
  }
  const folder = new URL(`dist${route === '/' ? '' : route}/`, root)
  await mkdir(folder, { recursive: true })
  await writeFile(new URL('index.html', folder), html)
}
if (siteUrl) {
  await writeFile(
    new URL('dist/sitemap.xml', root),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(
      seo,
    )
      .map((route) => `<url><loc>${escape(siteUrl + route)}</loc></url>`)
      .join('')}</urlset>`,
  )
}
await writeFile(
  new URL('dist/robots.txt', root),
  `User-agent: *\nAllow: /\nDisallow: /logo-preview.html\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`,
)
