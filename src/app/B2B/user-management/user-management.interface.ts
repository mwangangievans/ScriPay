export interface User {
  created_at: string
  id: number
  merchant: {
    address: string
    created_at: string
    email: string
    id: number
    location: string
    modified_at: string
    name: string
    logo: string
    active: boolean
  }
  modified_at: string
  user: {
    fullname: string
    id: number
    email: string
    phone_number: string
  }
  profile: string
  active: boolean
}

export interface Role {
  id: number
  created_at: string
  modified_at: string
  name: string
  access: "Internal" | "External"
  status: boolean
  merchant: number | null
}

export interface PermissionRole {
  created_at: string
  id: number
  modified_at: string
  permission: {
    created_at: string
    id: number
    modified_at: string
    name: string
    access: "Internal" | "External"
    status: boolean
  }
  role: {
    created_at: string
    id: number
    merchant: number
    modified_at: string
    name: string
    access: "Internal" | "External"
    status: boolean
  }
  status: boolean
}

export interface PaginationResult<T> {
  data: T[]
  totalCount: number
  hasMore: boolean
  currentPage: number
}
