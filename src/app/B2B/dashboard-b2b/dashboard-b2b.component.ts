import { Component, HostListener, OnInit, OnDestroy, Inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from "@angular/router";
import { AuthService } from "../../service/auth.service";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { UserObject } from "../../Shared/Auth/user.interface";
import { LocalstorageService } from "../../service/localstorage.service";
interface NavItem {
  label: string;
  icon: string;
  route: string;
  active: boolean;
}

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

@Component({
  selector: "app-dashboard-b2b",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./dashboard-b2b.component.html",
  styleUrl: "./dashboard-b2b.component.css",
})
export class DashboardB2bComponent implements OnInit, OnDestroy {
  pageTitle = "Dashboard";
  sidebarOpen = false;
  sidebarCollapsed = false;
  dropdownOpen = false;

  private routerSubscription: Subscription = new Subscription();
  userObject: UserObject


  navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: "M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
      route: "/b2b/dashboard",
      active: true,
    },
    {
      label: "Analytics",
      icon: "M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z",
      route: "/b2b/analytics",
      active: false,
    },
    {
      label: "Payments",
      icon: "M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z",
      route: "/b2b/payments",
      active: false,
    },
    {
      label: "Wallet",
      icon: "M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z",
      route: "/b2b/wallet",
      active: false,
    },
    {
      label: "Merchants",
      icon: "M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z",
      route: "/b2b/merchants",
      active: false,
    },
  ];

  // user: User = {
  //   name: "Sammy Maina",
  //   email: "helloworld@gmail.com",
  //   avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  //   role: "Admin",
  // };

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private authService: AuthService,
    private localStorageService: LocalstorageService,

    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.userObject = this.localStorageService.get("userObject")

    // Listen for route changes
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
        this.updateActiveNavItem();
        this.closeMobileSidebar();
      });

    // Initial setup
    this.updatePageTitle();
    this.updateActiveNavItem();
    this.handleResize();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any): void {
    this.handleResize();
  }

  @HostListener("document:click", ["$event"])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;

    // Close dropdown if clicking outside
    if (!target.closest(".dropdown-container")) {
      this.dropdownOpen = false;
    }

    // Close mobile sidebar if clicking outside
    if (!target.closest(".sidebar-container") && !target.closest(".menu-toggle")) {
      if (isPlatformBrowser(this.platformId) && window.innerWidth < 1024) {
        this.sidebarOpen = false;
      }
    }
  }

  private handleResize(): void {
    if (isPlatformBrowser(this.platformId) && window.innerWidth >= 1024) {
      this.sidebarOpen = false;
    }
  }

  private updatePageTitle(): void {
    const currentItem = this.navItems.find(
      (item) =>
        this.router.url.includes(item.route) ||
        (item.route === "/b2b/dashboard" && this.router.url === "/b2b/dashboard")
    );

    // Fallback: check for children routes with data.title
    let route = this.route;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const routeTitle = route.snapshot.data?.['title'];

    if (routeTitle) {
      this.pageTitle = routeTitle;
      this.titleService.setTitle(routeTitle);
    } else if (currentItem) {
      this.pageTitle = currentItem.label;
      this.titleService.setTitle(currentItem.label);
    }
  }

  private updateActiveNavItem(): void {
    this.navItems.forEach((item) => {
      item.active =
        this.router.url === item.route || (item.route === "/b2b/dashboard" && this.router.url.endsWith("/dashboard"));
    });
  }

  private closeMobileSidebar(): void {
    if (isPlatformBrowser(this.platformId) && window.innerWidth < 1024) {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth >= 1024) {
        this.sidebarCollapsed = !this.sidebarCollapsed;
      } else {
        this.sidebarOpen = !this.sidebarOpen;
      }
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  getUserInitials(): string {
    return this.userObject.user.fullname
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  getFirstName(): string {
    return this.userObject.user.fullname.split(" ")[0];
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route || (route === "/b2b/dashboard" && this.router.url.endsWith("/dashboard"));
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, { paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored' });
  }
}
