import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Check, CheckCheck, Mail, MessageCircle, Send } from 'lucide-react'

export interface SceneProps {
  onProgress?: (progress: number) => void
  onDone?: () => void
}

const prefersStill = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches

// Each scene is a list of step durations. The clock only runs while the scene is on
// screen, and reduced-motion users get the finished state with no timers at all.
function useTimeline(durations: number[], { onProgress, onDone }: SceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const last = durations.length - 1
  const [step, setStep] = useState(0)
  const callbacks = useRef({ onProgress, onDone })
  callbacks.current = { onProgress, onDone }
  useEffect(() => {
    callbacks.current.onProgress?.(step / last)
  }, [step, last])
  useEffect(() => {
    if (prefersStill()) {
      setStep(last)
      return
    }
    let frame = 0
    let previous = 0
    let elapsed = 0
    let index = 0
    let visible = false
    setStep(0)
    const tick = (now: number) => {
      if (visible && previous) elapsed += Math.min(now - previous, 100)
      previous = now
      if (elapsed >= durations[index]) {
        elapsed = 0
        index += 1
        if (index > last) {
          index = 0
          callbacks.current.onDone?.()
        }
        setStep(index)
      }
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0.35 },
    )
    if (ref.current) observer.observe(ref.current)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
    // The durations are module constants, so `last` covers any change that matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [last])
  return { ref, step }
}

const on = (active: boolean) => (active ? ' is-on' : '')

const GLYPHS = '▪▫░▒▓/_-+*'

// Text resolves left to right out of noise, as if it were being looked up live.
function Scramble({ text, active }: { text: string; active: boolean }) {
  const [shown, setShown] = useState(active && prefersStill() ? text : '')
  useEffect(() => {
    if (!active) {
      setShown('')
      return
    }
    if (prefersStill()) {
      setShown(text)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const resolved = Math.floor(((now - start) / 520) * text.length)
      if (resolved >= text.length) {
        setShown(text)
        return
      }
      setShown(
        text.slice(0, resolved) +
          Array.from(
            { length: Math.min(text.length - resolved, 6) },
            () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          ).join(''),
      )
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, active])
  return <>{shown || ' '}</>
}

function Ticker({ value, active }: { value: number; active: boolean }) {
  const [shown, setShown] = useState(active && prefersStill() ? value : 0)
  useEffect(() => {
    if (!active) {
      setShown(0)
      return
    }
    if (prefersStill()) {
      setShown(value)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const amount = Math.min(1, (now - start) / 800)
      setShown(Math.round(value * (1 - (1 - amount) ** 3)))
      if (amount < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, active])
  return <>{shown.toLocaleString('en-US')} €</>
}

function Bubble({
  from,
  text,
  active,
}: {
  from: 'them' | 'bot'
  text: string
  active: boolean
}) {
  return (
    <div className={`bubble bubble-${from}${on(active)}`}>
      {from === 'bot' && active && (
        <span className="bubble-dots">
          <i />
          <i />
          <i />
        </span>
      )}
      <span className="bubble-text">{text}</span>
    </div>
  )
}

/* 1. Lead qualification: a chat decides, then the lead lands in the CRM. */
const leadTimeline = [500, 1000, 1500, 1100, 1500, 750, 1100, 2400]
const leadMessages = [
  { from: 'them', text: 'Hi, do you offer team plans?', at: 1 },
  { from: 'bot', text: 'We do. How many people are on your team?', at: 2 },
  { from: 'them', text: 'About 40. We’d like to start next month.', at: 3 },
  { from: 'bot', text: 'Perfect, I’m passing you to sales now.', at: 4 },
] as const

export function LeadScene(props: SceneProps) {
  const { ref, step } = useTimeline(leadTimeline, props)
  return (
    <div ref={ref} className="scene scene-lead">
      <div className="lead-chat">
        <div className="scene-bar">
          <MessageCircle size={13} /> WhatsApp assistant
        </div>
        <div className="lead-messages">
          {leadMessages.map((message) => (
            <Bubble
              key={message.at}
              from={message.from}
              text={message.text}
              active={step >= message.at}
            />
          ))}
        </div>
      </div>
      <div className={`lead-beam${on(step >= 5)}`}>
        <span />
      </div>
      <div className="lead-crm">
        <div className="scene-bar">
          CRM <em>Inbound</em>
        </div>
        <div className={`lead-row lead-row-new${on(step >= 6)}`}>
          <strong>Northwind</strong>
          <span>40 seats · Next month</span>
          <b className="pill pill-hot">Qualified</b>
        </div>
        <div className="lead-row">
          <strong>Globex</strong>
          <span>12 seats · This quarter</span>
          <b className="pill">Contacted</b>
        </div>
        <div className="lead-row">
          <strong>Initech</strong>
          <span>Student project</span>
          <b className="pill pill-off">Not a fit</b>
        </div>
      </div>
    </div>
  )
}

/* 2. Prospecting: a list enriches itself row by row, then each email is rewritten. */
const prospects = [
  {
    name: 'Camille',
    company: 'Acme',
    role: 'Head of Sales',
    mail: 'camille@acme.example',
    hook: 'opening a Lyon office',
  },
  {
    name: 'Hugo',
    company: 'Globex',
    role: 'COO',
    mail: 'hugo@globex.example',
    hook: 'hiring ten new reps',
  },
  {
    name: 'Inès',
    company: 'Umbrella',
    role: 'CEO',
    mail: 'ines@umbrella.example',
    hook: 'launching in Spain',
  },
]
const prospectTimeline = [1800, 1800, 1800, 2600]

export function ProspectScene(props: SceneProps) {
  const { ref, step } = useTimeline(prospectTimeline, props)
  const current = prospects[Math.min(step, prospects.length - 1)]
  return (
    <div ref={ref} className="scene scene-prospect">
      <div className="prospect-table">
        <div className="scene-bar">Prospects</div>
        {prospects.map((prospect, index) => (
          <div
            key={prospect.company}
            className={`prospect-row${on(index === step)}${step > index ? ' is-done' : ''}`}
          >
            <strong>{prospect.company}</strong>
            <span>
              <Scramble text={prospect.role} active={step >= index} />
            </span>
            <span className="prospect-mail">
              <Scramble text={prospect.mail} active={step >= index} />
            </span>
            <span className={`prospect-sent${on(step > index)}`}>
              <CheckCheck size={14} />
            </span>
          </div>
        ))}
      </div>
      <div className="prospect-mailbox">
        <div className="scene-bar">
          <Mail size={13} /> Draft <em>to {current.name}</em>
        </div>
        <p>
          Hi{' '}
          <mark>
            <Scramble text={current.name} active />
          </mark>
          ,
        </p>
        <p>
          I saw that{' '}
          <mark>
            <Scramble text={current.company} active />
          </mark>{' '}
          is{' '}
          <mark>
            <Scramble text={current.hook} active />
          </mark>
          . Could we show you how others handle that?
        </p>
        <span className="prospect-send">
          <Send size={12} /> Sending
        </span>
      </div>
    </div>
  )
}

/* 3. Documents: a sheet of paper fills itself in from your data. */
const quoteLines = [
  ['Setup', '1,200 €'],
  ['40 licences', '720 €'],
  ['Support', '300 €'],
]
const quoteSources = ['CRM', 'Price list', 'Scope notes']
const quoteTimeline = [500, 800, 650, 650, 650, 1000, 900, 2400]

export function QuoteScene(props: SceneProps) {
  const { ref, step } = useTimeline(quoteTimeline, props)
  return (
    <div ref={ref} className="scene scene-quote">
      <ul className="quote-sources">
        {quoteSources.map((source, index) => (
          <li key={source} className={on(step === index + 1)}>
            {source}
          </li>
        ))}
      </ul>
      <div className={`quote-beam${on(step >= 1 && step < 6)}`} />
      <div className="quote-stack">
        <div className={`quote-sheet quote-sheet-a${on(step >= 7)}`}>
          Report
        </div>
        <div className={`quote-sheet quote-sheet-b${on(step >= 7)}`}>
          Proposal
        </div>
        <div className="quote-paper">
          <div className="quote-head">
            <strong>Quote</strong>
            <span className={`quote-fill${on(step >= 1)}`}>
              <i>For Northwind</i>
            </span>
          </div>
          {quoteLines.map(([label, amount], index) => (
            <div
              key={label}
              className={`quote-line quote-fill${on(step >= index + 2)}`}
            >
              <i>{label}</i>
              <i>{amount}</i>
            </div>
          ))}
          <div className="quote-total">
            <span>Total</span>
            <strong>
              <Ticker value={2220} active={step >= 5} />
            </strong>
          </div>
          <span className={`quote-stamp${on(step >= 6)}`}>
            <Check size={12} /> Ready to send
          </span>
        </div>
      </div>
    </div>
  )
}

/* 4. Assistant: the same website at three hours of the day, always answered. */
const assistantTurns = [
  {
    hour: 14,
    time: '14:08',
    question: 'Do you ship to Belgium?',
    answer: 'Yes, delivery to Belgium takes 2 to 3 working days.',
  },
  {
    hour: 23,
    time: '23:47',
    question: 'Can I still change my order?',
    answer: 'You can until it ships. I’ve opened your order for you.',
  },
  {
    hour: 3,
    time: '03:12',
    question: 'Where is my invoice?',
    answer: 'It’s in your account under Orders. I just emailed you a copy.',
  },
]
const assistantTimeline = [700, 2300, 700, 2300, 700, 2300, 900]

function Stream({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, index) => (
        <span
          key={index}
          className="stream-word"
          style={{ '--word': index } as CSSProperties}
        >
          {word}{' '}
        </span>
      ))}
    </>
  )
}

export function AssistantScene(props: SceneProps) {
  const { ref, step } = useTimeline(assistantTimeline, props)
  const turn = Math.min(Math.floor(step / 2), assistantTurns.length - 1)
  const { hour, time, question, answer } = assistantTurns[turn]
  const answered = step % 2 === 1 || step === assistantTimeline.length - 1
  const night = hour < 7 || hour > 20
  return (
    <div
      ref={ref}
      className={`scene scene-assistant${night ? ' is-night' : ''}`}
    >
      <div className="assistant-clock">
        <span className="assistant-hours">
          {Array.from({ length: 24 }, (_, index) => (
            <i key={index} className={index === hour ? 'is-on' : ''} />
          ))}
        </span>
        <b>{time}</b>
      </div>
      <div className="assistant-browser">
        <div className="assistant-chrome">
          <i />
          <i />
          <i />
          <span>yourcompany.example</span>
        </div>
        <div className="assistant-site">
          <div className="assistant-page">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="assistant-widget">
            <div className="scene-bar">
              <MessageCircle size={13} /> Ask us anything
            </div>
            <div key={turn} className="assistant-thread">
              <div className="bubble bubble-them is-on">
                <span className="bubble-text">{question}</span>
              </div>
              {answered && (
                <div className="bubble bubble-bot is-on">
                  <span className="bubble-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="bubble-text bubble-stream">
                    <Stream text={answer} />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* 5. Recruitment: a board that keeps itself moving, with the follow-ups as receipts. */
const boardColumns = ['Contacted', 'Interview', 'Offer', 'Placed']
const candidates = ['Léa', 'Tom', 'Inès']
const boardMoves = [
  [0, 0, 1],
  [1, 0, 1],
  [1, 0, 2],
  [1, 1, 2],
  [2, 1, 2],
  [2, 1, 3],
  [2, 1, 3],
]
const boardToasts = [
  { at: 1, text: 'Follow-up sent to Léa', day: 'Day 2' },
  { at: 2, text: 'Offer details sent to Inès', day: 'Day 5' },
  { at: 3, text: 'Interview reminder sent to Tom', day: 'Day 6' },
  { at: 4, text: 'Léa moved to Offer', day: 'Day 9' },
  { at: 5, text: 'Inès placed', day: 'Day 12' },
  { at: 6, text: 'Check-in sent to Inès', day: 'Day 42' },
]
const boardTimeline = [800, 1100, 1100, 1100, 1100, 1200, 2600]

export function BoardScene(props: SceneProps) {
  const { ref, step } = useTimeline(boardTimeline, props)
  const columns = boardMoves[step]
  const visibleToasts = boardToasts.filter((toast) => step >= toast.at)
  return (
    <div ref={ref} className="scene scene-board">
      <div className="board">
        {boardColumns.map((column) => (
          <div key={column} className="board-column">
            {column}
          </div>
        ))}
        <div className="board-cards">
          {candidates.map((candidate, index) => {
            const column = columns[index]
            const row = columns
              .slice(0, index)
              .filter((c) => c === column).length
            return (
              <div
                key={candidate}
                className={`board-card${column === 3 ? ' is-placed' : ''}`}
                style={{ '--col': column, '--row': row } as CSSProperties}
              >
                <b>{candidate[0]}</b>
                <span>{candidate}</span>
                {column === 3 && step >= 6 && (
                  <Check className="board-check" size={12} />
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="board-toasts">
        {boardToasts.map((toast) => {
          const position = visibleToasts.indexOf(toast)
          const depth = visibleToasts.length - 1 - position
          return (
            <div
              key={toast.at}
              className={`board-toast${on(position >= 0 && depth < 3)}`}
              style={{ '--depth': Math.max(depth, 0) } as CSSProperties}
            >
              <Check size={13} />
              <span>{toast.text}</span>
              <em>{toast.day}</em>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* 6. Content: one creative reflows into each format and fills the week. */
const formats = [
  { id: 'square', label: 'Feed · 1:1' },
  { id: 'story', label: 'Stories · 9:16' },
  { id: 'banner', label: 'Display · 16:9' },
]
const channels = ['Feed', 'Stories', 'Display']
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const slots = [
  { channel: 0, day: 1, at: 0 },
  { channel: 1, day: 3, at: 1 },
  { channel: 2, day: 0, at: 2 },
  { channel: 0, day: 4, at: 3 },
  { channel: 1, day: 5, at: 3 },
  { channel: 2, day: 2, at: 3 },
  { channel: 2, day: 6, at: 3 },
]
const contentTimeline = [1700, 1700, 1700, 2600]

export function ContentScene(props: SceneProps) {
  const { ref, step } = useTimeline(contentTimeline, props)
  const format = formats[step % formats.length]
  return (
    <div ref={ref} className="scene scene-content">
      <div className="content-stage">
        <div className={`content-frame content-frame-${format.id}`}>
          <div className="content-art" />
          <div className="content-copy">
            <strong>Spring launch</strong>
            <span>See what’s new</span>
          </div>
        </div>
        <span className="content-label">{format.label}</span>
      </div>
      <div className="content-week">
        <div className="scene-bar">
          This week <em>Published automatically</em>
        </div>
        <div className="content-grid">
          <span />
          {days.map((day, index) => (
            <span key={index} className="content-day">
              {day}
            </span>
          ))}
          {channels.map((channel, row) => (
            <div key={channel} className="content-row">
              <span className="content-channel">{channel}</span>
              {days.map((_, day) => {
                const slot = slots.find(
                  (entry) => entry.channel === row && entry.day === day,
                )
                return (
                  <span
                    key={day}
                    className={`content-slot${on(!!slot && step >= slot.at)}`}
                  >
                    {slot && step >= slot.at && <Check size={11} />}
                  </span>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
