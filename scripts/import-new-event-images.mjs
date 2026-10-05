import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'

const sources = {
  'paris-builds-2026':
    'https://images.lumacdn.com/uploads/bx/b4d431fb-0786-4e64-a6d6-e47bd26e29e2.png',
  'ai-venture-sprint-2026':
    'https://media.licdn.com/dms/image/v2/D4E22AQH2sSZt4NPmUw/feedshare-image-high-res/B4EZv_ACvNGoAU-/0/1769509760295?e=1792627200&v=beta&t=KuIqxQ_NSMQ5x7oehKEIbTEVlqO2YzY9p71FrMM9s3k',
  'secure-horizons-2026':
    'https://images.lumacdn.com/uploads/vb/d54a7996-3b61-4819-8c29-2faa0a8b2bc8.png',
  'investment-banking-2026':
    'https://images.lumacdn.com/event-covers/ry/7e7137b8-685e-4a5b-83fb-1bcbcc442b31.jpg',
  'echos-2050-2026':
    'https://media.licdn.com/dms/image/v2/D4E22AQGmtwS__wrgZg/feedshare-shrink_800/B4EZ6Yg39.HAAg-/0/1780675215897?e=2147483647&v=beta&t=7mqNU_9y4NoYhe7SvwmQSLeGZC5pCvI9ZJzVjpwj-rg',
  'kpmg-2026':
    'https://media.licdn.com/dms/image/v2/D4E22AQGy7m-CZEPbwQ/feedshare-shrink_800/B4EZz8gO1XIEAg-/0/1773762834238?e=2147483647&v=beta&t=N9RtnUdBBxqYM8I9JRnfoImJ2ZdbOn6tlgizL3zfFqc',
}
const manifestUrl = new URL('../src/event-images.json', import.meta.url)
const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'))
for (const [id, url] of Object.entries(sources)) {
  if (process.argv[2] && process.argv[2] !== id) continue
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) })
  if (!response.ok) throw new Error(`${id}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const variants = []
  let height, width
  for (const size of [480, 960]) {
    const { data, info } = await sharp(buffer)
      .rotate()
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toBuffer({ resolveWithObject: true })
    await writeFile(
      new URL(
        `../public/events/utopia-${id}-poster-${size}.webp`,
        import.meta.url,
      ),
      data,
    )
    variants.push({
      path: `/events/utopia-${id}-poster-${size}.webp`,
      width: info.width,
    })
    width = info.width
    height = info.height
    console.log(
      `${id} ${size}: ${info.width}×${info.height}, ${(data.length / 1024).toFixed(1)} KB`,
    )
  }
  manifest[id] = {
    width,
    height,
    src: variants[1].path,
    srcSet: variants
      .filter(
        (v, i) => variants.findIndex((other) => other.width === v.width) === i,
      )
      .map((v) => `${v.path} ${v.width}w`)
      .join(', '),
    source: url,
  }
  await writeFile(manifestUrl, JSON.stringify(manifest, null, 2) + '\n')
}
