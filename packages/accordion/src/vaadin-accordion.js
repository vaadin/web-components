/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { AccordionPanel } from './vaadin-accordion-panel.js';

/**
 * `<vaadin-accordion>` is a Web Component implementing accordion widget —
 * a vertically stacked set of expandable panels. The component should be
 * used as a wrapper for two or more `<vaadin-accordion-panel>` components.
 *
 * Panel headings function as controls that enable users to open (expand)
 * or hide (collapse) their associated sections of content. The user can
 * toggle panels by mouse click, Enter and Space keys.
 *
 * Only one panel can be opened at a time, opening a new one forces
 * previous panel to close and hide its content.
 *
 * ```
 * <vaadin-accordion>
 *   <vaadin-accordion-panel>
 *     <div slot="summary">Panel 1</div>
 *     This panel is opened, so the text is visible by default.
 *   </vaadin-accordion-panel>
 *   <vaadin-accordion-panel>
 *     <div slot="summary">Panel 2</div>
 *     After opening this panel, the first one becomes closed.
 *   </vaadin-accordion-panel>
 * </vaadin-accordion>
 * ```
 *
 * ### Styling
 *
 * See the [`<vaadin-accordion-panel>`](#/elements/vaadin-accordion-panel)
 * documentation for the available state attributes and stylable shadow parts.
 *
 * **Note:** You can apply the theme to `<vaadin-accordion>` component itself,
 * especially by using the following CSS selector:
 *
 * ```
 * :host ::slotted(vaadin-accordion-panel) {
 *   margin-bottom: 5px;
 * }
 * ```
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Accordion extends ThemableMixin(ElementMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
      <slot></slot>
    `;
  }

  static get is() {
    return 'vaadin-accordion';
  }

  static get properties() {
    return {
      /**
       * The index of currently opened panel. First panel is opened by
       * default. Only one panel can be opened at the same time.
       * Setting null or undefined closes all the accordion panels.
       * @type {number}
       */
      opened: {
        type: Number,
        value: 0,
        notify: true,
        reflectToAttribute: true,
      },

      /**
       * The list of `<vaadin-accordion-panel>` child elements.
       * It is populated from the elements passed to the light DOM,
       * and updated dynamically when adding or removing panels.
       * @type {!Array<!AccordionPanel>}
       */
      items: {
        type: Array,
        readOnly: true,
        notify: true,
      },
    };
  }

  static get observers() {
    return ['_updateItems(items, opened)'];
  }

  constructor() {
    super();
    this._boundUpdateOpened = this._updateOpened.bind(this);
  }

  /**
   * @return {Element | null}
   * @protected
   */
  get focused() {
    return this.getRootNode().activeElement;
  }

  /**
   * @protected
   */
  focus() {
    if (this._observer) {
      this._observer.flush();
    }
    if (Array.isArray(this.items)) {
      const idx = this._getAvailableIndex(0);
      if (idx >= 0) {
        this.items[idx].focus();
      }
    }
  }

  /** @protected */
  ready() {
    super.ready();

    this.addEventListener('keydown', (e) => this._onKeydown(e));

    this._observer = new FlattenedNodesObserver(this, (info) => {
      this._setItems(this._filterItems(Array.from(this.children)));

      this._filterItems(info.addedNodes).forEach((el) => {
        el.addEventListener('opened-changed', this._boundUpdateOpened);
      });
    });
  }

  /**
   * @param {!Array<!Element>} array
   * @return {!Array<!AccordionPanel>}
   * @protected
   */
  _filterItems(array) {
    return array.filter((el) => el instanceof AccordionPanel);
  }

  /** @private */
  _updateItems(items, opened) {
    if (items) {
      const itemToOpen = items[opened];
      items.forEach((item) => {
        item.opened = item === itemToOpen;
      });
    }
  }

  /**
   * @param {!KeyboardEvent} event
   * @protected
   */
  _onKeydown(event) {
    // Only check keyboard events on details toggle buttons
    const item = event.composedPath()[0];
    if (!this.items.some((el) => el.focusElement === item)) {
      return;
    }

    const currentIdx = this.items.indexOf(this.focused);
    let idx;
    let increment;

    switch (event.key) {
      case 'ArrowUp':
        increment = -1;
        idx = currentIdx - 1;
        break;
      case 'ArrowDown':
        increment = 1;
        idx = currentIdx + 1;
        break;
      case 'Home':
        increment = 1;
        idx = 0;
        break;
      case 'End':
        increment = -1;
        idx = this.items.length - 1;
        break;
      default:
      // Do nothing.
    }

    idx = this._getAvailableIndex(idx, increment);
    if (idx >= 0) {
      this.items[idx].focus();
      this.items[idx].setAttribute('focus-ring', '');
      event.preventDefault();
    }
  }

  /**
   * @param {number} index
   * @param {number} increment
   * @return {number}
   * @protected
   */
  _getAvailableIndex(index, increment) {
    const totalItems = this.items.length;
    let idx = index;
    for (let i = 0; typeof idx === 'number' && i < totalItems; i++, idx += increment || 1) {
      if (idx < 0) {
        idx = totalItems - 1;
      } else if (idx >= totalItems) {
        idx = 0;
      }

      const item = this.items[idx];
      if (!item.disabled) {
        return idx;
      }
    }
    return -1;
  }

  /** @private */
  _updateOpened(e) {
    const target = this._filterItems(e.composedPath())[0];
    const idx = this.items.indexOf(target);
    if (e.detail.value) {
      if (target.disabled || idx === -1) {
        return;
      }

      this.opened = idx;
    } else if (!this.items.some((item) => item.opened)) {
      this.opened = null;
    }
  }
}

customElements.define(Accordion.is, Accordion);

export { Accordion };
