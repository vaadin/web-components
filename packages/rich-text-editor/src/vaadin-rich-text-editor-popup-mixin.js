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

    constructor() {
      super();

      this.renderer = (root) => {
        if (!root.firstChild) {
          const container = document.createElement('div');
          container.style.maxWidth = '185px';
          container.style.display = 'flex';
          container.style.flexWrap = 'wrap';
          container.style.justifyContent = 'center';
          root.appendChild(container);

          this.colors.forEach((color) => {
            const btn = document.createElement('button');
            btn.style.background = color;
            btn.style.border = 'none';
            btn.style.width = '20px';
            btn.style.height = '20px';
            btn.style.margin = '3px';
            btn.addEventListener('click', () => {
              this.dispatchEvent(new CustomEvent('color-selected', { detail: { color } }));
            });
            container.appendChild(btn);
          });
        }
      };
    }
  };
