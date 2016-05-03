import {bootstrap} from '@angular/platform-browser-dynamic';
import {Component, ElementRef, ChangeDetectorRef} from '@angular/core';
import {VaadinComboBox} from '../../directives/vaadin-combo-box';

@Component({
  selector: 'test-app',
  template: `
    <vaadin-combo-box [(value)]="selection" required class="bound"></vaadin-combo-box>

    <form #testForm="ngForm">
      <vaadin-combo-box [items]="items" ngControl="selection" [value]="selection" required [_form]="testForm"></vaadin-combo-box>
    </form>
    `,
  directives: [VaadinComboBox]
})
export class TestApp {

  private _host;
  private _ref;
  private items = ['foo', 'bar', 'baz'];
  private selection = 'foo';

  constructor(e: ElementRef, ref: ChangeDetectorRef) {
    this._host = e.nativeElement;
    this._ref = ref;
  }

  ngAfterViewInit() {
    var event = new CustomEvent('readyForTests', {detail: this});
    this._host.dispatchEvent(event);
  }

  public detectChanges() {
    this._ref.detectChanges();
  }
}

document.body.addEventListener('bootstrap', () => {
  bootstrap(TestApp);
});
