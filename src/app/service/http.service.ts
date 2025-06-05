import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, tap, catchError, finalize, throwError, filter } from 'rxjs';
import { LoaderService } from './loader.service';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

const baseUrl = environment.apiUrl;

export interface RequestOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
  skipErrorNotification?: boolean;
  showSuccessNotification?: boolean;
  skipAuth?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private notify: NotificationService,
    private loader: LoaderService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private createOptions(options: RequestOptions = {}, isFormData: boolean = false): any {
    let headers = options.headers || new HttpHeaders();

    // Add skip-auth header if specified
    if (options.skipAuth) {
      headers = headers.set('skip-auth', 'true');
    }

    // Don't set 'Content-Type' header manually if sending FormData
    if (!isFormData && !headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return {
      headers,
      params: options.params,
      observe: 'response' as const,
    };
  }

  request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    route: string,
    body?: any,
    options: RequestOptions = {}
  ): Observable<HttpResponse<T>> {
    const url = `${baseUrl}${route}`;
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const requestOptions = this.createOptions(options, isFormData);

    this.loader.show();

    return this.http.request<T>(method, url, { ...requestOptions, body }).pipe(
      filter((event: HttpEvent<T>): event is HttpResponse<T> => event instanceof HttpResponse),
      tap((res: HttpResponse<T>) => this.handleSuccess(res, options)),
      catchError((error) => this.handleError(error, options)),
      finalize(() => this.loader.hide())
    );
  }

  private handleSuccess<T>(res: HttpResponse<T>, options: RequestOptions): void {
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
  }

  private handleError(error: any, options: RequestOptions): Observable<never> {
    if (isPlatformBrowser(this.platformId) && !options.skipErrorNotification) {
      const errorBody = error?.error;

      if (errorBody && typeof errorBody === 'object') {
        // Case 1: errorBody is an array of error objects
        if (Array.isArray(errorBody)) {
          errorBody.forEach((entry) => {
            if (typeof entry === 'object' && entry !== null) {
              Object.entries(entry).forEach(([key, messages]) => {
                if (Array.isArray(messages)) {
                  messages.forEach((msg: string) => {
                    if (msg === 'Email is not verified') {
                      this.notify.showWarning(`${key}: ${msg}`, 'Warning');
                    } else {
                      this.notify.showError(`${key}: ${msg}`, 'Error');
                    }
                  });
                } else if (typeof messages === 'string') {
                  this.notify.showError(`${key}: ${messages}`, 'Error');
                }
              });
            }
          });
          return throwError(() => error);
        }

        // Case 2: errorBody.error is an array of messages
        if (Array.isArray(errorBody.error)) {
          errorBody.error.forEach((msg: string) => this.notify.showError(msg, 'Error'));
        }

        // Case 3: Handle additional keys including string or array messages
        Object.entries(errorBody).forEach(([key, value]) => {
          if (key === 'error' && Array.isArray(value)) {
            return; // Already handled
          }

          if (Array.isArray(value)) {
            value.forEach((msg: string) => {
              if (key === 'username' && msg.includes('Email is not verified')) {
                // this.notify.showWarning('An unexpected error occurred.', 'Error');
                this.notify.showWarning(`${key}: ${msg}`, 'Warning');

              } else {
                this.notify.showError(`${key}: ${msg}`, 'Error');
              }
            });
          } else if (typeof value === 'string') {
            this.notify.showError(`${key}: ${value}`, 'Error');
          }
        });
      } else {
        this.notify.showError('An unexpected error occurred.', 'Error');
      }
    }

    return throwError(() => error);
  }





  get<T>(route: string, options: RequestOptions = {}): Observable<HttpResponse<T>> {
    return this.request<T>('GET', route, null, options);
  }

  post<T>(route: string, body: any, options: RequestOptions = {}): Observable<HttpResponse<T>> {
    return this.request<T>('POST', route, body, options);
  }

  put<T>(route: string, body: any, options: RequestOptions = {}): Observable<HttpResponse<T>> {
    return this.request<T>('PUT', route, body, options);
  }

  delete<T>(route: string, options: RequestOptions = {}): Observable<HttpResponse<T>> {
    return this.request<T>('DELETE', route, null, options);
  }

  getWithoutToken<T>(route: string): Observable<T> {
    return this.http.get<T>(`${baseUrl}${route}`, {
      headers: new HttpHeaders({ 'skip-auth': 'true' }),
    });
  }

  postWithoutToken<T>(route: string, payload: any): Observable<T> {
    return this.http.post<T>(`${baseUrl}${route}`, payload, {
      headers: new HttpHeaders({ 'skip-auth': 'true' }),
    });
  }
}
