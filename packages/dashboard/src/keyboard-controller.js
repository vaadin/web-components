/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import { fireMove, fireRemove, fireResize } from './vaadin-dashboard-helpers.js';

/**
 * A controller for managing widget/section keyboard interactions.
 */
export class KeyboardController {
  constructor(host) {
    this.host = host;

    host.addEventListener('focusout', (e) => this.__focusout(e));
    host.addEventListener('focusin', (e) => this.__focusin(e));
    host.addEventListener('keydown', (e) => this.__keydown(e));
  }

  /** @private */
  __focusout(e) {
    const focusOutElement = e.composedPath()[0];
    const isHostVisible = !!this.host.offsetHeight;
    const isFocusButtonHidden = getComputedStyle(focusOutElement).display === 'none';
    if (isHostVisible && isFocusButtonHidden) {
      this.host.__focusApply();
    } else {
      this.host.__exitMode();
      this.host.__focused = false;
      this.host.__selected = false;
    }
  }

  /** @private */
  __focusin(e) {
    if (e.target === this.host) {
      this.host.__focused = true;
    }
  }

  /** @private */
  __keydown(e) {
    if (e.metaKey || e.ctrlKey || !this.host.__selected) {
      return;
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      this.__delete(e);
    } else if (e.key === 'Escape') {
      this.__escape(e);
    } else if (e.shiftKey && e.key.startsWith('Arrow')) {
      this.__resize(e);
    } else if (e.key.startsWith('Arrow')) {
      this.__move(e);
    }
  }

  /** @private */
  __delete(e) {
    e.preventDefault();
    fireRemove(this.host);
  }

  /** @private */
  __escape(e) {
    e.preventDefault();
    if (this.host.__moveMode) {
      this.host.__exitMode(true);
    } else {
      this.host.__selected = false;
      this.host.focus();
    }
  }

  /** @private */
  __resize(e) {
    const resizeMap = {
      ArrowRight: [document.dir === 'rtl' ? -1 : 1, 0],
      ArrowLeft: [document.dir === 'rtl' ? 1 : -1, 0],
      ArrowDown: [0, 1],
      ArrowUp: [0, -1],
    };
    if (resizeMap[e.key]) {
      e.preventDefault();
      fireResize(this.host, ...resizeMap[e.key]);
    }
  }

  /** @private */
  __move(e) {
    const moveMap = {
      ArrowRight: document.dir === 'rtl' ? -1 : 1,
      ArrowLeft: document.dir === 'rtl' ? 1 : -1,
      ArrowDown: 1,
      ArrowUp: -1,
    };
    if (moveMap[e.key]) {
      e.preventDefault();
      fireMove(this.host, moveMap[e.key]);
    }
  }
}
