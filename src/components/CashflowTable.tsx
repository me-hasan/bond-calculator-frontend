import type { CashflowRow } from '@/types/bond'

interface CashflowTableProps {
  cashflows: CashflowRow[]
  startDate?: Date
  frequency?: number
}

export function CashflowTable({ cashflows, startDate = new Date(), frequency = 2 }: CashflowTableProps) {
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

  const calculatePaymentDate = (period: number): Date => {
    const monthsPerPeriod = 12 / frequency
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + (period - 1) * monthsPerPeriod)
    return date
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const formatType = (type: string): string => {
    return type === 'coupon' ? 'Coupon' : 'Principal'
  }

  const getTypeClass = (type: string): string => {
    return type === 'coupon' ? 'type-coupon' : 'type-principal'
  }

  const totalPresentValue = cashflows.reduce((sum, cf) => sum + cf.presentValue, 0)
  const totalAmount = cashflows.reduce((sum, cf) => sum + cf.amount, 0)

  return (
    <div className="cashflow-table-container">
      <h3 className="table-title">Cashflow Schedule</h3>
      <div className="table-wrapper">
        <table className="cashflow-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Payment Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Present Value</th>
            </tr>
          </thead>
          <tbody>
            {cashflows.map((row, index) => {
              const paymentDate = calculatePaymentDate(row.period)

              return (
                <tr key={index}>
                  <td className="cell-period">{row.period}</td>
                  <td className="cell-date">{formatDate(paymentDate)}</td>
                  <td className={`cell-type ${getTypeClass(row.type)}`}>{formatType(row.type)}</td>
                  <td className="cell-amount">{formatCurrency(row.amount)}</td>
                  <td className="cell-pv">{formatCurrency(row.presentValue)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span className="total-periods">Total Periods: {cashflows.length}</span>
        <span className="total-amount">
          Total Amount: {formatCurrency(totalAmount)}
        </span>
        <span className="total-pv">
          Total Present Value: {formatCurrency(totalPresentValue)}
        </span>
      </div>
    </div>
  )
}
