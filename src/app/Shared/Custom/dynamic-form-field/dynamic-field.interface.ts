export interface DynamicField {
  id: number
  created_at: string
  modified_at: string
  field_name: string
  field_type: "Text" | "Email" | "Number" | "Phone" | "File" | "Select" | "Textarea" | "Date" | "Checkbox" | "Radio"
  required: boolean
  active: boolean
  country: number
  options?: string[] // For select, radio fields
  placeholder?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    minLength?: number
    maxLength?: number
  }
}

export interface DynamicFormValue {
  [key: string]: any
}
