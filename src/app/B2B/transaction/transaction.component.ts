import { Component } from '@angular/core';
import { PaymentChannel, Transaction, TransactionFilters, TransactionPurpose, TransactionStatus, TransactionSummary } from './transaction.interface';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { TransactionService } from '../../service/transaction.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {
  private destroy$ = new Subject<void>()
  private searchSubject = new Subject<string>()

  // Data properties
  transactions: Transaction[] = []
  filteredTransactions: Transaction[] = []
  selectedTransaction: Transaction | null = null
  summary: TransactionSummary = {
    totalAmount: 0,
    totalFees: 0,
    successfulTransactions: 0,
    pendingTransactions: 0,
  }

  // Filter properties
  filters: TransactionFilters = {
    searchTerm: "",
    statusFilter: "all",
    purposeFilter: "all",
    channelFilter: "all",
  }

  // UI state
  isLoading = false
  showTransactionModal = false
  isMobileView = false

  // Constants for templates
  readonly statusOptions = ["all", "Success", "Pending", "Failed", "Processing", "Cancelled", "Reversed"]
  readonly purposeOptions = ["all", "Collection", "Payout", "P2P"]
  readonly channelOptions = ["all", "Mpesa", "AirtelMoney", "Card", "Bank", "Wallet"]

  readonly statusColors: Record<TransactionStatus, string> = {
    Success: "bg-green-100 text-green-800 border-green-200",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Failed: "bg-red-100 text-red-800 border-red-200",
    Processing: "bg-blue-100 text-blue-800 border-blue-200",
    Cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    Reversed: "bg-purple-100 text-purple-800 border-purple-200",
  }

  readonly statusIcons: Record<TransactionStatus, string> = {
    Success: "check-circle",
    Pending: "clock",
    Failed: "x-circle",
    Processing: "refresh-cw",
    Cancelled: "x-circle",
    Reversed: "refresh-cw",
  }

  readonly channelIcons: Record<PaymentChannel, string> = {
    Mpesa: "smartphone",
    AirtelMoney: "smartphone",
    Card: "credit-card",
    Bank: "building",
    Wallet: "wallet",
  }

  readonly purposeIcons: Record<TransactionPurpose, string> = {
    Collection: "arrow-down-left",
    Payout: "arrow-up-right",
    P2P: "refresh-cw",
  }

  constructor(private transactionService: TransactionService) {
    this.checkMobileView()
  }

  ngOnInit(): void {
    this.initializeSearchDebounce()
    this.loadTransactions()
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

  loadTransactions(): void {
    this.isLoading = true
    this.transactionService
      .getTransactions(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactions) => {
          this.transactions = transactions
          this.applyFilters()
          this.calculateSummary()
          this.isLoading = false
        },
        error: (error) => {
          console.error("Error loading transactions:", error)
          this.isLoading = false
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
    let filtered = [...this.transactions]

    // Apply search filter
    if (this.filters.searchTerm) {
      const searchLower = this.filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (tx) =>
          tx.order_id.toLowerCase().includes(searchLower) ||
          tx.rrn.toLowerCase().includes(searchLower) ||
          tx.narration.toLowerCase().includes(searchLower) ||
          tx.customer_phone.includes(this.filters.searchTerm),
      )
    }

    // Apply status filter
    if (this.filters.statusFilter !== "all") {
      filtered = filtered.filter((tx) => tx.status === this.filters.statusFilter)
    }

    // Apply purpose filter
    if (this.filters.purposeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.purpose === this.filters.purposeFilter)
    }

    // Apply channel filter
    if (this.filters.channelFilter !== "all") {
      filtered = filtered.filter((tx) => tx.channel === this.filters.channelFilter)
    }

    this.filteredTransactions = filtered
    this.calculateSummary()
  }

  private calculateSummary(): void {
    this.summary = {
      totalAmount: this.filteredTransactions.reduce((sum, tx) => sum + Number.parseFloat(tx.amount), 0),
      totalFees: this.filteredTransactions.reduce((sum, tx) => sum + Number.parseFloat(tx.fee), 0),
      successfulTransactions: this.filteredTransactions.filter((tx) => tx.status === "Success").length,
      pendingTransactions: this.filteredTransactions.filter((tx) => tx.status === "Pending").length,
    }
  }

  refreshTransactions(): void {
    this.loadTransactions()
  }

  exportTransactions(): void {
    this.transactionService
      .exportTransactions("csv")
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          // Handle export download
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
          link.click()
          window.URL.revokeObjectURL(url)
        },
        error: (error) => {
          console.error("Error exporting transactions:", error)
        },
      })
  }

  viewTransactionDetails(transaction: Transaction): void {
    this.selectedTransaction = transaction
    this.showTransactionModal = true
  }

  closeTransactionModal(): void {
    this.showTransactionModal = false
    this.selectedTransaction = null
  }

  retryTransaction(transaction: Transaction): void {
    // Implement retry logic
    console.log("Retrying transaction:", transaction.id)
  }

  downloadReceipt(transaction: Transaction): void {
    // Implement receipt download
    console.log("Downloading receipt for transaction:", transaction.id)
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

  formatDateLong(dateString: string): string {
    return new Date(dateString).toLocaleString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  getStatusClass(status: TransactionStatus): string {
    return this.statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  getStatusIcon(status: TransactionStatus): string {
    return this.statusIcons[status] || "clock"
  }

  getChannelIcon(channel: PaymentChannel): string {
    return this.channelIcons[channel] || "wallet"
  }

  getPurposeIcon(purpose: TransactionPurpose): string {
    return this.purposeIcons[purpose] || "refresh-cw"
  }

  getNetAmount(transaction: Transaction): number {
    return Number.parseFloat(transaction.amount) - Number.parseFloat(transaction.fee)
  }

  trackByTransactionId(index: number, transaction: Transaction): number {
    return transaction.id
  }

}
