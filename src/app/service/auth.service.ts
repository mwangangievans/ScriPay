import { Injectable } from "@angular/core";
import { LocalstorageService } from "./localstorage.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private _LocalstorageService: LocalstorageService) { }

  saveTokens(accessToken: string, refreshToken: string) {
    this._LocalstorageService.set(this.accessTokenKey, accessToken);
    this._LocalstorageService.set(this.refreshTokenKey, refreshToken);
  }

  getAccessToken(): string | null {
    return this._LocalstorageService.get(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return this._LocalstorageService.get(this.refreshTokenKey);
  }

  logout() {
    this._LocalstorageService.remove(this.accessTokenKey);
    this._LocalstorageService.remove(this.refreshTokenKey);
  }
}


