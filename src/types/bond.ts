export type BondStatus = 'Premium' | 'Discount' | 'Par'

export interface BondCalculationRequest {
  faceValue: number
  couponRate: number
  marketPrice: number
  yearsToMaturity: number
  frequency?: number // Payment frequency per year (default: 2 for semi-annual)
}

export type CashflowType = 'coupon' | 'principal'

export interface CashflowRow {
  period: number
  type: CashflowType
  amount: number
  presentValue: number
}

export interface BondCalculationResponse {
  status: BondStatus
  currentYield: number
  yieldToMaturity: number
  totalInterest: number
  cashflows: CashflowRow[]
}
