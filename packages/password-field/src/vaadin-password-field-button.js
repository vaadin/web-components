/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { buttonStyles } from '@vaadin/button/src/vaadin-button-styles.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
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
class PasswordFieldButton extends ButtonMixin(DirMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-password-field-button';
  }

  static get styles() {
    return [buttonStyles];
  }

  static get template() {
    const style = document.createElement('template');
    style.innerHTML = `<style>${this.styles.join(' ')}</style>`;
    return html`${style}`;
  }
}

defineCustomElement(PasswordFieldButton);
