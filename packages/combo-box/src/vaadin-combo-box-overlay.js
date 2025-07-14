/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-core-styles.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { comboBoxOverlayStyles } from './styles/vaadin-combo-box-overlay-core-styles.js';
import { ComboBoxOverlayMixin } from './vaadin-combo-box-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-combo-box>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ComboBoxOverlayMixin
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes ThemableMixin
 * @private
 */
export class ComboBoxOverlay extends ComboBoxOverlayMixin(
  OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
  static get is() {
    return 'vaadin-combo-box-overlay';
  }

  static get styles() {
    return [overlayStyles, comboBoxOverlayStyles];
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

defineCustomElement(ComboBoxOverlay);
