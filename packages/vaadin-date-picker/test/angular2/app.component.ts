import { Component, Output, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'test-app',
  template: `
    <vaadin-date-picker [(value)]="boundDate" required class="bound"></vaadin-date-picker>

    <form [formGroup]="form">
      <vaadin-date-picker formControlName="date" [(value)]="date" required></vaadin-date-picker>
    </form>
    `
})
export class TestApp {

  private _host;
  private _ref;
  private boundDate = '2000-01-01';
  private date = '2000-01-01';
  public form: FormGroup;

  constructor(e: ElementRef, ref: ChangeDetectorRef) {
    this._host = e.nativeElement;
    this._ref = ref;
    this.form = new FormGroup({
      date: new FormControl()
    });
  }

  ngAfterViewInit() {
    var event = new CustomEvent('readyForTests', {detail: this});
    this._host.dispatchEvent(event);
  }

  public detectChanges() {
    this._ref.detectChanges();
  }

}
