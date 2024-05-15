/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { PopoverOverlayMixin } from './vaadin-popover-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-popover>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes PopoverOverlayMixin
 * @mixes ThemableMixin
 * @private
 */
class PopoverOverlay extends PopoverOverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-popover-overlay';
  }

  static get styles() {
    return [
      overlayStyles,
      css`
        :host([position^='top'][top-aligned]) [part='overlay'],
        :host([position^='bottom'][top-aligned]) [part='overlay'] {
          margin-top: var(--vaadin-popover-offset-top, 0);
        }

        :host([position^='top'][bottom-aligned]) [part='overlay'],
        :host([position^='bottom'][bottom-aligned]) [part='overlay'] {
          margin-bottom: var(--vaadin-popover-offset-bottom, 0);
        }

        :host([position^='start'][start-aligned]) [part='overlay'],
        :host([position^='end'][start-aligned]) [part='overlay'] {
          margin-inline-start: var(--vaadin-popover-offset-start, 0);
        }

        :host([position^='start'][end-aligned]) [part='overlay'],
        :host([position^='end'][end-aligned]) [part='overlay'] {
          margin-inline-end: var(--vaadin-popover-offset-end, 0);
        }
      `,
    ];
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" hidden ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }
}

defineCustomElement(PopoverOverlay);
