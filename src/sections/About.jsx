import { useEffect, useRef } from 'react'
import './About.css'

const STATS = [
  { value: '3.8',  label: 'GPA' },
  { value: '15+', label: 'projects built' },
  { value: '6+',  label: 'years coding' },
  { value: '1',   label: 'publication' },
]

const EXPERIENCE = [
  {
    year: 'Mar 2025 – Present',
    title: 'Data Engineer',
    org: 'University of Colorado Denver',
    desc: 'Designed and implemented end-to-end ETL pipelines using Python, SQL, and Apache Spark to ingest and transform institutional data at scale. Developed and scheduled automated data ingestion workflows using Apache Airflow, reducing manual processing time by 50%. Integrated Scikit-learn classification models for student performance prediction and contributed to data warehouse schema design following star-schema principles.',
    type: 'work',
  },
  {
    year: 'Mar 2025 – Jun 2025',
    title: 'Student Web Accessibility Representative',
    org: 'University of Colorado Denver',
    desc: 'Resolved 10+ accessibility issues including semantic HTML, ARIA labels, and form validation to meet WCAG 2.1 AA & AAA standards using Siteimprove. Improved keyboard navigation and screen-reader support for university web pages.',
    type: 'work',
  },
  {
    year: 'Dec 2022 – May 2024',
    title: 'Software Engineer',
    org: 'Infor Pvt Ltd · Hyderabad, India',
    desc: 'Developed and maintained scalable backend microservices for enterprise ERP applications using Python and Django, improving system reliability for 1,000+ business users. Designed versioned RESTful APIs, wrote complex SQL queries and stored procedures in PostgreSQL, and built CI/CD pipelines using Git and Jenkins. Wrote comprehensive unit and integration tests using pytest across critical service modules.',
    type: 'work',
  },
  {
    year: 'May 2025 – Present',
    title: 'President, Indian Students Association',
    org: 'University of Colorado Denver',
    desc: 'Leading a campus-wide student organization, organizing events, advocating for student needs, and building community across 30+ nationalities.',
    type: 'work',
  },
]

const EDUCATION = [
  {
    year: 'Aug 2024 – May 2026',
    title: 'MS in Computer Science',
    org: 'University of Colorado Denver',
    desc: 'Specialization in Machine Learning, AI, and Software Engineering. GPA 3.8. Conducting research in multimodal learning, LLMs, and computer vision.',
    type: 'edu',
  },
  {
    year: 'Aug 2020 – May 2024',
    title: 'BTech in Computer Science & Engineering',
    org: 'Malla Reddy College of Engineering and Technology · Hyderabad, India',
    desc: 'GPA 3.6. Foundation in algorithms, data structures, databases, and software development. Published research on deepfake detection (IRJMETS 2024).',
    type: 'edu',
  },
]

const PUBLICATION = {
  title: 'Unmasking Digital Deception: Detecting Deepfakes through Deep Learning',
  detail: 'IRJMETS 2024 · International Research Journal of Modernization in Engineering, Technology and Science',
  url: 'https://www.irjmets.com/paperdetail.php?paperId=66acaa459c8859d1cba383e358fe4bd4&title=Unmasking+Digital+Deception%3A+Detecting+Deepfakes+through+Deep+Learning&authpr=PATLOLLA+DEEKSHA+REDDY',
}

const CERTS = [
  {
    name: 'HuggingFace Agents Course',
    issuer: 'Hugging Face',
    url: 'https://huggingface.co/datasets/agents-course/final-certificates/resolve/main/certificates/Deekshareddy10/2025-11-13.png',
    color: '#d4a853',
  },
  {
    name: 'Generative AI Fundamentals',
    issuer: 'Databricks',
    url: 'https://credentials.databricks.com/368e6ea8-d83e-42b3-8f9a-c930c2afe546#acc.pNKxV0SY',
    color: '#c47a5a',
  },
  {
    name: 'Rapid App Dev with LLMs',
    issuer: 'NVIDIA',
    url: 'https://learn.nvidia.com/certificates?id=fPx40KkRT9yYzgc6G5gaew#',
    color: '#5a9478',
  },
  {
    name: 'AI for Anomaly Detection',
    issuer: 'NVIDIA',
    url: 'https://learn.nvidia.com/certificates?id=8qjdEAyFSHiXet2SURJLnQ',
    color: '#7ab0a0',
  },
  {
    name: 'Machine Learning Crash Course',
    issuer: 'Google',
    url: 'https://developers.google.com/profile/badges/playlists/machine-learning-crash-course/llms',
    color: '#c8904a',
  },
  {
    name: 'Oracle DB for Developers',
    issuer: 'Oracle',
    url: '/certs/oracle.jpg',
    color: '#c47a5a',
  },
]

export default function About() {
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
      el.style.transitionDelay = `${i * 70}ms`
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="section about-section" ref={sectionRef} aria-label="About Deeksha">
      <div className="about-grid">
        {/* Left */}
        <div className="about-left">
          <div className="section-label reveal">the human behind the code</div>
          <h2 className="section-title reveal">About Me</h2>

          <p className="about-para reveal">
            Software and AI/ML Engineer experienced in building and deploying production-ready intelligent
            systems: RAG pipelines, multi-agent architectures, and multimodal models.
            Before my MS, I spent 1.5 years as a Software Engineer at Infor Pvt Ltd building enterprise ERP
            backend systems. Now I combine that engineering foundation with deep ML research at UCD.
          </p>

          <p className="about-para reveal">
            I've been coding for 6+ years and have shipped 15+ projects across the full stack — from
            research-grade ML models to deployed web apps. I go deep when something interests me:
            once I'm in a problem space, I read the papers, build the thing, and understand it end to end.
            Seeking SWE, AI/ML, or Data Engineering roles.
          </p>

          <p className="about-para reveal">
            Currently: Data Engineer at UCD by day, ISA President on campus, and perpetually
            down a rabbit hole at 2am.
          </p>

          {/* Publication */}
          <a
            href={PUBLICATION.url}
            target="_blank"
            rel="noopener noreferrer"
            className="publication-block reveal"
            aria-label="View publication"
          >
            <div className="pub-icon" aria-hidden="true">↗</div>
            <div className="pub-content">
              <div className="pub-label">Publication · IRJMETS 2024</div>
              <div className="pub-title">{PUBLICATION.title}</div>
              <div className="pub-detail">{PUBLICATION.detail} →</div>
            </div>
          </a>

          <div className="about-stats reveal" role="list" aria-label="Key stats">
            {STATS.map((s) => (
              <div key={s.label} className="stat-card" role="listitem">
                <div className="stat-value" aria-label={`${s.value} ${s.label}`}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="certs-block reveal">
            <h3 className="certs-title">Certifications</h3>
            <div className="certs-grid">
              {CERTS.map((c) => (
                <div key={c.name} className="cert-card" style={{ '--cert-color': c.color }}>
                  <div className="cert-issuer">{c.issuer}</div>
                  <div className="cert-name">{c.name}</div>
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cert-link"
                      aria-label={`View ${c.name} certificate`}
                    >
                      View →
                    </a>
                  ) : (
                    <span className="cert-link cert-link-na">On file</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="about-right">
          {/* Experience */}
          <div className="timeline-label reveal">experience & leadership</div>
          <div className="timeline" role="list">
            {EXPERIENCE.map((item, i) => (
              <div key={i} className="timeline-item reveal" role="listitem">
                <div className={`timeline-dot ${item.type}`} aria-hidden="true" />
                <div className="timeline-content">
                  <span className="timeline-year">{item.year}</span>
                  <h3 className="timeline-title">{item.title}</h3>
                  <span className="timeline-org">{item.org}</span>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="timeline-label timeline-label-edu reveal">education</div>
          <div className="timeline" role="list">
            {EDUCATION.map((item, i) => (
              <div key={i} className="timeline-item reveal" role="listitem">
                <div className={`timeline-dot ${item.type}`} aria-hidden="true" />
                <div className="timeline-content">
                  <span className="timeline-year">{item.year}</span>
                  <h3 className="timeline-title">{item.title}</h3>
                  <span className="timeline-org">{item.org}</span>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
