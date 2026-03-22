import { useEffect, useRef } from 'react'
import './WhatIBring.css'

const EVIDENCE = [
  {
    claim: 'Production AI Builder',
    icon: '🚀',
    accent: '#c8904a',
    bullets: [
      'Smart Parking: 94% accuracy, deployed on HuggingFace Spaces',
      'Resume AI RAG agent — live demo, public GitHub',
      'End-to-end pipelines: data → model → API → UI',
    ],
    tag: '2 live demos',
  },
  {
    claim: 'Research-Grade ML',
    icon: '🔬',
    accent: '#5a9478',
    bullets: [
      'Published: IRJMETS 2024 peer-reviewed paper',
      'Gated fusion architecture for multimodal disease detection',
      'Cross-modal contrastive learning for radiology retrieval',
    ],
    tag: '1 publication · 4 AI projects',
  },
  {
    claim: 'Full-Stack Depth',
    icon: '⚡',
    accent: '#c47a5a',
    bullets: [
      'Python · React · FastAPI · Flutter · Node.js',
      'ML + CV + LLMs + backend — not just one layer',
      '15+ projects shipped across the full stack',
    ],
    tag: '15+ projects',
  },
  {
    claim: 'LLM & Agentic AI',
    icon: '🧠',
    accent: '#7ab0a0',
    bullets: [
      '28% token reduction via RAG optimization on Resume AI',
      'Multi-agent orchestration with LangChain',
      'GAIA benchmark agent — tool use + reasoning chains',
    ],
    tag: 'HuggingFace · LangChain',
  },
  {
    claim: 'High Academic Standard',
    icon: '🎓',
    accent: '#d4a853',
    bullets: [
      'GPA 3.9 — MS Computer Science, UCD',
      '5 certifications: NVIDIA, Databricks, HuggingFace',
      'Graduate Assistant SWE + ISA President simultaneously',
    ],
    tag: 'GPA 3.9 · May 2026',
  },
  {
    claim: 'Reliability You Can Count On',
    icon: '🤝',
    accent: '#a78bfa',
    bullets: [
      'Web Accessibility Rep — WCAG audits across university platforms',
      'ISA President: leading community of 30+ nationalities',
      'Documents work, communicates early, ships on time',
    ],
    tag: 'Leader · Rep · GA',
  },
]

export default function WhatIBring() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.evidence-card')
    if (!cards) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 75}ms`
      observer.observe(card)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="what-i-bring" className="section bring-section" ref={sectionRef} aria-label="What I bring">
      <div className="section-label">why hire me</div>
      <h2 className="section-title">My Edge</h2>
      <p className="section-subtitle">
        Claims backed by evidence — not buzzwords.
      </p>

      <div className="evidence-grid" role="list">
        {EVIDENCE.map((item) => (
          <div
            key={item.claim}
            className="evidence-card"
            style={{ '--card-accent': item.accent }}
            role="listitem"
          >
            <div className="evidence-card-bg" aria-hidden="true" />

            <div className="evidence-header">
              <span className="evidence-icon" aria-hidden="true">{item.icon}</span>
              <h3 className="evidence-claim">{item.claim}</h3>
            </div>

            <ul className="evidence-bullets" aria-label={`Evidence for ${item.claim}`}>
              {item.bullets.map((b, i) => (
                <li key={i} className="evidence-bullet">
                  <span className="bullet-check" aria-hidden="true">✓</span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="evidence-tag" aria-label="Summary">{item.tag}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bring-cta">
        <div className="bring-cta-inner">
          <div>
            <h3 className="bring-cta-title">Convinced? Let's talk.</h3>
            <p className="bring-cta-sub">Open to SWE, ML and AI roles. Graduating May 2026.</p>
          </div>
          <div className="bring-cta-actions">
            <a href="#contact" className="btn btn-primary" onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Get in Touch
            </a>
            <button className="btn btn-outline" onClick={() => {
              const a = document.createElement('a')
              a.href = '/resume.pdf'
              a.download = 'Deeksha_Patlolla_Resume.pdf'
              a.click()
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Resume
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
