/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { buttonStyles } from '@vaadin/button/src/vaadin-button-base.js';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-password-field>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ButtonMixin
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @private
 */
class PasswordFieldButton extends ButtonMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-password-field-button';
  }

  static get styles() {
    return [
      buttonStyles,
      css`
        :host {
          --vaadin-button-background: transparent;
          --vaadin-button-border: none;
          --vaadin-button-padding: 0;
          color: var(--_vaadin-color-subtle);
          display: block;
          cursor: default;
        }

        :host::before {
          background: currentColor;
          content: '';
          display: block;
          height: var(--vaadin-icon-size, 1lh);
          mask-image: var(--_vaadin-icon-eye);
          width: var(--vaadin-icon-size, 1lh);
        }

        :host([aria-pressed='true'])::before {
          mask-image: var(--_vaadin-icon-eye-slash);
        }

        @media (forced-colors: active) {
          :host::before {
            background: CanvasText;
          }
        }
      `,
    ];
  }

  /** @protected */
  render() {
    return html``;
  }
}

defineCustomElement(PasswordFieldButton);
