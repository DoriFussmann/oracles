import { useState } from 'react'
import { ORACLE_CONFIGS } from '../utils/models'

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
        <div
          className="oracle-logo"
          style={{ color: config.color }}
          dangerouslySetInnerHTML={{ __html: config.logo }}
        />
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
        </div>
        <div className={`oracle-status-dot oracle-status-dot--${state.status}`} />
      </div>

      <div className="oracle-card__right">
        <div className="oracle-card__body">
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
              <span className="oracle-modal__title">{config.name} - {state.model}</span>
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
