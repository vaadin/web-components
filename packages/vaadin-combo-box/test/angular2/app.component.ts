import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { PolymerElement } from '@vaadin/angular2-polymer';

@Component({
  selector: 'test-app',
  template: `
    <vaadin-combo-box [(value)]="selection" required class="bound"></vaadin-combo-box>

    <form [formGroup]="form">
      <vaadin-combo-box [items]="items" formControlName="selection" required></vaadin-combo-box>
    </form>
    `
})
export class TestApp {

  private _host;
  private _ref;
  private items = ['foo', 'bar', 'baz'];
  private selection = 'foo';
  public form: FormGroup;

  constructor(e: ElementRef, ref: ChangeDetectorRef) {
    this._host = e.nativeElement;
    this._ref = ref;
    this.form = new FormGroup({
      selection: new FormControl()
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
