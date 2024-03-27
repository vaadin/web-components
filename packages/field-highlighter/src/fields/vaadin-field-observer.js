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

export class FieldObserver extends ComponentObserver {
  constructor(field) {
    super(field);

    this.addListeners(field);
  }

  addListeners(field) {
    field.addEventListener('focusin', (event) => this.onFocusIn(event));
    field.addEventListener('focusout', (event) => this.onFocusOut(event));
  }

  onFocusIn(event) {
    const target = this.getFocusTarget(event);
    this.showOutline(target);
  }

  onFocusOut(event) {
    const target = this.getFocusTarget(event);
    this.hideOutline(target);
  }
}
