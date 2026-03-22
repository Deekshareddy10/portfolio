import { useEffect, useRef, useState, useCallback } from 'react'
import './Interests.css'

const GRID_W = 22
const GRID_H = 14
const CELL = 22
const SPEED = 240

const INTERESTS = [
  { emoji: '📖', label: 'Philosophy', color: '#c8904a',
    desc: 'Nietzsche, Camus, Marcus Aurelius on permanent rotation. Nothing like an existential crisis before breakfast.' },
  { emoji: '🧠', label: 'Deep Conversations', color: '#5a9478',
    desc: 'The kind where you lose track of time and rethink everything. A good conversation > most TV shows.' },
  { emoji: '🎮', label: 'Coding Games', color: '#d4a853',
    desc: 'Building mini-games purely for the fun of it. If it has a scoreboard, even better.' },
  { emoji: '🏄', label: 'Surfing (someday)', color: '#c47a5a',
    desc: "It's on the list. Has been for a while. Manifesting." },
  { emoji: '🎵', label: 'Mixing Music', color: '#7ab0a0',
    desc: 'Curating the perfect coding playlist is a skill. Currently perfecting it.' },
  { emoji: '🐇', label: 'Reddit Rabbit Holes', color: '#a78bfa',
    desc: 'Started on a thread about coffee. Ended up learning about Byzantine architecture. Classic.' },
]

function getAutoDir(snake, food, dir) {
  const head = snake[0]
  const bodySet = new Set(snake.slice(1).map((s) => `${s.x},${s.y}`))

  const candidates = []
  if (food.x > head.x) candidates.push({ x: 1, y: 0 })
  if (food.x < head.x) candidates.push({ x: -1, y: 0 })
  if (food.y > head.y) candidates.push({ x: 0, y: 1 })
  if (food.y < head.y) candidates.push({ x: 0, y: -1 })
  if (Math.abs(food.x - head.x) <= Math.abs(food.y - head.y)) {
    candidates.push({ x: 0, y: 1 }, { x: 0, y: -1 })
  } else {
    candidates.push({ x: 1, y: 0 }, { x: -1, y: 0 })
  }

  for (const d of candidates) {
    if (d.x === -dir.x && d.y === -dir.y) continue
    const nx = head.x + d.x, ny = head.y + d.y
    if (nx < 0 || nx >= GRID_W || ny < 0 || ny >= GRID_H) continue
    if (bodySet.has(`${nx},${ny}`)) continue
    return d
  }
  for (const d of [{ x:1,y:0 },{ x:-1,y:0 },{ x:0,y:1 },{ x:0,y:-1 }]) {
    if (d.x === -dir.x && d.y === -dir.y) continue
    const nx = head.x + d.x, ny = head.y + d.y
    if (nx >= 0 && nx < GRID_W && ny >= 0 && ny < GRID_H && !bodySet.has(`${nx},${ny}`)) return d
  }
  return dir
}

function placeFood(snake, interestIdx) {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`))
  let pos
  let attempts = 0
  do {
    pos = {
      x: 2 + Math.floor(Math.random() * (GRID_W - 4)),
      y: 2 + Math.floor(Math.random() * (GRID_H - 4)),
    }
    attempts++
  } while (occupied.has(`${pos.x},${pos.y}`) && attempts < 200)
  return { ...pos, interest: INTERESTS[interestIdx % INTERESTS.length] }
}

export default function Interests() {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)
  const dirQueRef = useRef([])
  const userControlRef = useRef(false)
  const [active, setActive] = useState(null)
  const [eaten, setEaten] = useState([])
  const animRef = useRef(null)

  const initState = useCallback(() => ({
    snake: [
      { x: 5, y: GRID_H >> 1 },
      { x: 4, y: GRID_H >> 1 },
      { x: 3, y: GRID_H >> 1 },
    ],
    dir: { x: 1, y: 0 },
    food: null,
    foodIdx: 0,
    pulse: 0,
  }), [])

  const draw = useCallback((ctx, state) => {
    const W = GRID_W * CELL, H = GRID_H * CELL
    ctx.clearRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 0.5
    for (let x = 0; x <= GRID_W; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke()
    }
    for (let y = 0; y <= GRID_H; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke()
    }

    // Snake body (tail → head so head is on top)
    for (let i = state.snake.length - 1; i >= 0; i--) {
      const seg = state.snake[i]
      const t = 1 - i / state.snake.length
      if (i === 0) {
        ctx.fillStyle = '#c8904a'
        ctx.shadowBlur = 12
        ctx.shadowColor = 'rgba(200,144,74,0.7)'
      } else {
        ctx.fillStyle = `rgba(200, 144, 74, ${0.15 + t * 0.55})`
        ctx.shadowBlur = 0
      }
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, i === 0 ? 6 : 4)
      } else {
        ctx.rect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4)
      }
      ctx.fill()
      ctx.shadowBlur = 0

      // Eyes on head
      if (i === 0) {
        ctx.fillStyle = '#0e0e0e'
        const ex = seg.x * CELL, ey = seg.y * CELL
        const d = state.dir
        const e1x = ex + (d.x === 1 ? 14 : d.x === -1 ? 5 : 5)
        const e1y = ey + (d.y === 1 ? 14 : d.y === -1 ? 5 : 6)
        const e2x = ex + (d.x === 1 ? 14 : d.x === -1 ? 5 : 15)
        const e2y = ey + (d.y === 1 ? 14 : d.y === -1 ? 5 : 6)
        ctx.beginPath(); ctx.arc(e1x, e1y, 2, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(e2x, e2y, 2, 0, Math.PI * 2); ctx.fill()
      }
    }

    // Food
    if (state.food) {
      const fx = state.food.x * CELL + CELL / 2
      const fy = state.food.y * CELL + CELL / 2
      const r = CELL / 2 - 2

      const pulse = 0.5 + 0.5 * Math.sin(state.pulse * 0.2)
      ctx.beginPath()
      ctx.arc(fx, fy, r + 4 + pulse * 4, 0, Math.PI * 2)
      ctx.fillStyle = `${state.food.interest.color}22`
      ctx.fill()

      ctx.beginPath()
      ctx.arc(fx, fy, r, 0, Math.PI * 2)
      ctx.fillStyle = state.food.interest.color + '33'
      ctx.fill()
      ctx.strokeStyle = state.food.interest.color
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.font = `${CELL - 4}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(state.food.interest.emoji, fx, fy + 1)
    }
  }, [])

  const pushDir = useCallback((d) => {
    userControlRef.current = true
    dirQueRef.current.push(d)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let state = initState()
    state.food = placeFood(state.snake, 0)
    stateRef.current = state

    let lastTime = 0

    const loop = (ts) => {
      state.pulse++
      const elapsed = ts - lastTime

      if (elapsed >= SPEED) {
        lastTime = ts - (elapsed % SPEED)

        // Apply queued direction
        while (dirQueRef.current.length) {
          const d = dirQueRef.current.shift()
          if (d.x !== -state.dir.x || d.y !== -state.dir.y) { state.dir = d; break }
        }

        // Auto-pilot only when user hasn't taken control yet
        if (!userControlRef.current) {
          state.dir = getAutoDir(state.snake, state.food, state.dir)
        }

        const newHead = { x: state.snake[0].x + state.dir.x, y: state.snake[0].y + state.dir.y }

        const bodySet = new Set(state.snake.slice(1).map((s) => `${s.x},${s.y}`))
        if (
          newHead.x < 0 || newHead.x >= GRID_W ||
          newHead.y < 0 || newHead.y >= GRID_H ||
          bodySet.has(`${newHead.x},${newHead.y}`)
        ) {
          const fi = state.foodIdx
          state = initState()
          state.foodIdx = fi
          state.food = placeFood(state.snake, fi)
          stateRef.current = state
          // Reset user control on collision so autopilot resumes until next input
          userControlRef.current = false
          animRef.current = requestAnimationFrame(loop)
          return
        }

        state.snake.unshift(newHead)

        if (newHead.x === state.food.x && newHead.y === state.food.y) {
          const interest = state.food.interest
          setActive(interest)
          setEaten((prev) => prev.includes(interest.label) ? prev : [...prev, interest.label])
          state.foodIdx = (state.foodIdx + 1) % INTERESTS.length
          state.food = placeFood(state.snake, state.foodIdx)
        } else {
          state.snake.pop()
        }
      }

      draw(ctx, state)
      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)

    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const map = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      }
      if (map[e.key]) {
        e.preventDefault()
        pushDir(map[e.key])
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('keydown', onKey)
    }
  }, [initState, draw, pushDir])

  return (
    <section id="interests" className="section interests-section">
      <div className="section-label">outside the terminal</div>
      <h2 className="section-title">Interests & Hobbies</h2>
      <p className="section-subtitle">
        Control the snake with arrow keys or the buttons below.
        Each candy it eats reveals something about me.
      </p>

      <div className="snake-layout">
        {/* Canvas + controls */}
        <div className="snake-canvas-wrap">
          <canvas
            ref={canvasRef}
            width={GRID_W * CELL}
            height={GRID_H * CELL}
            className="snake-canvas"
            aria-label="Snake game — use arrow keys to control"
          />

          {/* On-screen arrow pad */}
          <div className="snake-dpad" aria-label="Direction controls">
            <div className="dpad-row">
              <button
                className="dpad-btn"
                onClick={() => pushDir({ x: 0, y: -1 })}
                aria-label="Up"
              >▲</button>
            </div>
            <div className="dpad-row">
              <button
                className="dpad-btn"
                onClick={() => pushDir({ x: -1, y: 0 })}
                aria-label="Left"
              >◀</button>
              <button
                className="dpad-btn dpad-center"
                onClick={() => pushDir({ x: 0, y: 1 })}
                aria-label="Down"
              >▼</button>
              <button
                className="dpad-btn"
                onClick={() => pushDir({ x: 1, y: 0 })}
                aria-label="Right"
              >▶</button>
            </div>
          </div>

          <div className="snake-hint">arrow keys / WASD / buttons above</div>
        </div>

        {/* Active interest card */}
        <div className="snake-side">
          {active ? (
            <div
              className="snake-active-card"
              key={active.label}
              style={{ '--card-color': active.color }}
            >
              <span className="active-emoji">{active.emoji}</span>
              <h3 className="active-label">{active.label}</h3>
              <p className="active-desc">{active.desc}</p>
            </div>
          ) : (
            <div className="snake-idle">
              <div className="idle-icon">🎮</div>
              <p>Waiting for the snake to grab a candy...</p>
            </div>
          )}

          {eaten.length > 0 && (
            <div className="eaten-tracker">
              <p className="eaten-label">Discovered so far:</p>
              <div className="eaten-pills">
                {INTERESTS.filter((i) => eaten.includes(i.label)).map((i) => (
                  <span key={i.label} className="eaten-pill" style={{ '--pill-color': i.color }}>
                    {i.emoji} {i.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
