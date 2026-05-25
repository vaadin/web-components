/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-breadcrumbs-item.js';
import './vaadin-breadcrumbs-overlay.js';
import { html, LitElement } from 'lit';
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { breadcrumbsStyles } from './styles/vaadin-breadcrumbs-base-styles.js';

const DEFAULT_I18N = {
  moreItems: 'More items',
};

/**
 * `<vaadin-breadcrumbs>` is a Web Component that displays the user's location
 * within a hierarchy as a trail of links from the root to the current page.
 *
 * @customElement vaadin-breadcrumbs
 * @extends HTMLElement
 */
class Breadcrumbs extends ResizeMixin(I18nMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-breadcrumbs';
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get styles() {
    return breadcrumbsStyles;
  }

  static get experimental() {
    return 'breadcrumbsComponent';
  }

  static get properties() {
    return {
      /** @private */
      __overlayOpened: {
        type: Boolean,
        value: false,
        sync: true,
      },

      /** @private */
      __hasOverflow: {
        type: Boolean,
        value: false,
        sync: true,
        reflectToAttribute: true,
        attribute: 'has-overflow',
      },
    };
  }

  static get defaultI18n() {
    return DEFAULT_I18N;
  }

  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   // Accessible label of the overflow button revealing collapsed items.
   *   moreItems: 'More items'
   * }
   * ```
   *
   * @return {!Object}
   */
  get i18n() {
    return super.i18n;
  }

  set i18n(value) {
    super.i18n = value;
  }

  /** @protected */
  render() {
    return html`
      <div id="list" role="list" part="list">
        <slot name="root"></slot>
        <div role="listitem" part="overflow" ?hidden="${!this.__hasOverflow}">
          <button
            id="overflow"
            type="button"
            part="overflow-button"
            aria-haspopup="true"
            aria-expanded="${this.__overlayOpened ? 'true' : 'false'}"
            aria-label="${this.__effectiveI18n?.moreItems}"
            @click="${this.__onOverflowButtonClick}"
          ></button>
        </div>
        <slot></slot>
      </div>
      <vaadin-breadcrumbs-overlay
        id="overlay"
        .opened="${this.__overlayOpened}"
        .owner="${this}"
        no-vertical-overlap
        restore-focus-on-close
        exportparts="overlay, content: overlay-content"
        @opened-changed="${this.__onOverlayOpenedChanged}"
        @vaadin-overlay-open="${this.__onOverlayOpen}"
        @keydown="${this.__onOverlayKeyDown}"
      >
        <slot name="overlay"></slot>
      </vaadin-breadcrumbs-overlay>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'navigation');
    }

    this.$.overlay.positionTarget = this.$.overflow;
    this.$.overlay.restoreFocusNode = this.$.overflow;

    // Re-evaluate items on add / remove via a single shadow-root-level observer.
    this.__slotObserver = new SlotObserver(this.shadowRoot, () => {
      this.__updateItems();
      this.__updateOverflow();
    });
    this.__slotObserver.flush();

    // Observe `path` attribute changes on items to modify the `current` state.
    this.__pathObserver = new MutationObserver(() => this.__updateItems());
    this.__pathObserver.observe(this, {
      attributes: true,
      attributeFilter: ['path'],
      subtree: true,
    });
  }

  /** @private */
  __getItems() {
    return [...this.children].filter((node) => node.localName === 'vaadin-breadcrumbs-item');
  }

  /**
   * Mark the last item without `path` as the current page.
   *
   * @private
   */
  __updateItems() {
    const items = this.__getItems();
    const lastIndex = items.length - 1;
    items.forEach((item, index) => {
      const isCurrent = index === lastIndex && item.path == null;
      item._setCurrent?.(isCurrent);
    });
  }

  /**
   * Restore each item to its natural slot, pulling overlay items back into
   * the trail so the measurement in `__updateOverflow` sees the full set.
   *
   * @private
   */
  __restoreSlots(items) {
    items.forEach((item, index) => {
      const expected = index === 0 ? 'root' : null;
      if (expected === null) {
        item.removeAttribute('slot');
      } else {
        item.setAttribute('slot', expected);
      }
    });
  }

  /**
   * Measure whether the trail fits and move items to `slot="overlay"`
   * closest-to-root first. The last item never collapses.
   *
   * Single forced reflow: `__hasOverflow` is set to `true` up front so the
   * `[part="overflow"]` binding commits synchronously (the property is
   * `sync: true`); one batch of rect reads then determines whether the
   * overflow button is actually needed and, if so, which items to collapse.
   *
   * @private
   */
  __updateOverflow() {
    const items = this.__getItems();
    this.__restoreSlots(items);

    if (items.length <= 1) {
      this.__hasOverflow = false;
      return;
    }

    // Optimistically reveal the overflow button so its width contributes
    // to the layout before we measure.
    this.__hasOverflow = true;

    const list = this.$.list;
    const overflowRect = list.querySelector('[part="overflow"]').getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const rects = items.map((item) => item.getBoundingClientRect());
    const gap = parseFloat(getComputedStyle(list).gap) || 0;

    // Width the trail would take with the overflow button hidden: subtract
    // the button's own width plus one of its surrounding gaps from the
    // current scrollWidth.
    if (list.scrollWidth - overflowRect.width - gap <= list.clientWidth) {
      this.__hasOverflow = false;
      return;
    }

    // Items don't fit even without the button. How far the last item
    // extends past the list — either edge can overflow (right in LTR,
    // left in RTL).
    const lastRect = rects.at(-1);
    const excessWidth = Math.max(0, lastRect.right - listRect.right, listRect.left - lastRect.left);

    // Collapsing items[1..i] shifts the trail by `|rects[i+1] - rects[1]|`
    // (Math.abs covers RTL). Stop as soon as the shift covers the excessWidth.
    for (let i = 1; i < items.length - 1; i += 1) {
      items[i].setAttribute('slot', 'overlay');
      if (Math.abs(rects[i + 1].left - rects[1].left) >= excessWidth) {
        return;
      }
    }

    items[0].setAttribute('slot', 'overlay');
  }

  /**
   * @protected
   * @override
   */
  _onResize() {
    this.__updateOverflow();
  }

  /** @private */
  __onOverflowButtonClick(event) {
    event.stopPropagation();
    this.__overlayOpened = !this.__overlayOpened;
  }

  /** @private */
  __onOverlayOpenedChanged(event) {
    this.__overlayOpened = event.detail.value;
  }

  /** @private */
  __onOverlayOpen() {
    // Move focus to the first slotted overlay item's link, if any.
    const firstItem = this.querySelector('vaadin-breadcrumbs-item[slot="overlay"]');
    if (firstItem) {
      firstItem.focus();
    }
  }

  /** @private */
  __onOverlayKeyDown(event) {
    if (event.key === 'Tab') {
      this.__overlayOpened = false;
      return;
    }

    const { key } = event;
    if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Home' && key !== 'End') {
      return;
    }

    const overlayItems = [...this.querySelectorAll('vaadin-breadcrumbs-item[slot="overlay"]')];
    if (overlayItems.length === 0) {
      return;
    }

    event.preventDefault();

    // `delegatesFocus: true` on the item element means the item is reported
    // as the focused element at the host level when its inner link has focus.
    const currentIndex = overlayItems.findIndex((item) => isElementFocused(item));

    // ArrowDown / ArrowUp wrap at both ends to match the menu-style navigation
    // used by `<vaadin-context-menu-list-box>` and `<vaadin-menu-bar>` (both
    // composed over `KeyboardDirectionMixin`).
    const lastIndex = overlayItems.length - 1;
    let nextIndex = currentIndex;
    if (key === 'ArrowDown') {
      nextIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1;
    } else if (key === 'ArrowUp') {
      nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
    } else if (key === 'Home') {
      nextIndex = 0;
    } else if (key === 'End') {
      nextIndex = lastIndex;
    }

    overlayItems[nextIndex].focus();
  }
}

defineCustomElement(Breadcrumbs);

export { Breadcrumbs };
