import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  Wallet,
  WalletCreateRequest,
  WalletFilters,
  WalletManager,
  WalletManagerCreateRequest,
  WalletUpdateRequest
} from '../B2B/wallet/wallet.interface';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = "/api/wallets" // Replace with actual API URL
  private walletsSubject = new BehaviorSubject<Wallet[]>([])
  public wallets$ = this.walletsSubject.asObservable()

  // Mock data for demonstration
  private mockWallets: Wallet[] = [
    {
      id: 1,
      merchant: {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        modified_at: "2024-01-01T00:00:00Z",
        name: "Tech Solutions Ltd",
        email: "info@techsolutions.com",
        location: "Nairobi, Kenya",
        address: "123 Business District",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2024-01-15T10:30:00Z",
      modified_at: "2024-01-15T10:30:00Z",
      number: "WAL-001-2024",
      address: "0x1234567890abcdef",
      type: "Business",
      balance: "150000.00",
      processing_balance: "5000.00",
      name: "Main Business Wallet",
      description: "Primary wallet for business transactions",
      checksum: "abc123def456",
      status: "Active",
      currency: 1,
    },
    {
      id: 2,
      merchant: {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        modified_at: "2024-01-01T00:00:00Z",
        name: "Tech Solutions Ltd",
        email: "info@techsolutions.com",
        location: "Nairobi, Kenya",
        address: "123 Business District",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2024-01-20T14:20:00Z",
      modified_at: "2024-01-20T14:20:00Z",
      number: "WAL-002-2024",
      address: "0xabcdef1234567890",
      type: "Personal",
      balance: "25000.00",
      processing_balance: "1000.00",
      name: "Personal Savings",
      description: "Personal savings wallet",
      checksum: "def456abc123",
      status: "Active",
      currency: 1,
    },
    {
      id: 3,
      merchant: {
        id: 2,
        created_at: "2024-01-01T00:00:00Z",
        modified_at: "2024-01-01T00:00:00Z",
        name: "Retail Corp",
        email: "contact@retailcorp.com",
        location: "Mombasa, Kenya",
        address: "456 Retail Avenue",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2024-01-25T09:15:00Z",
      modified_at: "2024-01-25T09:15:00Z",
      number: "WAL-003-2024",
      address: "0x567890abcdef1234",
      type: "Whitelabel",
      balance: "75000.00",
      processing_balance: "2500.00",
      name: "Whitelabel Solution",
      description: "Whitelabel wallet for partners",
      checksum: "789abc456def",
      status: "Suspended",
      currency: 1,
    },
  ]

  private mockWalletManagers: WalletManager[] = [
    {
      id: 1,
      staff: {
        id: 1,
        user: {
          id: 1,
          email: "john.doe@techsolutions.com",
          phone_number: "+254712345678",
          fullname: "John Doe",
        },
        merchant: this.mockWallets[0].merchant,
        created_at: "2024-01-01T00:00:00Z",
        modified_at: "2024-01-01T00:00:00Z",
        profile: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      wallet: this.mockWallets[0],
      created_at: "2024-01-15T10:30:00Z",
      modified_at: "2024-01-15T10:30:00Z",
      status: true,
    },
  ]

  constructor(private http: HttpClient) {
    // Initialize with mock data
    this.walletsSubject.next(this.mockWallets)
  }

  getWallets(filters?: WalletFilters): Observable<Wallet[]> {
    // In real implementation, this would make HTTP request
    // const params = this.buildHttpParams(filters);
    // return this.http.get<Wallet[]>(`${this.apiUrl}/wallets`, { params });

    // For now, return mock data
    return of(this.mockWallets)
  }

  getWalletById(id: number): Observable<Wallet> {
    // return this.http.get<Wallet>(`${this.apiUrl}/wallet/${id}/`);
    const wallet = this.mockWallets.find((w) => w.id === id)
    return of(wallet!)
  }

  createWallet(walletData: WalletCreateRequest): Observable<any> {
    // return this.http.post(`${this.apiUrl}/wallets`, walletData);
    return of({ message: "Wallet created successfully" })
  }

  updateWallet(id: number, updateData: WalletUpdateRequest): Observable<any> {
    // return this.http.put(`${this.apiUrl}/wallet/${id}/`, updateData);
    return of({ message: "Wallet updated successfully" })
  }

  getWalletManagers(): Observable<WalletManager[]> {
    // return this.http.get<WalletManager[]>(`${this.apiUrl}/managers`);
    return of(this.mockWalletManagers)
  }

  createWalletManager(managerData: WalletManagerCreateRequest): Observable<any> {
    // return this.http.post(`${this.apiUrl}/managers`, managerData);
    return of({ message: "Wallet manager assigned successfully" })
  }

  updateWalletManager(id: number, updateData: WalletUpdateRequest): Observable<any> {
    // return this.http.put(`${this.apiUrl}/manager/${id}/`, updateData);
    return of({ message: "Wallet manager updated successfully" })
  }

  private buildHttpParams(filters?: WalletFilters): HttpParams {
    let params = new HttpParams()

    if (filters) {
      if (filters.searchTerm) params = params.set("search", filters.searchTerm)
      if (filters.statusFilter !== "all") params = params.set("status", filters.statusFilter)
      if (filters.typeFilter !== "all") params = params.set("type", filters.typeFilter)
      if (filters.merchantFilter !== "all") params = params.set("merchant", filters.merchantFilter)
    }

    return params
  }
}
