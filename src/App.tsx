import { useState } from 'react'
import { BondForm } from './components/BondForm'
import { ResultCard } from './components/ResultCard'
import { CashflowTable } from './components/CashflowTable'
import { bondApi, ApiError, NetworkError } from './services/bondApi'
import type { BondCalculationRequest, BondCalculationResponse } from './types/bond'
import './components/BondForm.css'
import './components/ResultCard.css'
import './components/CashflowTable.css'
import './App.css'

function App() {
  const [result, setResult] = useState<BondCalculationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = async (data: BondCalculationRequest) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await bondApi.calculateBond(data)
      setResult(response)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Server Error (${err.statusCode}): ${err.message}`)
      } else if (err instanceof NetworkError) {
        setError(`Network Error: ${err.message}`)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      console.error('Calculation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bond Calculator</h1>
        <p className="subtitle">Calculate bond metrics, yield to maturity, and cashflow schedules</p>
      </header>

      <main className="app-main">
        <div className="form-section">
          <BondForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>

        {(result || error || isLoading) && (
          <div className="results-section">
            <ResultCard result={result} isLoading={isLoading} error={error} />

            {result && result.cashflows && result.cashflows.length > 0 && (
              <CashflowTable cashflows={result.cashflows} />
            )}
          </div>
        )}

        {result && !isLoading && (
          <div className="actions-section">
            <button onClick={handleReset} className="reset-button">
              Calculate Another Bond
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Bond Calculator &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
