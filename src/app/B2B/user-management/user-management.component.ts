import { Component, type OnInit, type OnDestroy, type ElementRef, ViewChild, type AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Subject, debounceTime, takeUntil, distinctUntilChanged } from "rxjs"
import { PermissionRole, Role, User } from "./user-management.interface"
import { UserManagementService } from "../../service/user-management.service"

@Component({
  selector: "app-user-management",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.scss"],
})
export class UserManagementComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("scrollContainer") scrollContainer!: ElementRef
  @ViewChild("usersLoadingRef") usersLoadingRef!: ElementRef
  @ViewChild("rolesLoadingRef") rolesLoadingRef!: ElementRef
  @ViewChild("permissionsLoadingRef") permissionsLoadingRef!: ElementRef

  // Data
  users: User[] = []
  roles: Role[] = []
  permissionRoles: PermissionRole[] = []

  // UI State
  activeTab = "users"
  activeOnly = true
  searchTerm = ""
  selectedUser: User | null = null
  selectedRole: Role | null = null
  showUserDialog = false
  showRoleDialog = false

  // Pagination state - Users
  loading = false
  hasMore = true
  page = 1
  totalCount = 0
  initialLoading = true

  // Pagination state - Roles
  rolesLoading = false
  rolesHasMore = true
  rolesPage = 1
  rolesTotalCount = 0
  rolesInitialLoading = true

  // Pagination state - Permissions
  permissionsLoading = false
  permissionsHasMore = true
  permissionsPage = 1
  permissionsTotalCount = 0
  permissionsInitialLoading = true

  // Observers
  private usersObserver?: IntersectionObserver
  private rolesObserver?: IntersectionObserver
  private permissionsObserver?: IntersectionObserver

  // Search debounce
  private searchSubject = new Subject<string>()
  private destroy$ = new Subject<void>()

  constructor(private userManagementService: UserManagementService) { }

  ngOnInit() {
    this.setupSearchDebounce()
    this.loadInitialData()
  }

  ngAfterViewInit() {
    this.setupIntersectionObservers()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
    this.cleanupObservers()
  }

  private setupSearchDebounce() {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => {
      this.resetAndLoadUsers()
    })
  }

  private setupIntersectionObservers() {
    // Users observer
    if (this.usersLoadingRef) {
      this.usersObserver = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry.isIntersecting && this.hasMore && !this.loading) {
            this.loadMoreUsers()
          }
        },
        { threshold: 0.1, rootMargin: "100px" },
      )
      this.usersObserver.observe(this.usersLoadingRef.nativeElement)
    }

    // Roles observer
    if (this.rolesLoadingRef) {
      this.rolesObserver = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry.isIntersecting && this.rolesHasMore && !this.rolesLoading) {
            this.loadMoreRoles()
          }
        },
        { threshold: 0.1, rootMargin: "100px" },
      )
      this.rolesObserver.observe(this.rolesLoadingRef.nativeElement)
    }

    // Permissions observer
    if (this.permissionsLoadingRef) {
      this.permissionsObserver = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry.isIntersecting && this.permissionsHasMore && !this.permissionsLoading) {
            this.loadMorePermissions()
          }
        },
        { threshold: 0.1, rootMargin: "100px" },
      )
      this.permissionsObserver.observe(this.permissionsLoadingRef.nativeElement)
    }
  }

  private cleanupObservers() {
    if (this.usersObserver) {
      this.usersObserver.disconnect()
    }
    if (this.rolesObserver) {
      this.rolesObserver.disconnect()
    }
    if (this.permissionsObserver) {
      this.permissionsObserver.disconnect()
    }
  }

  private loadInitialData() {
    this.resetAndLoadUsers()
    this.resetAndLoadRoles()
    this.resetAndLoadPermissions()
  }

  // Users methods
  private loadMoreUsers() {
    if (this.loading || !this.hasMore) return

    this.loading = true
    this.userManagementService
      .fetchUsers(this.page, this.searchTerm, this.activeOnly)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          if (this.page === 1) {
            this.users = result.data
          } else {
            this.users = [...this.users, ...result.data]
          }
          this.totalCount = result.totalCount
          this.hasMore = result.hasMore
          this.page++
          this.loading = false
          this.initialLoading = false
        },
        error: (error: any) => {
          console.error("Error loading users:", error)
          this.loading = false
          this.initialLoading = false
        },
      })
  }

  private resetAndLoadUsers() {
    this.users = []
    this.page = 1
    this.hasMore = true
    this.initialLoading = true
    this.loadMoreUsers()
  }

  // Roles methods
  private loadMoreRoles() {
    if (this.rolesLoading || !this.rolesHasMore) return

    this.rolesLoading = true
    this.userManagementService
      .fetchRoles(this.rolesPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          if (this.rolesPage === 1) {
            this.roles = result.data
          } else {
            this.roles = [...this.roles, ...result.data]
          }
          this.rolesTotalCount = result.totalCount
          this.rolesHasMore = result.hasMore
          this.rolesPage++
          this.rolesLoading = false
          this.rolesInitialLoading = false
        },
        error: (error: any) => {
          console.error("Error loading roles:", error)
          this.rolesLoading = false
          this.rolesInitialLoading = false
        },
      })
  }

  private resetAndLoadRoles() {
    this.roles = []
    this.rolesPage = 1
    this.rolesHasMore = true
    this.rolesInitialLoading = true
    this.loadMoreRoles()
  }

  // Permissions methods
  private loadMorePermissions() {
    if (this.permissionsLoading || !this.permissionsHasMore) return

    this.permissionsLoading = true
    this.userManagementService
      .fetchPermissions(this.permissionsPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          if (this.permissionsPage === 1) {
            this.permissionRoles = result.data
          } else {
            this.permissionRoles = [...this.permissionRoles, ...result.data]
          }
          this.permissionsTotalCount = result.totalCount
          this.permissionsHasMore = result.hasMore
          this.permissionsPage++
          this.permissionsLoading = false
          this.permissionsInitialLoading = false
        },
        error: (error: any) => {
          console.error("Error loading permissions:", error)
          this.permissionsLoading = false
          this.permissionsInitialLoading = false
        },
      })
  }

  private resetAndLoadPermissions() {
    this.permissionRoles = []
    this.permissionsPage = 1
    this.permissionsHasMore = true
    this.permissionsInitialLoading = true
    this.loadMorePermissions()
  }

  // Event handlers
  onSearchChange(value: string) {
    this.searchTerm = value
    this.searchSubject.next(value)
  }

  onActiveFilterChange() {
    this.resetAndLoadUsers()
  }

  onTabChange(tab: string) {
    this.activeTab = tab
  }

  // Utility methods
  get hasActiveFilters(): boolean {
    return this.searchTerm.length > 0 || !this.activeOnly
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  getAccessBadgeColor(access: "Internal" | "External"): string {
    return access === "Internal"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-green-100 text-green-800 border-green-200"
  }

  getPermissionsForRole(roleId: number) {
    return this.permissionRoles.filter((pr) => pr.role.id === roleId && pr.status).map((pr) => pr.permission)
  }

  getCategorizedPermissions(category: string) {
    return this.permissionRoles.filter((pr) => {
      const name = pr.permission.name.toLowerCase()
      switch (category) {
        case "Basic":
          return name.includes("user") || name.includes("management")
        case "Admin":
          return name.includes("system") || name.includes("configuration")
        case "User Management":
          return name.includes("user") && !name.includes("system")
        case "Finance":
          return name.includes("financial") || name.includes("reports")
        default:
          return false
      }
    })
  }

  getUncategorizedPermissions() {
    return this.permissionRoles.filter((pr) => {
      const name = pr.permission.name.toLowerCase()
      return (
        !name.includes("user") &&
        !name.includes("system") &&
        !name.includes("financial") &&
        !name.includes("reports") &&
        !name.includes("management") &&
        !name.includes("configuration")
      )
    })
  }

  // Action handlers
  handleCreateUser() {
    console.log("Create user clicked")
  }

  handleCreateRole() {
    console.log("Create role clicked")
  }

  handleConfigurePermissions() {
    console.log("Configure permissions clicked")
  }

  handleClearFilters() {
    this.searchTerm = ""
    this.activeOnly = true
    this.resetAndLoadUsers()
  }

  openUserDialog(user: User) {
    this.selectedUser = user
    this.showUserDialog = true
  }

  closeUserDialog() {
    this.selectedUser = null
    this.showUserDialog = false
  }

  openRoleDialog(role: Role) {
    this.selectedRole = role
    this.showRoleDialog = true
  }

  closeRoleDialog() {
    this.selectedRole = null
    this.showRoleDialog = false
  }

  // Skeleton arrays for loading states
  get skeletonArray() {
    return Array(3).fill(0)
  }
}
