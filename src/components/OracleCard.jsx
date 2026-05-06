import { useState } from 'react'
import { ORACLE_CONFIGS } from '../utils/models'

function formatCost(cost) {
  if (cost === null || cost === undefined) return '—'
  if (cost === 0) return '$0.00'
  if (cost < 0.0001) return '<$0.0001'
  if (cost < 0.01) return `$${cost.toFixed(4)}`
  return `$${cost.toFixed(3)}`
}

function formatMs(ms) {
  if (ms == null) return '—'
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}

function MetricsPanel({ metrics }) {
  const items = [
    {
      label: 'Tokens In / Out',
      value: (metrics.inputTokens != null && metrics.outputTokens != null)
        ? `${metrics.inputTokens.toLocaleString()} / ${metrics.outputTokens.toLocaleString()}`
        : '—',
    },
    { label: 'Response Time',  value: formatMs(metrics.totalTime) },
    { label: 'First Token',    value: formatMs(metrics.ttft) },
    { label: 'Est. Cost',      value: formatCost(metrics.cost) },
    { label: 'Model',          value: metrics.model },
  ]

  return (
    <div className="oracle-metrics">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="oracle-metric-card"
          style={{ '--metric-delay': `${i * 90}ms` }}
        >
          <span className="oracle-metric-label">{item.label}</span>
          <span className="oracle-metric-value" title={item.value}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export function OracleCard({ oracleId, state, onModelChange }) {
  const config = ORACLE_CONFIGS.find(o => o.id === oracleId)
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(state.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isActive = state.status !== 'idle'

  return (
    <div
      className={`oracle-card oracle-card--${state.status} ${isActive ? 'oracle-card--active' : ''}`}
      style={{ '--oracle-color': config.color }}
    >
      <div className="oracle-card__left">
        <div className="oracle-logo-well">
          <div
            className="oracle-logo"
            style={{ color: config.color }}
            dangerouslySetInnerHTML={{ __html: config.logo }}
          />
        </div>
        <div className="oracle-meta">
          <span className="oracle-name">{config.name}</span>
          <select
            className="oracle-model-select"
            value={state.model}
            onChange={e => onModelChange(oracleId, e.target.value)}
            disabled={state.status === 'loading'}
          >
            {config.models.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <div className={`oracle-status-dot oracle-status-dot--${state.status}`} />
        </div>
      </div>

      <div className="oracle-card__right">
        <div className="oracle-card__body">
          <div className="oracle-body-main">
            {state.status === 'idle' && (
              <div className="oracle-idle">
                <div className="oracle-idle-lines">
                  <div className="oracle-idle-line" style={{ width: '70%' }} />
                  <div className="oracle-idle-line" style={{ width: '50%' }} />
                  <div className="oracle-idle-line" style={{ width: '85%' }} />
                </div>
              </div>
            )}

            {state.status === 'loading' && (
              <div className="oracle-skeleton">
                <div className="skeleton-line" style={{ width: '90%' }} />
                <div className="skeleton-line" style={{ width: '75%' }} />
                <div className="skeleton-line" style={{ width: '95%' }} />
                <div className="skeleton-line" style={{ width: '60%' }} />
                <div className="skeleton-line" style={{ width: '80%' }} />
              </div>
            )}

            {state.status === 'success' && (
              <div className="oracle-response">
                <p className="oracle-text">{state.text}</p>
              </div>
            )}

            {state.status === 'error' && (
              <div className="oracle-error">
                <span className="oracle-error-icon">⚠</span>
                <p className="oracle-error-msg">{state.error}</p>
              </div>
            )}
          </div>

          {state.status === 'success' && state.metrics && (
            <MetricsPanel metrics={state.metrics} />
          )}
        </div>

        {state.status === 'success' && (
          <div className="oracle-card__footer">
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <button className="btn-copy btn-expand" onClick={() => setExpanded(true)}>
              Expand
            </button>
          </div>
        )}
      </div>

      {expanded && state.status === 'success' && (
        <div className="oracle-modal" role="dialog" aria-modal="true" aria-label={`${config.name} response`}>
          <div className="oracle-modal__dialog">
            <div className="oracle-modal__header">
              <span className="oracle-modal__title">{config.name} — {state.model}</span>
              <button className="btn-copy" onClick={() => setExpanded(false)}>
                Close
              </button>
            </div>

            <div className="oracle-modal__body">
              <div className="oracle-response oracle-response--expanded">
                <p className="oracle-text">{state.text}</p>
              </div>
            </div>

            <div className="oracle-modal__footer">
              <button className="btn-copy" onClick={handleCopy}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
