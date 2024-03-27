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
