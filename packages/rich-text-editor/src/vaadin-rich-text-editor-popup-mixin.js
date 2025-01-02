/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

/**
 * @polymerMixin
 */
export const RichTextEditorPopupMixin = (superClass) =>
  class RichTextEditorPopupMixinClass extends superClass {
    static get properties() {
      return {
        target: {
          type: Object,
        },

        opened: {
          type: Boolean,
          notify: true,
        },

        colors: {
          type: Array,
        },

        renderer: {
          type: Object,
        },
      };
    }

    static get observers() {
      return ['__openedOrTargetChanged(opened, target)', '__colorsChanged(colors)'];
    }

    /** @private */
    __colorsChanged(colors) {
      this.renderer = (root) => {
        if (!root.firstChild) {
          colors.forEach((color) => {
            const btn = document.createElement('button');
            btn.style.background = color;
            btn.dataset.color = color;
            btn.addEventListener('click', () => {
              this.dispatchEvent(new CustomEvent('color-selected', { detail: { color } }));
            });
            root.appendChild(btn);
          });
        }
      };
    }

    /** @private */
    __openedOrTargetChanged(opened, target) {
      if (target) {
        target.setAttribute('aria-expanded', opened ? 'true' : 'false');
      }
    }

    /** @protected */
    _onOverlayEscapePress() {
      this.target.focus();
    }
  };
