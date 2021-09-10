/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { PositionMixin } from '@vaadin/vaadin-overlay/src/vaadin-overlay-position-mixin.js';

registerStyles(
  'vaadin-combo-box-overlay',
  css`
    #overlay {
      width: var(--vaadin-combo-box-overlay-width, var(--_vaadin-combo-box-overlay-default-width, auto));
    }

    [part='content'] {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `,
  { moduleId: 'vaadin-combo-box-overlay-styles' }
);

/**
 * An element used internally by `<vaadin-combo-box>`. Not intended to be used separately.
 *
 * @extends OverlayElement
 * @private
 */
class ComboBoxOverlayElement extends PositionMixin(OverlayElement) {
  static get is() {
    return 'vaadin-combo-box-overlay';
  }

  connectedCallback() {
    super.connectedCallback();

    const dropdown = this.__dataHost;
    const comboBox = dropdown && dropdown.getRootNode().host;
    const hostDir = comboBox && comboBox.getAttribute('dir');
    if (hostDir) {
      this.setAttribute('dir', hostDir);
    }
  }

  ready() {
    super.ready();
    const loader = document.createElement('div');
    loader.setAttribute('part', 'loader');
    const content = this.shadowRoot.querySelector('[part~="content"]');
    content.parentNode.insertBefore(loader, content);
  }
}

customElements.define(ComboBoxOverlayElement.is, ComboBoxOverlayElement);
