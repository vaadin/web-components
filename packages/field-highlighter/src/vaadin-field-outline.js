/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { fieldOutlineStyles } from './vaadin-field-highlighter-styles.js';

registerStyles('vaadin-field-outline', fieldOutlineStyles, { moduleId: 'vaadin-field-outline-styles' });

/**
 * An element used internally by `<vaadin-field-highlighter>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @private
 */
export class FieldOutline extends ThemableMixin(DirMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-field-outline';
  }

  static get properties() {
    return {
      /**
       * A user who last interacted with the field.
       */
      user: {
        type: Object,
        value: null,
        observer: '_userChanged',
        sync: true,
      },
    };
  }

  /** @protected */
  render() {
    return html``;
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('part', 'outline');

    this._field = this.getRootNode().host;
  }

  /** @private */
  _userChanged(user) {
    // Set state attribute for styling
    this.toggleAttribute('has-active-user', Boolean(user));

    // Set custom property for styling
    const value = user ? `var(--vaadin-user-color-${user.colorIndex})` : 'transparent';

    const prop = '--_active-user-color';
    this.style.setProperty(prop, value);

    if (this._field) {
      this._field.style.setProperty(prop, value);
    }
  }
}

defineCustomElement(FieldOutline);
