import type { BondStatus } from '@/types/bond'

interface IndicatorProps {
  status: BondStatus
  size?: 'small' | 'medium' | 'large'
}

const STATUS_CONFIG = {
  Premium: {
    label: 'Premium',
    className: 'premium',
    icon: '▲',
  },
  Discount: {
    label: 'Discount',
    className: 'discount',
    icon: '▼',
  },
  Par: {
    label: 'Par',
    className: 'par',
    icon: '●',
  },
} as const

const SIZE_CLASSES = {
  small: 'indicator-small',
  medium: 'indicator-medium',
  large: 'indicator-large',
} as const

export function Indicator({ status, size = 'medium' }: IndicatorProps) {
  const config = STATUS_CONFIG[status]
  const sizeClass = SIZE_CLASSES[size]

  return (
    <div className={`indicator ${config.className} ${sizeClass}`}>
      <span className="indicator-icon">{config.icon}</span>
      <span className="indicator-label">{config.label}</span>
    </div>
  )
}
