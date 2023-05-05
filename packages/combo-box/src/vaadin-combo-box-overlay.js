/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxOverlayMixin } from './vaadin-combo-box-overlay-mixin.js';

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
  { moduleId: 'vaadin-combo-box-overlay-styles' },
);

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-combo-box>`. Not intended to be used separately.
 *
 * @extends Overlay
 * @mixes ComboBoxOverlayMixin
 * @private
 */
export class ComboBoxOverlay extends ComboBoxOverlayMixin(Overlay) {
  static get is() {
    return 'vaadin-combo-box-overlay';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);

      const overlay = memoizedTemplate.content.querySelector('[part~="overlay"]');
      overlay.removeAttribute('tabindex');

      const loader = document.createElement('div');
      loader.setAttribute('part', 'loader');

      overlay.insertBefore(loader, overlay.firstElementChild);
    }

    return memoizedTemplate;
  }
}

customElements.define(ComboBoxOverlay.is, ComboBoxOverlay);
