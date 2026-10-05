import { useEffect } from 'react'
import seo from './seo.json'

export default function PageMetadata() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  useEffect(() => {
    const data = seo[path as keyof typeof seo] ?? seo['/']
    document.title = data.title
    const tags = [
      ['name', 'description', data.description],
      ['property', 'og:type', 'website'],
      ['property', 'og:site_name', 'Utopia ESSEC'],
      ['property', 'og:title', data.title],
      ['property', 'og:description', data.description],
      ['name', 'twitter:card', 'summary'],
      ['name', 'twitter:title', data.title],
      ['name', 'twitter:description', data.description],
    ]
    tags.forEach(([attribute, key, content]) => {
      let tag = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`,
      )
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, key)
        document.head.appendChild(tag)
      }
      tag.content = content
    })
  }, [path])
  return null
}
