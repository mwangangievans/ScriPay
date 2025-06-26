import { Injectable } from '@angular/core';
import { PaginationResult, PermissionRole, Role, User } from '../B2B/user-management/user-management.interface';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  // Mock data
  // private mockUsers: User[] = []

  private mockUsers: User[] = [
    {
      created_at: "2024-01-15T10:30:00.000Z",
      id: 1,
      merchant: {
        address: "123 Business St, New York, NY",
        created_at: "2023-06-01T09:00:00.000Z",
        email: "admin@techcorp.com",
        id: 101,
        location: "New York",
        modified_at: "2024-01-10T14:20:00.000Z",
        name: "TechCorp Solutions",
        logo: "https://example.com/logos/techcorp.png",
        active: true,
      },
      modified_at: "2024-06-20T16:45:00.000Z",
      user: {
        fullname: "John Smith",
        id: 1001,
        email: "john.smith@techcorp.com",
        phone_number: "+1-555-0123",
      },
      profile: "https://example.com/profiles/john-smith",
      active: true,
    },
    {
      created_at: "2024-02-20T14:15:00.000Z",
      id: 2,
      merchant: {
        address: "456 Commerce Ave, Los Angeles, CA",
        created_at: "2023-08-15T11:30:00.000Z",
        email: "contact@retailplus.com",
        id: 102,
        location: "Los Angeles",
        modified_at: "2024-02-18T10:00:00.000Z",
        name: "RetailPlus Inc",
        logo: "https://example.com/logos/retailplus.png",
        active: true,
      },
      modified_at: "2024-06-25T09:30:00.000Z",
      user: {
        fullname: "Sarah Johnson",
        id: 1002,
        email: "sarah.johnson@retailplus.com",
        phone_number: "+1-555-0456",
      },
      profile: "https://example.com/profiles/sarah-johnson",
      active: true,
    },
    {
      created_at: "2024-03-10T08:45:00.000Z",
      id: 3,
      merchant: {
        address: "789 Finance Blvd, Chicago, IL",
        created_at: "2023-09-01T13:00:00.000Z",
        email: "info@financegroup.com",
        id: 103,
        location: "Chicago",
        modified_at: "2024-03-08T15:20:00.000Z",
        name: "Finance Group LLC",
        logo: "https://example.com/logos/financegroup.png",
        active: false,
      },
      modified_at: "2024-06-22T11:15:00.000Z",
      user: {
        fullname: "Michael Brown",
        id: 1003,
        email: "michael.brown@financegroup.com",
        phone_number: "+1-555-0789",
      },
      profile: "https://example.com/profiles/michael-brown",
      active: false,
    },
  ]

  private mockRoles: Role[] = [
    {
      id: 1,
      created_at: "2025-06-16T11:45:17.317622+03:00",
      modified_at: "2025-06-16T11:45:17.317655+03:00",
      name: "Merchant Admin",
      access: "External",
      status: true,
      merchant: null,
    },
    {
      id: 2,
      created_at: "2025-06-16T12:00:00.000000+03:00",
      modified_at: "2025-06-16T12:00:00.000000+03:00",
      name: "System Administrator",
      access: "Internal",
      status: true,
      merchant: null,
    },
    {
      id: 3,
      created_at: "2025-06-16T12:15:00.000000+03:00",
      modified_at: "2025-06-16T12:15:00.000000+03:00",
      name: "Financial Manager",
      access: "External",
      status: true,
      merchant: 101,
    },
    {
      id: 4,
      created_at: "2025-06-16T12:30:00.000000+03:00",
      modified_at: "2025-06-16T12:30:00.000000+03:00",
      name: "Operations Manager",
      access: "External",
      status: false,
      merchant: 102,
    },
  ]

  private mockPermissionRoles: PermissionRole[] = [
    {
      created_at: "2025-06-16T10:00:00.000Z",
      id: 1,
      modified_at: "2025-06-16T10:00:00.000Z",
      permission: {
        created_at: "2025-06-16T09:00:00.000Z",
        id: 1,
        modified_at: "2025-06-16T09:00:00.000Z",
        name: "User Management",
        access: "Internal",
        status: true,
      },
      role: {
        created_at: "2025-06-16T11:45:17.317622+03:00",
        id: 1,
        merchant: 101,
        modified_at: "2025-06-16T11:45:17.317655+03:00",
        name: "Merchant Admin",
        access: "External",
        status: true,
      },
      status: true,
    },
    {
      created_at: "2025-06-16T10:15:00.000Z",
      id: 2,
      modified_at: "2025-06-16T10:15:00.000Z",
      permission: {
        created_at: "2025-06-16T09:15:00.000Z",
        id: 2,
        modified_at: "2025-06-16T09:15:00.000Z",
        name: "Financial Reports",
        access: "External",
        status: true,
      },
      role: {
        created_at: "2025-06-16T12:15:00.000000+03:00",
        id: 3,
        merchant: 101,
        modified_at: "2025-06-16T12:15:00.000000+03:00",
        name: "Financial Manager",
        access: "External",
        status: true,
      },
      status: true,
    },
    {
      created_at: "2025-06-16T10:30:00.000Z",
      id: 3,
      modified_at: "2025-06-16T10:30:00.000Z",
      permission: {
        created_at: "2025-06-16T09:30:00.000Z",
        id: 3,
        modified_at: "2025-06-16T09:30:00.000Z",
        name: "System Configuration",
        access: "Internal",
        status: true,
      },
      role: {
        created_at: "2025-06-16T12:00:00.000000+03:00",
        id: 2,
        merchant: 0,
        modified_at: "2025-06-16T12:00:00.000000+03:00",
        name: "System Administrator",
        access: "Internal",
        status: true,
      },
      status: true,
    },
  ]

  // Flag to simulate empty states for demonstration
  private SIMULATE_EMPTY_STATES = false

  fetchUsers(pageNum: number, search = "", activeFilter = true): Observable<PaginationResult<User>> {
    if (this.SIMULATE_EMPTY_STATES && pageNum === 1) {
      return of({
        data: [],
        totalCount: 0,
        hasMore: false,
        currentPage: pageNum,
      }).pipe(delay(800));
    }

    // Simulate a larger dataset
    const allMockUsers = Array.from({ length: 150 }, (_, index) => ({
      ...this.mockUsers[index % this.mockUsers.length],
      id: index + 1,
      user: {
        ...this.mockUsers[index % this.mockUsers.length].user,
        id: index + 1001,
        fullname: `${this.mockUsers[index % this.mockUsers.length].user.fullname} ${index + 1}`,
        email: `user${index + 1}@${this.mockUsers[index % this.mockUsers.length].user.email.split("@")[1]}`,
      },
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      active: Math.random() > 0.3, // 70% active users
    }));

    // Apply filters
    const filteredData = allMockUsers.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.user.fullname.toLowerCase().includes(search.toLowerCase()) ||
        user.user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.merchant.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !activeFilter || user.active;
      return matchesSearch && matchesStatus;
    });

    const startIndex = (pageNum - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return of({
      data: paginatedData,
      totalCount: filteredData.length,
      hasMore: endIndex < filteredData.length,
      currentPage: pageNum,
    }).pipe(delay(800));
  }

  fetchRoles(pageNum: number): Observable<PaginationResult<Role>> {
    if (this.SIMULATE_EMPTY_STATES && pageNum === 1) {
      return of({
        data: [],
        totalCount: 0,
        hasMore: false,
        currentPage: pageNum,
      }).pipe(delay(600));
    }

    // Simulate more roles
    const allMockRoles = Array.from({ length: 25 }, (_, index) => ({
      ...this.mockRoles[index % this.mockRoles.length],
      id: index + 1,
      name: `${this.mockRoles[index % this.mockRoles.length].name} ${index + 1}`,
      created_at: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    const startIndex = (pageNum - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedData = allMockRoles.slice(startIndex, endIndex);

    return of({
      data: paginatedData,
      totalCount: allMockRoles.length,
      hasMore: endIndex < allMockRoles.length,
      currentPage: pageNum,
    }).pipe(delay(600));
  }

  fetchPermissions(pageNum: number): Observable<PaginationResult<PermissionRole>> {
    if (this.SIMULATE_EMPTY_STATES && pageNum === 1) {
      return of({
        data: [],
        totalCount: 0,
        hasMore: false,
        currentPage: pageNum,
      }).pipe(delay(600));
    }

    // Simulate more permission-role relationships
    const allMockPermissions = Array.from({ length: 40 }, (_, index) => ({
      ...this.mockPermissionRoles[index % this.mockPermissionRoles.length],
      id: index + 1,
      permission: {
        ...this.mockPermissionRoles[index % this.mockPermissionRoles.length].permission,
        id: index + 1,
        name: `${this.mockPermissionRoles[index % this.mockPermissionRoles.length].permission.name} ${Math.floor(index / 3) + 1}`,
      },
      role: {
        ...this.mockPermissionRoles[index % this.mockPermissionRoles.length].role,
        id: (index % 4) + 1,
        name: `${this.mockRoles[(index % 4)].name}`,
      },
      created_at: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    const startIndex = (pageNum - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedData = allMockPermissions.slice(startIndex, endIndex);

    return of({
      data: paginatedData,
      totalCount: allMockPermissions.length,
      hasMore: endIndex < allMockPermissions.length,
      currentPage: pageNum,
    }).pipe(delay(600));
  }
}
