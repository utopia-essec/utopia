import sharp from 'sharp'
import { readFile, writeFile, rename, unlink, access } from 'node:fs/promises'
const root = new URL('../', import.meta.url)
const heroes = {
  'ligh.jpg': 'utopia-essec-ai-hero.webp',
  'philo.jpg': 'utopia-conferences-philosophy-hero.webp',
  'templee.jpg': 'utopia-hackathons-temple-hero.webp',
  'greek.jpg': 'utopia-greek-art-dither-reference.webp',
}
for (const [oldName, newName] of Object.entries(heroes)) {
  try {
    await access(new URL(`public/${oldName}`, root))
  } catch {
    continue
  }
  const original = await readFile(new URL(`public/${oldName}`, root))
  const data = await sharp(original)
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toBuffer()
  await writeFile(new URL(`public/${newName}`, root), data)
  await unlink(new URL(`public/${oldName}`, root))
  console.log(
    `${oldName} → ${newName}: ${original.length} → ${data.length} bytes`,
  )
}
const slugs = {
  event_1: 'future-of-ai-2024',
  event_2: 'ia-a-tout-prix-2024',
  event_3: 'ia-en-entreprise-2024',
  event_4: 'arc-prize-2024',
  event_5: 'unaite-inaugural-conference-2024',
  event_6: 'meetup-alan-2024',
  event_7: 'start-from-scratch-2025',
  event_8: 'droit-et-ia-roundtable-2025',
  event_9: 'unaite-perplexity-2025',
  event_10: 'women-in-ai-2025',
  event_11: 'building-outliers-french-founders-2025',
  event_12: 'healthcare-ai-2025',
  hack_1: 'spotlight-consumer-edge-hackathon-2024',
  hack_2: 'llm-agentic-ai-hackathon-2025',
}
const manifestFile = new URL('src/event-images.json', root)
const manifest = JSON.parse(await readFile(manifestFile, 'utf8'))
for (const [id, item] of Object.entries(manifest)) {
  const slug = slugs[id] ?? id
  for (const size of [480, 960]) {
    const oldPath = `/events/${id}-${size}.webp`
    const newPath = `/events/utopia-${slug}-poster-${size}.webp`
    try {
      await rename(
        new URL(`public${oldPath}`, root),
        new URL(`public${newPath}`, root),
      )
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    item.src = item.src.replace(oldPath, newPath)
    item.srcSet = item.srcSet.replaceAll(oldPath, newPath)
  }
}
await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n')
await unlink(new URL('public/temple.jpg', root)).catch((error) => {
  if (error.code !== 'ENOENT') throw error
})
