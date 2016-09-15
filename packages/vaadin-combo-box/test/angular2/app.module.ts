import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from "@angular/forms";
import { PolymerElement } from '@vaadin/angular2-polymer';

import { TestApp }  from './app.component';

@NgModule({
  imports: [ BrowserModule, ReactiveFormsModule ],
  declarations: [ TestApp, PolymerElement('vaadin-combo-box') ],
  bootstrap: [ TestApp ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
