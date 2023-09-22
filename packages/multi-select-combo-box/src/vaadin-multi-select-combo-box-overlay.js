/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxOverlayMixin } from '@vaadin/combo-box/src/vaadin-combo-box-overlay-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-multi-select-combo-box-overlay',
  css`
    #overlay {
      width: var(
        --vaadin-multi-select-combo-box-overlay-width,
        var(--_vaadin-multi-select-combo-box-overlay-default-width, auto)
      );
    }

    [part='content'] {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `,
  { moduleId: 'vaadin-multi-select-combo-box-overlay-styles' },
);

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @customElement
 * @extends ComboBoxOverlay
 * @private
 */
class MultiSelectComboBoxOverlay extends ComboBoxOverlayMixin(Overlay) {
  static get is() {
    return 'vaadin-multi-select-combo-box-overlay';
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

defineCustomElement(MultiSelectComboBoxOverlay);
