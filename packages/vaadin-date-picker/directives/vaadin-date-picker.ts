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
} from '@angular/core';
import { NgControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/common';

console.warn(
  'The `VaadinDatePicker` directive is deprecated. Please use ' +
  '`PolymerElement(\'vaadin-date-picker\')` from the ' +
  '`@vaadin/angular2-polymer` npm package instead.'
);

const Polymer = (<any>window).Polymer;

const VAADIN_DATE_PICKER_CONTROL_VALUE_ACCESSOR = new Provider(
  NG_VALUE_ACCESSOR, {
    useExisting: forwardRef(() => VaadinDatePicker),
    multi: true
  });

@Directive({
  selector: 'vaadin-date-picker',
  providers: [VAADIN_DATE_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class VaadinDatePicker implements ControlValueAccessor, OnInit {

  private _element: any;
  private _renderer: any;
  private _control: any;
  private _initialValueSet = false;

  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this._renderer.setElementProperty(this._element, 'value', value);
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }


  ngOnInit() {
    this._control = this._injector.get(NgControl, null);
  }

  @Output() valueChange: EventEmitter<any> = new EventEmitter(false);
  @HostListener('value-changed', ['$event.detail.value'])
  valuechanged(value: any) {
    this.valueChange.emit(value);

    if (this._initialValueSet) {
      // Do not trigger onChange when the initial (empty) value is set
      // to keep the field as "pristine".
      this.onChange(value);
    } else {
      this._initialValueSet = true;
    }

    // Pass the invalid state to our native vaadin-date-picker element if
    // it is an ngControl.
    if (this._control != null) {
      setTimeout(() => {
        this._element.invalid = !this._control.pristine && !this._control.valid;
      }, 0);
    }
  }

  constructor(renderer: Renderer, el: ElementRef, private _injector: Injector) {
    if (!Polymer ||  !Polymer.isInstance(el.nativeElement)) {
      console.error("vaadin-date-picker has not been imported yet, please remember to import vaadin-date-picker.html in your main HTML page.");
      return;
    }

    this._renderer = renderer;
    this._element = el.nativeElement;
    this._element.$$('paper-input-container').addEventListener('blur', () => {
      if (!this._element.opened && !this._element._opened) {
        this.onTouched();
      }
    });
  }
}
