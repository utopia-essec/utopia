import { readFile, access, readdir, stat } from 'node:fs/promises'
import assert from 'node:assert/strict'
const root = new URL('../', import.meta.url)
const manifest = JSON.parse(
  await readFile(new URL('src/event-images.json', root), 'utf8'),
)
let total = 0
for (const [id, image] of Object.entries(manifest)) {
  assert.ok(image.width > 0 && image.height > 0, `${id}: missing dimensions`)
  for (const path of [
    image.src,
    ...image.srcSet.split(', ').map((item) => item.split(' ')[0]),
  ]) {
    assert.ok(
      path.startsWith('/events/') && !path.includes('..'),
      `${id}: invalid path`,
    )
    await access(new URL(`public${path}`, root))
  }
}
async function walk(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), folder)
    if (entry.isDirectory()) await walk(file)
    else {
      const size = (await stat(file)).size
      total += size
      if (size > 1024 * 1024)
        console.warn(
          `Large public asset: ${entry.name} (${(size / 1024).toFixed(0)} KB)`,
        )
    }
  }
}
await walk(new URL('public/', root))
console.log(
  `${Object.keys(manifest).length} event image references verified; public assets ${(total / 1048576).toFixed(2)} MB`,
)
