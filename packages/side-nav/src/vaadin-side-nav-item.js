/**
 * @license
 * Copyright (c) 2023 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-side-nav-overlay.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { matchPaths } from '@vaadin/component-base/src/url-utils.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { location } from './location.js';
import { sideNavItemStyles } from './styles/vaadin-side-nav-item-base-styles.js';
import { SideNavChildrenMixin } from './vaadin-side-nav-children-mixin.js';

/** Time the pointer has to rest on an item before its flyout opens. */
const HOVER_OPEN_DELAY = 100;

/** Grace period after the pointer leaves an item and its flyout, before it closes. */
const HOVER_CLOSE_DELAY = 300;

/**
 * A navigation item to be used within `<vaadin-side-nav>`. Represents a navigation target.
 * Not intended to be used separately.
 *
 * ```html
 * <vaadin-side-nav-item>
 *   Item 1
 *   <vaadin-side-nav-item path="/path1" slot="children">
 *     Child item 1
 *   </vaadin-side-nav-item>
 *   <vaadin-side-nav-item path="/path2" slot="children">
 *     Child item 2
 *   </vaadin-side-nav-item>
 * </vaadin-side-nav-item>
 * ```
 *
 * ### Customization
 *
 * You can configure the item by using `slot` names.
 *
 * Slot name | Description
 * ----------|-------------
 * `prefix`  | A slot for content before the label (e.g. an icon).
 * `suffix`  | A slot for content after the label (e.g. an icon).
 *
 * #### Example
 *
 * ```html
 * <vaadin-side-nav-item>
 *   <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
 *   Item
 *   <vaadin-badge slot="suffix">Suffix</vaadin-badge>
 * </vaadin-side-nav-item>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|----------------
 * `content`       | The element that wraps link and toggle button
 * `children`      | The element that wraps child items
 * `link`          | The clickable anchor used for navigation
 * `toggle-button` | The toggle button
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description
 * --------------------|-------------
 * `disabled`          | Set when the element is disabled.
 * `expanded`          | Set when the element is expanded.
 * `has-children`      | Set when the element has child items.
 * `has-current-child` | Set when a descendant item's path matches the current browser URL.
 * `has-tooltip`       | Set when the element has a slotted tooltip.
 * `overlay-children`  | Set when the child items are rendered in a flyout.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                       |
 * :-----------------------------------------|
 * | `--vaadin-side-nav-item-background`     |
 * | `--vaadin-side-nav-item-border-color`   |
 * | `--vaadin-side-nav-item-border-radius`  |
 * | `--vaadin-side-nav-item-border-width`   |
 * | `--vaadin-side-nav-item-font-size`      |
 * | `--vaadin-side-nav-item-font-weight`    |
 * | `--vaadin-side-nav-item-gap`            |
 * | `--vaadin-side-nav-item-line-height`    |
 * | `--vaadin-side-nav-item-padding`        |
 * | `--vaadin-side-nav-item-text-color`     |
 * | `--vaadin-side-nav-overlay-offset`      |
 * | `--vaadin-side-nav-overlay-padding`     |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} expanded-changed - Fired when the `expanded` property changes.
 *
 * @attr {string} theme - The theme variants to apply to the component.
 * @customElement vaadin-side-nav-item
 * @extends HTMLElement
 */
class SideNavItem extends SideNavChildrenMixin(
  DisabledMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
  static get is() {
    return 'vaadin-side-nav-item';
  }

  static get properties() {
    return {
      /**
       * The path to navigate to
       */
      path: {
        type: String,
      },

      /**
       * The list of alternative paths matching this item
       *
       * @type {!Array<string>}
       */
      pathAliases: {
        type: Array,
        value: () => [],
      },

      /**
       * Whether to show the child items or not
       */
      expanded: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true,
      },

      /**
       * When enabled, the child items are rendered in a flyout next to the item
       * instead of in a list below it. The flyout opens and closes with the
       * `expanded` property.
       *
       * On devices that support hovering, the flyout opens when the pointer rests
       * on the item and closes when it leaves both the item and the flyout. On
       * other devices, clicking an item that has child items opens the flyout
       * instead of navigating to the item's own path.
       *
       * Set `overlay-children` on the parent `<vaadin-side-nav>` to enable this
       * for all its top-level items, which is what a navigation rail needs.
       *
       * @attr {boolean} overlay-children
       */
      overlayChildren: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Whether to also match nested paths / routes. `false` by default.
       *
       * When enabled, an item with the path `/path` is considered current when
       * the browser URL is `/path`, `/path/child`, `/path/child/grandchild`,
       * etc.
       *
       * Note that this only affects matching of the URLs path, not the base
       * origin or query parameters.
       *
       * @attr {boolean} match-nested
       */
      matchNested: {
        type: Boolean,
        value: false,
      },

      /**
       * Whether the item's path matches the current browser URL.
       *
       * A match occurs when both share the same base origin (like https://example.com),
       * the same path (like /path/to/page), and the browser URL contains at least
       * all the query parameters with the same values from the item's path.
       *
       * See [`matchNested`](#/elements/vaadin-side-nav-item#property-matchNested) for how to change the path matching behavior.
       *
       * The state is updated when the item is added to the DOM or when the browser
       * navigates to a new page.
       */
      current: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
      },

      /**
       * The target of the link. Works only when `path` is set.
       */
      target: {
        type: String,
      },

      /**
       * Whether to exclude the item from client-side routing. When enabled,
       * this causes the item to behave like a regular anchor, causing a full
       * page reload. This only works with supported routers, such as the one
       * provided in Vaadin apps, or when using the side nav `onNavigate` hook.
       *
       * @attr {boolean} router-ignore
       */
      routerIgnore: {
        type: Boolean,
        value: false,
      },

      /** @private */
      __tooltipText: {
        type: String,
      },
    };
  }

  static get styles() {
    return sideNavItemStyles;
  }

  /** @private */
  #hoverQuery;

  /** @private */
  #openTimeout;

  /** @private */
  #closeTimeout;

  constructor() {
    super();

    this.__boundUpdateCurrent = this.__updateCurrent.bind(this);

    this.addEventListener('pointerenter', () => this.#onPointerEnter());
    this.addEventListener('pointerleave', () => this.#onPointerLeave());
  }

  /** @protected */
  get _button() {
    return this.shadowRoot.querySelector('button');
  }

  /** @private */
  get #overlay() {
    return this.shadowRoot.querySelector('vaadin-side-nav-overlay');
  }

  /**
   * @protected
   * @override
   */
  firstUpdated() {
    super.firstUpdated();

    // By default, if the user hasn't provided a custom role,
    // the role attribute is set to "listitem".
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }
  }

  /**
   * @protected
   * @override
   */
  updated(props) {
    super.updated(props);

    if (props.has('path') || props.has('pathAliases') || props.has('matchNested')) {
      this.__updateCurrent();
    }

    // Ensure all the child items are disabled
    if (props.has('disabled') || props.has('_itemsCount')) {
      this._items.forEach((item) => {
        item.disabled = this.disabled;
      });
    }

    // The flyout only exists after the branch has been rendered, so the
    // position target cannot be bound in the template itself.
    if (props.has('overlayChildren') && this.overlayChildren) {
      this.#overlay.positionTarget = this.$.content;
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.__updateCurrent();

    window.addEventListener('popstate', this.__boundUpdateCurrent);
    window.addEventListener('vaadin-navigated', this.__boundUpdateCurrent);
    window.addEventListener('side-nav-location-changed', this.__boundUpdateCurrent);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.#clearHoverTimeouts();
    window.removeEventListener('popstate', this.__boundUpdateCurrent);
    window.removeEventListener('vaadin-navigated', this.__boundUpdateCurrent);
    window.removeEventListener('side-nav-location-changed', this.__boundUpdateCurrent);
  }

  /** @protected */
  render() {
    return html`
      <div id="content" part="content" @click="${this._onContentClick}">
        <a
          id="link"
          ?disabled="${this.disabled}"
          tabindex="${this.disabled || this.path == null ? '-1' : '0'}"
          href="${ifDefined(this.disabled ? null : this.path)}"
          target="${ifDefined(this.target)}"
          ?router-ignore="${this.routerIgnore}"
          part="link"
          aria-current="${this.current ? 'page' : 'false'}"
        >
          <slot name="prefix"></slot>
          <slot></slot>
          <div class="sr-only">${this.__tooltipText}</div>
          <slot name="suffix"></slot>
        </a>
        <button
          part="toggle-button"
          ?disabled="${this.disabled}"
          @click="${this._onButtonClick}"
          aria-controls="children"
          aria-expanded="${this.expanded}"
          aria-labelledby="link i18n"
        ></button>
      </div>
      ${this.overlayChildren ? this.#renderFlyout() : this.#renderChildren(!this.expanded)}
      <div hidden id="i18n">${this.__effectiveI18n.toggle}</div>
      <slot name="tooltip"></slot>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this._tooltipController.setTarget(this.$.content);
    this._tooltipController.setAriaTarget(null);
    this._tooltipController.addEventListener('tooltip-changed', (event) => {
      const { node } = event.detail;
      if (node) {
        this.__tooltipText = node.textContent.trim();
        node.setAttribute('aria-hidden', 'true');
      } else {
        this.__tooltipText = '';
      }
    });
    this.addController(this._tooltipController);
  }

  /** @private */
  _onButtonClick(event) {
    // Prevent the event from being handled
    // by the content click listener below
    event.stopPropagation();
    this.__toggleExpanded();
  }

  /** @private */
  _onContentClick(e) {
    // Without hover, clicking is the only way to reach the flyout, so it takes
    // precedence over navigating to the item's own path
    if (this.overlayChildren && this.hasAttribute('has-children') && !this.disabled && !this.#canHover()) {
      this.__toggleExpanded();
    }
    // Navigate if path is defined and not clicking on the link directly
    else if (this.path && !e.composedPath().find((el) => el === this.$.link)) {
      this.$.link.click();
    }
    // Toggle item expanded state unless the link has a non-empty path
    else if (this.path == null && this.hasAttribute('has-children') && !this.disabled) {
      this.__toggleExpanded();
    }
  }

  /** @private */
  __toggleExpanded() {
    this.expanded = !this.expanded;
  }

  /** @private */
  __updateCurrent() {
    this._setCurrent(this.__isCurrent());
    if (this.current) {
      this.__expandParentItems();
      // A flyout must not pop open just because it holds the current item
      this.expanded = !this.overlayChildren && this._items.length > 0;
    }

    // The current item is not visible while its ancestor's flyout is closed,
    // so the ancestors need a hook to mark themselves as the active branch
    for (let item = this.__getParentItem(); item; item = item.__getParentItem()) {
      item.toggleAttribute('has-current-child', item.#hasCurrentDescendant());
    }
  }

  /** @private */
  __expandParentItems() {
    const sideNav = this.closest('vaadin-side-nav');
    if (sideNav?.noAutoExpand) {
      return;
    }

    const parentItem = this.__getParentItem();
    if (parentItem) {
      parentItem.__expandParentItems();
      if (!parentItem.overlayChildren) {
        parentItem.expanded = true;
      }
    }
  }

  /** @private */
  #hasCurrentDescendant() {
    return this._items.some((item) => item instanceof SideNavItem && (item.current || item.#hasCurrentDescendant()));
  }

  /** @private */
  #renderChildren(hidden) {
    return html`
      <ul id="children" part="children" role="list" ?hidden="${hidden}" aria-hidden="${hidden ? 'true' : 'false'}">
        <slot name="children"></slot>
      </ul>
    `;
  }

  /** @private */
  #renderFlyout() {
    return html`
      <vaadin-side-nav-overlay
        theme="${ifDefined(this._theme)}"
        .opened="${this.expanded && this._itemsCount > 0}"
        horizontal-align="start"
        vertical-align="top"
        no-horizontal-overlap
        modeless
        restore-focus-on-close
        @opened-changed="${this.#onFlyoutOpenedChanged}"
      >
        ${this.#renderChildren(false)}
      </vaadin-side-nav-overlay>
    `;
  }

  /** @private */
  #onFlyoutOpenedChanged(event) {
    this.expanded = event.detail.value;
  }

  /** @private */
  #canHover() {
    this.#hoverQuery ??= matchMedia('(hover: hover)');
    return this.#hoverQuery.matches;
  }

  /** @private */
  #onPointerEnter() {
    if (!this.overlayChildren || this.disabled || !this.#canHover()) {
      return;
    }
    this.#clearHoverTimeouts();
    this.#openTimeout = setTimeout(() => {
      this.expanded = true;
    }, HOVER_OPEN_DELAY);
  }

  /** @private */
  #onPointerLeave() {
    if (!this.overlayChildren || this.disabled || !this.#canHover()) {
      return;
    }
    this.#clearHoverTimeouts();
    this.#closeTimeout = setTimeout(() => {
      this.expanded = false;
    }, HOVER_CLOSE_DELAY);
  }

  /** @private */
  #clearHoverTimeouts() {
    clearTimeout(this.#openTimeout);
    clearTimeout(this.#closeTimeout);
  }

  /** @private */
  __getParentItem() {
    return this.parentElement instanceof SideNavItem ? this.parentElement : null;
  }

  /** @private */
  __isCurrent() {
    if (this.path == null) {
      return false;
    }

    const browserPath = `${location.pathname}${location.search}`;
    const matchOptions = { matchNested: this.matchNested };
    return (
      matchPaths(browserPath, this.path, matchOptions) ||
      this.pathAliases.some((alias) => matchPaths(browserPath, alias, matchOptions))
    );
  }
}

defineCustomElement(SideNavItem);

export { SideNavItem };
