/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { screenReaderOnly } from '@vaadin/a11y-base/src/styles/sr-only-styles.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { matchPaths } from '@vaadin/component-base/src/url-utils.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { sideNavItemBaseStyles } from './vaadin-side-nav-base-styles.js';
import { SideNavChildrenMixin } from './vaadin-side-nav-children-mixin.js';

function isEnabled() {
  return window.Vaadin && window.Vaadin.featureFlags && !!window.Vaadin.featureFlags.sideNavComponent;
}

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
 * `expanded`     | Set when the element is expanded.
 * `has-children` | Set when the element has child items.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} expanded-changed - Fired when the `expanded` property changes.
 *
 * @extends LitElement
 * @mixes PolylitMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes SideNavChildrenMixin
 */
class SideNavItem extends SideNavChildrenMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
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
       * A comma-separated list of alternative paths matching this item.
       *
       * @attr {string} path-aliases
       */
      pathAliases: String,

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
       * Whether the path of the item matches the current path.
       * Set when the item is appended to DOM or when navigated back
       * to the page that contains this item using the browser.
       *
       * @type {boolean}
       */
      current: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
      },
    };
  }

  static get styles() {
    return [screenReaderOnly, sideNavItemBaseStyles];
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

    if (props.has('path') || props.has('pathAliases')) {
      this.__updateCurrent();
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.__updateCurrent();

    window.addEventListener('popstate', this.__boundUpdateCurrent);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this.__boundUpdateCurrent);
  }

  /** @protected */
  render() {
    return html`
      <div part="content" @click="${this._onContentClick}">
        <a id="link" href="${ifDefined(this.path)}" part="link" aria-current="${this.current ? 'page' : 'false'}">
          <slot name="prefix"></slot>
          <slot></slot>
          <slot name="suffix"></slot>
        </a>
        <button
          part="toggle-button"
          @click="${this._onButtonClick}"
          aria-controls="children"
          aria-expanded="${this.expanded}"
          aria-labelledby="link i18n"
        ></button>
      </div>
      <ul part="children" ?hidden="${!this.expanded}">
        <slot name="children"></slot>
      </ul>
      <div class="sr-only" id="i18n">${this.i18n.toggle}</div>
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
    if (!this.path && this.path !== '') {
      this._setCurrent(false);
      return;
    }
    this._setCurrent(this.__isCurrent());
    this.toggleAttribute('child-current', document.location.pathname.startsWith(this.path));
    if (this.current) {
      this.expanded = true;
    }
  }

  /** @private */
  __isCurrent() {
    if (this.path == null) {
      return false;
    }
    if (matchPaths(document.location.pathname, this.path)) {
      return true;
    }
    return (
      this.pathAliases != null &&
      this.pathAliases.split(',').some((alias) => matchPaths(document.location.pathname, alias))
    );
  }
}

if (isEnabled()) {
  customElements.define(SideNavItem.is, SideNavItem);
}

export { SideNavItem };
