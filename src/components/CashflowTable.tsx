import type { CashflowRow } from '@/types/bond'
import { CURRENCY_SYMBOL } from '@/config/api'

interface CashflowTableProps {
  cashflows: CashflowRow[]
  faceValue?: number
}

export function CashflowTable({ cashflows, faceValue = 0 }: CashflowTableProps) {
  if (!cashflows || cashflows.length === 0) {
    return (
      <div className="cashflow-table-container empty">
        <div className="empty-state">
          <p>No cashflow data available</p>
          <p className="empty-hint">Calculate bond details to see cashflow schedule</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value).replace(/^/, CURRENCY_SYMBOL)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  // Calculate totals
  const totalCouponPayments = cashflows.reduce((sum, cf) => sum + (cf.couponPayment || 0), 0)
  const lastCumulativeInterest = cashflows.length > 0 ? cashflows[cashflows.length - 1].cumulativeInterest || 0 : 0
  const totalPayments = totalCouponPayments + faceValue

  return (
    <div className="cashflow-table-container">
      <h3 className="table-title">Cashflow Schedule</h3>
      <div className="table-wrapper">
        <table className="cashflow-table">
          <thead>
            <tr>
              <th className="text-center">Period</th>
              <th>Payment Date</th>
              <th className="text-right">Coupon Payment</th>
              <th className="text-right">Cumulative Interest</th>
              <th className="text-right">Remaining Principal</th>
            </tr>
          </thead>
          <tbody>
            {cashflows.map((row, index) => {
              const isLastRow = index === cashflows.length - 1
              const couponPayment = row.couponPayment || 0

              return (
                <tr key={index} className={isLastRow ? 'row-principal' : ''}>
                  <td className="cell-period">{row.period}</td>
                  <td className="cell-date">{formatDate(row.paymentDate)}</td>
                  <td className="cell-coupon">{couponPayment > 0 ? formatCurrency(couponPayment) : '-'}</td>
                  <td className="cell-cumulative">{formatCurrency(row.cumulativeInterest)}</td>
                  <td className="cell-principal">{formatCurrency(row.remainingPrincipal)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span className="total-periods">Total Periods: {cashflows.length}</span>
        <span className="total-amount">
          Total Interest: {formatCurrency(lastCumulativeInterest)}
        </span>
        <span className="total-amount">
          Total Payments: {formatCurrency(totalPayments)}
        </span>
      </div>
    </div>
  )
}