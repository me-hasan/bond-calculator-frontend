export type BondStatus = 'Premium' | 'Discount' | 'Par'

export interface BondCalculationRequest {
  faceValue: number
  couponRate: number
  marketPrice: number
  yearsToMaturity: number
  frequency?: number // Payment frequency per year (default: 2 for semi-annual)
}

export interface CashflowRow {
  period: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface BondCalculationResponse {
  status: BondStatus
  yieldToMaturity: number
  presentValue: number
  macaulayDuration: number
  modifiedDuration: number
  cashflows: CashflowRow[]
  currentBondPrice: number
  accruedInterest: number
  dirtyPrice: number
}
