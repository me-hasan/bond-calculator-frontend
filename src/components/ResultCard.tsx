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
}

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

  const statusClass = STATUS_COLORS[result.status]

  return (
    <div className="result-card">
      <div className={`status-badge ${statusClass}`}>
        {result.status} Bond
      </div>

      <div className="results-grid">
        <div className="result-item">
          <label>Current Yield</label>
          <div className="result-value">
            {((result.cashflows[0]?.interest || 0) / result.currentBondPrice * 100).toFixed(2)}%
          </div>
        </div>

        <div className="result-item">
          <label>Yield to Maturity</label>
          <div className="result-value">
            {(result.yieldToMaturity * 100).toFixed(2)}%
          </div>
        </div>

        <div className="result-item">
          <label>Total Interest</label>
          <div className="result-value">
            ${result.cashflows.reduce((sum, cf) => sum + cf.interest, 0).toFixed(2)}
          </div>
        </div>

        <div className="result-item">
          <label>Bond Price</label>
          <div className="result-value">
            ${result.currentBondPrice.toFixed(2)}
          </div>
        </div>

        <div className="result-item">
          <label>Present Value</label>
          <div className="result-value">
            ${result.presentValue.toFixed(2)}
          </div>
        </div>

        <div className="result-item">
          <label>Macaulay Duration</label>
          <div className="result-value">
            {result.macaulayDuration.toFixed(2)} years
          </div>
        </div>

        <div className="result-item">
          <label>Modified Duration</label>
          <div className="result-value">
            {result.modifiedDuration.toFixed(2)}
          </div>
        </div>

        <div className="result-item">
          <label>Dirty Price</label>
          <div className="result-value">
            ${result.dirtyPrice.toFixed(2)}
          </div>
        </div>

        <div className="result-item">
          <label>Accrued Interest</label>
          <div className="result-value">
            ${result.accruedInterest.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}
