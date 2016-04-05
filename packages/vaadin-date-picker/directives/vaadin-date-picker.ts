import {Directive, ElementRef, Output, HostListener, EventEmitter} from 'angular2/core';
declare var Polymer;

@Directive({selector: 'vaadin-date-picker'})
export class VaadinDatePicker {

  private element;

  @Output() valueChange: EventEmitter<any> = new EventEmitter(false);
  @HostListener('value-changed', ['$event.detail.value'])
  valuechanged(value) {
    if (value) {
      this.valueChange.emit(value);
      this.element.fire('input');
    }
  }

  @Output() invalidChange: EventEmitter<any> = new EventEmitter(false);
  @HostListener('invalid-changed', ['$event.detail.value'])
  invalidchanged(value) {
    this.invalidChange.emit(value);
  }

  onImport(e) {
    this.element.$$('paper-input-container').addEventListener('blur', () => {
      if (!this.element.opened && !this.element._opened) {
        this.element.fire('blur');
      }
    });
  }

  constructor(el: ElementRef) {
    this.element = el.nativeElement;
    if (!Polymer.isInstance(el.nativeElement)) {
      Polymer.Base.importHref('bower_components/vaadin-date-picker/vaadin-date-picker.html', this.onImport.bind(this));
    }
  }
}
