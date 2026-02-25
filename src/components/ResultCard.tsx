import { useState, useEffect, useRef } from 'react'
import type { BondCalculationResponse } from '@/types/bond'
import { CURRENCY_SYMBOL } from '@/config/api'

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

// Number counter animation hook
function useCounter(end: number, duration: number = 1000, start: number = 0) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const frameRef = useRef<number>()
  const startTimeRef = useRef<number>()

  useEffect(() => {
    if (!isVisible) return

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = timestamp - startTimeRef.current
      const percentage = Math.min(progress / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4)
      const currentCount = start + (end - start) * easeOutQuart

      setCount(currentCount)

      if (percentage < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [end, duration, start, isVisible])

  return { count, setIsVisible }
}

function AnimatedValue({ value, decimals = 2, suffix = '', prefix = '' }: { value: number, decimals?: number, suffix?: string, prefix?: string }) {
  const { count, setIsVisible } = useCounter(value, 1200)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [setIsVisible])

  return (
    <span className="number-animate">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  )
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

  const statusClass = STATUS_COLORS[result.status] || ''

  return (
    <div className="result-card animate-scale-in">
      <div className={`status-badge ${statusClass} animate-bounce-in`}>
        <span className="status-icon">
          {result.status === 'Premium' && '▲'}
          {result.status === 'Discount' && '▼'}
          {result.status === 'Par' && '●'}
        </span>
        {result.status} Bond
      </div>

      <div className="results-grid stagger-children">
        <div className="result-item animate-slide-up hover-lift">
          <label>Current Yield</label>
          <div className="result-value">
            <AnimatedValue value={result.currentYield} suffix="%" />
          </div>
        </div>

        <div className="result-item animate-slide-up hover-lift">
          <label>Yield to Maturity</label>
          <div className="result-value">
            <AnimatedValue value={result.yieldToMaturity} suffix="%" />
          </div>
        </div>

        <div className="result-item animate-slide-up hover-lift">
          <label>Total Interest</label>
          <div className="result-value">
            <AnimatedValue value={result.totalInterest} prefix={CURRENCY_SYMBOL} />
          </div>
        </div>
      </div>
    </div>
  )
}
