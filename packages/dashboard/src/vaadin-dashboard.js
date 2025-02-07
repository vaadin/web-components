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
import './vaadin-dashboard-widget.js';
import './vaadin-dashboard-section.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
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
 * ### Quick Start
 *
 * Assign an array to the [`items`](#/elements/vaadin-dashboard#property-items) property.
 * Set a renderer function to the [`renderer`](#/elements/vaadin-dashboard#property-renderer) property.
 *
 * The widgets and the sections will be generated and configured based on the renderer and the items provided.
 *
 * ```html
 * <vaadin-dashboard></vaadin-dashboard>
 * ```
 *
 * ```js
 * const dashboard = document.querySelector('vaadin-dashboard');
 *
 * dashboard.items = [
 *   { title: 'Widget 1 title', content: 'Text 1', rowspan: 2 },
 *   { title: 'Widget 2 title', content: 'Text 2', colspan: 2 },
 *   {
 *     title: 'Section title',
 *     items: [{ title: 'Widget in section title', content: 'Text 3' }]
 *   },
 *   // ... more items
 * ];
 *
 * dashboard.renderer = (root, _dashboard, { item }) => {
 *   const widget = root.firstElementChild || document.createElement('vaadin-dashboard-widget');
 *   if (!root.contains(widget)) {
 *     root.appendChild(widget);
 *   }
 *   widget.widgetTitle = item.title;
 *   widget.textContent = item.content;
 * };
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available:
 *
 * Custom Property                     | Description
 * ------------------------------------|-------------
 * `--vaadin-dashboard-col-min-width`  | minimum column width of the dashboard
 * `--vaadin-dashboard-col-max-width`  | maximum column width of the dashboard
 * `--vaadin-dashboard-row-min-height` | minimum row height of the dashboard
 * `--vaadin-dashboard-col-max-count`  | maximum column count of the dashboard
 * `--vaadin-dashboard-gap`            | gap between child elements. Must be in length units (0 is not allowed, 0px is)
 * `--vaadin-dashboard-padding`        | space around the dashboard's outer edges. Must be in length units (0 is not allowed, 0px is)
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `editable`     | Set when the dashboard is editable.
 * `dense-layout` | Set when the dashboard is in dense mode.
 * `item-selected`| Set when an item is selected.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
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
 * @mixes I18nMixin
 * @mixes ThemableMixin
 */
class Dashboard extends DashboardLayoutMixin(
  I18nMixin(getDefaultI18n(), ElementMixin(ThemableMixin(PolylitMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-dashboard';
  }

  static get experimental() {
    return 'dashboardComponent';
  }

  static get cvdlName() {
    return 'vaadin-dashboard';
  }

  static get styles() {
    return [
      super.styles,
      css`
        #grid[item-resizing] {
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

      /** @private */
      __childCount: {
        type: Number,
        value: 0,
      },
    };
  }

  static get observers() {
    return ['__itemsOrRendererChanged(items, renderer, editable, __effectiveI18n)'];
  }

  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
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
   * @return {!DashboardI18n}
   */
  get i18n() {
    return super.i18n;
  }

  set i18n(value) {
    super.i18n = value;
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
    return html`<div id="grid">
      ${[...Array(this.__childCount)].map((_, index) => html`<slot name="slot-${index}"></slot>`)}
    </div>`;
  }

  /** @private */
  __itemsOrRendererChanged(items, renderer) {
    this.__childCount = items ? items.length : 0;
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
        wrapper.firstElementChild.__i18n = this.__effectiveI18n;
      }
    });
  }

  /** @private */
  __renderItemWrappers(items, hostElement = this) {
    // Get all the wrappers in the host element
    let wrappers = [...hostElement.children].filter((el) => el.localName === WRAPPER_LOCAL_NAME);

    const focusedWrapper = wrappers.find((wrapper) => wrapper.querySelector(':focus'));
    const focusedWrapperWillBeRemoved = focusedWrapper && !this.__isActiveWrapper(focusedWrapper);
    const wrapperClosestToRemovedFocused =
      focusedWrapperWillBeRemoved && this.__getClosestActiveWrapper(focusedWrapper);

    items.forEach((item, index) => {
      // Find the wrapper for the item or create a new one
      const wrapper = wrappers.find((el) => itemsEqual(getElementItem(el), item)) || this.__createWrapper(item);
      wrappers = wrappers.filter((el) => el !== wrapper);
      if (!wrapper.isConnected) {
        hostElement.appendChild(wrapper);
      }

      // Update the wrapper style
      this.__updateWrapper(wrapper, item);

      // Update the wrapper slot
      wrapper.slot = `slot-${index}`;

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

        SYNCHRONIZED_ATTRIBUTES.forEach((attr) => section.toggleAttribute(attr, !!wrapper[attr]));
        section.__i18n = this.__effectiveI18n;

        // Render the subitems
        section.__childCount = item.items.length;
        this.__renderItemWrappers(item.items, section);
      }
    });

    // Remove the unused wrappers
    wrappers.forEach((wrapper) => wrapper.remove());

    requestAnimationFrame(() => {
      if (focusedWrapperWillBeRemoved) {
        // The wrapper containing the focused element was removed. Try to focus the element in the closest wrapper.
        this.__focusWrapperContent(wrapperClosestToRemovedFocused || this.querySelector(WRAPPER_LOCAL_NAME));
      }

      const focusedItem = this.querySelector(':focus');
      if (focusedItem && this.__outsideViewport(focusedItem)) {
        // If the focused wrapper is not in the viewport, scroll it into view
        focusedItem.scrollIntoView();
      }
    });
  }

  /** @private */
  __outsideViewport(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
    const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
    if (rect.bottom < 0 || rect.right < 0 || rect.top > viewportHeight || rect.left > viewportWidth) {
      return true;
    }

    const dashboardRect = this.getBoundingClientRect();
    if (
      rect.bottom < dashboardRect.top ||
      rect.right < dashboardRect.left ||
      rect.top > dashboardRect.bottom ||
      rect.left > dashboardRect.right
    ) {
      return true;
    }

    return false;
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

  /**
   * Parses the slot name to get the index of the item in the dashboard
   * For example, slot name "slot-12" will return 12
   * @private
   */
  __parseSlotIndex(slotName) {
    return parseInt(slotName.split('-')[1]);
  }

  /** @private */
  __getClosestActiveWrapper(wrapper) {
    if (!wrapper || this.__isActiveWrapper(wrapper)) {
      return wrapper;
    }

    // Sibling wrappers sorted by their slot name
    const siblingWrappers = [...wrapper.parentElement.children].sort((a, b) => {
      return this.__parseSlotIndex(a.slot) - this.__parseSlotIndex(b.slot);
    });

    // Starting from the given wrapper element, iterates through the siblings in the given direction
    // to find the closest wrapper that represents an item in the dashboard's items array
    const findSiblingWrapper = (wrapper, dir) => {
      while (wrapper) {
        if (this.__isActiveWrapper(wrapper)) {
          return wrapper;
        }
        const currentIndex = siblingWrappers.indexOf(wrapper);
        wrapper = dir === 1 ? siblingWrappers[currentIndex + 1] : siblingWrappers[currentIndex - 1];
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
    wrapper.i18n = this.__effectiveI18n;
  }

  /** @private */
  __itemRemove(e) {
    e.stopImmediatePropagation();
    const item = getElementItem(e.target);
    const items = getItemsArrayOfItem(item, this.items);
    items.splice(items.indexOf(item), 1);
    this.items = [...this.items];
    this.toggleAttribute('item-selected', false);
    this.dispatchEvent(
      new CustomEvent('dashboard-item-removed', { cancelable: true, detail: { item, items: this.items } }),
    );
  }

  /** @private */
  __dispatchCustomEvent(eventName, item, value) {
    if (!item) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent(eventName, {
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
    this.toggleAttribute('item-selected', e.detail.value);
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
   * @private
   */
  __updateColumnCount() {
    const previousColumnCount = this.$.grid.style.getPropertyValue('--_vaadin-dashboard-col-count');
    super.__updateColumnCount();

    // Request update for all the widgets if the column count has changed on resize
    if (previousColumnCount !== this.$.grid.style.getPropertyValue('--_vaadin-dashboard-col-count')) {
      this.querySelectorAll(WRAPPER_LOCAL_NAME).forEach((wrapper) => {
        if (wrapper.firstElementChild && 'requestUpdate' in wrapper.firstElementChild) {
          wrapper.firstElementChild.requestUpdate();
        }
      });
    }
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
