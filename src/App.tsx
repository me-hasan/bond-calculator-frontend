import { useState } from 'react'
import { BondForm } from './components/BondForm'
import { ResultCard } from './components/ResultCard'
import { CashflowTable } from './components/CashflowTable'
import { ErrorBoundary } from './components/ErrorBoundary'
import { bondService, ApiError, NetworkError, ValidationError } from './api'
import type { BondCalculationRequest, BondCalculationResponse } from './types/bond'
import './components/BondForm.css'
import './components/ResultCard.css'
import './components/CashflowTable.css'
import './components/ErrorBoundary.css'
import './App.css'

function AppContent() {
  const [result, setResult] = useState<BondCalculationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = async (data: BondCalculationRequest) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await bondService.calculateBond(data)
      setResult(response as BondCalculationResponse)
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(`Validation Error: ${err.message}`)
      } else if (err instanceof ApiError) {
        const errorMsg = `Server Error (${err.statusCode}): ${err.message}`
        setError(errorMsg)
        // Log additional details for debugging
        if (err.details) {
          console.error('Server error details:', err.details)
        }
        // Log the full request that was sent
        console.error('Request data:', data)
        console.error('Request URL:', `${import.meta.env.VITE_API_BASE_URL}/bond/calculate`)
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

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}

export default App
