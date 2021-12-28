/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@polymer/polymer/lib/elements/dom-repeat.js';
import './vaadin-multi-select-combo-box-chip.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { css, registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MultiSelectComboBoxMixin } from './vaadin-multi-select-combo-box-mixin.js';

registerStyles(
  'vaadin-multi-select-combo-box-chips',
  css`
    :host {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 1;
      min-width: 0;
    }

    :host([hidden]) {
      display: none !important;
    }
  `,
  { moduleId: 'vaadin-multi-select-combo-box-chips-styles' }
);

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes MultiSelectComboBoxMixin
 * @mixes ThemableMixin
 * @private
 */
class MultiSelectComboBoxChips extends MultiSelectComboBoxMixin(ThemableMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-multi-select-combo-box-chips';
  }

  static get template() {
    return html`
      <template id="repeat" is="dom-repeat" items="[[items]]">
        <vaadin-multi-select-combo-box-chip
          part="chip"
          item="[[item]]"
          label="[[_getItemLabel(item, itemLabelPath)]]"
        ></vaadin-multi-select-combo-box-chip>
      </template>
    `;
  }

  requestContentUpdate() {
    this.$.repeat.render();
  }
}

customElements.define(MultiSelectComboBoxChips.is, MultiSelectComboBoxChips);
