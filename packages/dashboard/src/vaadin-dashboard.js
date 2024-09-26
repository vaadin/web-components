/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import './vaadin-dashboard-widget.js';
import './vaadin-dashboard-section.js';
import { html, LitElement } from 'lit';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { css, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import {
  getElementItem,
  getItemsArrayOfItem,
  itemsEqual,
  SYNCHRONIZED_ATTRIBUTES,
  WRAPPER_LOCAL_NAME,
} from './vaadin-dashboard-helpers.js';
import { getDefaultI18n } from './vaadin-dashboard-item-mixin.js';
import { DashboardLayoutMixin } from './vaadin-dashboard-layout-mixin.js';
import { DashboardSection } from './vaadin-dashboard-section.js';
import { hasWidgetWrappers } from './vaadin-dashboard-styles.js';
import { WidgetReorderController } from './widget-reorder-controller.js';
import { WidgetResizeController } from './widget-resize-controller.js';

/**
 * A responsive, grid-based dashboard layout component
 *
 * @fires {CustomEvent} dashboard-item-moved - Fired when an item was moved
 * @fires {CustomEvent} dashboard-item-resized - Fired when an item was resized
 * @fires {CustomEvent} dashboard-item-removed - Fired when an item was removed
 * @fires {CustomEvent} dashboard-item-selected-changed - Fired when an item selected state changed
 * @fires {CustomEvent} dashboard-item-move-mode-changed - Fired when an item move mode changed
 * @fires {CustomEvent} dashboard-item-resize-mode-changed - Fired when an item resize mode changed
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes DashboardLayoutMixin
 * @mixes ThemableMixin
 */
class Dashboard extends ControllerMixin(DashboardLayoutMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-dashboard';
  }

  static get cvdlName() {
    return 'vaadin-dashboard';
  }

  static get styles() {
    return [
      super.styles,
      css`
        #grid[resizing] {
          -webkit-user-select: none;
          user-select: none;
        }
      `,
      hasWidgetWrappers,
    ];
  }

  static get properties() {
    return {
      /**
       * An array containing the items of the dashboard
       * @type {!Array<!DashboardItem> | null | undefined}
       */
      items: {
        type: Array,
      },

      /**
       * Custom function for rendering a widget for each dashboard item.
       * Placing something else than a widget in the wrapper is not supported.
       * Receives three arguments:
       *
       * - `root` The container for the widget.
       * - `dashboard` The reference to the `<vaadin-dashboard>` element.
       * - `model` The object with the properties related with the rendered
       *   item, contains:
       *   - `model.item` The item.
       *
       * @type {DashboardRenderer | null | undefined}
       */
      renderer: {
        type: Function,
      },

      /**
       * Whether the dashboard is editable.
       */
      editable: {
        type: Boolean,
      },

      /**
       * The object used to localize this component.
       *
       * To change the default localization, replace the entire
       * `i18n` object with a custom one.
       *
       * The object has the following structure and default values:
       * ```
       * {
       *   selectSection: 'Select section for editing',
       *   selectWidget: 'Select widget for editing',
       *   remove: 'Remove',
       *   resize: 'Resize',
       *   resizeApply: 'Apply',
       *   resizeShrinkWidth: 'Shrink width',
       *   resizeGrowWidth: 'Grow width',
       *   resizeShrinkHeight: 'Shrink height',
       *   resizeGrowHeight: 'Grow height',
       *   move: 'Move',
       *   moveApply: 'Apply',
       *   moveForward: 'Move Forward',
       *   moveBackward: 'Move Backward',
       * }
       * ```
       */
      i18n: {
        type: Object,
        value: () => {
          return {
            ...getDefaultI18n(),
          };
        },
      },
    };
  }

  static get observers() {
    return ['__itemsOrRendererChanged(items, renderer, editable, i18n)'];
  }

  constructor() {
    super();
    this.__widgetReorderController = new WidgetReorderController(this);
    this.__widgetResizeController = new WidgetResizeController(this);
    this.addEventListener('item-remove', (e) => this.__itemRemove(e));
    this.addEventListener('item-selected-changed', (e) => this.__itemSelectedChanged(e));
    this.addEventListener('item-move-mode-changed', (e) => this.__itemMoveModeChanged(e));
    this.addEventListener('item-resize-mode-changed', (e) => this.__itemResizeModeChanged(e));
  }

  /** @protected */
  ready() {
    super.ready();
    this.addController(this.__widgetReorderController);
    this.addController(this.__widgetResizeController);
  }

  /** @protected */
  render() {
    return html`<div id="grid"><slot></slot></div>`;
  }

  /** @private */
  __itemsOrRendererChanged(items, renderer) {
    this.__renderItemWrappers(items || []);

    this.querySelectorAll(WRAPPER_LOCAL_NAME).forEach((wrapper) => {
      if (wrapper.firstElementChild && wrapper.firstElementChild.localName === 'vaadin-dashboard-section') {
        return;
      }
      const item = getElementItem(wrapper);
      if (item.component instanceof HTMLElement) {
        if (item.component.parentElement !== wrapper) {
          wrapper.textContent = '';
          wrapper.appendChild(item.component);
        }
      } else if (renderer) {
        renderer(wrapper, this, { item });
      } else {
        wrapper.innerHTML = '';
      }

      if (wrapper.firstElementChild) {
        SYNCHRONIZED_ATTRIBUTES.forEach((attr) => {
          wrapper.firstElementChild.toggleAttribute(attr, !!wrapper[attr]);
        });
        wrapper.firstElementChild.__i18n = this.i18n;
      }
    });
  }

  /** @private */
  __renderItemWrappers(items, hostElement = this) {
    // Get all the wrappers in the host element
    let wrappers = [...hostElement.children].filter((el) => el.localName === WRAPPER_LOCAL_NAME);
    let previousWrapper = null;

    const focusedWrapper = wrappers.find((wrapper) => wrapper.querySelector('[focused]'));
    const focusedWrapperWillBeRemoved = focusedWrapper && !this.__isActiveWrapper(focusedWrapper);
    const wrapperClosestToRemovedFocused =
      focusedWrapperWillBeRemoved && this.__getClosestActiveWrapper(focusedWrapper);

    items.forEach((item) => {
      // Find the wrapper for the item or create a new one
      const wrapper = wrappers.find((el) => itemsEqual(getElementItem(el), item)) || this.__createWrapper(item);
      wrappers = wrappers.filter((el) => el !== wrapper);

      // Update the wrapper style
      this.__updateWrapper(wrapper, item);

      if (!wrapper.contains(document.activeElement)) {
        // Insert the wrapper to the correct position inside the host element
        const insertBeforeElement = previousWrapper ? previousWrapper.nextSibling : hostElement.firstChild;
        hostElement.insertBefore(wrapper, insertBeforeElement);
      }
      previousWrapper = wrapper;

      // Render section if the item has subitems
      if (item.items) {
        let section = wrapper.firstElementChild;
        const isComponentSection = item.component instanceof DashboardSection;
        if (!(section instanceof DashboardSection)) {
          // Create a new section if it doesn't exist
          section = isComponentSection ? item.component : document.createElement('vaadin-dashboard-section');
          wrapper.appendChild(section);
        }
        if (!isComponentSection) {
          section.sectionTitle = item.title;
        }

        section.toggleAttribute('highlight', !!this.__widgetReorderController.draggedItem);
        SYNCHRONIZED_ATTRIBUTES.forEach((attr) => section.toggleAttribute(attr, !!wrapper[attr]));
        section.__i18n = this.i18n;

        // Render the subitems
        this.__renderItemWrappers(item.items, section);
      }
    });

    // Remove the unused wrappers
    wrappers.forEach((wrapper) => wrapper.remove());

    if (focusedWrapperWillBeRemoved) {
      // The wrapper containing the focused element was removed. Try to focus the element in the closest wrapper.
      requestAnimationFrame(() =>
        this.__focusWrapperContent(wrapperClosestToRemovedFocused || this.querySelector(WRAPPER_LOCAL_NAME)),
      );
    }
  }

  /** @private */
  __focusWrapperContent(wrapper) {
    if (wrapper && wrapper.firstElementChild) {
      wrapper.firstElementChild.focus();
    }
  }

  /**
   * Checks if the wrapper represents an item that is part of the dashboard's items array
   * @private
   */
  __isActiveWrapper(wrapper) {
    if (!wrapper || wrapper.localName !== WRAPPER_LOCAL_NAME) {
      return false;
    }
    return getItemsArrayOfItem(getElementItem(wrapper), this.items);
  }

  /** @private */
  __getClosestActiveWrapper(wrapper) {
    if (!wrapper || this.__isActiveWrapper(wrapper)) {
      return wrapper;
    }

    // Starting from the given wrapper element, iterates through the siblings in the given direction
    // to find the closest wrapper that represents an item in the dashboard's items array
    const findSiblingWrapper = (wrapper, dir) => {
      while (wrapper) {
        if (this.__isActiveWrapper(wrapper)) {
          return wrapper;
        }
        wrapper = dir === 1 ? wrapper.nextElementSibling : wrapper.previousElementSibling;
      }
    };

    return (
      findSiblingWrapper(wrapper, 1) ||
      findSiblingWrapper(wrapper, -1) ||
      this.__getClosestActiveWrapper(wrapper.parentElement.closest(WRAPPER_LOCAL_NAME))
    );
  }

  /** @private */
  __createWrapper(item) {
    const wrapper = document.createElement(WRAPPER_LOCAL_NAME);
    wrapper.__item = item;
    return wrapper;
  }

  /** @private */
  __updateWrapper(wrapper, item) {
    const style = `
      ${item.colspan ? `--vaadin-dashboard-item-colspan: ${item.colspan};` : ''}
      ${item.rowspan ? `--vaadin-dashboard-item-rowspan: ${item.rowspan};` : ''}
    `.trim();

    wrapper.__item = item;
    wrapper.setAttribute('style', style);
    wrapper.editable = this.editable;
    wrapper.dragging = this.__widgetReorderController.draggedItem === item;
    wrapper['first-child'] = item === getItemsArrayOfItem(item, this.items)[0];
    wrapper['last-child'] = item === getItemsArrayOfItem(item, this.items).slice(-1)[0];
    wrapper.i18n = this.i18n;
  }

  /** @private */
  __itemRemove(e) {
    e.stopImmediatePropagation();
    const item = getElementItem(e.target);
    const items = getItemsArrayOfItem(item, this.items);
    items.splice(items.indexOf(item), 1);
    this.items = [...this.items];
    this.dispatchEvent(
      new CustomEvent('dashboard-item-removed', { cancelable: true, detail: { item, items: this.items } }),
    );
  }

  /** @private */
  __dispatchCustomEvent(eventName, item, value) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        detail: {
          item,
          value,
        },
      }),
    );
  }

  /** @private */
  __itemSelectedChanged(e) {
    e.stopImmediatePropagation();
    this.__dispatchCustomEvent('dashboard-item-selected-changed', getElementItem(e.target), e.detail.value);
  }

  /** @private */
  __itemMoveModeChanged(e) {
    e.stopImmediatePropagation();
    this.__dispatchCustomEvent('dashboard-item-move-mode-changed', getElementItem(e.target), e.detail.value);
  }

  /** @private */
  __itemResizeModeChanged(e) {
    e.stopImmediatePropagation();
    this.__dispatchCustomEvent('dashboard-item-resize-mode-changed', getElementItem(e.target), e.detail.value);
  }

  /**
   * Fired when an item selected state changed
   *
   * @event dashboard-item-selected-changed
   */

  /**
   * Fired when an item move mode changed
   *
   * @event dashboard-item-move-mode-changed
   */

  /**
   * Fired when an item resize mode changed
   *
   * @event dashboard-item-resize-mode-changed
   */

  /**
   * Fired when an item was moved
   *
   * @event dashboard-item-moved
   */

  /**
   * Fired when an item was resized
   *
   * @event dashboard-item-resized
   */

  /**
   * Fired when an item was removed
   *
   * @event dashboard-item-removed
   */
}

defineCustomElement(Dashboard);

export { Dashboard };
