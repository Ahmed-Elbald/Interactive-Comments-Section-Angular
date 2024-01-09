import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const LOCAL_STORAGE = new InjectionToken("Browser Local Storage", {
  providedIn: "root",
  factory: () => window.localStorage
})

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations()
  ]
};
