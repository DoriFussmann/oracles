import { useState } from 'react'

export function JudgePanel({ allDone, judgeStatus, judgeText, judgeError, onJudge }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(judgeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!allDone && judgeStatus === 'idle') return null

  // Parse the summary and draft
  let summaryNodes = []
  let draftNodes = []

  if (judgeText) {
    const lines = judgeText.split('\n')
    let mode = 'summary' // 'summary' or 'draft'
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith('## Synthesis Draft')) {
        mode = 'draft'
        continue
      }
      if (line.startsWith('## Model Summaries')) {
        continue
      }

      const cleanLine = line.replace(/\*\*/g, '') // remove bolding for cleaner look
      
      if (mode === 'summary' && cleanLine.trim() !== '') {
        summaryNodes.push(<div key={i} className="synthesizer-summary-item">{cleanLine}</div>)
      } else if (mode === 'draft' && line.trim() !== '') {
        draftNodes.push(<p key={i} className="synthesizer-para">{cleanLine}</p>)
      }
    }
  }

  return (
    <div className={`oracle-panel oracle-panel--${judgeStatus} ${expanded ? 'expanded' : ''} synthesizer-theme`}>
      <div className="oracle-panel-header" onClick={() => judgeStatus === 'success' && setExpanded(!expanded)}>
        <div className="oracle-panel-title">
          <div className="synthesizer-icon-minimal">✦</div>
          <span className="oracle-name">Working Draft Synthesis</span>
          <div className={`oracle-status-dot oracle-status-dot--${judgeStatus}`} />
        </div>

        {judgeStatus === 'success' && (
          <div className="oracle-summary synthesizer-summary-container">
            {summaryNodes}
          </div>
        )}

        {judgeStatus === 'loading' && (
          <div className="oracle-summary oracle-summary--loading">
            <span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span> Synthesizing consensus
          </div>
        )}

        {judgeStatus === 'error' && (
          <div className="oracle-summary oracle-summary--error">
            {judgeError}
          </div>
        )}
      </div>

      {expanded && judgeStatus === 'success' && (
        <div className="oracle-panel-body">
          <div className="conversation-history">
            <div className="chat-bubble chat-bubble--assistant synthesizer-draft-bubble">
              {draftNodes}
            </div>
          </div>
          <div className="oracle-metrics-inline" style={{ justifyContent: 'space-between' }}>
            <span>Synthesized from all oracles</span>
            <button className="btn-minimal" onClick={handleCopy}>
              {copied ? '✓ Copied' : 'Copy Draft'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
