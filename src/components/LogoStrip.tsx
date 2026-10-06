const logos = [
  { name: 'Hugging Face', file: 'hugging-face-logo.webp' },
  { name: 'OpenAI', file: 'openai-logo.webp' },
  { name: 'Perplexity', file: 'perplexity-logo.webp' },
  { name: 'Lovable', file: 'lovable-logo-v2.webp' },
  { name: 'Mistral AI', file: 'mistral-ai-logo.webp?v=3' },
  { name: 'Kima Ventures', file: 'kima-ventures-logo.webp' },
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
              className={`company-logo__art${logo.name === 'Perplexity' ? ' company-logo__art--perplexity' : logo.name === 'Hugging Face' ? ' company-logo__art--huggingface' : ''}`}
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
