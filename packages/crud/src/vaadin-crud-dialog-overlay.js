/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { DialogOverflowController } from '@vaadin/dialog/src/vaadin-dialog-overflow-controller.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { crudDialogOverlayStyles } from './styles/vaadin-crud-dialog-overlay-base-styles.js';

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 *
 * @customElement vaadin-crud-dialog-overlay
 * @extends HTMLElement
 * @private
 */
class CrudDialogOverlay extends OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-crud-dialog-overlay';
  }

  static get styles() {
    return crudDialogOverlayStyles;
  }

  /**
   * Override method from OverlayFocusMixin to use dialog as focus root
   * @protected
   * @override
   */
  get _focusRoot() {
    // Do not use `owner` since that points to `vaadin-crud`
    return this.getRootNode().host;
  }

  /** @protected */
  render() {
    return html`
      <div part="backdrop" id="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay">
        <section id="resizerContainer" class="resizer-container">
          <header part="header">
            <slot name="header"></slot>
          </header>
          <div part="content" id="content">
            <slot name="form"></slot>
          </div>
          <footer part="footer" role="toolbar">
            <slot name="save-button"></slot>
            <slot name="cancel-button"></slot>
            <slot name="delete-button"></slot>
          </footer>
        </section>
      </div>
    `;
  }

  /**
   * @protected
   * @override
   */
  ready() {
    super.ready();

    // Detect overflow of the content part and toggle the `overflow` attribute
    this.__overflowController = new DialogOverflowController(this);
    this.addController(this.__overflowController);

    // CRUD has header and footer but does not use renderers
    this.setAttribute('has-header', '');
    this.setAttribute('has-footer', '');
  }
}

defineCustomElement(CrudDialogOverlay);
