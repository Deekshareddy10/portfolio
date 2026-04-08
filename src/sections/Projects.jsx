import { useEffect, useRef, useState } from 'react'
import './Projects.css'

const PROJECTS = [
  // ── FEATURED ──────────────────────────────────────────────
  {
    id: 11,
    title: 'CivicLens — LynxHack 2026 · 4th Place',
    desc: 'Hackathon winner at LynxHack 2026 (UCD, Denver). Policymakers upload any policy document; CivicLens pulls live economic and demographic data, runs three specialised AI agents (Economist, Urban Planner, Equity Analyst), and renders projected impact on an interactive 3D Mapbox map.',
    tags: ['Multi-Agent AI', 'Mapbox GL', 'RAG', 'Python', 'React'],
    image: '/projects/civiclens.png',
    github: 'https://github.com/Deekshareddy10/lynxhack_dtl',
    demo: 'https://youtu.be/z7sHBukYB08?si=ZPFJbarp4ORTLX6n',
    accent: '#7ab0a0',
    featured: true,
  },
  {
    id: 1,
    title: 'Heterogeneity-Aware Multimodal Learning',
    desc: 'Early disease detection via multimodal fusion that accounts for heterogeneous patient data across imaging and clinical modalities. Research-grade system with novel gated fusion architecture.',
    tags: ['PyTorch', 'Multimodal ML', 'Healthcare AI', 'Gated Fusion'],
    image: '/projects/multimodal.png',
    github: 'https://github.com/Deekshareddy10/Heterogeneity-Aware-Multimodal-Learning-for-Early-Disease-Detection---DataXpeditioners/tree/main',
    demo: null,
    accent: '#c8904a',
    featured: true,
  },
  {
    id: 5,
    title: 'Smart Parking Detection',
    desc: 'Real-time parking spot occupancy detection using YOLOv8 on the PKLot dataset. Processes CCTV feeds to classify occupied vs. empty spots — 94% accuracy, deployed on Hugging Face Spaces.',
    tags: ['YOLOv8', 'OpenCV', 'Python', 'Computer Vision'],
    image: '/projects/parking.png',
    github: 'https://github.com/Deekshareddy10/Smart_Parking_Detection_using_Computer_Vision',
    demo: 'https://huggingface.co/spaces/Deekshareddy10/smart-parking-detection',
    accent: '#d4a853',
    featured: true,
  },
  {
    id: 3,
    title: 'Resume AI Intelligence Platform',
    desc: 'RAG + Multi-Agent LLM system that parses, scores, and provides deep feedback on resumes against job descriptions. Combines retrieval-augmented generation with orchestrated agent pipelines.',
    tags: ['RAG', 'LangChain', 'FastAPI', 'React', 'Python'],
    image: '/projects/resume-ai.png',
    github: 'https://github.com/Deekshareddy10/Resume-AI-Assistant',
    demo: 'https://huggingface.co/spaces/Deekshareddy10/resume-ai-rag-agent',
    accent: '#c47a5a',
    featured: true,
  },
  {
    id: 4,
    title: 'Multimodal Fusion for Radiology Retrieval',
    desc: 'Aligns radiology images with medical captions using cross-modal contrastive learning. Enables semantic image-to-text and text-to-image retrieval over clinical datasets.',
    tags: ['PyTorch', 'CLIP', 'Computer Vision', 'NLP'],
    image: '/projects/radiology.png',
    github: 'https://github.com/Deekshareddy10/Multimodal_fusion_for_radiology_image_caption_retrieval/tree/main',
    demo: null,
    accent: '#7ab0a0',
    featured: true,
  },

  // ── MORE PROJECTS ─────────────────────────────────────────
  {
    id: 2,
    title: 'Autonomous Cybersecurity Defender',
    desc: 'An autonomous agent that monitors network activity and responds to threats in real time. Combines rule-based detection with ML-driven anomaly scoring for adaptive defense.',
    tags: ['Python', 'ML', 'Cybersecurity', 'Anomaly Detection'],
    image: null,
    github: 'https://github.com/Deekshareddy10/Autonomous_Cybersecurity_Defender',
    demo: null,
    accent: '#5a9478',
    featured: false,
  },
  {
    id: 6,
    title: 'AI Agent for GAIA Benchmark',
    desc: 'Autonomous AI agent designed to tackle the GAIA benchmark — a challenging real-world general assistant evaluation. Includes tool use, reasoning chains, and multi-step planning.',
    tags: ['LangChain', 'LLM Agents', 'Python', 'GAIA'],
    image: null,
    github: 'https://github.com/Deekshareddy10/AI_Agent_Course_final_project',
    demo: null,
    accent: '#c8904a',
    featured: false,
  },
  {
    id: 7,
    title: 'Social Media Sentiment & Engagement',
    desc: 'Examined emotional-based interactions on social media using sentiment analysis to develop AI models that predict post engagement and virality.',
    tags: ['NLP', 'Transformers', 'Scikit-learn', 'Python'],
    image: null,
    github: null,
    demo: null,
    accent: '#a78bfa',
    featured: false,
  },
  {
    id: 8,
    title: 'DeepFake Detection',
    desc: 'Deep learning system to detect AI-generated or manipulated videos and images. Trained on benchmark deepfake datasets with strong generalization across manipulation types.',
    tags: ['Deep Learning', 'PyTorch', 'Computer Vision', 'CNN'],
    image: null,
    github: null,
    demo: null,
    accent: '#5a9478',
    featured: false,
  },
  {
    id: 9,
    title: 'Face Recognition for Secure ATM',
    desc: 'Secure ATM authentication system using HAAR CASCADE face detection combined with recognition to replace or augment PIN-based auth.',
    tags: ['OpenCV', 'HAAR CASCADE', 'Python', 'Security'],
    image: null,
    github: null,
    demo: null,
    accent: '#c47a5a',
    featured: false,
  },
  {
    id: 10,
    title: 'College ERP Website',
    desc: 'Full-featured ERP web platform for college administration — student records, attendance, grades, fee management, and faculty portals.',
    tags: ['React', 'Node.js', 'MySQL', 'REST API'],
    image: null,
    github: 'https://github.com/Deekshareddy10/College-Erp-website-project',
    demo: null,
    accent: '#7ab0a0',
    featured: false,
  },
]

const FEATURED = PROJECTS.filter((p) => p.featured)
const MORE     = PROJECTS.filter((p) => !p.featured)

function ProjectCard({ project, index, size = 'normal' }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)
    setTilt({ x: dy * -5, y: dx * 5 })
  }
  const onLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <div
      ref={cardRef}
      className={`project-card reveal size-${size}`}
      style={{
        '--card-accent': project.accent,
        '--tilt-x': `${tilt.x}deg`,
        '--tilt-y': `${tilt.y}deg`,
        transitionDelay: `${index * 80}ms`,
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Image — only for featured cards */}
      {size !== 'compact' && (
        <div className="project-img">
          {project.image ? (
            <img src={project.image} alt={project.title} />
          ) : (
            <div className="project-img-placeholder">
              <span className="placeholder-code">
                <span style={{ color: project.accent }}>{'<'}</span>
                {project.title.split(' ')[0]}
                <span style={{ color: project.accent }}>{' />'}</span>
              </span>
            </div>
          )}
          <span className="featured-badge">Featured</span>
        </div>
      )}

      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.desc}</p>

        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>

        <div className="project-links">
          {project.github ? (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          ) : (
            <span className="project-link project-link-na">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Private
            </span>
          )}

          {project.demo ? (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link project-link-demo">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Live Demo
            </a>
          ) : null}
        </div>
      </div>

      <div className="project-border-glow" />
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.reveal')
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
      { threshold: 0.08 }
    )
    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [showMore])

  return (
    <section id="projects" className="section projects-section" ref={sectionRef}>
      <div className="section-label">what i've shipped</div>
      <h2 className="section-title">Projects</h2>
      <p className="section-subtitle">
        15+ projects across AI research, full-stack builds, and hackathon wins.
      </p>

      {/* Featured grid */}
      <div className="projects-label-row">
        <span className="projects-sub-label">Featured</span>
      </div>
      <div className="projects-grid">
        {FEATURED.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      {/* More projects */}
      <div className="projects-label-row" style={{ marginTop: 48 }}>
        <span className="projects-sub-label">More Projects</span>
        <button
          className="toggle-more-btn"
          onClick={() => setShowMore(!showMore)}
          aria-expanded={showMore}
        >
          {showMore ? 'Show less ↑' : `Show all ${MORE.length} ↓`}
        </button>
      </div>

      {showMore && (
        <div className="projects-grid projects-grid-more">
          {MORE.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} size="compact" />
          ))}
        </div>
      )}

      {!showMore && (
        <div className="more-teaser">
          {MORE.slice(0, 3).map((p) => (
            <div key={p.id} className="teaser-pill" style={{ '--pill-accent': p.accent }}>
              {p.title}
            </div>
          ))}
          <span className="teaser-more">+ {MORE.length - 3} more</span>
        </div>
      )}
    </section>
  )
}
