/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComponentObserver } from './vaadin-component-observer.js';

export class DatePickerObserver extends ComponentObserver {
  constructor(datePicker) {
    super(datePicker);

    this.datePicker = datePicker;
    this.fullscreenFocus = false;
    this.blurWhileOpened = false;

    this.addListeners(datePicker);
  }

  addListeners(datePicker) {
    this.overlay = datePicker.$.overlay;

    // Fullscreen date picker calls blur() to avoid focusing of the input:
    // 1. first time when focus event is fired (before opening the overlay),
    // 2. second time after the overlay is open, see "_onOverlayOpened".
    // Here we set the flag to ignore related focusout events and then to
    // mark date picker as being edited by user (to show field highlight).
    // We have to use capture phase in order to catch this event early.
    datePicker.addEventListener('blur', (event) => this.onBlur(event), true);

    datePicker.addEventListener('opened-changed', (event) => this.onOpenedChanged(event));

    this.overlay.addEventListener('focusout', (event) => this.onOverlayFocusOut(event));

    datePicker.addEventListener('focusin', (event) => this.onFocusIn(event));

    datePicker.addEventListener('focusout', (event) => this.onFocusOut(event));
  }

  onBlur(event) {
    const datePicker = this.datePicker;
    if (datePicker._fullscreen && event.relatedTarget !== this.overlay) {
      this.fullscreenFocus = true;
    }
  }

  onFocusIn(event) {
    if (event.relatedTarget === this.overlay) {
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
    if (this.fullscreenFocus || event.relatedTarget === this.overlay) {
      // Do nothing, overlay is opening.
    } else if (!this.datePicker.opened) {
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
    if (event.detail.value === true && this.fullscreenFocus) {
      this.fullscreenFocus = false;
      this.showOutline(this.datePicker);
    }

    // Closing after previously moving focus away.
    if (event.detail.value === false && this.blurWhileOpened) {
      this.blurWhileOpened = false;
      this.hideOutline(this.datePicker);
    }
  }
}
