/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { comboBoxScrollerStyles } from './styles/vaadin-combo-box-scroller-base-styles.js';
import { ComboBoxScrollerMixin } from './vaadin-combo-box-scroller-mixin.js';

/**
 * An element used internally by `<vaadin-combo-box>`. Not intended to be used separately.
 *
 * @customElement vaadin-combo-box-scroller
 * @extends HTMLElement
 * @private
 */
class ComboBoxScroller extends ComboBoxScrollerMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-combo-box-scroller';
  }

  static get styles() {
    return comboBoxScrollerStyles;
  }

  /**
   * Override method from `ComboBoxScrollerMixin` to update availability when a row is reused.
   * @protected
   * @override
   */
  _updateElement(el, index) {
    super._updateElement(el, index);

    const disabled = this.owner?._isItemDisabled?.(this.items[index]) === true;
    // Leave attributes supplied by a custom renderer alone when the feature is unused.
    if (disabled || el._disabledByOwner) {
      el.toggleAttribute('disabled', disabled);
      setOrRemoveAttribute(el, 'aria-disabled', disabled && 'true');
      el._disabledByOwner = disabled;
    }
  }

  /** @protected */
  render() {
    return html`
      <div id="selector">
        <slot></slot>
      </div>
    `;
  }
}

defineCustomElement(ComboBoxScroller);

export { ComboBoxScroller };
