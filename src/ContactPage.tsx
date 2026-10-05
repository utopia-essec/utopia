import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, Copy, Check } from 'lucide-react'
import ContactSignal from './ContactSignal'
import './contact.css'

const email = 'utopia.essec@gmail.com'

export default function ContactPage() {
  const [opened, setOpened] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(copyTimer.current), [])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const organization = String(data.get('organization') ?? '').trim()
    if (!name || !organization || !message) {
      const field = form.elements.namedItem(
        !name ? 'name' : !organization ? 'organization' : 'message',
      ) as HTMLInputElement | HTMLTextAreaElement
      field.setCustomValidity('Please enter a value, not just spaces.')
      field.reportValidity()
      return
    }
    const body = `Name: ${name}\nEmail: ${data.get('email')}\nOrganization: ${organization}\n\n${message}`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Utopia — ${data.get('topic')}`)}&body=${encodeURIComponent(body)}`
    setOpened(true)
  }
  async function copyEmail() {
    clearTimeout(copyTimer.current)
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopyError(true)
      setCopied(false)
    }
    copyTimer.current = setTimeout(() => {
      setCopied(false)
      setCopyError(false)
    }, 2500)
  }
  return (
    <main id="main" className="contact-page">
      <section className="contact-layout" aria-labelledby="contact-title">
        <div className="contact-intro">
          <h1 id="contact-title">Let’s connect</h1>
          <p>
            Have a question, an idea for an event, or a partnership in mind? Get
            in touch with the Utopia team.
          </p>
          <div className="contact-address">
            <a href={`mailto:${email}`}>{email}</a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div
            className={`copy-toast${copied || copyError ? ' is-visible' : ''}`}
            role="status"
          >
            {copyError
              ? 'Please select and copy the email address.'
              : copied
                ? 'Email address copied'
                : ''}
          </div>
          <ContactSignal />
        </div>
        <form
          className="contact-form"
          onSubmit={submit}
          onInput={(event) => {
            const target = event.target
            if (
              target instanceof HTMLInputElement ||
              target instanceof HTMLTextAreaElement
            )
              target.setCustomValidity('')
            setOpened(false)
          }}
        >
          <div className="contact-form-row">
            <label>
              Your name *
              <input
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                placeholder="Full name"
              />
            </label>
            <label>
              Email address *
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label>
            Organization *
            <input
              name="organization"
              autoComplete="organization"
              required
              maxLength={150}
              placeholder="Company, association, or university"
            />
          </label>
          <label>
            What would you like to discuss? *
            <select name="topic" defaultValue="" required>
              <option value="" disabled>
                Select a topic
              </option>
              <option>Partnerships</option>
              <option>Conferences</option>
              <option>Hackathons</option>
              <option>Consulting</option>
              <option>Joining Utopia</option>
              <option>General inquiry</option>
            </select>
          </label>
          <label>
            Your message *
            <textarea
              name="message"
              required
              rows={6}
              maxLength={2000}
              placeholder="Tell us a little about your idea…"
            />
          </label>
          <p id="mail-hint" className="contact-hint">
            This opens a draft in your email app. Review it there and press Send
            to deliver your message.
          </p>
          <button
            className="button button-light"
            type="submit"
            aria-describedby="mail-hint"
          >
            Open email draft <ArrowUpRight size={18} />
          </button>
          {opened && (
            <p className="contact-status" role="status">
              Email draft requested—your message has not been sent yet. If no
              app opened, email <a href={`mailto:${email}`}>{email}</a>{' '}
              directly. Your form text is still here to copy.
            </p>
          )}
        </form>
      </section>
    </main>
  )
}
