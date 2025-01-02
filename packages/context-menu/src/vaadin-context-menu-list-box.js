/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ListMixin } from '@vaadin/a11y-base/src/list-mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes DirMixin
 * @mixes ListMixin
 * @mixes ThemableMixin
 * @protected
 */
class ContextMenuListBox extends ListMixin(ThemableMixin(DirMixin(ControllerMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-context-menu-list-box';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: flex;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='items'] {
          height: 100%;
          width: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
      </style>
      <div part="items">
        <slot></slot>
      </div>
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
  ready() {
    super.ready();

    this.setAttribute('role', 'menu');
  }
}

defineCustomElement(ContextMenuListBox);

export { ContextMenuListBox };
