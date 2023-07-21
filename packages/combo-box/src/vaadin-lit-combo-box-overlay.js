/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxOverlayMixin } from './vaadin-combo-box-overlay-mixin.js';

const comboBoxOverlayStyles = css`
  #overlay {
    width: var(--vaadin-combo-box-overlay-width, var(--_vaadin-combo-box-overlay-default-width, auto));
  }

  [part='content'] {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

/**
 * An element used internally by `<vaadin-combo-box>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ComboBoxOverlayMixin
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes ThemableMixin
 * @private
 */
export class ComboBoxOverlay extends ComboBoxOverlayMixin(
  OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-combo-box-overlay';
  }

  static get styles() {
    return [overlayStyles, comboBoxOverlayStyles, comboBoxOverlayStyles];
  }

  static get properties() {
    return {
      /**
       * When true, the overlay is visible and attached to body.
       * This property config is overridden to set `sync: true`.
       */
      opened: {
        type: Boolean,
        notify: true,
        observer: '_openedChanged',
        reflectToAttribute: true,
        sync: true,
      },
    };
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

customElements.define(ComboBoxOverlay.is, ComboBoxOverlay);
