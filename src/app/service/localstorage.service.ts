import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private notify: NotificationService,
  ) { }

  set(key: string, value: any): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        this.notify.showError('Error saving to localStorage', "error");
      }
    }
  }

  get(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        this.notify.showError('Error saving to localStorage', "error");
        return null;
      }
    }
    return null;
  }

  remove(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Error removing item from localStorage', e);
      }
    }
  }
  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.clear();
      } catch (e) {
        console.error('Error clearing localStorage', e);
      }
    }
  }
}
