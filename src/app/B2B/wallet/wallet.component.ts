import { Component } from '@angular/core';
import { Wallet, WalletCreateRequest, WalletFilters, WalletManager, WalletManagerCreateRequest, WalletStatus, WalletSummary, WalletType } from './wallet.interface';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { WalletService } from '../../service/wallet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent {
  private destroy$ = new Subject<void>()
  private searchSubject = new Subject<string>()

  // Data properties
  wallets: Wallet[] = []
  walletManagers: WalletManager[] = []
  filteredWallets: Wallet[] = []
  selectedWallet: Wallet | null = null
  summary: WalletSummary = {
    totalWallets: 0,
    activeWallets: 0,
    suspendedWallets: 0,
    totalBalance: 0,
    processingBalance: 0,
    businessWallets: 0,
    personalWallets: 0,
    whitelabelWallets: 0,
  }

  // Filter properties
  filters: WalletFilters = {
    searchTerm: "",
    statusFilter: "all",
    typeFilter: "all",
    merchantFilter: "all",
  }

  // UI state
  isLoading = false
  showWalletModal = false
  showCreateWalletModal = false
  showManagerModal = false
  isMobileView = false
  activeTab = "overview"

  // Form data
  newWallet: WalletCreateRequest = {
    merchant: 1,
    name: "",
    description: "",
    currency: 1,
    type: "Business",
  }

  newWalletManager: WalletManagerCreateRequest = {
    staff: 1,
    wallet: 1,
  }

  // Constants for templates
  readonly statusOptions = ["all", "Active", "Suspended"]
  readonly typeOptions = ["all", "Business", "Personal", "Whitelabel"]

  readonly statusColors: Record<WalletStatus, string> = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Suspended: "bg-red-100 text-red-800 border-red-200",
  }

  readonly typeColors: Record<WalletType, string> = {
    Business: "bg-blue-100 text-blue-800 border-blue-200",
    Personal: "bg-purple-100 text-purple-800 border-purple-200",
    Whitelabel: "bg-orange-100 text-orange-800 border-orange-200",
  }

  readonly statusIcons: Record<WalletStatus, string> = {
    Active: "check-circle",
    Suspended: "x-circle",
  }

  readonly typeIcons: Record<WalletType, string> = {
    Business: "building",
    Personal: "user",
    Whitelabel: "layers",
  }

  constructor(private walletService: WalletService) {
    this.checkMobileView()
  }

  ngOnInit(): void {
    this.initializeSearchDebounce()
    this.loadWallets()
    this.loadWalletManagers()
    this.setupWindowResize()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private initializeSearchDebounce(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.filters.searchTerm = searchTerm
        this.applyFilters()
      })
  }

  private setupWindowResize(): void {
    window.addEventListener("resize", () => this.checkMobileView())
  }

  private checkMobileView(): void {
    this.isMobileView = window.innerWidth < 768
  }

  loadWallets(): void {
    this.isLoading = true
    this.walletService
      .getWallets(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (wallets) => {
          this.wallets = wallets
          this.applyFilters()
          this.calculateSummary()
          this.isLoading = false
        },
        error: (error) => {
          console.error("Error loading wallets:", error)
          this.isLoading = false
        },
      })
  }

  loadWalletManagers(): void {
    this.walletService
      .getWalletManagers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (managers) => {
          this.walletManagers = managers
        },
        error: (error) => {
          console.error("Error loading wallet managers:", error)
        },
      })
  }

  onSearchChange(searchTerm: any): void {
    this.searchSubject.next(searchTerm.value)
  }

  onFilterChange(): void {
    this.applyFilters()
  }

  private applyFilters(): void {
    let filtered = [...this.wallets]

    // Apply search filter
    if (this.filters.searchTerm) {
      const searchLower = this.filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (wallet) =>
          wallet.name.toLowerCase().includes(searchLower) ||
          wallet.number.toLowerCase().includes(searchLower) ||
          wallet.description.toLowerCase().includes(searchLower) ||
          wallet.merchant.name.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (this.filters.statusFilter !== "all") {
      filtered = filtered.filter((wallet) => wallet.status === this.filters.statusFilter)
    }

    // Apply type filter
    if (this.filters.typeFilter !== "all") {
      filtered = filtered.filter((wallet) => wallet.type === this.filters.typeFilter)
    }

    this.filteredWallets = filtered
    this.calculateSummary()
  }

  private calculateSummary(): void {
    this.summary = {
      totalWallets: this.filteredWallets.length,
      activeWallets: this.filteredWallets.filter((w) => w.status === "Active").length,
      suspendedWallets: this.filteredWallets.filter((w) => w.status === "Suspended").length,
      totalBalance: this.filteredWallets.reduce((sum, w) => sum + Number.parseFloat(w.balance), 0),
      processingBalance: this.filteredWallets.reduce((sum, w) => sum + Number.parseFloat(w.processing_balance), 0),
      businessWallets: this.filteredWallets.filter((w) => w.type === "Business").length,
      personalWallets: this.filteredWallets.filter((w) => w.type === "Personal").length,
      whitelabelWallets: this.filteredWallets.filter((w) => w.type === "Whitelabel").length,
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  viewWalletDetails(wallet: Wallet): void {
    this.selectedWallet = wallet
    this.showWalletModal = true
  }

  closeWalletModal(): void {
    this.showWalletModal = false
    this.selectedWallet = null
  }

  openCreateWalletModal(): void {
    this.showCreateWalletModal = true
    this.resetNewWallet()
  }

  closeCreateWalletModal(): void {
    this.showCreateWalletModal = false
    this.resetNewWallet()
  }

  openManagerModal(): void {
    this.showManagerModal = true
  }

  closeManagerModal(): void {
    this.showManagerModal = false
  }

  createWallet(): void {
    if (this.isValidWallet()) {
      this.walletService
        .createWallet(this.newWallet)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log("Wallet created:", response)
            this.closeCreateWalletModal()
            this.loadWallets()
          },
          error: (error) => {
            console.error("Error creating wallet:", error)
          },
        })
    }
  }

  assignWalletManager(): void {
    this.walletService
      .createWalletManager(this.newWalletManager)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log("Wallet manager assigned:", response)
          this.closeManagerModal()
          this.loadWalletManagers()
        },
        error: (error) => {
          console.error("Error assigning wallet manager:", error)
        },
      })
  }

  updateWalletStatus(wallet: Wallet, status: boolean): void {
    this.walletService
      .updateWallet(wallet.id, { status })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log("Wallet updated:", response)
          this.loadWallets()
        },
        error: (error) => {
          console.error("Error updating wallet:", error)
        },
      })
  }

  public isValidWallet(): boolean {
    return !!(this.newWallet.name && this.newWallet.description && this.newWallet.merchant)
  }

  private resetNewWallet(): void {
    this.newWallet = {
      merchant: 1,
      name: "",
      description: "",
      currency: 1,
      type: "Business",
    }
  }

  formatCurrency(amount: string | number, currency = "KES"): string {
    const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
    }).format(numAmount)
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  getStatusClass(status: WalletStatus): string {
    return this.statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  getTypeClass(type: WalletType): string {
    return this.typeColors[type] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  getStatusIcon(status: WalletStatus): string {
    return this.statusIcons[status] || "circle"
  }

  getTypeIcon(type: WalletType): string {
    return this.typeIcons[type] || "circle"
  }

  trackByWalletId(index: number, wallet: Wallet): number {
    return wallet.id
  }

  trackByManagerId(index: number, manager: WalletManager): number {
    return manager.id
  }
}
