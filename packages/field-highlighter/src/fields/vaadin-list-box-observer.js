/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FieldObserver } from './vaadin-field-observer.js';

export class ListBoxObserver extends FieldObserver {
  getFields() {
    return this.component.items || [];
  }

  getFocusTarget(event) {
    const fields = this.getFields();
    return Array.from(event.composedPath()).find((node) => fields.includes(node));
  }
}
