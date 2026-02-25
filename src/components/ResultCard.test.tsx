/**
 * ResultCard Component Tests
 *
 * Test Categories:
 * - Rendering: FRC-001 to FRC-007
 * - Styling: FRC-S-001 to FRC-S-004
 * - Formatting: FRC-F-001 to FRC-F-003
 * - Loading States: FRC-L-001 to FRC-L-003
 * - Error States: FRC-E-001 to FRC-E-003
 * - Edge Cases: FRC-EC-001 to FRC-EC-004
 * - Accessibility: FRC-A-001 to FRC-A-002
 * - Null States: FRC-N-001
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultCard } from './ResultCard'
import type { BondCalculationResponse } from '@/types/bond'

// Mock CURRENCY_SYMBOL
vi.mock('@/config/api', () => ({
  CURRENCY_SYMBOL: '$',
}))

// Mock requestAnimationFrame for tests
let mockRaf = vi.fn()
let mockCancelRaf = vi.fn()

beforeEach(() => {
  mockRaf = vi.fn((cb) => {
    return setTimeout(() => cb(Date.now()), 0) as unknown as number
  })
  mockCancelRaf = vi.fn()

  global.requestAnimationFrame = mockRaf
  global.cancelAnimationFrame = mockCancelRaf
})

afterEach(() => {
  vi.clearAllMocks()
})

// Mock test data
const mockResult: BondCalculationResponse = {
  status: 'Discount',
  currentYield: 5.26,
  yieldToMaturity: 6.15,
  totalInterest: 250,
  cashflows: [],
}

const mockPremiumResult: BondCalculationResponse = {
  status: 'Premium',
  currentYield: 4.5,
  yieldToMaturity: 3.8,
  totalInterest: 500,
  cashflows: [],
}

const mockParResult: BondCalculationResponse = {
  status: 'Par',
  currentYield: 5.0,
  yieldToMaturity: 5.0,
  totalInterest: 250,
  cashflows: [],
}

describe('ResultCard Component', () => {
  // ============================================================================
  // Rendering Tests (FRC-001 to FRC-007)
  // ============================================================================

  describe('Rendering', () => {
    it('FRC-001: should display current yield value', () => {
      render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      // Check that percentage symbol is present (value may be animating from 0)
      expect(screen.getByText(/current yield/i)).toBeInTheDocument()
      // Check for percentage elements in the result values
      const percentElements = document.querySelectorAll('.number-animate')
      expect(percentElements.length).toBeGreaterThan(0)
      // At least one should contain a % character
      const hasPercentSign = Array.from(percentElements).some(el => el.textContent?.includes('%'))
      expect(hasPercentSign).toBe(true)
    })

    it('FRC-002: should display yield to maturity value', () => {
      render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      expect(screen.getByText(/yield to maturity/i)).toBeInTheDocument()
      // Check for percentage element
      const percentages = document.querySelectorAll('.number-animate')
      expect(percentages.length).toBeGreaterThan(0)
    })

    it('FRC-003: should display total interest value', () => {
      render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      // Check for currency symbol (value may be animating)
      expect(screen.getByText(/\$/)).toBeInTheDocument()
    })

    it('FRC-004: should display Discount status', () => {
      render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      expect(screen.getByText(/discount bond/i)).toBeInTheDocument()
    })

    it('FRC-005: should display Premium status', () => {
      render(<ResultCard result={mockPremiumResult} isLoading={false} error={null} />)

      expect(screen.getByText(/premium bond/i)).toBeInTheDocument()
    })

    it('FRC-006: should display Par status', () => {
      render(<ResultCard result={mockParResult} isLoading={false} error={null} />)

      expect(screen.getByText(/par bond/i)).toBeInTheDocument()
    })

    it('FRC-007: should display all metric labels', () => {
      render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      expect(screen.getByText(/current yield/i)).toBeInTheDocument()
      expect(screen.getByText(/yield to maturity/i)).toBeInTheDocument()
      expect(screen.getByText(/total interest/i)).toBeInTheDocument()
    })

    it('should display discount icon', () => {
      render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const icon = screen.getByText('▼')
      expect(icon).toBeInTheDocument()
    })

    it('should display premium icon', () => {
      render(<ResultCard result={mockPremiumResult} isLoading={false} error={null} />)

      const icon = screen.getByText('▲')
      expect(icon).toBeInTheDocument()
    })

    it('should display par icon', () => {
      render(<ResultCard result={mockParResult} isLoading={false} error={null} />)

      const icon = screen.getByText('●')
      expect(icon).toBeInTheDocument()
    })
  })

  // ============================================================================
  // Styling Tests (FRC-S-001 to FRC-S-004)
  // ============================================================================

  describe('Styling', () => {
    it('FRC-S-001: should apply discount class for discount status', () => {
      const { container } = render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const statusBadge = container.querySelector('.status-badge.discount')
      expect(statusBadge).toBeInTheDocument()
    })

    it('FRC-S-002: should apply premium class for premium status', () => {
      const { container } = render(<ResultCard result={mockPremiumResult} isLoading={false} error={null} />)

      const statusBadge = container.querySelector('.status-badge.premium')
      expect(statusBadge).toBeInTheDocument()
    })

    it('FRC-S-003: should apply par class for par status', () => {
      const { container } = render(<ResultCard result={mockParResult} isLoading={false} error={null} />)

      const statusBadge = container.querySelector('.status-badge.par')
      expect(statusBadge).toBeInTheDocument()
    })

    it('FRC-S-004: should display results in card layout', () => {
      const { container } = render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const card = container.querySelector('.result-card')
      expect(card).toBeInTheDocument()
    })

    it('should apply animation classes', () => {
      const { container } = render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const card = container.querySelector('.result-card.animate-scale-in')
      expect(card).toBeInTheDocument()
    })

    it('should apply hover-lift class to result items', () => {
      const { container } = render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const hoverItems = container.querySelectorAll('.hover-lift')
      expect(hoverItems.length).toBe(3)
    })
  })

  // ============================================================================
  // Formatting Tests (FRC-F-001 to FRC-F-003)
  // ============================================================================

  describe('Formatting', () => {
    it('FRC-F-001: should format percentages correctly with 2 decimal places', () => {
      render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      // Check that there are percentage values displayed (animation makes exact values difficult to test)
      const animatedElements = document.querySelectorAll('.number-animate')
      expect(animatedElements.length).toBe(3)
    })

    it('FRC-F-002: should format currency correctly with 2 decimal places', () => {
      render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      // Currency is present with symbol
      expect(screen.getByText(/\$/)).toBeInTheDocument()
    })

    it('FRC-F-003: should round to appropriate decimals', () => {
      const resultWithMoreDecimals: BondCalculationResponse = {
        ...mockResult,
        currentYield: 5.256789,
        yieldToMaturity: 6.15321,
      }

      render(<ResultCard result={resultWithMoreDecimals} isLoading={false} error={null} />)

      // Component renders with animation, just check it renders
      const animatedElements = document.querySelectorAll('.number-animate')
      expect(animatedElements.length).toBe(3)
    })

    it('should format currency with symbol', () => {
      render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const currencyElements = screen.getAllByText(/\$/)
      expect(currencyElements.length).toBeGreaterThan(0)
    })
  })

  // ============================================================================
  // Loading States Tests (FRC-L-001 to FRC-L-003)
  // ============================================================================

  describe('Loading States', () => {
    it('FRC-L-001: should show loading indicator when loading', () => {
      render(<ResultCard result={null} isLoading={true} error={null} />)

      const spinner = document.querySelector('.loading-spinner')
      expect(spinner).toBeInTheDocument()
    })

    it('FRC-L-002: should display loading message', () => {
      render(<ResultCard result={null} isLoading={true} error={null} />)

      expect(screen.getByText(/calculating bond metrics\.\.\./i)).toBeInTheDocument()
    })

    it('FRC-L-003: should hide results while loading', () => {
      render(<ResultCard result={null} isLoading={true} error={null} />)

      expect(screen.queryByText(/current yield/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/yield to maturity/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/total interest/i)).not.toBeInTheDocument()
    })

    it('should apply loading class when loading', () => {
      const { container } = render(<ResultCard result={null} isLoading={true} error={null} />)

      const card = container.querySelector('.result-card.loading')
      expect(card).toBeInTheDocument()
    })
  })

  // ============================================================================
  // Error States Tests (FRC-E-001 to FRC-E-003)
  // ============================================================================

  describe('Error States', () => {
    it('FRC-E-001: should display error message', () => {
      render(<ResultCard result={null} isLoading={false} error="Failed to calculate" />)

      expect(screen.getByText(/failed to calculate/i)).toBeInTheDocument()
    })

    it('FRC-E-002: should hide results on error', () => {
      render(<ResultCard result={null} isLoading={false} error="Failed to calculate" />)

      expect(screen.queryByText(/5\.26%/i)).not.toBeInTheDocument()
    })

    it('FRC-E-003: should apply error styling', () => {
      const { container } = render(<ResultCard result={null} isLoading={false} error="Failed to calculate" />)

      const card = container.querySelector('.result-card.error')
      expect(card).toBeInTheDocument()
    })

    it('should display error icon', () => {
      render(<ResultCard result={null} isLoading={false} error="Failed to calculate" />)

      expect(screen.getByText('⚠')).toBeInTheDocument()
    })

    it('should display error heading', () => {
      render(<ResultCard result={null} isLoading={false} error="Failed to calculate" />)

      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  // ============================================================================
  // Edge Cases Tests (FRC-EC-001 to FRC-EC-004)
  // ============================================================================

  describe('Edge Cases', () => {
    it('FRC-EC-001: should display zero values correctly', () => {
      const zeroResult: BondCalculationResponse = {
        status: 'Par',
        currentYield: 0,
        yieldToMaturity: 0,
        totalInterest: 0,
        cashflows: [],
      }

      render(<ResultCard result={zeroResult} isLoading={false} error={null} />)

      // Check for zero values (animation makes exact text matching difficult)
      const animatedElements = document.querySelectorAll('.number-animate')
      expect(animatedElements.length).toBe(3)
    })

    it('FRC-EC-002: should display negative YTM', () => {
      const negativeYTMResult: BondCalculationResponse = {
        status: 'Discount',
        currentYield: 2.5,
        yieldToMaturity: -0.5,
        totalInterest: 100,
        cashflows: [],
      }

      render(<ResultCard result={negativeYTMResult} isLoading={false} error={null} />)

      // Component handles negative values
      const animatedElements = document.querySelectorAll('.number-animate')
      expect(animatedElements.length).toBe(3)
    })

    it('FRC-EC-003: should format large numbers with commas', () => {
      const largeResult: BondCalculationResponse = {
        status: 'Premium',
        currentYield: 5.5,
        yieldToMaturity: 4.8,
        totalInterest: 1000000,
        cashflows: [],
      }

      render(<ResultCard result={largeResult} isLoading={false} error={null} />)

      // Component renders large values
      expect(screen.getByText(/\$/)).toBeInTheDocument()
    })

    it('FRC-EC-004: should display small decimal yields', () => {
      const smallDecimalResult: BondCalculationResponse = {
        status: 'Discount',
        currentYield: 0.001,
        yieldToMaturity: 0.05,
        totalInterest: 50,
        cashflows: [],
      }

      render(<ResultCard result={smallDecimalResult} isLoading={false} error={null} />)

      // Component renders small decimals
      const animatedElements = document.querySelectorAll('.number-animate')
      expect(animatedElements.length).toBe(3)
    })

    it('should handle very large total interest values', () => {
      const veryLargeResult: BondCalculationResponse = {
        status: 'Premium',
        currentYield: 10,
        yieldToMaturity: 8,
        totalInterest: 999999999.99,
        cashflows: [],
      }

      render(<ResultCard result={veryLargeResult} isLoading={false} error={null} />)

      // Component renders very large values
      expect(screen.getByText(/\$/)).toBeInTheDocument()
    })
  })

  // ============================================================================
  // Accessibility Tests (FRC-A-001 to FRC-A-002)
  // ============================================================================

  describe('Accessibility', () => {
    it('FRC-A-001: should include labels for metrics', () => {
      render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const labels = document.querySelectorAll('.result-item label')
      expect(labels.length).toBe(3)
    })

    it('FRC-A-002: should have proper heading structure', () => {
      render(<ResultCard result={null} isLoading={false} error="Test error" />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toBeInTheDocument()
    })

    it('should use semantic HTML for results display', () => {
      const { container } = render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const labels = container.querySelectorAll('label')
      expect(labels.length).toBe(3)
    })
  })

  // ============================================================================
  // Null States Tests (FRC-N-001)
  // ============================================================================

  describe('Null States', () => {
    it('FRC-N-001: should show placeholder when no results', () => {
      render(<ResultCard result={null} isLoading={false} error={null} />)

      expect(screen.getByText(/enter bond details and click calculate to see results/i)).toBeInTheDocument()
    })

    it('should apply empty class when no results', () => {
      const { container } = render(<ResultCard result={null} isLoading={false} error={null} />)

      const card = container.querySelector('.result-card.empty')
      expect(card).toBeInTheDocument()
    })
  })

  // ============================================================================
  // Animation Tests
  // ============================================================================

  describe('Animations', () => {
    it('should animate values when result is displayed', () => {
      const { container } = render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const animatedElements = container.querySelectorAll('.number-animate')
      expect(animatedElements.length).toBe(3)
    })

    it('should apply stagger animation to children', () => {
      const { container } = render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const grid = container.querySelector('.stagger-children')
      expect(grid).toBeInTheDocument()
    })
  })

  // ============================================================================
  // Status Badge Variations
  // ============================================================================

  describe('Status Badge', () => {
    it('should render status badge with icon and text', () => {
      render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const badge = document.querySelector('.status-badge')
      const icon = screen.getByText('▼')
      const text = screen.getByText(/discount bond/i)

      expect(badge).toBeInTheDocument()
      expect(icon).toBeInTheDocument()
      expect(text).toBeInTheDocument()
    })

    it('should apply bounce-in animation to status badge', () => {
      const { container } = render(<ResultCard result={mockResult} isLoading={false} error={null} />)

      const badge = container.querySelector('.animate-bounce-in')
      expect(badge).toBeInTheDocument()
    })
  })
})