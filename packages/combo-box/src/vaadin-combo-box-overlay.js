/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { PositionMixin } from '@vaadin/vaadin-overlay/src/vaadin-overlay-position-mixin.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-combo-box>`. Not intended to be used separately.
 *
 * @extends OverlayElement
 * @private
 */
export class ComboBoxOverlay extends PositionMixin(OverlayElement) {
  static get is() {
    return 'vaadin-combo-box-overlay';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);
      memoizedTemplate.content.querySelector('[part~="overlay"]').removeAttribute('tabindex');
    }

    return memoizedTemplate;
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

  _outsideClickListener(event) {
    const eventPath = event.composedPath();
    if (!eventPath.includes(this.positionTarget) && !eventPath.includes(this)) {
      this.close();
    }
  }
}

customElements.define(ComboBoxOverlay.is, ComboBoxOverlay);
