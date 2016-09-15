import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app.module';

enableProdMode();

document.body.addEventListener('bootstrap', () => {
  platformBrowserDynamic().bootstrapModule(AppModule);
});
