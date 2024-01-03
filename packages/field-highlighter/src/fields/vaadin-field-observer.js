/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
