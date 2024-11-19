/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { ComboBoxOverlayMixin } from '@vaadin/combo-box/src/vaadin-combo-box-overlay-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const multiSelectComboBoxOverlayStyles = css`
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
`;

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ComboBoxOverlayMixin
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes ThemableMixin
 * @private
 */
class MultiSelectComboBoxOverlay extends ComboBoxOverlayMixin(
  OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-multi-select-combo-box-overlay';
  }

  static get styles() {
    return [overlayStyles, multiSelectComboBoxOverlayStyles];
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" hidden></div>
      <div part="overlay" id="overlay">
        <div part="loader"></div>
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }
}

defineCustomElement(MultiSelectComboBoxOverlay);
