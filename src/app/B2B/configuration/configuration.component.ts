import { Component } from '@angular/core';
import { Fee, MobileCredential, Scope, Stat, Webhook } from './configuration.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {

  activeTab = "scopes"
  showSecrets = false
  mobileMenuOpen = false

  stats: Stat[] = [
    { label: "Active Configurations", value: "12", change: "+2", icon: "settings", color: "text-purple-600" },
    { label: "Total Transactions", value: "2.1K", change: "+15%", icon: "trending-up", color: "text-blue-500" },
    { label: "Success Rate", value: "99.2%", change: "+0.3%", icon: "check-circle", color: "text-green-500" },
    { label: "Active Webhooks", value: "4", change: "0", icon: "webhook", color: "text-purple-400" },
  ]

  scopes: Scope[] = [
    {
      id: 1,
      scope: "Mobile Collection",
      active: true,
      merchant: "Demo Merchant",
      description: "Accept payments via mobile money platforms",
      transactions: 1250,
      volume: "KES 2.5M",
    },
    {
      id: 2,
      scope: "Card Collection",
      active: true,
      merchant: "Demo Merchant",
      description: "Process credit and debit card payments",
      transactions: 890,
      volume: "KES 1.8M",
    },
    {
      id: 3,
      scope: "Wallet Transfer",
      active: false,
      merchant: "Demo Merchant",
      description: "Enable wallet-to-wallet transfers",
      transactions: 0,
      volume: "KES 0",
    },
  ]

  fees: Fee[] = [
    {
      id: 1,
      scope: "Mobile Collection",
      feeType: "Merchant",
      chargeType: "Percentage",
      value: 2.5,
      minValue: 10,
      maxValue: 50000,
      provider: "M-Pesa",
      status: "Active",
    },
    {
      id: 2,
      scope: "Card Collection",
      feeType: "Merchant",
      chargeType: "Fixed",
      value: 50,
      minValue: 100,
      maxValue: 100000,
      provider: "Visa/Mastercard",
      status: "Active",
    },
  ]

  mobileCredentials: MobileCredential[] = [
    {
      id: 1,
      provider: "M-Pesa",
      shortCode: "174379",
      billType: "CustomerPayBillOnline",
      status: true,
      isDefault: true,
      lastUsed: "2 hours ago",
      transactions: 1250,
    },
    {
      id: 2,
      provider: "Airtel Money",
      shortCode: "123456",
      billType: "CustomerBuyGoodsOnline",
      status: false,
      isDefault: false,
      lastUsed: "Never",
      transactions: 0,
    },
  ]

  webhooks: Webhook[] = [
    {
      id: 1,
      name: "Payment Notifications",
      url: "https://api.example.com/webhooks/payments",
      active: true,
      lastTriggered: "5 mins ago",
      successRate: 99.8,
      totalCalls: 15420,
    },
    {
      id: 2,
      name: "Transaction Updates",
      url: "https://api.example.com/webhooks/transactions",
      active: true,
      lastTriggered: "12 mins ago",
      successRate: 98.5,
      totalCalls: 8930,
    },
  ]

  // SMS Configuration
  smsProvider = {
    provider: "africas-talking",
    senderId: "SCRIPAY",
    apiKey: "",
    apiSecret: "",
  }

  smsTemplate = {
    scope: "mobile-collection",
    message:
      "Payment of {amount} {currency} received from {phone}. Transaction ID: {reference}. Thank you for using SCRIPAY!",
    active: true,
  }

  // New webhook form
  newWebhook = {
    name: "",
    url: "",
  }

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  // Tab Management
  setActiveTab(tab: string): void {
    this.activeTab = tab
    this.mobileMenuOpen = false
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen
  }

  // Scope Management
  toggleScope(scope: Scope): void {
    scope.active = !scope.active
    // Here you would typically call an API to update the scope
    console.log(`Scope ${scope.scope} ${scope.active ? "activated" : "deactivated"}`)
  }

  addScope(): void {
    console.log("Adding new scope...")
    // Implement add scope logic
  }

  editScope(scope: Scope): void {
    console.log("Editing scope:", scope)
    // Implement edit scope logic
  }

  deleteScope(scope: Scope): void {
    if (confirm(`Are you sure you want to delete ${scope.scope}?`)) {
      this.scopes = this.scopes.filter((s) => s.id !== scope.id)
      console.log("Scope deleted:", scope)
    }
  }

  // Fee Management
  addFeeRule(): void {
    console.log("Adding new fee rule...")
    // Implement add fee rule logic
  }

  editFee(fee: Fee): void {
    console.log("Editing fee:", fee)
    // Implement edit fee logic
  }

  viewFeeHistory(fee: Fee): void {
    console.log("Viewing fee history:", fee)
    // Implement view fee history logic
  }

  deleteFee(fee: Fee): void {
    if (confirm(`Are you sure you want to delete the fee rule for ${fee.scope}?`)) {
      this.fees = this.fees.filter((f) => f.id !== fee.id)
      console.log("Fee deleted:", fee)
    }
  }

  // Mobile Credentials Management
  addMobileProvider(): void {
    console.log("Adding new mobile provider...")
    // Implement add mobile provider logic
  }

  toggleMobileCredential(credential: MobileCredential): void {
    credential.status = !credential.status
    console.log(`Mobile credential ${credential.provider} ${credential.status ? "activated" : "deactivated"}`)
  }

  editMobileCredential(credential: MobileCredential): void {
    console.log("Editing mobile credential:", credential)
    // Implement edit mobile credential logic
  }

  testMobileConnection(credential: MobileCredential): void {
    console.log("Testing connection for:", credential.provider)
    // Implement test connection logic
  }

  deleteMobileCredential(credential: MobileCredential): void {
    if (confirm(`Are you sure you want to delete ${credential.provider} credentials?`)) {
      this.mobileCredentials = this.mobileCredentials.filter((c) => c.id !== credential.id)
      console.log("Mobile credential deleted:", credential)
    }
  }

  toggleShowSecrets(): void {
    this.showSecrets = !this.showSecrets
  }

  // SMS Configuration
  saveSmsProvider(): void {
    console.log("Saving SMS provider configuration:", this.smsProvider)
    // Implement save SMS provider logic
  }

  saveSmsTemplate(): void {
    console.log("Saving SMS template:", this.smsTemplate)
    // Implement save SMS template logic
  }

  // Webhook Management
  addWebhook(): void {
    console.log("Adding new webhook...")
    // Implement add webhook logic
  }

  toggleWebhook(webhook: Webhook): void {
    webhook.active = !webhook.active
    console.log(`Webhook ${webhook.name} ${webhook.active ? "activated" : "deactivated"}`)
  }

  editWebhook(webhook: Webhook): void {
    console.log("Editing webhook:", webhook)
    // Implement edit webhook logic
  }

  testWebhook(webhook: Webhook): void {
    console.log("Testing webhook:", webhook.name)
    // Implement test webhook logic
  }

  deleteWebhook(webhook: Webhook): void {
    if (confirm(`Are you sure you want to delete ${webhook.name}?`)) {
      this.webhooks = this.webhooks.filter((w) => w.id !== webhook.id)
      console.log("Webhook deleted:", webhook)
    }
  }

  createWebhook(): void {
    if (this.newWebhook.name && this.newWebhook.url) {
      const webhook: Webhook = {
        id: Date.now(),
        name: this.newWebhook.name,
        url: this.newWebhook.url,
        active: true,
        lastTriggered: "Never",
        successRate: 0,
        totalCalls: 0,
      }
      this.webhooks.push(webhook)
      this.newWebhook = { name: "", url: "" }
      console.log("New webhook created:", webhook)
    }
  }

  // Utility Methods
  formatNumber(num: number): string {
    return num.toLocaleString()
  }

  getStatusBadgeClass(status: boolean): string {
    return status ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"
  }

  getActiveBadgeClass(active: boolean): string {
    return active ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" : "bg-gray-100 text-gray-600"
  }

}
