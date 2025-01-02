/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComponentObserver } from './vaadin-component-observer.js';
import { DatePickerObserver } from './vaadin-date-picker-observer.js';
import { FieldObserver } from './vaadin-field-observer.js';

class DateObserver extends DatePickerObserver {
  constructor(datePicker, host) {
    super(datePicker);

    // Fire events on the host
    this.component = host;
  }

  getFieldIndex() {
    return 0;
  }
}

class TimeObserver extends FieldObserver {
  constructor(timePicker, host) {
    super(timePicker);

    // Fire events on the host
    this.component = host;
    this.timePicker = timePicker;
  }

  getFocusTarget(_event) {
    return this.timePicker;
  }

  getFieldIndex() {
    return 1;
  }
}

export class DateTimePickerObserver extends ComponentObserver {
  constructor(picker) {
    super(picker);

    const [datePicker, timePicker] = this.getFields();

    this.dateObserver = new DateObserver(datePicker, picker);
    this.timeObserver = new TimeObserver(timePicker, picker);
  }

  getFields() {
    return [this.component.querySelector('[slot=date-picker]'), this.component.querySelector('[slot=time-picker]')];
  }
}
