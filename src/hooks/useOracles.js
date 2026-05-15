import { useState, useCallback } from 'react'
import { callOracle } from '../utils/api'
import { ORACLE_CONFIGS, calculateCost } from '../utils/models'

const initialState = () =>
  ORACLE_CONFIGS.reduce((acc, o) => {
    acc[o.id] = {
      status: 'idle', // idle | loading | success | error
      messages: [],
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

  const isolateOracle = useCallback((id) => {
    setOracles(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(key => {
        next[key] = { ...next[key], enabled: key === id }
      })
      return next
    })
  }, [])

  const baselineAll = useCallback((draftText) => {
    setOracles(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(key => {
        if (next[key].enabled) {
          next[key] = {
            ...next[key],
            status: 'idle', // Ready to ask again
            messages: [...next[key].messages, { role: 'user', content: `[BASELINE ESTABLISHED]:\n${draftText}` }]
          }
        }
      })
      return next
    })
  }, [])

  const askAll = useCallback(async (question) => {
    // Reset all enabled oracles to loading, append user message
    setOracles(prev => {
      const next = { ...prev }
      ORACLE_CONFIGS.forEach(o => {
        if (next[o.id].enabled) {
          next[o.id] = { 
            ...next[o.id], 
            status: 'loading', 
            error: '', 
            metrics: null,
            messages: [...next[o.id].messages, { role: 'user', content: question }]
          }
        }
      })
      return next
    })
    setIsRunning(true)

    // Fire all in parallel
    const enabled = ORACLE_CONFIGS.filter(o => oracles[o.id].enabled)

    await Promise.allSettled(
      enabled.map(async (oracle) => {
        // We capture the state values before the await
        const model = oracles[oracle.id].model
        const messageHistory = [...oracles[oracle.id].messages, { role: 'user', content: question }]
        
        try {
          const result = await callOracle(oracle.id, messageHistory, model)
          const cost = calculateCost(model, result.inputTokens, result.outputTokens)
          
          setOracles(prev => ({
            ...prev,
            [oracle.id]: {
              ...prev[oracle.id],
              status: 'success',
              messages: [...prev[oracle.id].messages, { role: 'assistant', content: result.text }],
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

  const responses = ORACLE_CONFIGS.filter(o => oracles[o.id].enabled).map(o => {
    const msgs = oracles[o.id].messages;
    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
    return {
      id: o.id,
      name: o.name,
      model: oracles[o.id].model,
      status: oracles[o.id].status,
      text: lastMsg?.role === 'assistant' ? lastMsg.content : '',
      error: oracles[o.id].error,
    }
  })

  return { oracles, isRunning, allDone, responses, askAll, reset, setModel, toggleEnabled, isolateOracle, baselineAll }
}
