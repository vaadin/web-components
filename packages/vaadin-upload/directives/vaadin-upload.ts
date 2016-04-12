import {
  Injector,
  OnInit,
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
export class VaadinUpload extends DefaultValueAccessor implements OnInit {

  private _element;
  private _control;

  ngOnInit() {
    this._control = this._injector.getOptional(NgControl);
  }

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


  onImport(e) {
    this._element.$$('paper-button').addEventListener('blur', () => {
      this.onTouched();
    });
  }

  constructor(renderer: Renderer, el: ElementRef,  private _injector: Injector) {
    super(renderer, el);
    this._element = el.nativeElement;
    Polymer.Base.importHref('bower_components/vaadin-upload/vaadin-upload.html', this.onImport.bind(this));
  }

}
