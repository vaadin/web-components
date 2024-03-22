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
import { ComboBoxOverlay } from '@vaadin/combo-box/src/vaadin-combo-box-overlay.js';
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
  `,
  { moduleId: 'vaadin-multi-select-combo-box-overlay-styles' },
);

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @extends ComboBoxOverlay
 * @private
 */
class MultiSelectComboBoxOverlay extends ComboBoxOverlay {
  static get is() {
    return 'vaadin-multi-select-combo-box-overlay';
  }
}

customElements.define(MultiSelectComboBoxOverlay.is, MultiSelectComboBoxOverlay);
