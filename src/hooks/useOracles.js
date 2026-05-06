import { useState, useCallback } from 'react'
import { callOracle } from '../utils/api'
import { ORACLE_CONFIGS, calculateCost } from '../utils/models'

const initialState = () =>
  ORACLE_CONFIGS.reduce((acc, o) => {
    acc[o.id] = {
      status: 'idle', // idle | loading | success | error
      text: '',
      error: '',
      model: o.defaultModel,
      enabled: true,
      metrics: null,
    }
    return acc
  }, {})

export function useOracles() {
  const [oracles, setOracles] = useState(initialState)
  const [isRunning, setIsRunning] = useState(false)

  const setModel = useCallback((id, model) => {
    setOracles(prev => ({ ...prev, [id]: { ...prev[id], model } }))
  }, [])

  const toggleEnabled = useCallback((id) => {
    setOracles(prev => ({ ...prev, [id]: { ...prev[id], enabled: !prev[id].enabled } }))
  }, [])

  const askAll = useCallback(async (question) => {
    // Reset all enabled oracles to loading
    setOracles(prev => {
      const next = { ...prev }
      ORACLE_CONFIGS.forEach(o => {
        if (next[o.id].enabled) {
          next[o.id] = { ...next[o.id], status: 'loading', text: '', error: '', metrics: null }
        }
      })
      return next
    })
    setIsRunning(true)

    const enabled = ORACLE_CONFIGS.filter(o => oracles[o.id].enabled)

    // Fire all in parallel, update each as it resolves
    await Promise.allSettled(
      enabled.map(async (oracle) => {
        const model = oracles[oracle.id].model
        try {
          const result = await callOracle(oracle.id, question, model)
          const cost = calculateCost(model, result.inputTokens, result.outputTokens)
          setOracles(prev => ({
            ...prev,
            [oracle.id]: {
              ...prev[oracle.id],
              status: 'success',
              text: result.text,
              metrics: {
                inputTokens: result.inputTokens,
                outputTokens: result.outputTokens,
                totalTime: result.totalTime,
                ttft: result.ttft,
                cost,
                model,
              },
            },
          }))
        } catch (err) {
          setOracles(prev => ({
            ...prev,
            [oracle.id]: {
              ...prev[oracle.id],
              status: 'error',
              error: err.message || 'Unknown error',
            },
          }))
        }
      })
    )

    setIsRunning(false)
  }, [oracles])

  const reset = useCallback(() => {
    setOracles(initialState())
    setIsRunning(false)
  }, [])

  const allDone =
    ORACLE_CONFIGS.filter(o => oracles[o.id].enabled).length > 0 &&
    ORACLE_CONFIGS.filter(o => oracles[o.id].enabled).every(
      o => oracles[o.id].status === 'success' || oracles[o.id].status === 'error'
    )

  const responses = ORACLE_CONFIGS.filter(o => oracles[o.id].enabled).map(o => ({
    id: o.id,
    name: o.name,
    model: oracles[o.id].model,
    status: oracles[o.id].status,
    text: oracles[o.id].text,
    error: oracles[o.id].error,
  }))

  return { oracles, isRunning, allDone, responses, askAll, reset, setModel, toggleEnabled }
}
