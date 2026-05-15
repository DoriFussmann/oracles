import { useState } from 'react'
import { ORACLE_CONFIGS } from '../utils/models'

export function OracleCard({ oracleId, state, onModelChange, onIsolate }) {
  const config = ORACLE_CONFIGS.find(o => o.id === oracleId)
  const [expanded, setExpanded] = useState(false)

  const msgs = state.messages || []
  const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null
  const isAssistant = lastMsg?.role === 'assistant'
  const latestText = isAssistant ? lastMsg.content : ''

  let summary = ''
  
  if (latestText) {
    const match = latestText.match(/<summary>([\s\S]*?)<\/summary>/i)
    if (match) {
      summary = match[1].trim()
    } else {
      // Fallback if model didn't use tags
      summary = latestText.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).slice(0, 2).join('\n')
      if (!summary) summary = latestText.substring(0, 100) + '...'
    }
  }

  // Remove markdown bolding and extra spaces from summary for a cleaner minimalist look
  summary = summary.replace(/\*\*/g, '').trim()

  return (
    <div className={`oracle-panel oracle-panel--${state.status} ${expanded ? 'expanded' : ''}`}>
      <div className="oracle-panel-header" onClick={() => state.status === 'success' && setExpanded(!expanded)}>
        <div className="oracle-panel-title">
          <div className="oracle-logo-minimal" style={{ color: config.color }} dangerouslySetInnerHTML={{ __html: config.logo }} />
          <span className="oracle-name">{config.name}</span>
          <select
            className="oracle-model-select"
            value={state.model}
            onChange={e => onModelChange(oracleId, e.target.value)}
            disabled={state.status === 'loading'}
            onClick={e => e.stopPropagation()}
          >
            {config.models.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <div className={`oracle-status-dot oracle-status-dot--${state.status}`} />
        </div>

        {state.status === 'success' && (
          <div className="oracle-summary">
            {summary}
          </div>
        )}

        {state.status === 'loading' && (
          <div className="oracle-summary oracle-summary--loading">
            <span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span>
          </div>
        )}

        {state.status === 'error' && (
          <div className="oracle-summary oracle-summary--error">
            {state.error}
          </div>
        )}
      </div>

      {expanded && state.status === 'success' && (
        <div className="oracle-panel-body">
          <div className="conversation-history">
            {msgs.map((msg, i) => {
              let displayContent = msg.content
              if (msg.role === 'assistant') {
                displayContent = displayContent.replace(/<summary>[\s\S]*?<\/summary>/i, '').trim()
              }
              return (
                <div key={i} className={`chat-bubble chat-bubble--${msg.role}`}>
                  {displayContent}
                </div>
              )
            })}
          </div>
          
          {state.metrics && (
            <div className="oracle-metrics-inline" style={{ justifyContent: 'space-between' }}>
              <div>
                <span>{state.metrics.inputTokens} In / {state.metrics.outputTokens} Out</span>
                <span className="sep">·</span>
                <span>{state.metrics.totalTime >= 1000 ? (state.metrics.totalTime/1000).toFixed(1) + 's' : state.metrics.totalTime + 'ms'}</span>
                <span className="sep">·</span>
                <span>Cost: ${(state.metrics.cost || 0).toFixed(4)}</span>
              </div>
              <button 
                className="btn-minimal" 
                onClick={(e) => { e.stopPropagation(); onIsolate(oracleId); }}
              >
                Branch to 1:1
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
