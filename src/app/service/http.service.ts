import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { LoaderService } from './loader.service';
import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

const baseUrl = environment.apiUrl;

export interface RequestOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
  skipDefaultHeaders?: boolean;
  skipErrorNotification?: boolean;
  showSuccessNotification?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private notify: NotificationService,
    private loader: LoaderService
  ) { }

  private defaultHeaders(): HttpHeaders {
    return new HttpHeaders({
      Accept: '*/*',
      'Content-Type': 'application/json',
    });
  }

  request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    route: string,
    body?: any,
    options: RequestOptions = {}
  ): Observable<HttpResponse<T>> {
    const url = `${baseUrl}${route}`;
    const headers = options.skipDefaultHeaders
      ? options.headers || new HttpHeaders()
      : this.defaultHeaders();

    const requestOptions = {
      body,
      headers,
      params: options.params,
      observe: 'response' as const, // 👈 Return full HTTP response
    };

    this.loader.show();

    return this.http.request<T>(method, url, requestOptions).pipe(
      tap((res: HttpResponse<T>) => {
        const responseBody = res.body as any;

        if (options.showSuccessNotification && responseBody?.message) {
          if (Array.isArray(responseBody.message)) {
            responseBody.message.forEach((msg: string) => {
              this.notify.showSuccess(msg, 'Success');
            });
          } else if (typeof responseBody.message === 'string') {
            this.notify.showSuccess(responseBody.message, 'Success');
          }
        }
      }),
      catchError((error) => {
        const errorBody = error?.error;

        if (errorBody && typeof errorBody === 'object') {
          Object.keys(errorBody).forEach((key) => {
            const messages = errorBody[key];
            if (Array.isArray(messages)) {
              messages.forEach((msg: string) => {
                this.notify.showError(`${key}: ${msg}`, 'Error');
              });
            } else if (typeof messages === 'string') {
              this.notify.showError(`${key}: ${messages}`, 'Error');
            }
          });
        } else {
          this.notify.showError('An unexpected error occurred.', 'Error');
        }

        return throwError(() => error); // 👈 Properly rethrow for component to catch
      }),
      finalize(() => {
        this.loader.hide();
      })
    );
  }

  // Convenience methods
  get<T>(route: string, options?: RequestOptions): Observable<HttpResponse<T>> {
    return this.request<T>('GET', route, null, options);
  }

  post<T>(route: string, body: any, options?: RequestOptions): Observable<HttpResponse<T>> {
    return this.request<T>('POST', route, body, options);
  }

  put<T>(route: string, body: any, options?: RequestOptions): Observable<HttpResponse<T>> {
    return this.request<T>('PUT', route, body, options);
  }

  delete<T>(route: string, options?: RequestOptions): Observable<HttpResponse<T>> {
    return this.request<T>('DELETE', route, null, options);
  }

  // Fallback methods if needed
  getWithoutToken<T>(route: string): Observable<T> {
    return this.http.get<T>(`${baseUrl}${route}`);
  }

  postWithoutToken<T>(route: string, payload: any): Observable<T> {
    return this.http.post<T>(`${baseUrl}${route}`, payload);
  }
}


