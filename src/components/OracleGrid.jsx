import { OracleCard } from './OracleCard'
import { ORACLE_CONFIGS } from '../utils/models'

export function OracleGrid({ oracles, onModelChange, onIsolate }) {
  return (
    <div className="oracle-grid">
      {ORACLE_CONFIGS.map(config => {
        if (!oracles[config.id].enabled) return null;
        
        return (
          <OracleCard
            key={config.id}
            oracleId={config.id}
            state={oracles[config.id]}
            onModelChange={onModelChange}
            onIsolate={onIsolate}
          />
        )
      })}
    </div>
  )
}
