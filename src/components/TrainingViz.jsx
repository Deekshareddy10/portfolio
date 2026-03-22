import { useState, useEffect, useRef, useCallback } from 'react'
import './TrainingViz.css'

const TOTAL_EPOCHS = 60
const TICK_MS = 70

const AMBER = '#c8904a'
const GREEN = '#5a9478'

function makeCurves() {
  const loss = [], acc = []
  for (let i = 0; i <= TOTAL_EPOCHS; i++) {
    const t = i / TOTAL_EPOCHS
    const l = 2.4 * Math.exp(-4.2 * t) + 0.07 + (Math.random() - 0.5) * 0.07
    const a = Math.min(97, 92 * (1 - Math.exp(-4.5 * t)) + 36 + (Math.random() - 0.5) * 2.2)
    loss.push(Math.max(0.05, l))
    acc.push(Math.max(34, a))
  }
  return { loss, acc }
}

export default function TrainingViz() {
  const canvasRef = useRef(null)
  const [epoch, setEpoch] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const curvesRef = useRef(makeCurves())
  const epochRef = useRef(0)
  const timerRef = useRef(null)

  const drawChart = useCallback((upTo) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { loss, acc } = curvesRef.current
    const W = canvas.width, H = canvas.height
    const PAD = { top: 14, right: 10, bottom: 22, left: 32 }
    const cW = W - PAD.left - PAD.right
    const cH = H - PAD.top - PAD.bottom

    ctx.clearRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + (i / 4) * cH
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + cW, y); ctx.stroke()
    }

    // Y-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.font = '9px JetBrains Mono, monospace'
    ctx.textAlign = 'right'
    ;[2.5, 1.875, 1.25, 0.625, 0].forEach((val, i) => {
      const y = PAD.top + (i / 4) * cH
      ctx.fillText(val.toFixed(1), PAD.left - 4, y + 3)
    })

    // X-axis epoch labels
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ;[0, 15, 30, 45, 60].forEach((ep) => {
      const x = PAD.left + (ep / TOTAL_EPOCHS) * cW
      ctx.fillText(ep, x, H - 4)
    })

    if (upTo < 1) return

    const n = Math.min(upTo, TOTAL_EPOCHS)

    // Loss curve (amber)
    ctx.beginPath()
    ctx.strokeStyle = AMBER
    ctx.lineWidth = 1.8
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    for (let i = 0; i <= n; i++) {
      const x = PAD.left + (i / TOTAL_EPOCHS) * cW
      const y = PAD.top + (1 - Math.min(loss[i] / 2.5, 1)) * cH
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Accuracy curve (green) — scaled 30-100%
    ctx.beginPath()
    ctx.strokeStyle = GREEN
    ctx.lineWidth = 1.8
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    for (let i = 0; i <= n; i++) {
      const x = PAD.left + (i / TOTAL_EPOCHS) * cW
      const y = PAD.top + (1 - (acc[i] - 30) / 70) * cH
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Live dots at current position
    const lx = PAD.left + (n / TOTAL_EPOCHS) * cW
    const ly = PAD.top + (1 - Math.min(loss[n] / 2.5, 1)) * cH
    const ay = PAD.top + (1 - (acc[n] - 30) / 70) * cH

    ctx.shadowBlur = 8
    ctx.shadowColor = AMBER
    ctx.beginPath(); ctx.arc(lx, ly, 3, 0, Math.PI * 2)
    ctx.fillStyle = AMBER; ctx.fill()

    ctx.shadowColor = GREEN
    ctx.beginPath(); ctx.arc(lx, ay, 3, 0, Math.PI * 2)
    ctx.fillStyle = GREEN; ctx.fill()
    ctx.shadowBlur = 0
  }, [])

  const startTraining = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    curvesRef.current = makeCurves()
    epochRef.current = 0
    setEpoch(0)
    setRunning(true)
    setDone(false)
    drawChart(0)

    timerRef.current = setInterval(() => {
      epochRef.current += 1
      setEpoch(epochRef.current)
      drawChart(epochRef.current)
      if (epochRef.current >= TOTAL_EPOCHS) {
        clearInterval(timerRef.current)
        setRunning(false)
        setDone(true)
      }
    }, TICK_MS)
  }, [drawChart])

  useEffect(() => {
    const id = setTimeout(startTraining, 500)
    return () => {
      clearTimeout(id)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTraining])

  const { loss, acc } = curvesRef.current
  const curLoss = loss[epoch] ?? 2.4
  const curAcc = acc[epoch] ?? 36
  const pct = Math.round((epoch / TOTAL_EPOCHS) * 100)

  return (
    <div className="tv-wrapper" aria-label="Live AI training visualizer">

      {/* Config row */}
      <div className="tv-config">
        <span className="tv-config-item">
          <span className="tv-config-key">model</span>
          <span className="tv-config-val">bert_finetune.py</span>
        </span>
        <span className="tv-config-item">
          <span className="tv-config-key">device</span>
          <span className="tv-config-val">cuda:0</span>
        </span>
        <span className="tv-config-item">
          <span className="tv-config-key">optimizer</span>
          <span className="tv-config-val">AdamW</span>
        </span>
      </div>

      {/* Live metrics */}
      <div className="tv-metrics" aria-live="polite">
        <div className="tv-metric">
          <span className="tv-metric-key" style={{ color: AMBER }}>loss</span>
          <span className="tv-metric-val">{curLoss.toFixed(3)}</span>
        </div>
        <div className="tv-metric">
          <span className="tv-metric-key" style={{ color: GREEN }}>accuracy</span>
          <span className="tv-metric-val">{curAcc.toFixed(1)}%</span>
        </div>
        <div className="tv-metric">
          <span className="tv-metric-key">epoch</span>
          <span className="tv-metric-val">{epoch} / {TOTAL_EPOCHS}</span>
        </div>
      </div>

      {/* Chart */}
      <canvas
        ref={canvasRef}
        width={430}
        height={155}
        className="tv-canvas"
        aria-hidden="true"
      />

      {/* Legend */}
      <div className="tv-legend" aria-hidden="true">
        <span className="tv-legend-item">
          <span className="tv-legend-line" style={{ background: AMBER }} />
          train loss
        </span>
        <span className="tv-legend-item">
          <span className="tv-legend-line" style={{ background: GREEN }} />
          accuracy
        </span>
      </div>

      {/* Progress bar */}
      <div className="tv-progress-wrap" aria-hidden="true">
        <div className="tv-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Footer */}
      <div className="tv-footer">
        <span className={`tv-status ${done ? 'status-done' : 'status-running'}`}>
          {done ? '✓ converged' : running ? `training  ${pct}%` : 'ready'}
        </span>
        <button
          className="tv-btn"
          onClick={startTraining}
          disabled={running}
          aria-label="Restart training"
        >
          {running ? 'training...' : 'Train Again'}
        </button>
      </div>
    </div>
  )
}
