import { useState } from 'react'
import { QueryBox } from './components/QueryBox'
import { OracleGrid } from './components/OracleGrid'
import { JudgePanel } from './components/JudgePanel'
import { useOracles } from './hooks/useOracles'
import { useJudge } from './hooks/useJudge'

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState('')
  const { oracles, isRunning, allDone, responses, askAll, reset, setModel } = useOracles()
  const { judgeStatus, judgeText, judgeError, runJudge, resetJudge } = useJudge()

  const hasAnyActivity = Object.values(oracles).some(o => o.status !== 'idle')

  const handleAsk = (question) => {
    setCurrentQuestion(question)
    resetJudge()
    askAll(question)
  }

  const handleReset = () => {
    setCurrentQuestion('')
    reset()
    resetJudge()
  }

  const handleJudge = () => {
    runJudge(currentQuestion, responses)
  }

  return (
    <div className="app">
      <div className="app-inner">
        {/* Query Box */}
        <QueryBox
          onAsk={handleAsk}
          isRunning={isRunning}
          onReset={handleReset}
        />

        {/* Judge Panel — slides in after all done */}
        <div className={`judge-wrapper ${allDone || judgeStatus !== 'idle' ? 'judge-wrapper--visible' : ''}`}>
          <JudgePanel
            allDone={allDone}
            judgeStatus={judgeStatus}
            judgeText={judgeText}
            judgeError={judgeError}
            onJudge={handleJudge}
          />
        </div>

        {/* Oracle Grid */}
        <div className={`oracles-wrapper ${hasAnyActivity ? 'oracles-wrapper--active' : ''}`}>
          <OracleGrid oracles={oracles} onModelChange={setModel} />
        </div>
      </div>
    </div>
  )
}
