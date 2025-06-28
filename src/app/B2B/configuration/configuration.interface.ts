
export interface Scope {
  id: number
  scope: string
  active: boolean
  merchant: string
  description: string
  transactions: number
  volume: string
}

export interface Fee {
  id: number
  scope: string
  feeType: string
  chargeType: string
  value: number
  minValue: number
  maxValue: number
  provider: string
  status: string
}

export interface MobileCredential {
  id: number
  provider: string
  shortCode: string
  billType: string
  status: boolean
  isDefault: boolean
  lastUsed: string
  transactions: number
}

export interface Webhook {
  id: number
  name: string
  url: string
  active: boolean
  lastTriggered: string
  successRate: number
  totalCalls: number
}

export interface Stat {
  label: string
  value: string
  change: string
  icon: string
  color: string
}
