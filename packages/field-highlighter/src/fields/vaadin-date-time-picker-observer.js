/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
    return this.component.__inputs;
  }
}
