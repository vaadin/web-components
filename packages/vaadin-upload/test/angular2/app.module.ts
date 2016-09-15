import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PolymerElement } from '@vaadin/angular2-polymer';

import { TestApp }  from './app.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ TestApp, PolymerElement('vaadin-upload') ],
  bootstrap: [ TestApp ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
