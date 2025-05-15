import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { INotifyOptions } from 'notiflix';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly baseOptions: INotifyOptions = {
    width: '420px',
    position: 'right-top',
    distance: '20px',
    opacity: 1,
    borderRadius: '8px',
    timeout: 5000,
    fontSize: '16px',
    fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    cssAnimationStyle: 'fade',
    clickToClose: true,
    pauseOnHover: true,
    showOnlyTheLastOne: true,
  };

  constructor() { }

  private getMessage(message?: string, fallback?: string): string {
    return message ?? fallback ?? '';
  }

  private initStyle(type: 'success' | 'failure' | 'info' | 'warning'): void {
    let styleOptions: Partial<INotifyOptions> = {};

    switch (type) {
      case 'success':
        styleOptions = {
          success: {
            background: '#e6f4ea',
            textColor: '#237804',
            notiflixIconColor: '#237804',
          },
        };
        break;
      case 'failure':
        styleOptions = {
          failure: {
            background: '#fff1f0',
            textColor: '#a8071a',
            notiflixIconColor: '#a8071a',
          },
        };
        break;
      case 'info':
        styleOptions = {
          info: {
            background: '#e6f7ff',
            textColor: '#096dd9',
            notiflixIconColor: '#096dd9',
          },
        };
        break;
      case 'warning':
        styleOptions = {
          warning: {
            background: '#fffbe6',
            textColor: '#ad8b00',
            notiflixIconColor: '#ad8b00',
          },
        };
        break;
    }

    Notify.init({
      ...this.baseOptions,
      ...styleOptions,
    });
  }

  showSuccess(message?: string, title?: string): void {
    this.initStyle('success');
    Notify.success(this.getMessage(message, title));
  }

  showError(message?: string, title?: string): void {
    this.initStyle('failure');
    Notify.failure(this.getMessage(message, title));
  }

  showInfo(message?: string, title?: string): void {
    this.initStyle('info');
    Notify.info(this.getMessage(message, title));
  }

  showWarning(message?: string, title?: string): void {
    this.initStyle('warning');
    Notify.warning(this.getMessage(message, title));
  }

}
