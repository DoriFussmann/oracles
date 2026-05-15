import { useState, useEffect } from 'react'
import { QueryBox } from './components/QueryBox'
import { OracleGrid } from './components/OracleGrid'
import { JudgePanel } from './components/JudgePanel'
import { useOracles } from './hooks/useOracles'
import { useJudge } from './hooks/useJudge'

export default function App() {
  const { oracles, isRunning, allDone, responses, askAll, reset, setModel } = useOracles()
  const { judgeStatus, judgeText, judgeError, runJudge, resetJudge } = useJudge()

  const hasAnyActivity = Object.values(oracles).some(o => o.status !== 'idle')

  const handleAsk = (question) => {
    resetJudge()
    askAll(question)
  }

  const handleReset = () => {
    reset()
    resetJudge()
  }

  const handleJudge = () => {
    const enabledOracles = Object.values(oracles).filter(o => o.enabled)
    const messages = enabledOracles.length > 0 ? enabledOracles[0].messages : []
    runJudge(messages, responses)
  }

  // Auto-start synthesis when all oracles finish
  useEffect(() => {
    if (allDone && judgeStatus === 'idle') {
      handleJudge()
    }
  }, [allDone, judgeStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app">
      <div className="app-inner">
        {/* Header Actions */}
        {hasAnyActivity && (
          <div className="app-top-actions">
            <button className="btn-minimal" onClick={handleReset}>Clear Chat</button>
          </div>
        )}

        {/* 1. Chat/Query Box (Top) */}
        <div className="query-box-container--inline">
          <QueryBox
            onAsk={handleAsk}
            isRunning={isRunning}
            onReset={handleReset}
          />
        </div>

        {/* 2. Synthesizer Panel (Middle, squeezed in) */}
        <div className={`judge-wrapper ${allDone || judgeStatus !== 'idle' ? 'judge-wrapper--visible' : ''}`}>
          <JudgePanel
            allDone={allDone}
            judgeStatus={judgeStatus}
            judgeText={judgeText}
            judgeError={judgeError}
            onJudge={handleJudge}
          />
        </div>

        {/* 3. Oracle Grid (Bottom) */}
        <div className={`oracles-wrapper ${hasAnyActivity ? 'oracles-wrapper--active' : ''}`}>
          <OracleGrid oracles={oracles} onModelChange={setModel} />
        </div>
      </div>
    </div>
  )
}
