import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class WindowService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  get nativeWindow(): Window | null {
    return isPlatformBrowser(this.platformId) ? window : null;
  }
}
