/**
 * @license
 * Copyright (c) 2017 - 2021 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Dialog } from '@vaadin/dialog/src/vaadin-dialog.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-dialog-overlay',
  css`
    [part='scroller'] {
      display: flex;
      flex-direction: column;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      flex: auto;
    }

    [part='footer'] {
      display: flex;
      flex: none;
      flex-direction: row-reverse;
    }
  `,
  { moduleId: 'vaadin-crud-dialog-overlay-styles' }
);

const editorTemplate = html`
  <div part="scroller" role="group" aria-labelledby="header">
    <div part="header" id="header">
      <slot name="header"></slot>
    </div>
    <slot name="form"></slot>
  </div>

  <div part="footer" role="toolbar">
    <slot name="save-button"></slot>
    <slot name="cancel-button"></slot>
    <slot name="delete-button"></slot>
  </div>
`;

class CrudDialog extends Dialog {
  ready() {
    super.ready();

    this.renderer = (root) => {
      if (!root.__dialogInitialized) {
        root.__dialogInitialized = true;
        root.$.content.appendChild(editorTemplate.content.cloneNode(true));
      }
    };
  }
}

customElements.define('vaadin-crud-dialog', CrudDialog);
