/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { FieldObserver } from './vaadin-field-observer.js';

export class SelectObserver extends FieldObserver {
  constructor(select) {
    super(select);

    this.overlay = select._overlayElement;
  }

  onFocusIn(event) {
    if (this.overlay._rendererRoot.contains(event.target)) {
      // Focus moves to the overlay item, do nothing.
      return;
    }

    if (this.overlay._rendererRoot.contains(event.relatedTarget)) {
      // Focus returns on item select, do nothing.
      return;
    }

    if (this.outsideClick && (event.relatedTarget == null || event.relatedTarget === document.body)) {
      // Focus is restored after closing on outside click.
      this.outsideClick = false;
      return;
    }

    super.onFocusIn(event);
  }

  onFocusOut(event) {
    if (this.overlay._rendererRoot.contains(event.relatedTarget)) {
      // Do nothing, focus moves to the overlay on opening.
      return;
    }

    if (this.overlay._rendererRoot.contains(event.target) && this.component.contains(event.relatedTarget)) {
      // Do nothing, focus moves from the overlay on select.
      return;
    }

    if (
      this.overlay._rendererRoot.contains(event.target) &&
      (event.relatedTarget == null || event.relatedTarget === document.body) &&
      !isKeyboardActive()
    ) {
      // Focus moves to body but will be restored, do nothing.
      this.outsideClick = true;
      return;
    }

    super.onFocusOut(event);
  }
}
