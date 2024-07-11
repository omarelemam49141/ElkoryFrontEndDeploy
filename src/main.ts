import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


import localeArEg from '@angular/common/locales/ar-EG';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeArEg, 'ar-EG');


import { enableProdMode } from '@angular/core';
enableProdMode();


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
