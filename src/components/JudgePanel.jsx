import { useState } from 'react'

function renderJudgeText(text) {
  // Split into sections and render with basic markdown-ish formatting
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('## ')) {
      return <h3 key={i} className="judge-section-title">{line.replace('## ', '')}</h3>
    }
    if (line.startsWith('• ')) {
      const content = line.replace('• ', '')
      // Bold **text**
      const parts = content.split(/(\*\*[^*]+\*\*)/)
      return (
        <div key={i} className="judge-bullet">
          <span className="judge-bullet-dot">•</span>
          <span>
            {parts.map((p, j) =>
              p.startsWith('**') && p.endsWith('**')
                ? <strong key={j}>{p.slice(2, -2)}</strong>
                : p
            )}
          </span>
        </div>
      )
    }
    if (line.trim() === '') return <div key={i} className="judge-spacer" />
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="judge-para">
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j}>{p.slice(2, -2)}</strong>
            : p
        )}
      </p>
    )
  })
}

export function JudgePanel({ allDone, judgeStatus, judgeText, judgeError, onJudge }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(judgeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!allDone && judgeStatus === 'idle') return null

  return (
    <div className={`judge-panel judge-panel--${judgeStatus}`}>
      <div className="judge-panel__header">
        <div className="judge-icon">⚖</div>
        <div className="judge-title-group">
          <span className="judge-label">THE JUDGE</span>
          <span className="judge-subtitle">Anthropic · Synthesis Engine</span>
        </div>
        {judgeStatus === 'idle' && allDone && (
          <button className="btn-judge" onClick={onJudge}>
            Judge &amp; Sync
          </button>
        )}
        {judgeStatus === 'success' && (
          <button className="btn-copy btn-copy--judge" onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>

      {judgeStatus === 'loading' && (
        <div className="judge-loading">
          <div className="judge-skeleton-line" style={{ width: '85%' }} />
          <div className="judge-skeleton-line" style={{ width: '65%' }} />
          <div className="judge-skeleton-line" style={{ width: '90%' }} />
          <div className="judge-skeleton-line" style={{ width: '75%' }} />
          <div className="judge-skeleton-line" style={{ width: '55%' }} />
          <div className="judge-skeleton-line" style={{ width: '80%' }} />
        </div>
      )}

      {judgeStatus === 'success' && (
        <div className="judge-content">
          {renderJudgeText(judgeText)}
        </div>
      )}

      {judgeStatus === 'error' && (
        <div className="judge-error">
          <span className="oracle-error-icon">⚠</span>
          <p>{judgeError}</p>
        </div>
      )}
    </div>
  )
}
