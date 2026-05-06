import { useState } from 'react'

export function QueryBox({ onAsk, isRunning, onReset }) {
  const [question, setQuestion] = useState('')

  const handleSubmit = () => {
    if (!question.trim() || isRunning) return
    onAsk(question.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  return (
    <div className="query-box">
      <div className="query-header">
        <span className="query-label">YOUR QUESTION</span>
        <span className="query-hint">⌘ + Enter to send</span>
      </div>
      <textarea
        className="query-textarea"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything. The Oracles will convene."
        rows={3}
        disabled={isRunning}
      />
      <div className="query-actions">
        <button
          className="btn-reset"
          onClick={() => { setQuestion(''); onReset() }}
          disabled={isRunning}
        >
          Clear
        </button>
        <button
          className="btn-ask"
          onClick={handleSubmit}
          disabled={!question.trim() || isRunning}
        >
          {isRunning ? (
            <span className="btn-loading">
              <span className="spinner" />
              Consulting Oracles…
            </span>
          ) : (
            'Ask The Oracles'
          )}
        </button>
      </div>
    </div>
  )
}
