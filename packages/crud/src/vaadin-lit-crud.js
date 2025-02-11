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
import '@vaadin/button/src/vaadin-lit-button.js';
import '@vaadin/confirm-dialog/src/vaadin-lit-confirm-dialog.js';
import './vaadin-lit-crud-dialog.js';
import './vaadin-lit-crud-grid.js';
import './vaadin-lit-crud-form.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CrudMixin } from './vaadin-crud-mixin.js';
import { crudStyles } from './vaadin-crud-styles.js';

/**
 * LitElement based version of `<vaadin-crud>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class Crud extends ControllerMixin(ElementMixin(ThemableMixin(CrudMixin(PolylitMixin(LitElement))))) {
  static get styles() {
    return crudStyles;
  }

  /** @protected */
  render() {
    return html`
      <div id="container">
        <div id="main">
          <slot name="grid"></slot>

          <div id="toolbar" part="toolbar">
            <slot name="toolbar"></slot>
            <slot name="new-button"></slot>
          </div>
        </div>

        <div
          part="editor"
          id="editor"
          role="group"
          aria-labelledby="header"
          ?hidden="${this.__computeEditorHidden(this.editorOpened, this._fullscreen, this.editorPosition)}"
        >
          <div part="scroller" id="scroller">
            <div part="header" id="header">
              <slot name="header"></slot>
            </div>
            <slot name="form"></slot>
          </div>

          <div part="footer" role="toolbar">
            <slot name="save-button"></slot>
            <slot name="cancel-button"></slot>
            <slot name="delete-button"></slot>
          </div>
        </div>
      </div>

      <vaadin-crud-dialog
        id="dialog"
        .opened="${this.__computeDialogOpened(this.editorOpened, this._fullscreen, this.editorPosition)}"
        .fullscreen="${this._fullscreen}"
        .ariaLabel="${this.__dialogAriaLabel}"
        .noCloseOnOutsideClick="${this.__isDirty}"
        .noCloseOnEsc="${this.__isDirty}"
        theme="${ifDefined(this._theme)}"
        @opened-changed="${this.__onDialogOpened}"
      ></vaadin-crud-dialog>

      <vaadin-confirm-dialog
        theme="${ifDefined(this._theme)}"
        id="confirmCancel"
        @confirm="${this.__confirmCancel}"
        cancel-button-visible
        .confirmText="${this.__effectiveI18n.confirm.cancel.button.confirm}"
        .cancelText="${this.__effectiveI18n.confirm.cancel.button.dismiss}"
        .header="${this.__effectiveI18n.confirm.cancel.title}"
        .message="${this.__effectiveI18n.confirm.cancel.content}"
        confirm-theme="primary"
      ></vaadin-confirm-dialog>

      <vaadin-confirm-dialog
        theme="${ifDefined(this._theme)}"
        id="confirmDelete"
        @confirm="${this.__confirmDelete}"
        cancel-button-visible
        .confirmText="${this.__effectiveI18n.confirm.delete.button.confirm}"
        .cancelText="${this.__effectiveI18n.confirm.delete.button.dismiss}"
        .header="${this.__effectiveI18n.confirm.delete.title}"
        .message="${this.__effectiveI18n.confirm.delete.content}"
        confirm-theme="primary error"
      ></vaadin-confirm-dialog>
    `;
  }

  static get is() {
    return 'vaadin-crud';
  }

  static get cvdlName() {
    return 'vaadin-crud';
  }
}

defineCustomElement(Crud);

export { Crud };
