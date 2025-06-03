export interface StepData {
  id: number
  title: string
  description: string
  icon: string
  color: string
}

export interface OnboardingFormData {
  // Business Info
  businessName: string
  businessEmail: string
  businessAddress: string
  businessLocation: string
  logo: File | null

  // Owner Info
  country: string
  firstName: string
  lastName: string
  dob: string
  nationalId: string
  personalEmail: string
  personalPhone: string

  // Bank Info
  bankName: string
  accountNumber: string
  accountName: string
  branchCode: string
  currency: string
  swiftCode: string

  // Auth
  otp: string
}

export interface Country {
  value: string
  label: string
}

export interface Currency {
  value: string
  label: string
}
