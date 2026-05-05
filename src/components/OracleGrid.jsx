import { OracleCard } from './OracleCard'
import { ORACLE_CONFIGS } from '../utils/models'

export function OracleGrid({ oracles, onModelChange }) {
  return (
    <div className="oracle-grid">
      {ORACLE_CONFIGS.map(config => (
        <OracleCard
          key={config.id}
          oracleId={config.id}
          state={oracles[config.id]}
          onModelChange={onModelChange}
        />
      ))}
    </div>
  )
}
