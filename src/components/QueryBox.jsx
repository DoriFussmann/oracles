import { useState } from 'react'

export function QueryBox({ onAsk, isRunning, onReset }) {
  const [question, setQuestion] = useState('')

  const handleSubmit = () => {
    if (!question.trim() || isRunning) return
    onAsk(question.trim())
    setQuestion('') // clear input after sending, to feel like chat
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="query-box-minimal">
      <textarea
        className="query-input"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask the oracles..."
        rows={1}
        disabled={isRunning}
      />
      <div className="query-actions-minimal">
        {isRunning ? (
          <div className="minimal-spinner" />
        ) : (
          <button
            className="btn-send-minimal"
            onClick={handleSubmit}
            disabled={!question.trim() || isRunning}
            title="Send"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
