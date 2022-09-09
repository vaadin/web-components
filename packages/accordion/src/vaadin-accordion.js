/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { KeyboardDirectionMixin } from '@vaadin/component-base/src/keyboard-direction-mixin.js';
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
 * @mixes KeyboardDirectionMixin
 * @mixes ThemableMixin
 */
class Accordion extends KeyboardDirectionMixin(ThemableMixin(ElementMixin(PolymerElement))) {
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
   * @protected
   * @override
   */
  focus() {
    if (this._observer) {
      this._observer.flush();
    }
    super.focus();
  }

  /** @protected */
  ready() {
    super.ready();

    this._observer = new FlattenedNodesObserver(this, (info) => {
      this._setItems(this._filterItems(Array.from(this.children)));

      this._filterItems(info.addedNodes).forEach((el) => {
        el.addEventListener('opened-changed', this._boundUpdateOpened);
      });
    });
  }

  /**
   * Override method inherited from `KeyboardDirectionMixin`
   * to use the stored list of accordion panels as items.
   *
   * @return {Element[]}
   * @protected
   * @override
   */
  _getItems() {
    return this.items;
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
   * Override an event listener from `KeyboardMixin`
   * to only handle details toggle buttons events.
   *
   * @param {!KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDown(event) {
    // Only check keyboard events on details toggle buttons
    const item = event.composedPath()[0];
    if (!this.items.some((el) => el.focusElement === item)) {
      return;
    }

    super._onKeyDown(event);
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
