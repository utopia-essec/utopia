import sharp from 'sharp'
import { mkdir, writeFile, stat, readFile, access } from 'node:fs/promises'

const output = new URL('../public/events/', import.meta.url)
await mkdir(output, { recursive: true })
const items = [
  ...Array.from({ length: 12 }, (_, i) => ['event', i + 1]),
  ['hack', 1],
  ['hack', 2],
]
const manifestUrl = new URL('../src/event-images.json', import.meta.url)
const manifest = await readFile(manifestUrl, 'utf8')
  .then(JSON.parse)
  .catch(() => ({}))
let originalBytes = 0
let previewBytes = 0
// Small batches keep remote downloads and conversion memory bounded.
for (let offset = 0; offset < items.length; offset += 3) {
  await Promise.all(
    items.slice(offset, offset + 3).map(async ([category, number]) => {
      const id = `${category}_${number}`
      if (manifest[id]?.src.startsWith('/events/utopia-')) {
        await access(new URL(`../public${manifest[id].src}`, import.meta.url))
        console.log(`${id}: kept descriptive optimized assets`)
        return
      }
      try {
        const large = await sharp(
          new URL(`${id}-960.webp`, output).pathname,
        ).metadata()
        const small = await sharp(
          new URL(`${id}-480.webp`, output).pathname,
        ).metadata()
        manifest[id] = {
          width: large.width,
          height: large.height,
          src: `/events/${id}-960.webp`,
          srcSet:
            small.width === large.width
              ? `/events/${id}-960.webp ${large.width}w`
              : `/events/${id}-480.webp ${small.width}w, /events/${id}-960.webp ${large.width}w`,
        }
        console.log(
          `${id}: reused optimized files (${(await stat(new URL(`${id}-960.webp`, output))).size} bytes)`,
        )
        return
      } catch {
        /* Download only missing previews. */
      }
      const response = await fetch(
        `https://utopia-website-nine.vercel.app/affiches/affiches_${category}/${id}.png`,
        { signal: AbortSignal.timeout(60000) },
      )
      if (!response.ok) throw new Error(`${id}: HTTP ${response.status}`)
      const buffer = Buffer.from(await response.arrayBuffer())
      originalBytes += buffer.length
      const metadata = await sharp(buffer).metadata()
      const variants = []
      for (const size of [480, 960]) {
        const { data, info } = await sharp(buffer)
          .rotate()
          .resize({ width: size, withoutEnlargement: true })
          .webp({ quality: 84 })
          .toBuffer({ resolveWithObject: true })
        const path = `/events/${id}-${size}.webp`
        await writeFile(new URL(`${id}-${size}.webp`, output), data)
        if (size === 960) previewBytes += data.length
        variants.push({ path, width: info.width })
      }
      manifest[id] = {
        width: metadata.width,
        height: metadata.height,
        src: variants[1].path,
        srcSet: variants
          .filter(
            (v, i) =>
              variants.findIndex((other) => other.width === v.width) === i,
          )
          .map((v) => `${v.path} ${v.width}w`)
          .join(', '),
      }
      console.log(`${id}: ${(buffer.length / 1024).toFixed(0)} KB original`)
    }),
  )
}
await writeFile(
  new URL('../src/event-images.json', import.meta.url),
  JSON.stringify(manifest, null, 2) + '\n',
)
console.log(
  `Original PNGs: ${(originalBytes / 1048576).toFixed(2)} MB; 960px WebPs: ${(previewBytes / 1048576).toFixed(2)} MB; reduction: ${(100 * (1 - previewBytes / originalBytes)).toFixed(1)}%`,
)
