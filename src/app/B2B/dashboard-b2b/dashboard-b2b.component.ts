import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-dashboard-b2b',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-b2b.component.html',
  styleUrl: './dashboard-b2b.component.css'
})
export class DashboardB2bComponent {
  pageTitle = '';
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const isInside = target.closest('.menu-container');
    if (!isInside) {
      this.isMenuOpen = false;
    }
  }


  constructor(public router: Router, private route: ActivatedRoute, private titleService: Title, private _AuthService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Listen for route changes
    this.router.events.subscribe(() => {
      let currentRoute = this.route;
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      const title = currentRoute.snapshot.data['title'];
      if (title) {
        this.pageTitle = title;
        this.titleService.setTitle(title);
        this.cdr.detectChanges(); // Trigger change detection
      }
    });

  }

  logout() {
    this._AuthService.logout()
    this.router.navigate(['/login'])

  }


  user = {
    name: 'Sammy Maina',
    email: 'helloworld@gmail.com',
    avatar: '/api/placeholder/40/40',
  };

  // sidebar.component.ts
  navItems = [
    {
      label: 'Dashboard',
      icon: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      route: '/b2b/dashboard'

    },
    {
      label: 'Analytics',
      icon: 'M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z',
      route: '/b2b/analytics'
    },
    {
      label: 'Payments',
      icon: 'M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z',
      route: '/b2b/payments'
    },
    {
      label: 'Wallet',
      icon: 'M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z',
      route: '/b2b/wallet'
    },
    {
      label: 'Merchants',
      icon: 'M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z',
      route: '/b2b/merchants'
    }
  ];

}


