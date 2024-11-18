/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
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
        :host {
          --_vaadin-popover-content-width: auto;
          --_vaadin-popover-content-height: auto;
        }

        :host([modeless][with-backdrop]) [part='backdrop'] {
          pointer-events: none;
        }

        :host([position^='top'][top-aligned]) [part='overlay'],
        :host([position^='bottom'][top-aligned]) [part='overlay'] {
          margin-top: var(--vaadin-popover-offset-top, 0);
        }

        [part='overlay'] {
          position: relative;
          overflow: visible;
          max-height: 100%;
        }

        [part='content'] {
          overflow: auto;
          box-sizing: border-box;
          max-height: 100%;
          width: var(--_vaadin-popover-content-width);
          height: var(--_vaadin-popover-content-height);
        }

        /* Increase the area of the popover so the pointer can go from the target directly to it. */
        [part='overlay']::before {
          position: absolute;
          content: '';
          inset-block: calc(var(--vaadin-popover-offset-top, 0) * -1) calc(var(--vaadin-popover-offset-bottom, 0) * -1);
          inset-inline: calc(var(--vaadin-popover-offset-start, 0) * -1) calc(var(--vaadin-popover-offset-end, 0) * -1);
          z-index: -1;
          pointer-events: auto;
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

        [part='arrow'] {
          display: none;
          position: absolute;
          height: 0;
          width: 0;
        }

        :host([theme~='arrow']) [part='arrow'] {
          display: block;
        }
      `,
    ];
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" hidden ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="arrow"></div>
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }

  /**
   * Override method inherited from `OverlayMixin` to not close
   * modal popover on outside click when opening on focus.
   *
   * @param {Event} event
   * @return {boolean}
   * @protected
   */
  _shouldCloseOnOutsideClick(event) {
    // When opening a modal popover on mouse focusin, the focus moves to the overlay
    // and then outside click listener is fired. Detect this case and prevent closing.
    if (this.owner.__hasTrigger('focus') && isElementFocused(this)) {
      return false;
    }

    return super._shouldCloseOnOutsideClick(event);
  }
}

defineCustomElement(PopoverOverlay);
