import {bootstrap}    from '@angular/platform-browser-dynamic';
import {Component, Output, ElementRef, ChangeDetectorRef} from '@angular/core';
import {PolymerElement} from '@vaadin/angular2-polymer';
import {enableProdMode} from '@angular/core';
enableProdMode();

@Component({
  selector: 'test-app',
  template: `
    <vaadin-date-picker [(value)]="date" required class="bound"></vaadin-date-picker>

    <form #testForm="ngForm">
      <vaadin-date-picker ngControl="date" required [_form]="testForm"></vaadin-date-picker>
    </form>
    `,
  directives: [PolymerElement('vaadin-date-picker')]
})
export class TestApp {

  private _host;
  private _ref;
  private date = '2000-01-01';

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
