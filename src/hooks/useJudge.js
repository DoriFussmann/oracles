import { useState, useCallback } from 'react'
import { callJudge } from '../utils/api'

export function useJudge() {
  const [judgeStatus, setJudgeStatus] = useState('idle') // idle | loading | success | error
  const [judgeText, setJudgeText] = useState('')
  const [judgeError, setJudgeError] = useState('')

  const runJudge = useCallback(async (question, responses) => {
    setJudgeStatus('loading')
    setJudgeText('')
    setJudgeError('')
    try {
      const text = await callJudge(question, responses)
      setJudgeText(text)
      setJudgeStatus('success')
    } catch (err) {
      setJudgeError(err.message || 'Judge failed')
      setJudgeStatus('error')
    }
  }, [])

  const resetJudge = useCallback(() => {
    setJudgeStatus('idle')
    setJudgeText('')
    setJudgeError('')
  }, [])

  return { judgeStatus, judgeText, judgeError, runJudge, resetJudge }
}
