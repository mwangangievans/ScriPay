import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private http: HttpClient) { }

  verify(data: { password: string; code: string }): Observable<any> {
    return this.http.post('/authentication/verify-code', data);
  }

  resendCode(email: string): Observable<any> {
    return this.http.post('/authentication/request-code', { email });
  }
}
