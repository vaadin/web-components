/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-breadcrumbs-item.js';
import './vaadin-breadcrumbs-overlay.js';
import { html, LitElement, render } from 'lit';
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
      _overlayOpened: {
        type: Boolean,
        value: false,
        sync: true,
      },

      /** @private */
      _overflowButton: {
        type: Object,
      },

      /** @private */
      __hasOverflow: {
        type: Boolean,
        value: false,
      },

      /** @private */
      __hiddenItems: {
        type: Array,
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
  get _observeParent() {
    return true;
  }

  constructor() {
    super();
    this.__hiddenItems = [];
  }

  /** @protected */
  render() {
    return html`
      <div role="list" part="list">
        <slot name="root"></slot>
        <div role="listitem" part="overflow" ?hidden="${!this.__hasOverflow}">
          <button
            type="button"
            part="overflow-button"
            aria-haspopup="true"
            aria-expanded="${this._overlayOpened ? 'true' : 'false'}"
            aria-label="${this.__effectiveI18n?.moreItems}"
            @click="${this.__onOverflowButtonClick}"
          ></button>
        </div>
        <slot></slot>
      </div>
      <vaadin-breadcrumbs-overlay
        .opened="${this._overlayOpened}"
        .owner="${this}"
        .positionTarget="${this._overflowButton}"
        .restoreFocusOnClose="${true}"
        .restoreFocusNode="${this._overflowButton}"
        exportparts="overlay, content: overlay-content"
        @opened-changed="${this.__onOverlayOpenedChanged}"
        @vaadin-overlay-open="${this.__onOverlayOpen}"
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

    this._overflowButton = this.shadowRoot.querySelector('[part="overflow-button"]');

    // Re-evaluate items on add / remove via a single shadow-root-level observer.
    // The observer's union diff suppresses callbacks for cross-slot reassignment
    // between `root`, default, and `overlay` slots, so overflow updates don't
    // loop back into the handler.
    this.__slotObserver = new SlotObserver(this.shadowRoot, () => this.__updateItems());
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
    return [...this.children].filter((node) => node.localName === 'vaadin-breadcrumbs-item' && node.slot !== 'overlay');
  }

  /**
   * Apply root slot assignment, current state, and overflow detection.
   *
   * @private
   */
  __updateItems() {
    const items = this.__getItems();

    // Root slot assignment.
    items.forEach((item, index) => {
      if (index === 0) {
        if (item.getAttribute('slot') !== 'root') {
          item.setAttribute('slot', 'root');
        }
      } else if (item.getAttribute('slot') === 'root') {
        item.removeAttribute('slot');
      }
    });

    // Current state on the last item without `path`.
    const lastIndex = items.length - 1;
    items.forEach((item, index) => {
      const isCurrent = index === lastIndex && item.path == null;
      item._setCurrent?.(isCurrent);
    });

    this.__updateOverflow();
  }

  /**
   * Override to write the hidden items as light-DOM children with
   * `slot="overlay"`, so the overlay's default slot projects them.
   * Follows the `__renderSlottedForm` pattern from
   * `packages/login/src/vaadin-login-form-mixin.js`.
   *
   * @protected
   */
  update(props) {
    super.update(props);

    this.__renderHiddenItems();
  }

  /** @private */
  __renderHiddenItems() {
    const hidden = this.__hiddenItems || [];

    // Render the hidden item links into the breadcrumbs' own light DOM with
    // `slot="overlay"`. The breadcrumbs shadow DOM contains the doorway
    // `<slot name="overlay">` inside `<vaadin-breadcrumbs-overlay>` which
    // then projects them through the overlay's default slot.
    render(
      html`
        ${hidden.map(
          (item) => html`
            <vaadin-breadcrumbs-item slot="overlay" path="${item.path}">${item.label}</vaadin-breadcrumbs-item>
          `,
        )}
      `,
      this,
      { host: this },
    );
  }

  /**
   * @protected
   * @override
   */
  _onResize() {
    this.__updateOverflow();
  }

  /**
   * Measure whether all items fit and set `data-overflow-hidden` on
   * items closest-to-root first. The last item never collapses.
   *
   * @private
   */
  __updateOverflow() {
    if (!this.shadowRoot || !this.isConnected) {
      return;
    }

    const items = this.__getItems();
    if (items.length <= 1) {
      this.__setHasOverflow(false);
      this.__setHiddenItems([]);
      return;
    }

    items.forEach((item) => item.removeAttribute('data-overflow-hidden'));

    const list = this.shadowRoot.querySelector('[part="list"]');
    if (!list) {
      return;
    }

    const overflowFits = () => list.scrollWidth <= list.clientWidth;

    this.__setHasOverflow(false);

    if (overflowFits()) {
      this.__setHiddenItems([]);
      return;
    }

    this.__setHasOverflow(true);

    const hiddenIndexes = [];
    const collapseOrder = [];
    for (let i = 1; i < items.length - 1; i += 1) {
      collapseOrder.push(i);
    }
    collapseOrder.push(0);

    for (const idx of collapseOrder) {
      items[idx].setAttribute('data-overflow-hidden', '');
      hiddenIndexes.push(idx);

      if (overflowFits()) {
        break;
      }
    }

    this.__setHiddenItems(
      hiddenIndexes
        .sort((a, b) => a - b)
        .map((idx) => ({
          path: items[idx].path != null ? items[idx].path : '',
          label: items[idx].textContent,
        })),
    );
  }

  /** @private */
  __setHasOverflow(value) {
    if (value !== this.__hasOverflow) {
      this.__hasOverflow = value;
      this.toggleAttribute('has-overflow', value);
      this.requestUpdate();
    }
  }

  /** @private */
  __setHiddenItems(items) {
    const same =
      Array.isArray(this.__hiddenItems) &&
      this.__hiddenItems.length === items.length &&
      this.__hiddenItems.every((it, i) => it.path === items[i].path && it.label === items[i].label);
    if (!same) {
      this.__hiddenItems = items;
      this.requestUpdate();
    }
  }

  /** @private */
  __onOverflowButtonClick(event) {
    event.stopPropagation();
    this._overlayOpened = !this._overlayOpened;
  }

  /** @private */
  __onOverlayOpenedChanged(event) {
    this._overlayOpened = event.detail.value;
  }

  /** @private */
  __onOverlayOpen() {
    const firstSlotted = this.querySelector('vaadin-breadcrumbs-item[slot="overlay"]');
    if (firstSlotted) {
      firstSlotted.focus();
    }
  }
}

defineCustomElement(Breadcrumbs);

export { Breadcrumbs };
