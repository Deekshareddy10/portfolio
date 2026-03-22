import { useRef, useEffect, useState, useCallback } from 'react'
import './BouncingDisc.css'

const GREETINGS = [
  { text: 'Hi! 👋', color: '#a78bfa' },
  { text: 'Hey! 😊', color: '#60a5fa' },
  { text: 'Hello! ✨', color: '#34d399' },
  { text: 'Psst! 👀', color: '#fb923c' },
  { text: 'Boo! 👻', color: '#f472b6' },
  { text: 'Yay! 🎉', color: '#fbbf24' },
  { text: "What's up! 🤙", color: '#a78bfa' },
]

export default function BouncingDisc() {
  const discRef = useRef(null)
  const containerRef = useRef(null)
  const animRef = useRef(null)
  const tRef = useRef(0)
  const greetingIdx = useRef(0)
  const [greeting, setGreeting] = useState(GREETINGS[0])
  const [reacting, setReacting] = useState(false)
  const [ripples, setRipples] = useState([])
  const rippleId = useRef(0)

  const animate = useCallback(() => {
    tRef.current += 0.007
    const t = tRef.current
    const container = containerRef.current
    const disc = discRef.current
    if (!container || !disc) {
      animRef.current = requestAnimationFrame(animate)
      return
    }

    const w = container.offsetWidth
    const h = container.offsetHeight
    const discSize = 130

    // Lissajous-like path — smooth, organic, never hits edges
    const rangeX = (w - discSize) * 0.42
    const rangeY = (h - discSize) * 0.38
    const cx = w / 2 - discSize / 2
    const cy = h / 2 - discSize / 2

    const x = cx + rangeX * Math.sin(t * 1.3)
    const y = cy + rangeY * Math.sin(t * 0.9 + 1.2)

    disc.style.transform = `translate(${x}px, ${y}px)`
    animRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [animate])

  const handleClick = useCallback((e) => {
    if (reacting) return

    // Cycle greeting
    greetingIdx.current = (greetingIdx.current + 1) % GREETINGS.length
    const next = GREETINGS[greetingIdx.current]
    setGreeting(next)
    setReacting(true)

    // Ripple
    const id = ++rippleId.current
    setRipples((prev) => [...prev, { id, color: next.color }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 800)

    setTimeout(() => {
      setReacting(false)
      setGreeting(GREETINGS[0])
    }, 1800)
  }, [reacting])

  return (
    <div className="disc-container" ref={containerRef}>
      <div
        className={`disc ${reacting ? 'reacting' : ''}`}
        ref={discRef}
        onClick={handleClick}
        style={{ '--disc-color': greeting.color }}
      >
        {/* Ripples */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="disc-ripple"
            style={{ '--ripple-color': r.color }}
          />
        ))}

        {/* Orbiting dot */}
        <span className="disc-orbit" />

        {/* Text */}
        <span className="disc-text">{greeting.text}</span>

        {/* Hint */}
        <span className="disc-hint">click me!</span>
      </div>

      {/* Ambient glow blob behind */}
      <div className="disc-glow-bg" style={{ '--glow-color': greeting.color }} />
    </div>
  )
}
