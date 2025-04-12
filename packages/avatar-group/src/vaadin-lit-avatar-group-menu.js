/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { ListMixin } from '@vaadin/a11y-base/src/list-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-avatar-group>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes DirMixin
 * @mixes ListMixin
 * @mixes ThemableMixin
 * @protected
 */
class AvatarGroupMenu extends ListMixin(ThemableMixin(DirMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-avatar-group-menu';
  }

  static get styles() {
    return css`
      :host {
        display: flex;
      }

      :host([hidden]) {
        display: none !important;
      }

      [part='items'] {
        height: 100%;
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
        width: 100%;
      }
    `;
  }

  static get properties() {
    return {
      // We don't need to define this property since super default is vertical,
      // but we don't want it to be modified, or be shown in the API docs.
      /** @private */
      orientation: {
        readOnly: true,
      },
    };
  }

  /**
   * @return {!HTMLElement}
   * @protected
   * @override
   */
  get _scrollerElement() {
    return this.shadowRoot.querySelector('[part="items"]');
  }

  /** @protected */
  render() {
    return html`
      <div part="items">
        <slot></slot>
      </div>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'menu');
  }
}

defineCustomElement(AvatarGroupMenu);

export { AvatarGroupMenu };
