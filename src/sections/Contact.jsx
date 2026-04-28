import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import './Contact.css'

const SOCIALS = [
  {
    name: 'GitHub',
    handle: '@Deekshareddy10',
    url: 'https://github.com/Deekshareddy10',
    color: '#c8904a',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    handle: 'Deeksha Reddy Patlolla',
    url: 'https://www.linkedin.com/in/deeksha-reddy-patlolla-2aa378245/',
    color: '#5a9478',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Email',
    handle: 'deekshareddyp.10@gmail.com',
    url: 'mailto:deekshareddyp.10@gmail.com',
    color: '#7ab0a0',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
]

const NOTE_COLORS = ['#fef08a', '#fda4af', '#93c5fd', '#86efac', '#d8b4fe']

function StickyNotes() {
  const [notes, setNotes] = useState([])
  const [text, setText] = useState('')
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0])
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  // Load notes on mount
  useEffect(() => {
    if (!supabase) {
      // Supabase not configured yet — use localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('portfolio-notes') || '[]')
        setNotes(saved)
      } catch { /* ignore */ }
      setLoading(false)
      return
    }
    supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setNotes(data)
        setLoading(false)
      })
  }, [])

  const addNote = async (e) => {
    e.preventDefault()
    if (!text.trim() || posting) return
    setPosting(true)
    const note = {
      text: text.trim(),
      author: authorName.trim() || 'Anonymous',
      color: selectedColor,
      rotation: parseFloat(((Math.random() - 0.5) * 7).toFixed(2)),
    }
    if (!supabase) {
      const localNote = { ...note, id: Date.now(), created_at: new Date().toISOString() }
      const updated = [localNote, ...notes]
      setNotes(updated)
      localStorage.setItem('portfolio-notes', JSON.stringify(updated))
    } else {
      const { data, error } = await supabase.from('notes').insert([note]).select().single()
      if (!error && data) setNotes((prev) => [data, ...prev])
    }
    setText('')
    setAuthorName('')
    setPosting(false)
  }

  const deleteNote = async (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (!supabase) {
      const updated = notes.filter((n) => n.id !== id)
      localStorage.setItem('portfolio-notes', JSON.stringify(updated))
    } else {
      await supabase.from('notes').delete().eq('id', id)
    }
  }

  return (
    <div className="notes-section">
      <div className="notes-header">
        <h3 className="notes-title">Leave a Note</h3>
        <p className="notes-sub">
          Drop a message — a kind word, a thought, feedback about the site. I read every one.
        </p>
      </div>

      {/* Form */}
      <form className="note-form" onSubmit={addNote}>
        <div className="note-form-row">
          <input
            type="text"
            className="note-input"
            placeholder="Your name (optional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={30}
          />
          <div className="note-colors">
            {NOTE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-dot ${selectedColor === c ? 'selected' : ''}`}
                style={{ background: c }}
                onClick={() => setSelectedColor(c)}
                aria-label={`Pick ${c}`}
              />
            ))}
          </div>
        </div>

        <textarea
          className="note-textarea"
          placeholder="What's on your mind? ✍️"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          rows={3}
        />

        <div className="note-form-actions">
          <span className="note-char-count">{text.length} / 200</span>
          <button type="submit" className="btn btn-primary" disabled={!text.trim() || posting}>
            {posting ? 'Pinning...' : 'Pin Note'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="2" x2="12" y2="22"/>
              <path d="M17 7l-5-5-5 5"/>
            </svg>
          </button>
        </div>
      </form>

      {/* Board */}
      {loading && (
        <div className="notes-empty">
          <span>Loading notes...</span>
        </div>
      )}

      {!loading && notes.length > 0 && (
        <div className="notes-board">
          {notes.map((note) => (
            <div
              key={note.id}
              className="sticky-note"
              style={{
                background: note.color,
                transform: `rotate(${note.rotation}deg)`,
              }}
            >
              <button
                className="note-delete"
                onClick={() => deleteNote(note.id)}
                aria-label="Delete note"
              >
                ×
              </button>
              <p className="note-text">{note.text}</p>
              <div className="note-meta">
                <span className="note-author">— {note.author}</span>
                <span className="note-date">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && notes.length === 0 && (
        <div className="notes-empty">
          <span>No notes yet. Be the first! 📌</span>
        </div>
      )}
    </div>
  )
}

export default function Contact() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal')
    if (!els) return
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
    els.forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" className="section contact-section" ref={sectionRef}>
      <div className="section-label">let's connect</div>
      <h2 className="section-title">Contact Me</h2>
      <p className="section-subtitle">
        Whether it's an opportunity, a collaboration, or just saying hi — my inbox is open.
      </p>

      {/* Socials grid */}
      <div className="socials-grid">
        {SOCIALS.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target={social.name !== 'Email' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="social-card reveal"
            style={{ '--social-color': social.color }}
          >
            <div className="social-icon">{social.icon}</div>
            <div className="social-info">
              <span className="social-name">{social.name}</span>
              <span className="social-handle">{social.handle}</span>
            </div>
            <div className="social-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* Resume download */}
      <div className="resume-band reveal">
        <div className="resume-band-content">
          <div className="resume-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <p className="resume-band-title">Deeksha's Resume</p>
            <p className="resume-band-sub">Updated · PDF · Always current</p>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            const link = document.createElement('a')
            link.href = '/resume.pdf'
            link.download = 'Deeksha_Resume.pdf'
            link.click()
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download
        </button>
      </div>

      {/* Sticky notes board */}
      <div className="reveal">
        <StickyNotes />
      </div>

      {/* Footer */}
      <footer className="site-footer reveal">
        <p>Built with React + Vite · Designed & coded by Deeksha</p>
        <p className="footer-sub">© {new Date().getFullYear()} · All rights reserved</p>
      </footer>
    </section>
  )
}
