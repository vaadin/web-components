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

/* prettier-ignore */
const COLORS = [
  '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff',
  '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff',
  '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff',
  '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2',
  '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'
];

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

          COLORS.forEach((color) => {
            const div = document.createElement('div');
            div.style.background = color;
            div.style.width = '20px';
            div.style.height = '20px';
            div.style.margin = '3px';
            div.addEventListener('click', () => {
              this.dispatchEvent(new CustomEvent('color-selected', { detail: { color } }));
            });
            container.appendChild(div);
          });
        }
      };
    }
  };
