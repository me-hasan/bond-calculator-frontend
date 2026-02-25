import { useState } from 'react'
import { BondForm } from './components/BondForm'
import { ResultCard } from './components/ResultCard'
import { CashflowTable } from './components/CashflowTable'
import { ErrorBoundary } from './components/ErrorBoundary'
import { bondService, ApiError, NetworkError, ValidationError } from './api'
import type { BondCalculationRequest, BondCalculationResponse } from './types/bond'
import './styles/index.css'

function AppContent() {
  const [result, setResult] = useState<BondCalculationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRequest, setLastRequest] = useState<BondCalculationRequest | null>(null)

  const handleFormSubmit = async (data: BondCalculationRequest) => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setLastRequest(data)

    try {
      // Single API call that returns both metrics and cashflow schedule
      const response = await bondService.calculateBond(data)
      setResult(response)
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(`Validation Error: ${err.message}`)
      } else if (err instanceof ApiError) {
        const errorMsg = `Server Error (${err.statusCode}): ${err.message}`
        setError(errorMsg)
        if (err.details) {
          console.error('Server error details:', err.details)
        }
        console.error('Request data:', data)
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

        <div className="results-wrapper">
          {(result || error || isLoading) && (
            <div className="results-section">
              <ResultCard result={result} isLoading={isLoading} error={error} />

              {result && result.cashflows && result.cashflows.length > 0 && (
                <CashflowTable cashflows={result.cashflows} faceValue={lastRequest?.faceValue} />
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Bond Calculator &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}

export default App