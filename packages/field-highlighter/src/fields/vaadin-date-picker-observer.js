/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { ComponentObserver } from './vaadin-component-observer.js';

export class DatePickerObserver extends ComponentObserver {
  constructor(datePicker) {
    super(datePicker);

    this.datePicker = datePicker;
    this.blurWhileOpened = false;

    this.addListeners(datePicker);
  }

  addListeners(datePicker) {
    this.overlay = datePicker.$.overlay;

    datePicker.addEventListener('opened-changed', (event) => this.onOpenedChanged(event));

    this.overlay.addEventListener('focusout', (event) => this.onOverlayFocusOut(event));

    datePicker.addEventListener('focusin', (event) => this.onFocusIn(event));

    datePicker.addEventListener('focusout', (event) => this.onFocusOut(event));
  }

  isEventInOverlay(node) {
    return this.datePicker._overlayContent && this.datePicker._overlayContent.contains(node);
  }

  isFullscreen() {
    const datePicker = this.datePicker;
    return datePicker._noInput && !isKeyboardActive();
  }

  onFocusIn(event) {
    if (this.isEventInOverlay(event.target)) {
      // Focus moves to the overlay, do nothing.
      return;
    }

    if (this.isEventInOverlay(event.relatedTarget)) {
      // Focus returns from the overlay, do nothing.
      return;
    }

    if (this.blurWhileOpened) {
      this.blurWhileOpened = false;
      // Focus returns from outside the browser tab, ignore.
      return;
    }

    this.showOutline(this.datePicker);
  }

  onFocusOut(event) {
    if (this.isEventInOverlay(event.target) && this.component.contains(event.relatedTarget)) {
      // Focus returns from the overlay, do nothing.
      return;
    }

    if (this.isEventInOverlay(event.relatedTarget)) {
      // Focus moves to the overlay, do nothing.
      return;
    }

    if (!this.datePicker.opened) {
      // Field blur when closed.
      this.hideOutline(this.datePicker);
    } else {
      // Focus moves away while still opened, e.g. outside the browser.
      // Mark the date picker as blurred and wait for opened-changed.
      this.blurWhileOpened = true;
    }
  }

  onOverlayFocusOut(event) {
    if (!this.datePicker.contains(event.relatedTarget)) {
      // Mark as blurred to wait for opened-changed.
      this.blurWhileOpened = true;
    }
  }

  onOpenedChanged(event) {
    if (event.detail.value === true && this.isFullscreen()) {
      this.showOutline(this.datePicker);
    }

    // Closing after previously moving focus away.
    if (event.detail.value === false && this.blurWhileOpened) {
      this.blurWhileOpened = false;
      this.hideOutline(this.datePicker);
    }
  }
}
