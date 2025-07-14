/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { css, html, LitElement, render } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-core-styles.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-rich-text-editor>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @private
 */
class RichTextEditorPopup extends PolylitMixin(LitElement) {
  static get is() {
    return 'vaadin-rich-text-editor-popup';
  }

  static get styles() {
    return css`
      :host {
        display: none;
      }
    `;
  }

  static get properties() {
    return {
      target: {
        type: Object,
      },

      opened: {
        type: Boolean,
        notify: true,
      },

      colors: {
        type: Array,
      },

      renderer: {
        type: Object,
      },
    };
  }

  static get observers() {
    return ['__openedOrTargetChanged(opened, target)', '__colorsChanged(colors)'];
  }

  /** @protected */
  render() {
    return html`
      <vaadin-rich-text-editor-popup-overlay
        .renderer="${this.renderer}"
        .opened="${this.opened}"
        .positionTarget="${this.target}"
        no-vertical-overlap
        horizontal-align="start"
        vertical-align="top"
        focus-trap
        @opened-changed="${this._onOpenedChanged}"
        @vaadin-overlay-escape-press="${this._onOverlayEscapePress}"
      ></vaadin-rich-text-editor-popup-overlay>
    `;
  }

  /** @private */
  _onOpenedChanged(event) {
    this.opened = event.detail.value;
  }

  /** @private */
  _onOverlayEscapePress() {
    this.target.focus();
  }

  /** @private */
  _onColorClick(e) {
    const { color } = e.target.dataset;
    this.dispatchEvent(new CustomEvent('color-selected', { detail: { color } }));
  }

  /** @private */
  __colorsChanged(colors) {
    this.renderer = (root) => {
      render(
        html`
          ${colors.map(
            (color) => html`
              <button data-color="${color}" style="background: ${color}" @click="${this._onColorClick}"></button>
            `,
          )}
        `,
        root,
        { host: this },
      );
    };
  }

  /** @private */
  __openedOrTargetChanged(opened, target) {
    if (target) {
      target.setAttribute('aria-expanded', opened ? 'true' : 'false');
    }
  }
}

defineCustomElement(RichTextEditorPopup);

export { RichTextEditorPopup };

/**
 * An element used internally by `<vaadin-rich-text-editor>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @mixes OverlayMixin
 * @mixes PositionMixin
 * @private
 */
class RichTextEditorPopupOverlay extends PositionMixin(
  OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
  static get is() {
    return 'vaadin-rich-text-editor-popup-overlay';
  }

  static get styles() {
    return overlayStyles;
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" hidden></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }
}

defineCustomElement(RichTextEditorPopupOverlay);
