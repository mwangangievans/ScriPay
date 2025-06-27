import { Component, type OnDestroy, type OnInit } from "@angular/core"
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { animate, style, transition, trigger } from "@angular/animations"
import { Subscription } from "rxjs"
import { LocalstorageService } from "../../service/localstorage.service"
import { OnboardingService } from "../../service/onboarding.service"
import { CountrySelectorComponent } from "../../Shared/Custom/country-selector/country-selector.component"
import { DynamicFormFieldComponent } from "../../Shared/Custom/dynamic-form-field/dynamic-form-field.component"
import { HttpService } from "../../service/http.service"
import type { UserObject } from "../../Shared/Auth/user.interface"
import { HttpHeaders } from "@angular/common/http"
import type { submittedKycs } from "./kyc.interface"
import { CommonModule } from "@angular/common"

export interface Countries {
  id: number
  name: string
  code: number
  currency: string
  logo: string
  timezone: string
  active: boolean
  created_at: string
  modified_at: string
}

export interface DynamicField {
  id: number
  field_name: string
  field_type: "Text" | "Email" | "Phone" | "Number" | "Date" | "Textarea" | "Select" | "Checkbox" | "Radio" | "File"
  required: boolean
  active: boolean
  country: number
  options?: string[]
  placeholder?: string
}

export interface Pagination<T> {
  status: number
  results: T[]
  count: number
}

type FieldStatus = "approved" | "pending" | "rejected" | "not_submitted"

@Component({
  selector: "app-kyc-info",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CountrySelectorComponent, DynamicFormFieldComponent],
  animations: [
    trigger("fadeSlide", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(30px)" }),
        animate("500ms cubic-bezier(0.4, 0, 0.2, 1)", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [
        animate("300ms cubic-bezier(0.4, 0, 0.2, 1)", style({ opacity: 0, transform: "translateY(-20px)" })),
      ]),
    ]),
  ],
  templateUrl: "./kyc-info.component.html",
  styleUrls: ["./kyc-info.component.css"],
})
export class KycInfoComponent implements OnInit, OnDestroy {
  form: FormGroup
  countries: Countries[] = []
  submittedKycs: submittedKycs[] = []
  fields: DynamicField[] = []
  currentStep = 2
  isLoading = false
  userObject: UserObject
  selectedDocument: submittedKycs | null = null
  private apiSubscriptions: Subscription[] = []
  private subscription: Subscription = new Subscription()
  hasSubmittedAnyField = false
  private submittingFields: Set<number> = new Set()

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalstorageService,
    private onboardingService: OnboardingService,
    private httpService: HttpService,
  ) {
    this.userObject = this.localStorageService.get("userObject")
    this.form = this.fb.group({
      country: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadFormData()
    this.getCountries()
    this.loadSubmittedKyc()
    this.subscription.add(
      this.form.statusChanges.subscribe((status) => {
        this.localStorageService.set("kycInfoFormData", JSON.stringify(this.form.value))
        this.onboardingService.setStepValidity(2, status === "VALID")
      }),
    )
  }

  ngOnDestroy(): void {
    this.apiSubscriptions.forEach((sub) => sub.unsubscribe())
    this.subscription.unsubscribe()
    this.form.reset()
    this.countries = []
    this.submittingFields.clear()
  }

  private loadFormData() {
    const savedData = this.localStorageService.get("kycInfoFormData")
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        this.form.patchValue(data)
        if (data.country) {
          this.getFieldsByCountry(data.country)
        }
      } catch (e) {
        console.error("Error parsing saved KYC form data", e)
      }
    }
  }

  getCountries(): void {
    const url = "settings/counties"
    const subscription = this.httpService.get<Pagination<Countries>>(url).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.results) {
          this.countries = response.body.results
        }
      },
      error: (error) => {
        console.error("Error fetching countries:", error)
      },
    })
    this.apiSubscriptions.push(subscription)
  }

  loadSubmittedKyc() {
    const url = "onboarding/kycs"
    const subscription = this.httpService.get<Pagination<submittedKycs>>(url).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.results) {
          this.submittedKycs = response.body.results
          this.updateSubmissionStatus()
        }
      },
      error: (error) => {
        console.error("Error fetching submitted KYCs:", error)
      },
    })
    this.apiSubscriptions.push(subscription)
  }

  private updateSubmissionStatus(): void {
    const selectedCountryId = this.form.get("country")?.value
    if (selectedCountryId && this.fields.length > 0) {
      const countryFields = this.fields.filter((field) => field.country === selectedCountryId)
      this.hasSubmittedAnyField = countryFields.some((field) =>
        this.submittedKycs.some((kyc) => kyc.mapper.id === field.id),
      )
    }
  }

  getFieldsByCountry(countryId: number): void {
    this.isLoading = true
    const url = `onboarding/requirements?country__id=${countryId}`
    const subscription = this.httpService.get<Pagination<DynamicField>>(url).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.results) {
          this.fields = response.body.results
          this.updateFormControls()
          this.updateSubmissionStatus()
        }
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error fetching fields:", error)
        this.isLoading = false
      },
    })
    this.apiSubscriptions.push(subscription)
  }

  updateFormControls(): void {
    Object.keys(this.form.controls).forEach((key) => {
      if (key !== "country") {
        this.form.removeControl(key)
      }
    })

    this.fields.forEach((field) => {
      const controlName = this.convertToSnakeCase(field.field_name)
      const validators = field.required ? [Validators.required] : []

      if (field.field_name === "KRA Number") {
        validators.push(Validators.pattern(/^[A-Z0-9]{10,11}$/))
      } else if (field.field_type === "Email") {
        validators.push(Validators.email)
      } else if (field.field_type === "Phone") {
        validators.push(Validators.pattern(/^[+]?[1-9][\d]{0,15}$/))
      }

      this.form.addControl(controlName, new FormControl("", validators))
    })
  }

  onCountrySelected(country: Countries): void {
    this.form.get("country")?.setValue(country.id)
    this.getFieldsByCountry(country.id)
  }

  getCountryError(): string {
    const countryControl = this.form.get("country")
    if (countryControl?.hasError("required") && countryControl?.touched) {
      return "Please select your country to continue"
    }
    return ""
  }

  convertToSnakeCase(input: string): string {
    return input.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "")
  }

  getFormControl(field: DynamicField): FormControl {
    const control = this.form.get(this.convertToSnakeCase(field.field_name))
    return control as FormControl
  }

  getFieldError(field: DynamicField): string {
    const control = this.getFormControl(field)
    if (control?.invalid && control?.touched) {
      if (control.hasError("required")) return `${field.field_name} is required`
      if (control.hasError("email")) return "Please enter a valid email address"
      if (control.hasError("pattern")) {
        if (field.field_name === "KRA Number") return "KRA Number must be 10-11 alphanumeric characters"
        if (field.field_type === "Phone") return "Please enter a valid phone number"
        return `Invalid ${field.field_name.toLowerCase()} format`
      }
    }
    return ""
  }

  // Enhanced status-based methods
  getFieldStatus(fieldId: number): FieldStatus {
    const submittedKyc = this.submittedKycs.find((kyc) => kyc.mapper.id === fieldId)
    if (!submittedKyc) return "not_submitted"

    if (submittedKyc.approved === true) return "approved"
    if (submittedKyc.approved === false) return "pending"
    return "rejected" // null or undefined means rejected
  }

  getSubmittedDocument(fieldId: number): submittedKycs | null {
    return this.submittedKycs.find((kyc) => kyc.mapper.id === fieldId) || null
  }

  getStatusText(fieldId: number): string {
    const status = this.getFieldStatus(fieldId)
    switch (status) {
      case "approved":
        return "Approved"
      case "pending":
        return "Under Review"
      case "rejected":
        return "Rejected - Resubmit Required"
      case "not_submitted":
        return "Not Submitted"
      default:
        return "Unknown"
    }
  }

  getButtonText(fieldId: number): string {
    const status = this.getFieldStatus(fieldId)
    switch (status) {
      case "approved":
        return "Approved"
      case "pending":
        return "Under Review"
      case "rejected":
        return "Resubmit Document"
      case "not_submitted":
        return "Submit Document"
      default:
        return "Submit"
    }
  }

  getButtonClasses(fieldId: number): string {
    const status = this.getFieldStatus(fieldId)
    const baseClasses = "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"

    switch (status) {
      case "approved":
        return `bg-gradient-to-r from-emerald-500 to-green-500 cursor-default ${baseClasses}`
      case "pending":
        return `bg-gradient-to-r from-yellow-500 to-amber-500 cursor-default ${baseClasses}`
      case "rejected":
        return `bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 ${baseClasses}`
      case "not_submitted":
        return `bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 hover:from-purple-600 hover:via-violet-600 hover:to-indigo-600 ${baseClasses}`
      default:
        return `bg-gray-400 ${baseClasses}`
    }
  }

  canSubmitField(field: DynamicField): boolean {
    const status = this.getFieldStatus(field.id)
    if (status === "approved" || status === "pending") return false
    if (this.isFieldSubmitting(field.id)) return false

    const control = this.getFormControl(field)
    return control?.valid || false
  }

  isFieldSubmitting(fieldId: number): boolean {
    return this.submittingFields.has(fieldId)
  }

  // Progress calculation methods
  getCountryFieldsCount(): number {
    const selectedCountryId = this.form.get("country")?.value
    if (!selectedCountryId) return 0
    return this.fields.filter((field) => field.country === selectedCountryId).length
  }

  getSubmittedCount(): number {
    const selectedCountryId = this.form.get("country")?.value
    if (!selectedCountryId) return 0

    const countryFields = this.fields.filter((field) => field.country === selectedCountryId)
    return countryFields.filter((field) => this.submittedKycs.some((kyc) => kyc.mapper.id === field.id)).length
  }

  getApprovedCount(): number {
    const selectedCountryId = this.form.get("country")?.value
    if (!selectedCountryId) return 0

    const countryFields = this.fields.filter((field) => field.country === selectedCountryId)
    return countryFields.filter((field) => this.getFieldStatus(field.id) === "approved").length
  }

  getPendingCount(): number {
    const selectedCountryId = this.form.get("country")?.value
    if (!selectedCountryId) return 0

    const countryFields = this.fields.filter((field) => field.country === selectedCountryId)
    return countryFields.filter((field) => this.getFieldStatus(field.id) === "pending").length
  }

  getRemainingCount(): number {
    return this.getCountryFieldsCount() - this.getSubmittedCount()
  }

  getOverallProgress(): number {
    const total = this.getCountryFieldsCount()
    if (total === 0) return 0
    return (this.getSubmittedCount() / total) * 100
  }

  getApprovedProgress(): number {
    const total = this.getCountryFieldsCount()
    if (total === 0) return 0
    return (this.getApprovedCount() / total) * 100
  }

  getPendingProgress(): number {
    const total = this.getCountryFieldsCount()
    if (total === 0) return 0
    return (this.getPendingCount() / total) * 100
  }

  // Document viewing
  viewDocument(document: submittedKycs): void {
    this.selectedDocument = document
  }

  closeDocumentViewer(): void {
    this.selectedDocument = null
  }

  private prepareFieldData(field: DynamicField, controlValue: any): object {
    if (!this.userObject?.merchant?.id) {
      throw new Error("User merchant ID is not available")
    }

    return {
      mapper: field.id,
      merchant: this.userObject.merchant.id,
      [field.field_type === "File" ? "file_value" : "text_value"]: controlValue,
    }
  }

  async onFieldSubmit(field: DynamicField): Promise<void> {
    const controlName = this.convertToSnakeCase(field.field_name)
    const control = this.form.get(controlName)

    if (!this.canSubmitField(field)) {
      control?.markAsTouched()
      return
    }

    this.submittingFields.add(field.id)

    try {
      const fieldData = this.prepareFieldData(field, control?.value)

      let response
      if (field.field_type === "File" && control?.value) {
        const formData = new FormData()
        Object.entries(fieldData).forEach(([key, value]) => {
          if (key === "file_value" && value instanceof File) {
            formData.append(key, value, value.name)
          } else {
            formData.append(key, value as any)
          }
        })
        response = await this.httpService.post("onboarding/kycs", formData).toPromise()
      } else {
        const urlSearchParams = new URLSearchParams()
        Object.entries(fieldData).forEach(([key, value]) => {
          urlSearchParams.append(key, value as string)
        })
        response = await this.httpService
          .post("onboarding/kycs", urlSearchParams.toString(), {
            headers: new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded" }),
          })
          .toPromise()
      }

      if (response?.status === 200) {
        const responseBody = response.body
        const kycId =
          responseBody && typeof responseBody === "object" && "id" in responseBody
            ? (responseBody as any).id
            : Date.now()

        // Check if this is an update (resubmission) or new submission
        const existingKycIndex = this.submittedKycs.findIndex((kyc) => kyc.mapper.id === field.id)

        const newKyc: submittedKycs = {
          id: kycId,
          mapper: this.fields.find((f) => f.id === field.id) as any,
          merchant: this.userObject.merchant,
          text_value: field.field_type !== "File" ? control?.value : null,
          file_value: field.field_type === "File" ? control?.value : null,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
          approved: false, // New submissions start as pending (false)
        }

        if (existingKycIndex >= 0) {
          // Update existing submission
          this.submittedKycs[existingKycIndex] = newKyc
        } else {
          // Add new submission
          this.submittedKycs.push(newKyc)
        }

        // Immediately update the UI for the recently submitted document
        this.submittedKycs = [...this.submittedKycs]

        control?.markAsUntouched()
        this.updateSubmissionStatus()

        console.log(`${field.field_name} submitted successfully`)
      } else {
        console.error(`Submission failed for ${field.field_name}`)
      }
    } catch (error) {
      console.error(`Error submitting ${field.field_name}:`, error)
    } finally {
      this.submittingFields.delete(field.id)
    }
  }

  async onFormSubmit(): Promise<void> {
    if (!this.hasSubmittedAnyField) {
      this.form.markAllAsTouched()
      return
    }
    this.onboardingService.completeStep(2)
  }

  goToPreviousStep() {
    this.onboardingService.goToPreviousStep()
  }

  getSelectedCountryLogo(): string {
    const selectedId = this.form.get("country")?.value
    const country = this.countries.find((c) => c.id === selectedId)
    return country?.logo || ""
  }

  getSelectedCountryName(): string {
    const selectedId = this.form.get("country")?.value
    const country = this.countries.find((c) => c.id === selectedId)
    return country?.name || ""
  }
}
