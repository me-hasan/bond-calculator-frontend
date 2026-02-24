import { useState } from 'react'
import type { BondCalculationRequest } from '@/types/bond'

interface BondFormProps {
  onSubmit: (data: BondCalculationRequest) => void
  isLoading?: boolean
}

const FREQUENCY_OPTIONS = [
  { value: 1, label: 'Annual' },
  { value: 2, label: 'Semi-Annual' },
]

export function BondForm({ onSubmit, isLoading = false }: BondFormProps) {
  const [formData, setFormData] = useState<BondCalculationRequest>({
    faceValue: 0,
    couponRate: 0,
    marketPrice: 0,
    yearsToMaturity: 0,
    frequency: 2, // Default to Semi-Annual
  })

  const [errors, setErrors] = useState<Partial<Record<keyof BondCalculationRequest, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BondCalculationRequest, string>> = {}

    if (!formData.faceValue || formData.faceValue <= 0) {
      newErrors.faceValue = 'Face value must be greater than 0'
    }
    if (!formData.couponRate || formData.couponRate <= 0) {
      newErrors.couponRate = 'Coupon rate must be greater than 0'
    }
    if (!formData.marketPrice || formData.marketPrice <= 0) {
      newErrors.marketPrice = 'Market price must be greater than 0'
    }
    if (!formData.yearsToMaturity || formData.yearsToMaturity <= 0) {
      newErrors.yearsToMaturity = 'Years to maturity must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof BondCalculationRequest, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bond-form">
      <div className="form-group">
        <label htmlFor="faceValue">Face Value</label>
        <input
          id="faceValue"
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter face value"
          value={formData.faceValue || ''}
          onChange={(e) => handleChange('faceValue', parseFloat(e.target.value) || 0)}
          disabled={isLoading}
        />
        {errors.faceValue && <span className="error">{errors.faceValue}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="couponRate">Coupon Rate %</label>
        <input
          id="couponRate"
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="Enter coupon rate"
          value={formData.couponRate || ''}
          onChange={(e) => handleChange('couponRate', parseFloat(e.target.value) || 0)}
          disabled={isLoading}
        />
        {errors.couponRate && <span className="error">{errors.couponRate}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="marketPrice">Market Price</label>
        <input
          id="marketPrice"
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter market price"
          value={formData.marketPrice || ''}
          onChange={(e) => handleChange('marketPrice', parseFloat(e.target.value) || 0)}
          disabled={isLoading}
        />
        {errors.marketPrice && <span className="error">{errors.marketPrice}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="yearsToMaturity">Years to Maturity</label>
        <input
          id="yearsToMaturity"
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter years to maturity"
          value={formData.yearsToMaturity || ''}
          onChange={(e) => handleChange('yearsToMaturity', parseFloat(e.target.value) || 0)}
          disabled={isLoading}
        />
        {errors.yearsToMaturity && <span className="error">{errors.yearsToMaturity}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="frequency">Coupon Frequency</label>
        <select
          id="frequency"
          value={formData.frequency}
          onChange={(e) => handleChange('frequency', parseInt(e.target.value))}
          disabled={isLoading}
        >
          {FREQUENCY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? 'Calculating...' : 'Calculate'}
      </button>
    </form>
  )
}
