const logos = [
  { name: 'OpenAI', file: 'openai-logo.webp' },
  { name: 'Mistral AI', file: 'mistral-ai-logo.webp?v=3' },
  { name: 'Perplexity', file: 'perplexity-logo.webp' },
  { name: 'Hugging Face', file: 'hugging-face-logo.webp' },
  { name: 'Lovable', file: 'lovable-logo-v2.webp' },
]

export default function LogoStrip() {
  return (
    <section
      className="names-strip"
      aria-label="Organizations represented by past conference speakers"
    >
      <div className="logo-list">
        {logos.map((logo) => (
          <div className="company-logo" key={logo.name} aria-label={logo.name}>
            <img
              className="company-logo__art"
              width={834}
              height={266}
              src={`/logos/${logo.file}`}
              alt={logo.name}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
