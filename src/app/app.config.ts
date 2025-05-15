import { provideRouter } from '@angular/router';
import { ApplicationConfig, provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient()
  ]
};
