/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-core-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { selectOverlayStyles } from './styles/vaadin-select-overlay-core-styles.js';
import { SelectOverlayMixin } from './vaadin-select-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes SelectOverlayMixin
 * @mixes ThemableMixin
 * @private
 */
export class SelectOverlay extends SelectOverlayMixin(ThemableMixin(LumoInjectionMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-select-overlay';
  }

  static get styles() {
    return [overlayStyles, selectOverlayStyles];
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('renderer')) {
      this.requestContentUpdate();
    }
  }
}

defineCustomElement(SelectOverlay);
