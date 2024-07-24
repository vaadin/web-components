/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { css, registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const selectOverlayStyles = css`
  :host {
    align-items: flex-start;
    justify-content: flex-start;
  }

  [part='overlay'] {
    min-width: var(--vaadin-select-overlay-width, var(--vaadin-select-text-field-width));
  }

  @media (forced-colors: active) {
    [part='overlay'] {
      outline: 3px solid;
    }
  }
`;

registerStyles('vaadin-select-overlay', [overlayStyles, selectOverlayStyles], {
  moduleId: 'vaadin-select-overlay-styles',
});

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes PositionMixin
 * @mixes ThemableMixin
 * @private
 */
export class SelectOverlay extends PositionMixin(OverlayMixin(DirMixin(ThemableMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-select-overlay';
  }

  static get template() {
    return html`
      <div id="backdrop" part="backdrop" hidden$="[[!withBackdrop]]"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  static get observers() {
    return ['_updateOverlayWidth(opened, owner)'];
  }

  /** @protected */
  ready() {
    super.ready();

    // When setting `opened` as an attribute, the overlay is already teleported to body
    // by the time when `ready()` callback of the `vaadin-select` is executed by Polymer,
    // so querySelector() would return null. So we use this workaround to set properties.
    this.owner = this.__dataHost;
    this.owner._overlayElement = this;
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

  /** @private */
  _updateOverlayWidth(opened, owner) {
    if (opened && owner) {
      const widthProperty = '--vaadin-select-overlay-width';
      const customWidth = getComputedStyle(owner).getPropertyValue(widthProperty);

      if (customWidth === '') {
        this.style.removeProperty(widthProperty);
      } else {
        this.style.setProperty(widthProperty, customWidth);
      }
    }
  }
}

defineCustomElement(SelectOverlay);
