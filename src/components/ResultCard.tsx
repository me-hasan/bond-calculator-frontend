import type { BondCalculationResponse } from '@/types/bond'

interface ResultCardProps {
  result: BondCalculationResponse | null
  isLoading: boolean
  error: string | null
}

const STATUS_COLORS = {
  Premium: 'premium',
  Discount: 'discount',
  Par: 'par',
} as const

export function ResultCard({ result, isLoading, error }: ResultCardProps) {
  if (isLoading) {
    return (
      <div className="result-card loading">
        <div className="loading-spinner" />
        <p>Calculating bond metrics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="result-card error">
        <div className="error-icon">⚠</div>
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="result-card empty">
        <p>Enter bond details and click Calculate to see results</p>
      </div>
    )
  }

  const statusClass = STATUS_COLORS[result.status] || ''

  return (
    <div className="result-card">
      <div className={`status-badge ${statusClass}`}>
        {result.status} Bond
      </div>

      <div className="results-grid">
        <div className="result-item">
          <label>Current Yield</label>
          <div className="result-value">
            {result.currentYield.toFixed(2)}%
          </div>
        </div>

        <div className="result-item">
          <label>Yield to Maturity</label>
          <div className="result-value">
            {result.yieldToMaturity.toFixed(2)}%
          </div>
        </div>

        <div className="result-item">
          <label>Total Interest</label>
          <div className="result-value">
            ${result.totalInterest.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}
