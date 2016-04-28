import {bootstrap}    from 'angular2/platform/browser';
import {Component, Output, ElementRef, ChangeDetectorRef} from 'angular2/core';
import {VaadinUpload} from '../../directives/vaadin-upload';

@Component({
  selector: 'test-app',
  template: `
    <form>
      <vaadin-upload [(files)]="files" ngControl="upload" required>Text content</vaadin-upload>
    </form>
    <vaadin-upload id="structural">
      <div class="drop-label">
        <span *ngIf="visible">Content for drop-label</span>
      </div>
      <div class="file-list">
        <span *ngIf="visible">Content for file-list</span>
      </div>
    </vaadin-upload>
    `,
  directives: [VaadinUpload]
})
export class TestApp {

  private _host;
  private _ref;
  public visible = false;
  public files = [];

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
