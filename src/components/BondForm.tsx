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

const SLIDER_CONFIGS = {
  faceValue: { min: 100, max: 1000000, step: 100, default: 10000 },
  couponRate: { min: 0, max: 20, step: 0.1, default: 5 },
  marketPrice: { min: 50, max: 200000, step: 50, default: 10000 },
  yearsToMaturity: { min: 0.1, max: 30, step: 0.1, default: 5 },
}

export function BondForm({ onSubmit, isLoading = false }: BondFormProps) {
  const [formData, setFormData] = useState<BondCalculationRequest>({
    faceValue: 0,
    couponRate: 0,
    marketPrice: 0,
    yearsToMaturity: 0,
    frequency: 2,
  })

  const [_sliderMode, _setSliderMode] = useState<Set<keyof BondCalculationRequest>>(new Set())
  const [focusedField, setFocusedField] = useState<keyof BondCalculationRequest | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof BondCalculationRequest, string>>>({})

  const validateForm = (currentData: BondCalculationRequest): boolean => {
    const newErrors: Partial<Record<keyof BondCalculationRequest, string>> = {}

    if (!currentData.faceValue || currentData.faceValue <= 0) {
      newErrors.faceValue = 'Face value must be greater than 0'
    }
    if (!currentData.couponRate || currentData.couponRate <= 0) {
      newErrors.couponRate = 'Coupon rate must be greater than 0'
    } else if (currentData.couponRate > 100) {
      newErrors.couponRate = 'Coupon rate must not exceed 100'
    }
    if (!currentData.marketPrice || currentData.marketPrice <= 0) {
      newErrors.marketPrice = 'Market price must be greater than 0'
    }
    if (!currentData.yearsToMaturity || currentData.yearsToMaturity <= 0) {
      newErrors.yearsToMaturity = 'Years to maturity must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm(formData)) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof BondCalculationRequest, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when value changes
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const renderInputWithSlider = (
    field: keyof BondCalculationRequest,
    label: string,
    id: string,
    _config: { min: number; max: number; step: number }
  ) => {
    const isFocused = focusedField === field

    return (
      <div className={`form-group ${isFocused ? 'focused' : ''}`}>
        <label htmlFor={id}>{label}</label>

        <input
          id={id}
          type="number"
          step="0.01"
          placeholder={`Enter ${label.toLowerCase()}`}
          value={formData[field] === 0 ? '' : formData[field]}
          onChange={(e) => {
            const val = e.target.value
            handleChange(field, val === '' ? 0 : parseFloat(val))
          }}
          disabled={isLoading}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
        />

        {errors[field] && <span className="error animate-shake">{errors[field]}</span>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bond-form">
      {renderInputWithSlider('faceValue', 'Face Value', 'faceValue', SLIDER_CONFIGS.faceValue)}

      {renderInputWithSlider('couponRate', 'Coupon Rate %', 'couponRate', SLIDER_CONFIGS.couponRate)}

      {renderInputWithSlider('marketPrice', 'Market Price', 'marketPrice', SLIDER_CONFIGS.marketPrice)}

      {renderInputWithSlider('yearsToMaturity', 'Years to Maturity', 'yearsToMaturity', SLIDER_CONFIGS.yearsToMaturity)}

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