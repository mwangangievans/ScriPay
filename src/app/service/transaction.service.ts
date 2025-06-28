import { Injectable } from '@angular/core';
import { Transaction, TransactionFilters } from '../B2B/transaction/transaction.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {


  private apiUrl = "/api/transactions" // Replace with actual API URL
  private transactionsSubject = new BehaviorSubject<Transaction[]>([])
  public transactions$ = this.transactionsSubject.asObservable()

  // Mock data for demonstration
  private mockTransactions: Transaction[] = [
    {
      id: 1,
      order_id: "ORD-2024-001",
      rrn: "RRN123456789",
      status: "Success",
      purpose: "Collection",
      currency: "KES",
      amount: "1500.00",
      fee: "15.00",
      provider_ref: "MPESA123456",
      narration: "Payment for services",
      description: "Online payment collection",
      created_at: "2024-01-15T10:30:00Z",
      date_completed: "2024-01-15T10:31:00Z",
      is_completed: true,
      channel: "Mpesa",
      customer_phone: "+254712345678",
      merchant_name: "Tech Solutions Ltd",
      merchant: 1,
      credential: 1,
    },
    {
      id: 2,
      order_id: "ORD-2024-002",
      rrn: "RRN123456790",
      status: "Pending",
      purpose: "Payout",
      currency: "KES",
      amount: "2500.00",
      fee: "25.00",
      provider_ref: null,
      narration: "Salary payment",
      description: "Monthly salary disbursement",
      created_at: "2024-01-15T11:00:00Z",
      date_completed: null,
      is_completed: false,
      channel: "Bank",
      customer_phone: "+254712345679",
      merchant_name: "Retail Corp",
      merchant: 2,
      credential: 2,
    },
    {
      id: 3,
      order_id: "ORD-2024-003",
      rrn: "RRN123456791",
      status: "Failed",
      purpose: "Collection",
      currency: "KES",
      amount: "750.00",
      fee: "7.50",
      provider_ref: "CARD789012",
      narration: "Product purchase",
      description: "E-commerce transaction",
      created_at: "2024-01-15T12:15:00Z",
      date_completed: null,
      is_completed: false,
      channel: "Card",
      customer_phone: "+254712345680",
      merchant_name: "Online Store",
      merchant: 3,
      credential: 3,
    },
  ]

  constructor(private http: HttpClient) {
    // Initialize with mock data
    this.transactionsSubject.next(this.mockTransactions)
  }

  getTransactions(filters?: TransactionFilters): Observable<Transaction[]> {
    // In real implementation, this would make HTTP request
    // const params = this.buildHttpParams(filters);
    // return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`, { params });

    // For now, return mock data
    return of(this.mockTransactions)
  }

  getTransactionById(id: number): Observable<Transaction> {
    // return this.http.get<Transaction>(`${this.apiUrl}/transaction/${id}`);
    const transaction = this.mockTransactions.find((t) => t.id === id)
    return of(transaction!)
  }

  refreshTransactions(): Observable<Transaction[]> {
    // return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
    return of(this.mockTransactions)
  }

  exportTransactions(format: "csv" | "pdf"): Observable<Blob> {
    // return this.http.get(`${this.apiUrl}/export?format=${format}`, { responseType: 'blob' });
    return of(new Blob())
  }

  private buildHttpParams(filters?: TransactionFilters): HttpParams {
    let params = new HttpParams()

    if (filters) {
      if (filters.searchTerm) params = params.set("search", filters.searchTerm)
      if (filters.statusFilter !== "all") params = params.set("status", filters.statusFilter)
      if (filters.purposeFilter !== "all") params = params.set("purpose", filters.purposeFilter)
      if (filters.channelFilter !== "all") params = params.set("channel", filters.channelFilter)
    }

    return params
  }
}
