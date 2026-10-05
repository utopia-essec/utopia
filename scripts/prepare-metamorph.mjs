import sharp from 'sharp'
// Derive an ink mask from the supplied artwork instead of approximating its outline.
const { data, info } = await sharp(
  'public/utopia-metalab-metamorph-reference.png',
)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
for (let i = 0; i < data.length; i += 4) {
  const ink = 1 - Math.min(data[i], data[i + 1], data[i + 2]) / 255
  data[i + 3] = Math.round(
    data[i + 3] * Math.max(0, Math.min(1, (ink - 0.035) * 1.5)),
  )
  data[i] = 255
  data[i + 1] = 255
  data[i + 2] = 255
}
await sharp(data, { raw: info })
  .trim()
  .webp({ lossless: true })
  .toFile('public/utopia-metalab-metamorph-sharp.webp')
