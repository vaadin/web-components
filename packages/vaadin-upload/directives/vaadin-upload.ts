import {
  Injector,
  Directive,
  ElementRef,
  Output,
  HostListener,
  EventEmitter,
  Provider,
  forwardRef,
  Renderer
} from 'angular2/core';
import { NgControl, NG_VALUE_ACCESSOR, DefaultValueAccessor } from 'angular2/common';
import { CONST_EXPR } from 'angular2/src/facade/lang';
declare var Polymer;

const VAADIN_UPLOAD_CONTROL_VALUE_ACCESSOR = CONST_EXPR(new Provider(
    NG_VALUE_ACCESSOR, {
      useExisting: forwardRef(() => VaadinUpload),
      multi: true
    }));

@Directive({
  selector: 'vaadin-upload',
  providers: [VAADIN_UPLOAD_CONTROL_VALUE_ACCESSOR]
})
export class VaadinUpload extends DefaultValueAccessor {

  private _element;

  @Output() filesChange: EventEmitter<any> = new EventEmitter(false);
  @HostListener('files-changed')
  fileschanged(value) {
    value = this._element.files;
    this.filesChange.emit(value);

    if (value && value.length > 0) {
      // Assuming that the registered onChange function is only used
      // for the pristine/dirty status here.
      this.onChange(value);
    }
  }

  importHref(href) {
    const link = document.createElement('link');
    link.rel = 'import';
    link.href = href;
    link.onload = this.onImport.bind(this)
    document.head.appendChild(link);
  }


  onImport() {
    this._element.$$('paper-button').addEventListener('blur', () => {
      this.onTouched();
    });
  }

  constructor(renderer: Renderer, el: ElementRef,  private _injector: Injector) {
    super(renderer, el);
    this._element = el.nativeElement;
    this.importHref('bower_components/vaadin-upload/vaadin-upload.html');
  }

}
