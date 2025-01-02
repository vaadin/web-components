/**
 * @license
 * Copyright (c) 2023 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { matchPaths } from '@vaadin/component-base/src/url-utils.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { location } from './location.js';
import { sideNavItemBaseStyles } from './vaadin-side-nav-base-styles.js';
import { SideNavChildrenMixin } from './vaadin-side-nav-children-mixin.js';

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
 *   <span theme="badge primary" slot="suffix">Suffix</span>
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
 * Attribute      | Description
 * ---------------|-------------
 * `disabled`     | Set when the element is disabled.
 * `expanded`     | Set when the element is expanded.
 * `has-children` | Set when the element has child items.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} expanded-changed - Fired when the `expanded` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DisabledMixin
 * @mixes ElementMixin
 * @mixes SideNavChildrenMixin
 */
class SideNavItem extends SideNavChildrenMixin(DisabledMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-side-nav-item';
  }

  static get properties() {
    return {
      /**
       * The path to navigate to
       */
      path: String,

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
       *
       * @type {boolean}
       */
      expanded: {
        type: Boolean,
        value: false,
        notify: true,
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
       * @type {boolean}
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
       *
       * @type {boolean}
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
      target: String,

      /**
       * Whether to exclude the item from client-side routing. When enabled,
       * this causes the item to behave like a regular anchor, causing a full
       * page reload. This only works with supported routers, such as the one
       * provided in Vaadin apps, or when using the side nav `onNavigate` hook.
       *
       * @type {boolean}
       * @attr {boolean} router-ignore
       */
      routerIgnore: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get styles() {
    return [sideNavItemBaseStyles];
  }

  constructor() {
    super();

    this.__boundUpdateCurrent = this.__updateCurrent.bind(this);
  }

  /** @protected */
  get _button() {
    return this.shadowRoot.querySelector('button');
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
    window.removeEventListener('popstate', this.__boundUpdateCurrent);
    window.removeEventListener('vaadin-navigated', this.__boundUpdateCurrent);
    window.removeEventListener('side-nav-location-changed', this.__boundUpdateCurrent);
  }

  /** @protected */
  render() {
    return html`
      <div part="content" @click="${this._onContentClick}">
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
      <ul part="children" role="list" ?hidden="${!this.expanded}" aria-hidden="${this.expanded ? 'false' : 'true'}">
        <slot name="children"></slot>
      </ul>
      <div hidden id="i18n">${this.i18n.toggle}</div>
    `;
  }

  /** @private */
  _onButtonClick(event) {
    // Prevent the event from being handled
    // by the content click listener below
    event.stopPropagation();
    this.__toggleExpanded();
  }

  /** @private */
  _onContentClick() {
    // Toggle item expanded state unless the link has a non-empty path
    if (this.path == null && this.hasAttribute('has-children')) {
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
      this.expanded = this._items.length > 0;
    }
  }

  /** @private */
  __expandParentItems() {
    const parentItem = this.__getParentItem();
    if (parentItem) {
      parentItem.__expandParentItems();
    }
    this.expanded = true;
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
