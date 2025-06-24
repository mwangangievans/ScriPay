import { Component, type OnInit, type OnDestroy, ViewChild, type ElementRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import type { Subscription } from "rxjs"
import { Pagination } from "../B2B.interface"
import { OnboardingService } from "../../service/onboarding.service"
import { HttpService } from "../../service/http.service"

interface DocumentMapper {
  id: number
  created_at: string
  modified_at: string
  field_name: string
  field_type: string
  required: boolean
  active: boolean
  country: number
}

interface Merchant {
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

interface Document {
  id: number
  mapper: DocumentMapper
  merchant: Merchant
  created_at: string
  modified_at: string
  text_value: string | null
  file_value: string | null
  approved: boolean | null
}

interface CountryGroup {
  countryId: number
  documents: Document[]
}

interface Countries {
  id: number
  created_at: string
  modified_at: string
  name: string
  code: number
  currency: string
  logo: string
  timezone: string
  active: boolean
}

type StatusFilter = "all" | "approved" | "pending" | "rejected"
type DocumentStatus = "approved" | "pending" | "rejected"

@Component({
  selector: "app-document-status",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./document-status.component.html",
  styleUrls: ["./document-status.component.css"],
})
export class DocumentStatusComponent implements OnInit, OnDestroy {
  @ViewChild("imageContainer") imageContainer!: ElementRef

  documents: Document[] = []
  filteredDocuments: Document[] = []
  selectedDocument: Document | null = null
  isLoading = false
  searchTerm = ""
  statusFilter: StatusFilter = "all"

  // Zoom and pan functionality
  zoomLevel = 1
  isDragging = false
  dragStart = { x: 0, y: 0 }

  countries: Countries[] = []
  private apiSubscriptions: Subscription[] = []

  private subscriptions: Subscription[] = []
  Math = Math // Make Math available in template

  constructor(private onboardingService: OnboardingService,
    private httpService: HttpService,) {
    // Initialize with sample data - replace with actual service call

  }

  ngOnInit(): void {
    this.getCountries()
    this.loadSubmittedKyc()
    // Subscribe to onboarding state changes if needed
    this.subscriptions.push(
      this.onboardingService.state$.subscribe((state) => {
        // Handle state changes if necessary
        console.log("[DocumentStatusComponent] Onboarding state changed:", state)
        // Example: this.selectedLogo = state.selectedLogo;
      }),
    )
    this.applyFilters()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  // Status and filtering methods
  getDocumentStatus(document: Document): DocumentStatus {
    if (document.approved === true) return "approved"
    if (document.approved === false) return "pending"
    return "rejected" // null means rejected
  }

  getStatusText(document: Document): string {
    const status = this.getDocumentStatus(document)
    switch (status) {
      case "approved":
        return "Approved"
      case "pending":
        return "Under Review"
      case "rejected":
        return "Rejected"
      default:
        return "Unknown"
    }
  }

  getStatusDescription(document: Document): string {
    const status = this.getDocumentStatus(document)
    switch (status) {
      case "approved":
        return "Your document has been approved and verified"
      case "pending":
        return "Your document is currently under review"
      case "rejected":
        return "Your document was rejected and needs to be resubmitted"
      default:
        return "Status unknown"
    }
  }

  setStatusFilter(filter: StatusFilter): void {
    this.statusFilter = filter
    this.applyFilters()
  }

  onSearch(): void {
    this.applyFilters()
  }

  applyFilters(): void {
    let filtered = [...this.documents]

    // Apply status filter
    if (this.statusFilter !== "all") {
      filtered = filtered.filter((doc) => this.getDocumentStatus(doc) === this.statusFilter)
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.mapper.field_name.toLowerCase().includes(term) ||
          (doc.text_value && doc.text_value.toLowerCase().includes(term)) ||
          this.getCountryName(doc.mapper.country).toLowerCase().includes(term),
      )
    }

    this.filteredDocuments = filtered
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
    const subscription = this.httpService.get<Pagination<Document>>(url).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.results) {
          this.documents = response.body.results
          this.filteredDocuments = [...this.documents] // Initialize filtered documents
          this.applyFilters() // Apply filters to initialize view
        } else {
          console.warn("No submitted KYCs found or response is not as expected")
        }
      },
      error: (error) => {
        console.error("Error fetching submitted KYCs:", error)
      },
    })
    this.apiSubscriptions.push(subscription)
  }

  // Grouping methods
  getGroupedDocuments(): CountryGroup[] {
    // Group by countries array, preserving order and including only countries with documents
    return this.countries
      .map((country) => ({
        countryId: country.id,
        country,
        documents: this.filteredDocuments.filter((doc) => doc.mapper.country === country.id),
      }))
      .filter((group) => group.documents.length > 0)
      .map((group) => ({
        countryId: group.countryId,
        documents: group.documents,
      }))
  }

  getCountryName(countryId: number): string {
    const country = this.countries.find((c) => c.id === countryId)
    return country ? country.name : `Country ${countryId}`
  }

  getCountryLogo(countryId: number): string {
    const country = this.countries.find((c) => c.id === countryId)
    return country ? country.logo : ""
  }

  getCountryProgress(countryId: number): number {
    const countryDocs = this.documents.filter((doc) => doc.mapper.country === countryId)
    if (countryDocs.length === 0) return 0

    const approvedDocs = countryDocs.filter((doc) => this.getDocumentStatus(doc) === "approved")
    return Math.round((approvedDocs.length / countryDocs.length) * 100)
  }

  // Statistics methods
  getTotalCount(): number {
    return this.documents.length
  }

  getApprovedCount(): number {
    return this.documents.filter((doc) => this.getDocumentStatus(doc) === "approved").length
  }

  getPendingCount(): number {
    return this.documents.filter((doc) => this.getDocumentStatus(doc) === "pending").length
  }

  getRejectedCount(): number {
    return this.documents.filter((doc) => this.getDocumentStatus(doc) === "rejected").length
  }

  // Preview methods
  openDocumentPreview(document: Document): void {
    this.selectedDocument = document
    this.zoomLevel = 1
  }

  closePreview(): void {
    this.selectedDocument = null
    this.zoomLevel = 1
    this.isDragging = false
  }

  // Image handling methods
  isImageFile(url: string): boolean {
    if (!url) return false
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"]
    const urlLower = url.toLowerCase()
    return imageExtensions.some((ext) => urlLower.includes(ext))
  }

  // Zoom functionality
  zoomIn(): void {
    if (this.zoomLevel < 3) {
      this.zoomLevel = Math.min(3, this.zoomLevel + 0.25)
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel = Math.max(0.5, this.zoomLevel - 0.25)
    }
  }

  // Drag functionality for zoomed images
  startDrag(event: MouseEvent): void {
    if (this.zoomLevel > 1) {
      this.isDragging = true
      this.dragStart = { x: event.clientX, y: event.clientY }
      event.preventDefault()
    }
  }

  onDrag(event: MouseEvent): void {
    if (this.isDragging && this.imageContainer) {
      const deltaX = event.clientX - this.dragStart.x
      const deltaY = event.clientY - this.dragStart.y

      const container = this.imageContainer.nativeElement
      container.scrollLeft -= deltaX
      container.scrollTop -= deltaY

      this.dragStart = { x: event.clientX, y: event.clientY }
    }
  }

  endDrag(): void {
    this.isDragging = false
  }

  // Utility methods
  trackByDocumentId(index: number, document: Document): number {
    return document.id
  }

  // Navigation methods
  areAllDocumentsApproved(): boolean {
    if (this.documents.length === 0) return false
    return this.documents.every((doc) => this.getDocumentStatus(doc) === "approved")
  }

  proceedToDashboard(): void {
    if (this.areAllDocumentsApproved()) {
      // Navigate to dashboard - replace with your actual navigation logic
      console.log("Proceeding to dashboard...")
      // Example: this.router.navigate(['/dashboard'])
      // Or emit an event: this.onProceedToDashboard.emit()
    }
  }


  goToPreviousStep() {
    this.onboardingService.goToPreviousStep()
  }
}
