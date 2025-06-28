export interface Wallet {
  id: number
  merchant: Merchant
  created_at: string
  modified_at: string
  number: string
  address: string
  type: WalletType
  balance: string
  processing_balance: string
  name: string
  description: string
  checksum: string
  status: WalletStatus
  currency: number
}

export interface WalletManager {
  id: number
  staff: Staff
  wallet: Wallet
  created_at: string
  modified_at: string
  status: boolean
}

export interface Staff {
  id: number
  user: User
  merchant: Merchant
  created_at: string
  modified_at: string
  profile: string
  active: boolean
}

export interface User {
  id: number
  email: string
  phone_number: string
  fullname: string
}

export interface Merchant {
  id: number
  created_at: string
  modified_at: string
  name: string
  email: string
  location: string
  address: string
  logo: string
  active: boolean
}

export type WalletType = "Business" | "Personal" | "Whitelabel"
export type WalletStatus = "Active" | "Suspended"

export interface WalletCreateRequest {
  merchant: number
  name: string
  description: string
  currency: number
  type: WalletType
}

export interface WalletManagerCreateRequest {
  staff: number
  wallet: number
}

export interface WalletUpdateRequest {
  status: boolean
}

export interface WalletSummary {
  totalWallets: number
  activeWallets: number
  suspendedWallets: number
  totalBalance: number
  processingBalance: number
  businessWallets: number
  personalWallets: number
  whitelabelWallets: number
}

export interface WalletFilters {
  searchTerm: string
  statusFilter: string
  typeFilter: string
  merchantFilter: string
}
