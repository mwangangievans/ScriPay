
export interface User {
  id: number
  user: {
    id: number
    email: string
    fullname: string
    username: string
    phone_number: string
  }
  merchant: {
    id: number
    name: string
    email: string
    location: string
    address: string
    logo: string
    active: boolean
  }
  created_at: string
  modified_at: string
  profile: any
  active: boolean
}

export interface UserRole {
  id: number
  user: {
    id: number
    email: string
    phone_number: string
    fullname: string
  }
  role: {
    id: number
    created_at: string
    modified_at: string
    name: string
    access: string
    status: boolean
    merchant: any
  }
  created_at: string
  modified_at: string
  status: boolean
  assigned_by: number
}
