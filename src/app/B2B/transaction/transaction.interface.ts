export interface Transaction {
  id: number
  order_id: string
  rrn: string
  status: TransactionStatus
  purpose: TransactionPurpose
  currency: string
  amount: string
  fee: string
  provider_ref?: string
  narration: string
  description?: string
  created_at: string
  date_completed?: string
  is_completed: boolean
  channel: PaymentChannel
  customer_phone: string
  merchant_name: string
  callback_url?: string
  checkout_request_id?: string
  merchant_request_id?: string
  ip?: string
  merchant: number
  credential: number
}

export type TransactionStatus = "Success" | "Pending" | "Failed" | "Processing" | "Cancelled" | "Reversed"
export type TransactionPurpose = "Collection" | "Payout" | "P2P"
export type PaymentChannel = "Mpesa" | "AirtelMoney" | "Card" | "Bank" | "Wallet"

export interface TransactionSummary {
  totalAmount: number
  totalFees: number
  successfulTransactions: number
  pendingTransactions: number
}

export interface TransactionFilters {
  searchTerm: string
  statusFilter: string
  purposeFilter: string
  channelFilter: string
}
