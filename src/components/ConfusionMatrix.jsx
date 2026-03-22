import { useState, useEffect, useRef } from 'react'
import './ConfusionMatrix.css'

const SCENARIOS = [
  {
    id: 'medical',
    name: 'Medical Diagnosis',
    icon: '🏥',
    context: 'Detecting disease from radiology scans',
    pos_label: 'Disease', neg_label: 'Healthy',
    base: { tp: 89, fp: 12, fn: 8, tn: 241 },
  },
  {
    id: 'parking',
    name: 'Parking Detection',
    icon: '🚗',
    context: 'YOLOv8 slot occupancy — PKLot dataset',
    pos_label: 'Occupied', neg_label: 'Empty',
    base: { tp: 947, fp: 87, fn: 53, tn: 913 },
  },
  {
    id: 'fraud',
    name: 'Fraud Detection',
    icon: '💳',
    context: 'Flagging suspicious transactions',
    pos_label: 'Fraud', neg_label: 'Legit',
    base: { tp: 312, fp: 45, fn: 23, tn: 8420 },
  },
]

// Compute TP/FP/FN/TN for a given threshold (0.0–1.0, base at 0.5)
function getMatrix(base, threshold) {
  const totalPos = base.tp + base.fn
  const totalNeg = base.fp + base.tn
  const t = threshold, t0 = 0.5

  let tp, fn, fp, tn
  if (t >= t0) {
    const f = (t - t0) / t0
    tp = Math.max(0, Math.round(base.tp * (1 - f * 0.92)))
    fn = totalPos - tp
    fp = Math.max(0, Math.round(base.fp * (1 - f * 0.75)))
    tn = totalNeg - fp
  } else {
    const f = (t0 - t) / t0
    tp = Math.min(totalPos, Math.round(base.tp + (totalPos - base.tp) * f * 0.85))
    fn = totalPos - tp
    fp = Math.min(totalNeg, Math.round(base.fp + (totalNeg - base.tn) * f))
    tn = totalNeg - fp
  }
  return { tp, fn, fp, tn }
}

function useCountUp(target, duration = 500) {
  const [value, setValue] = useState(target)
  const raf = useRef(null)
  const prev = useRef(target)

  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current)
    const from = prev.current
    const start = performance.now()
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const val = Math.round(from + (target - from) * eased)
      setValue(val)
      if (t < 1) raf.current = requestAnimationFrame(step)
      else prev.current = target
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

const CELL_INFO = {
  tp: { label: 'True Positive',  short: 'TP', color: '#5a9478', desc: 'Correctly flagged as positive. Model said YES — it was right.' },
  fn: { label: 'False Negative', short: 'FN', color: '#d4a853', desc: 'Missed a real case. Model said NO — it was wrong. Dangerous in medicine.' },
  fp: { label: 'False Positive', short: 'FP', color: '#c47a5a', desc: 'False alarm. Model said YES — it was wrong. Costly in fraud detection.' },
  tn: { label: 'True Negative',  short: 'TN', color: '#7ab0a0', desc: 'Correctly cleared as negative. Model said NO — it was right.' },
}

function getInsight(threshold) {
  if (threshold >= 0.75) return { text: 'High precision, low recall — conservative model. Misses real cases but avoids false alarms.', level: 'strict' }
  if (threshold >= 0.55) return { text: 'Slightly conservative — precision-biased. Good for low false-positive tolerance.', level: 'mid-high' }
  if (threshold <= 0.25) return { text: 'Aggressive threshold — high recall, many false alarms. Use when missing positives is costly.', level: 'loose' }
  if (threshold <= 0.45) return { text: 'Slightly permissive — recall-biased. Good when catching all positives matters most.', level: 'mid-low' }
  return { text: 'Balanced threshold — default decision boundary. Equal weight on precision and recall.', level: 'balanced' }
}

export default function ConfusionMatrix() {
  const [scenario, setScenario] = useState(SCENARIOS[0])
  const [threshold, setThreshold] = useState(0.5)
  const [hovered, setHovered] = useState(null)

  const mx = getMatrix(scenario.base, threshold)
  const tp = useCountUp(mx.tp)
  const fn = useCountUp(mx.fn)
  const fp = useCountUp(mx.fp)
  const tn = useCountUp(mx.tn)

  const total = tp + fn + fp + tn || 1
  const accuracy  = (tp + tn) / total
  const precision = tp / (tp + fp || 1)
  const recall    = tp / (tp + fn || 1)
  const f1        = 2 * precision * recall / ((precision + recall) || 1)
  const insight   = getInsight(threshold)

  const cells = [
    { key: 'tp', value: tp },
    { key: 'fn', value: fn },
    { key: 'fp', value: fp },
    { key: 'tn', value: tn },
  ]

  return (
    <div className="cm-wrapper" role="region" aria-label="Interactive confusion matrix">
      {/* Scenario selector */}
      <div className="cm-scenarios" role="tablist" aria-label="Select scenario">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={scenario.id === s.id}
            className={`cm-scenario-btn ${scenario.id === s.id ? 'active' : ''}`}
            onClick={() => setScenario(s)}
          >
            <span aria-hidden="true">{s.icon}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      <p className="cm-context">{scenario.context}</p>

      {/* ── Threshold slider — THE unique element ── */}
      <div className="cm-threshold" role="group" aria-label="Decision threshold control">
        <div className="threshold-header">
          <label htmlFor="threshold-slider" className="threshold-label">
            Decision Threshold
          </label>
          <span className="threshold-value" aria-live="polite">{threshold.toFixed(2)}</span>
        </div>
        <input
          id="threshold-slider"
          type="range"
          min="0.05" max="0.95" step="0.05"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          className="threshold-slider"
          aria-valuemin={0.05}
          aria-valuemax={0.95}
          aria-valuenow={threshold}
          aria-valuetext={`Threshold: ${threshold.toFixed(2)}`}
        />
        <div className="threshold-scale" aria-hidden="true">
          <span>Permissive</span>
          <span>Balanced</span>
          <span>Strict</span>
        </div>
        <div className={`threshold-insight insight-${insight.level}`} role="status" aria-live="polite">
          <span className="insight-icon" aria-hidden="true">→</span>
          {insight.text}
        </div>
      </div>

      {/* Matrix */}
      <div className="cm-outer" role="table" aria-label="Confusion matrix">
        <div className="cm-axis-predicted" aria-hidden="true">
          <span className="cm-axis-title">Predicted</span>
          <div className="cm-axis-vals">
            <span style={{ color: CELL_INFO.tp.color }}>+ {scenario.pos_label}</span>
            <span style={{ color: CELL_INFO.tn.color }}>- {scenario.neg_label}</span>
          </div>
        </div>
        <div className="cm-left-col" aria-hidden="true">
          <span className="cm-axis-title cm-actual-title">Actual</span>
          <div className="cm-actual-vals">
            <span style={{ color: CELL_INFO.tp.color }}>+ {scenario.pos_label}</span>
            <span style={{ color: CELL_INFO.tn.color }}>- {scenario.neg_label}</span>
          </div>
        </div>
        <div className="cm-grid" role="rowgroup">
          {cells.map((cell) => {
            const info = CELL_INFO[cell.key]
            return (
              <div
                key={cell.key}
                className={`cm-cell ${hovered === cell.key ? 'hovered' : ''}`}
                style={{ '--cell-color': info.color }}
                onMouseEnter={() => setHovered(cell.key)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(cell.key)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                role="cell"
                aria-label={`${info.label}: ${cell.value}`}
              >
                <div className="cm-cell-short" aria-hidden="true">{info.short}</div>
                <div className="cm-cell-value" aria-hidden="true">{cell.value.toLocaleString()}</div>
                <div className="cm-cell-label" aria-hidden="true">{info.label}</div>
                {hovered === cell.key && (
                  <div className="cm-tooltip" role="tooltip">{info.desc}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Metrics */}
      <div className="cm-metrics" role="list" aria-label="Model performance metrics">
        {[
          { label: 'Accuracy',  val: accuracy,  color: '#c8904a' },
          { label: 'Precision', val: precision, color: '#5a9478' },
          { label: 'Recall',    val: recall,    color: '#d4a853' },
          { label: 'F1',        val: f1,        color: '#7ab0a0' },
        ].map(({ label, val, color }) => (
          <div key={label} className="metric-badge" role="listitem">
            <span className="metric-label">{label}</span>
            <span className="metric-value" style={{ color }} aria-label={`${label}: ${(val * 100).toFixed(1)}%`}>
              {(val * 100).toFixed(1)}%
            </span>
            <div className="metric-bar-wrap" aria-hidden="true">
              <div className="metric-bar" style={{ width: `${val * 100}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
