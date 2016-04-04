import {Directive, ElementRef, Output, HostListener, EventEmitter} from 'angular2/core';

@Directive({selector: 'vaadin-date-picker'})

export class VaadinDatePicker {
  
  @Output() _selectedDateChange: EventEmitter<any> = new EventEmitter(false);
  @HostListener('selected-date-changed', ['$event.detail.value'])
  _selectedDatechanged(value) {
    this._selectedDateChange.emit(value);
  }
  
  @Output() valueChange: EventEmitter<any> = new EventEmitter(false);
  @HostListener('value-changed', ['$event.detail.value'])
  valuechanged(value) {
    this.valueChange.emit(value);
  }
  
  @Output() invalidChange: EventEmitter<any> = new EventEmitter(false);
  @HostListener('invalid-changed', ['$event.detail.value'])
  invalidchanged(value) {
    this.invalidChange.emit(value);
  }
  
  constructor(el: ElementRef) {
    if (!Polymer.isInstance(el.nativeElement)) {
      Polymer.Base.importHref('bower_components/vaadin-date-picker/vaadin-date-picker.html')
    }
  }
}
