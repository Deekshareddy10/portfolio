import { useEffect, useState, useRef } from 'react'
import TrainingViz from '../components/TrainingViz'
import './Hero.css'

const PHRASES = [
  'ML systems that scale',
  'computer vision pipelines',
  'LLM-powered applications',
  'multimodal AI research',
  'production AI backends',
]

const CHIPS = [
  'GPA 3.9 · Graduating May 2026',
  'Published researcher · IRJMETS 2024',
  'Open to SWE, ML & AI roles',
  'ML + CV + Backend all three',
  '15+ projects shipped',
]

function useTypewriter(phrases, speed = 72, pause = 2200) {
  const [display, setDisplay] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIdx]
    let timeout
    if (!deleting && display.length < current.length) {
      timeout = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), speed)
    } else if (!deleting && display.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && display.length > 0) {
      timeout = setTimeout(() => setDisplay(display.slice(0, -1)), speed / 2)
    } else {
      setDeleting(false)
      setPhraseIdx((i) => (i + 1) % phrases.length)
    }
    return () => clearTimeout(timeout)
  }, [display, deleting, phraseIdx, phrases, speed, pause])

  return display
}

export default function Hero() {
  const typed = useTypewriter(PHRASES)
  const [activeChip, setActiveChip] = useState(null)
  const chipIdx = useRef(0)
  const chipTimer = useRef(null)

  useEffect(() => {
    const show = () => {
      setActiveChip(CHIPS[chipIdx.current % CHIPS.length])
      chipIdx.current++
      chipTimer.current = setTimeout(() => {
        setActiveChip(null)
        chipTimer.current = setTimeout(show, 900)
      }, 2800)
    }
    chipTimer.current = setTimeout(show, 1000)
    return () => clearTimeout(chipTimer.current)
  }, [])

  return (
    <section id="home" className="hero" aria-label="Introduction">
      <div className="hero-inner">
        {/* Left */}
        <div className="hero-text">
          <div className="hero-badge" role="status">
            <span className="hero-badge-dot" aria-hidden="true" />
            Open to Work · May 2026
          </div>

          <h1 className="hero-name">
            <span className="hero-name-shine">Deeksha Reddy Patlolla</span>
          </h1>

          <p className="hero-institution">
            MS Computer Science &nbsp;·&nbsp; University of Colorado Denver
          </p>

          <p className="hero-tagline" aria-live="polite">
            Building{' '}
            <span className="hero-typed" aria-label={`Building ${typed}`}>
              {typed}
              <span className="hero-cursor" aria-hidden="true" />
            </span>
          </p>

          <p className="hero-bio">
            I design and implement end-to-end AI-powered systems — spanning computer vision pipelines,
            multimodal learning, LLM applications, and scalable backend infrastructure.
            My focus is on systems that are modular, reproducible, and built for production.
          </p>

          <div className="hero-chip-area" aria-live="polite" aria-atomic="true">
            {activeChip && (
              <div className="hero-chip" key={activeChip} role="note">
                <span className="chip-dot" aria-hidden="true" />
                {activeChip}
              </div>
            )}
          </div>

          <div className="hero-cta">
            <a
              href="#projects"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              View Projects
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
            <a
              href="#contact"
              className="btn btn-outline"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Right: Confusion Matrix */}
        <div className="hero-right" aria-label="Interactive confusion matrix demo">
          <div className="cm-card">
            <div className="cm-card-header" aria-hidden="true">
              <div className="cm-card-dots">
                <span style={{background:'#ff5f57'}} />
                <span style={{background:'#febc2e'}} />
                <span style={{background:'#28c840'}} />
              </div>
              <span className="cm-card-title">training_run.py — live</span>
            </div>
            <div className="cm-card-body">
              <TrainingViz />
            </div>
          </div>
          <p className="cm-caption">
            Watch the model train in real time. Hit "Train Again" to see a new run.
          </p>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span className="scroll-text">scroll</span>
        <div className="scroll-line"><div className="scroll-dot" /></div>
      </div>
    </section>
  )
}
