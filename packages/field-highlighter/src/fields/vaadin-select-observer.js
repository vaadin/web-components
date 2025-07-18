/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FieldObserver } from './vaadin-field-observer.js';

export class SelectObserver extends FieldObserver {
  constructor(select) {
    super(select);

    this.overlay = select._overlayElement;
  }

  onFocusIn(event) {
    if (this.overlay._contentRoot.contains(event.target)) {
      // Focus moves to the overlay item, do nothing.
      return;
    }

    if (this.overlay._contentRoot.contains(event.relatedTarget)) {
      // Focus returns on item select, do nothing.
      return;
    }

    super.onFocusIn(event);
  }

  onFocusOut(event) {
    if (this.overlay._contentRoot.contains(event.relatedTarget)) {
      // Focus moves to the overlay on opening, do nothing.
      return;
    }

    if (this.overlay._contentRoot.contains(event.target) && this.component.contains(event.relatedTarget)) {
      // Focus returns from the overlay on closing, do nothing.
      return;
    }

    super.onFocusOut(event);
  }
}
