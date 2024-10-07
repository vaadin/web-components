/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';

/**
 * @polymerMixin
 * @mixes DirMixin
 * @mixes OverlayMixin
 */
export const LoginOverlayWrapperMixin = (superClass) =>
  class LoginOverlayWrapperMixin extends OverlayMixin(DirMixin(superClass)) {
    static get properties() {
      return {
        /**
         * Title of the application.
         */
        title: {
          type: String,
          observer: '_titleChanged',
        },

        /**
         * Application description. Displayed under the title.
         */
        description: {
          type: String,
        },
      };
    }

    /** @protected */
    ready() {
      super.ready();

      // Use slot observer instead of slot controller since the latter
      // does not work well with teleporting (it removes custom title).
      const slot = this.shadowRoot.querySelector('slot[name="title"]');
      this._titleSlotObserver = new SlotObserver(slot, () => {
        const title = slot.assignedElements({ flatten: true })[0];
        if (!title) {
          return;
        }

        // Only set ID on the custom slotted title and link it using
        // aria-labelledby as the default title is in the shadow DOM.
        if (title.getAttribute('part') === 'title') {
          this.setAttribute('aria-label', this.title);
          this.removeAttribute('aria-labelledby');
        } else {
          if (!title.id) {
            title.id = `login-overlay-title-${generateUniqueId()}`;
          }
          this.removeAttribute('aria-label');
          this.setAttribute('aria-labelledby', title.id);
        }
      });
    }

    /** @private */
    _titleChanged(title) {
      if (title && this.hasAttribute('aria-label')) {
        this.setAttribute('aria-label', title);
      }
    }
  };
