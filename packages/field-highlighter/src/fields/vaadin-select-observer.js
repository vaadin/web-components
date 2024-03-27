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

export class SelectObserver extends FieldObserver {
  constructor(select) {
    super(select);

    this.blurWhileOpened = false;
    this.overlay = select._overlayElement;
  }

  addListeners(select) {
    super.addListeners(select);

    select.addEventListener('opened-changed', (event) => {
      // When in phone mode, focus is lost when closing.
      if (select._phone && event.detail.value === false) {
        this.hideOutline(select);
      }
    });
  }

  onFocusIn(event) {
    if (this.overlay.contains(event.relatedTarget)) {
      // Focus returns on item select, do nothing.
      return;
    }

    if (!this.component._phone && this.overlay.hasAttribute('closing')) {
      // Focus returns on outside click, do nothing.
      return;
    }

    super.onFocusIn(event);
  }

  onFocusOut(event) {
    if (this.overlay.contains(event.relatedTarget)) {
      // Do nothing, overlay is opening.
      return;
    }
    super.onFocusOut(event);
  }
}
