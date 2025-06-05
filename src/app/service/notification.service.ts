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
    opacity: 0.95,
    borderRadius: '10px',
    timeout: 5000,
    fontSize: '16px',
    fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    cssAnimationStyle: 'fade',
    cssAnimationDuration: 400,
    clickToClose: true,
    pauseOnHover: true,
    showOnlyTheLastOne: true,
    useIcon: true,
  };

  constructor() { }

  private getMessage(message?: string, fallback?: string): string {
    return message ?? fallback ?? '';
  }

  private initStyle(type: 'success' | 'failure' | 'info' | 'warning'): INotifyOptions {
    let styleOptions: Partial<INotifyOptions> = {};

    switch (type) {
      case 'success':
        styleOptions = {
          cssAnimationStyle: 'zoom', // Sweet zoom animation for success
          cssAnimationDuration: 600,
          success: {
            background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
            textColor: '#1a3c34',
            notiflixIconColor: '#1a3c34',
            fontAwesomeIconColor: '#1a3c34',
            backOverlayColor: 'rgba(0, 128, 0, 0.1)',
          },
        };
        break;
      case 'failure':
        styleOptions = {
          timeout: 7000, // Extended timeout for user to clear
          failure: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
            textColor: '#3c1014',
            notiflixIconColor: '#3c1014',
            fontAwesomeIconColor: '#3c1014',
            backOverlayColor: 'rgba(255, 0, 0, 0.1)',
          },
        };
        break;
      case 'info':
        styleOptions = {
          info: {
            background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
            textColor: '#1e3a8a',
            notiflixIconColor: '#1e3a8a',
            fontAwesomeIconColor: '#1e3a8a',
            backOverlayColor: 'rgba(0, 0, 255, 0.1)',
          },
        };
        break;
      case 'warning':
        styleOptions = {
          timeout: 7000, // Extended timeout for user to clear
          warning: {
            background: 'linear-gradient(135deg, #ffec99 0%, #ffdb4d 100%)',
            textColor: '#4a2c00',
            notiflixIconColor: '#4a2c00',
            fontAwesomeIconColor: '#4a2c00',
            backOverlayColor: 'rgba(255, 165, 0, 0.1)',
          },
        };
        break;
    }

    const options = {
      ...this.baseOptions,
      ...styleOptions,
    };

    Notify.init(options);
    return options;
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
