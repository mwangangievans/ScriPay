import { Component, type OnInit, type OnDestroy, HostListener } from "@angular/core"
import { animate, style, transition, trigger } from "@angular/animations"
import { CommonModule } from "@angular/common"
import { Subscription } from "rxjs"
import { MerchantsInfoComponent } from "../merchants-info/merchants-info.component"
import { KycInfoComponent } from "../kyc-info/kyc-info.component"
import { OnboardingService } from "../../service/onboarding.service"
import { LocalstorageService } from "../../service/localstorage.service"
import { isPlatformBrowser } from "@angular/common"
import { DocumentStatusComponent } from "../document-status/document-status.component"
import { Router } from "@angular/router"

interface Step {
  id: number
  title: string
  description: string
  icon: string
  color: string
}

interface OnboardingState {
  currentStep: number
  completedSteps: number[]
  selectedLogo: { name: string } | null
  stepValidity: { [key: number]: boolean }
}

interface UserInfo {
  name?: string
  email?: string
  merchant?: {
    name?: string
  }
}

@Component({
  selector: "app-onboarding",
  templateUrl: "./onboarding.component.html",
  styleUrls: ["./onboarding.component.css"],
  standalone: true,
  imports: [CommonModule, MerchantsInfoComponent, KycInfoComponent, DocumentStatusComponent],
  animations: [
    trigger("fadeSlide", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("400ms cubic-bezier(0.4, 0, 0.2, 1)", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [
        animate("300ms cubic-bezier(0.4, 0, 0.2, 1)", style({ opacity: 0, transform: "translateY(-20px)" })),
      ]),
    ]),
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(100%)" }),
        animate("300ms ease-in-out", style({ transform: "translateX(0%)" })),
      ]),
      transition(":leave", [animate("300ms ease-in-out", style({ transform: "translateX(100%)" }))]),
    ]),
  ],
})
export class OnboardingComponent implements OnInit, OnDestroy {
  steps: Step[] = [
    {
      id: 1,
      title: "Merchant Information",
      description: "Tell us about your business",
      icon: "Building2",
      color: "from-violet-500 to-purple-600",
    },
    {
      id: 2,
      title: "KYC Details",
      description: "Submit required documents",
      icon: "User",
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 3,
      title: "Document Status",
      description: "Review submission status",
      icon: "CreditCard",
      color: "from-emerald-500 to-green-600",
    },
  ]

  state: OnboardingState = {
    currentStep: 1,
    completedSteps: [],
    selectedLogo: null,
    stepValidity: {},
  }

  // UI State
  showUserMenu = false
  showLogoutModal = false
  showHelp = false
  showSaveToast = false
  userInfo: UserInfo | null = null

  // Auto-save functionality
  private autoSaveInterval: any
  private lastSavedState = ""

  private subscription: Subscription = new Subscription()
  Math = Math // Make Math available in template

  constructor(
    private onboardingService: OnboardingService,
    private localStorageService: LocalstorageService,
    private router: Router,
  ) {
    // Subscribe to onboarding state changes
    this.subscription.add(
      this.onboardingService.state$.subscribe((state) => {
        this.state = state
        this.autoSave()
      }),
    )
  }

  ngOnInit() {
    this.loadUserInfo()
    this.loadSavedState()
    this.initAutoSave()
    console.log("[OnboardingComponent] Initialized with state:", this.state)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval)
    }
  }

  // Listen for beforeunload to save progress
  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHandler(event: any) {
    this.saveProgress()
    // Optionally show a confirmation dialog
    if (this.hasUnsavedChanges()) {
      event.returnValue = "You have unsaved changes. Are you sure you want to leave?"
    }
  }

  // User Management
  loadUserInfo(): void {
    if (typeof window !== "undefined") {
      const userData = this.localStorageService.get("userObject")
      if (userData) {
        this.userInfo = userData
      }
    }
  }

  getCurrentUserName(): string {
    // Safely handle missing userInfo or merchant
    if (this.userInfo && this.userInfo.merchant && typeof this.userInfo.merchant.name === 'string') {
      return this.userInfo.merchant.name;
    }
    if (this.userInfo && typeof this.userInfo.name === 'string') {
      return this.userInfo.name;
    }
    return "User";
  }

  getCurrentUserEmail(): string {
    // Safely handle missing userInfo
    if (this.userInfo && typeof this.userInfo.email === 'string') {
      return this.userInfo.email;
    }
    return "user@example.com";
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu
  }

  // Logout Functionality
  requestLogout(): void {
    this.showUserMenu = false
    this.showLogoutModal = true
  }

  confirmLogout(): void {
    // Save current progress before logout
    this.saveProgress()

    // Clear user session
    if (typeof window !== "undefined") {
      this.localStorageService.clear()
      this.localStorageService.remove("userObject")
      this.localStorageService.remove("authToken")
    }

    // Redirect to login
    this.router.navigate(["/login"])
    this.showLogoutModal = false
  }

  cancelLogout(): void {
    this.showLogoutModal = false
  }

  // Save and Continue Later
  saveAndContinueLater(): void {
    this.saveProgress()
    this.showUserMenu = false

    // Show confirmation and redirect to dashboard
    this.showSaveToast = true
    setTimeout(() => {
      this.showSaveToast = false
      this.router.navigate(["/dashboard"])
    }, 2000)
  }

  // Progress Management
  get progressPercentage(): number {
    return (this.state.completedSteps.length / this.steps.length) * 100
  }

  getCurrentStep(): Step {
    return this.steps.find((step) => step.id === this.state.currentStep) || this.steps[0]
  }

  getStepClasses(step: Step): { [key: string]: boolean } {
    return {
      // Completed step
      "bg-emerald-500 border-emerald-500 text-white shadow-emerald-200": this.state.completedSteps.includes(step.id),

      // Current step
      "bg-gradient-to-r text-white shadow-lg border-transparent":
        this.state.currentStep === step.id && !this.state.completedSteps.includes(step.id),

      // Future step
      "bg-white border-gray-300 text-gray-400 hover:border-gray-400":
        !this.state.completedSteps.includes(step.id) && this.state.currentStep !== step.id,

      // Apply gradient color for current step
      [step.color]: this.state.currentStep === step.id && !this.state.completedSteps.includes(step.id),
    }
  }

  getCurrentStepMobileClasses(): { [key: string]: boolean } {
    const currentStep = this.getCurrentStep()
    return {
      "bg-gradient-to-r text-white": true,
      [currentStep.color]: true,
    }
  }

  // State Management
  private loadSavedState() {
    if (typeof window !== "undefined") {
      const savedState = this.localStorageService.get("onboardingState")
      if (savedState) {
        try {
          this.state = {
            currentStep: savedState.currentStep || 1,
            completedSteps: savedState.completedSteps || [],
            selectedLogo: savedState.selectedLogo || null,
            stepValidity: savedState.stepValidity || {},
          }
          this.lastSavedState = JSON.stringify(this.state)
        } catch (e) {
          console.error("Error parsing saved onboarding state", e)
        }
      }
    }
  }

  private saveCurrentState() {
    if (typeof window !== "undefined") {
      this.localStorageService.set("onboardingState", this.state)
      this.lastSavedState = JSON.stringify(this.state)
    }
  }

  // Auto-save functionality
  private initAutoSave(): void {
    if (typeof window !== "undefined") {
      // Auto-save every 30 seconds
      this.autoSaveInterval = setInterval(() => {
        this.autoSave()
      }, 30000)
    }
  }

  private autoSave(): void {
    const currentState = JSON.stringify(this.state)
    if (currentState !== this.lastSavedState) {
      this.saveCurrentState()
      console.log("[OnboardingComponent] Auto-saved state")
    }
  }

  private hasUnsavedChanges(): boolean {
    return JSON.stringify(this.state) !== this.lastSavedState
  }

  // Manual save
  saveProgress(): void {
    this.saveCurrentState()
    this.showSaveToast = true
    setTimeout(() => {
      this.showSaveToast = false
    }, 3000)
  }

  // Utility method to update state
  updateState(newState: Partial<OnboardingState>) {
    this.state = { ...this.state, ...newState }
    this.saveCurrentState()
  }

  // Click outside directive implementation
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement
    if (!target.closest(".relative")) {
      this.showUserMenu = false
    }
  }
}
