import { useEffect, useRef, useState, useCallback } from 'react'
import './TechArsenal.css'

const CATEGORIES = {
  ml: {
    label: 'ML / AI',
    cmd: 'cat skills/ml-ai.txt',
    color: '#c8904a',
    skills: [
      { name: 'PyTorch',            pct: 88 },
      { name: 'TensorFlow',         pct: 80 },
      { name: 'Scikit-learn',       pct: 91 },
      { name: 'LangChain',          pct: 82 },
      { name: 'HuggingFace',        pct: 85 },
      { name: 'OpenCV',             pct: 87 },
      { name: 'Pandas / NumPy',     pct: 93 },
      { name: 'CNNs / RNNs',        pct: 84 },
      { name: 'Transformers',       pct: 80 },
      { name: 'Autoencoders',       pct: 76 },
      { name: 'Attention Mechs.',   pct: 78 },
      { name: 'Gate Fusion Nets',   pct: 74 },
      { name: 'Vector Databases',   pct: 77 },
      { name: 'Agentic AI',         pct: 81 },
      { name: 'Gen AI / LLMs',      pct: 83 },
    ],
  },
  lang: {
    label: 'Languages',
    cmd: 'cat skills/languages.txt',
    color: '#5a9478',
    skills: [
      { name: 'Python',     pct: 93 },
      { name: 'JavaScript', pct: 76 },
      { name: 'Java',       pct: 68 },
      { name: 'SQL',        pct: 72 },
      { name: 'Dart',       pct: 62 },
      { name: 'C / C++',    pct: 55 },
    ],
  },
  frameworks: {
    label: 'Frameworks',
    cmd: 'cat skills/frameworks.txt',
    color: '#c47a5a',
    skills: [
      { name: 'React',    pct: 79 },
      { name: 'FastAPI',  pct: 78 },
      { name: 'Flask',    pct: 74 },
      { name: 'Flutter',  pct: 70 },
      { name: 'Node.js',  pct: 66 },
      { name: 'Spring',   pct: 55 },
    ],
  },
  tools: {
    label: 'Tools & Cloud',
    cmd: 'cat skills/tools.txt',
    color: '#7ab0a0',
    skills: [
      { name: 'Git / GitHub',  pct: 90 },
      { name: 'Docker',        pct: 63 },
      { name: 'AWS',           pct: 60 },
      { name: 'Supabase',      pct: 68 },
      { name: 'Firebase',      pct: 68 },
      { name: 'Databricks',    pct: 65 },
      { name: 'Jupyter',       pct: 95 },
    ],
  },
}

const LEVEL = (p) =>
  p >= 90 ? 'expert' : p >= 75 ? 'proficient' : p >= 60 ? 'competent' : 'familiar'

const BAR_CHARS = (pct, width = 20) => {
  const filled = Math.round((pct / 100) * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

function useTypeOut(text, speed = 28) {
  const [out, setOut] = useState('')
  useEffect(() => {
    setOut('')
    let i = 0
    const id = setInterval(() => {
      setOut(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return out
}

export default function TechArsenal() {
  const sectionRef = useRef(null)
  const [activeCat, setActiveCat] = useState('ml')
  const [lines, setLines] = useState([])
  const [typing, setTyping] = useState(true)
  const [visible, setVisible] = useState(false)
  const termRef = useRef(null)
  const timeoutsRef = useRef([])

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  const t = (fn, ms) => {
    const id = setTimeout(fn, ms)
    timeoutsRef.current.push(id)
    return id
  }

  const runSequence = useCallback((catKey) => {
    clearTimeouts()
    const cat = CATEGORIES[catKey]
    setTyping(true)
    setLines([])

    t(() => {
      setLines([
        { type: 'blank' },
        { type: 'header', text: `  ${cat.label.toUpperCase()} STACK`, color: cat.color },
        { type: 'blank' },
      ])

      cat.skills.forEach((skill, i) => {
        t(() => {
          setLines((prev) => [
            ...prev,
            {
              type: 'skill',
              name: skill.name,
              pct: skill.pct,
              bar: BAR_CHARS(skill.pct),
              level: LEVEL(skill.pct),
              color: cat.color,
            },
          ])
          if (i === cat.skills.length - 1) {
            t(() => {
              setLines((prev) => [...prev, { type: 'blank' }, { type: 'ready' }])
              setTyping(false)
            }, 200)
          }
        }, 80 + i * 90)
      })
    }, 520)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true)
          runSequence(activeCat)
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [visible, activeCat, runSequence])

  const handleCat = (key) => {
    if (key === activeCat) return
    setActiveCat(key)
    runSequence(key)
  }

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight
    }
  }, [lines])

  const cmdText = CATEGORIES[activeCat].cmd
  const typedCmd = useTypeOut(typing ? cmdText : cmdText, typing ? 28 : 0)

  return (
    <section id="tech-arsenal" className="section tech-section" ref={sectionRef} aria-label="Tech stack">
      <div className="section-label">what i work with</div>
      <h2 className="section-title">Tech Arsenal</h2>
      <p className="section-subtitle">
        A terminal that loads itself. Pick a category.
      </p>

      <div className="terminal-wrap">
        {/* Title bar */}
        <div className="term-titlebar" aria-hidden="true">
          <div className="term-dots">
            <span style={{ background: '#ff5f57' }} />
            <span style={{ background: '#febc2e' }} />
            <span style={{ background: '#28c840' }} />
          </div>
          <span className="term-title">deeksha@portfolio ~ zsh</span>
          <div className="term-tabs" role="tablist" aria-label="Skill categories">
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeCat === key}
                className={`term-tab ${activeCat === key ? 'active' : ''}`}
                style={{ '--tab-color': cat.color }}
                onClick={() => handleCat(key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal body */}
        <div className="term-body" ref={termRef} role="log" aria-label="Terminal output" aria-live="polite">
          {/* Prompt line */}
          <div className="term-line">
            <span className="term-prompt" aria-hidden="true">
              <span className="prompt-user">deeksha</span>
              <span className="prompt-at">@</span>
              <span className="prompt-host">portfolio</span>
              <span className="prompt-sep"> % </span>
            </span>
            <span className="term-cmd">{typing ? typedCmd : cmdText}</span>
            {typing && typedCmd.length < cmdText.length && (
              <span className="term-blink-cursor" aria-hidden="true" />
            )}
          </div>

          {/* Output lines */}
          {lines.map((line, i) => {
            if (line.type === 'blank') return <div key={i} className="term-blank" />
            if (line.type === 'header') return (
              <div key={i} className="term-header" style={{ color: line.color }}>
                {line.text}
              </div>
            )
            if (line.type === 'ready') return (
              <div key={i} className="term-line term-ready">
                <span className="term-prompt" aria-hidden="true">
                  <span className="prompt-user">deeksha</span>
                  <span className="prompt-at">@</span>
                  <span className="prompt-host">portfolio</span>
                  <span className="prompt-sep"> % </span>
                </span>
                <span className="term-blink-cursor" aria-hidden="true" />
              </div>
            )
            if (line.type === 'skill') return (
              <div key={i} className="term-skill-line" style={{ '--skill-color': line.color }}>
                <span className="skill-name">{line.name.padEnd(18, ' ')}</span>
                <span className="skill-bar">[{line.bar}]</span>
                <span className="skill-pct"> {line.pct}%</span>
                <span className="skill-level"> {line.level}</span>
              </div>
            )
            return null
          })}
        </div>
      </div>
    </section>
  )
}
