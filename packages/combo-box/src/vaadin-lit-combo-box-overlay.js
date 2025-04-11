/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxOverlayMixin } from './vaadin-combo-box-overlay-mixin.js';

const comboBoxOverlayStyles = css`
  [part='overlay'] {
    position: relative;
    width: var(--vaadin-combo-box-overlay-width, var(--_vaadin-combo-box-overlay-default-width, auto));
  }

  [part~='loader'] {
    animation: spin 1s linear infinite;
    border: 2px solid;
    border-color: var(--_vaadin-background-container-strong) var(--_vaadin-background-container-strong)
      var(--_vaadin-color-strong) var(--_vaadin-color-strong);
    border-radius: var(--_vaadin-radius-full);
    box-sizing: border-box;
    display: none;
    height: var(--vaadin-icon-size, 1lh);
    inset: 6px 8px auto auto;
    pointer-events: none;
    position: absolute;
    width: var(--vaadin-icon-size, 1lh);
  }

  [part='content'] {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  :host([loading]) [part~='loader'] {
    display: block;
  }

  :host([loading]) [part~='content'] {
    min-height: calc(var(--vaadin-icon-size, 1lh) + 12px);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
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
