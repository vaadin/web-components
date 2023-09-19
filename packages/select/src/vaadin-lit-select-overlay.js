/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes PositionMixin
 * @mixes OverlayMixin
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @protected
 */
class SelectOverlay extends PositionMixin(OverlayMixin(ThemableMixin(DirMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-select-overlay';
  }

  static get styles() {
    return [
      overlayStyles,
      css`
        :host {
          align-items: flex-start;
          justify-content: flex-start;
        }

        @media (forced-colors: active) {
          [part='overlay'] {
            outline: 3px solid;
          }
        }
      `,
    ];
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

  requestContentUpdate() {
    super.requestContentUpdate();

    if (this.owner) {
      // Ensure menuElement reference is correct.
      const menuElement = this._getMenuElement();
      this.owner._assignMenuElement(menuElement);
    }
  }

  /** @protected */
  _getMenuElement() {
    return Array.from(this.children).find((el) => el.localName !== 'style');
  }
}

defineCustomElement(SelectOverlay);
