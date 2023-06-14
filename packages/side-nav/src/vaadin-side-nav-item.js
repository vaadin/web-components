/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { sideNavItemBaseStyles } from './vaadin-side-nav-base-styles.js';

function isEnabled() {
  return window.Vaadin && window.Vaadin.featureFlags && !!window.Vaadin.featureFlags.sideNavComponent;
}

/**
 * A controller to manage the item content children slot.
 */
class ChildrenController extends SlotController {
  constructor(host) {
    super(host, 'children', null, { observe: true, multiple: true });
  }

  /**
   * @protected
   * @override
   */
  initAddedNode() {
    this.host.requestUpdate();
  }

  /**
   * @protected
   * @override
   */
  teardownNode() {
    this.host.requestUpdate();
  }
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
 * @fires {CustomEvent} expanded-changed - Fired when the `expanded` property changes.
 *
 * @extends LitElement
 * @mixes PolylitMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class SideNavItem extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
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
       * The path aliases delimited by a comma
       */
      pathAliases: {
        type: String,
        reflectToAttribute: true,
        attribute: true,
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
       * Whether the path of the item matches the current path.
       * Set when the item is appended to DOM or when navigated back
       * to the page that contains this item using the browser.
       *
       * @type {boolean}
       */
      active: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
      },
    };
  }

  static get styles() {
    return sideNavItemBaseStyles;
  }

  constructor() {
    super();

    this._childrenController = new ChildrenController(this);
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
    // Controller to detect whether the item has child items.
    this.addController(this._childrenController);

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
      this.__updateActive();
    }

    this.toggleAttribute('has-children', this._childrenController.nodes.length > 0);
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.__updateActive();
    this.__boundUpdateActive = this.__updateActive.bind(this);
    window.addEventListener('popstate', this.__boundUpdateActive);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this.__boundUpdateActive);
  }

  /** @protected */
  render() {
    return html`
      <a href="${ifDefined(this.path)}" part="item" aria-current="${this.active ? 'page' : 'false'}">
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
        <button
          part="toggle-button"
          @click="${this.__toggleExpanded}"
          aria-controls="children"
          aria-expanded="${this.expanded}"
          aria-label="Toggle child items"
        ></button>
      </a>
      <slot name="children" role="list" part="children" id="children" ?hidden="${!this.expanded}"></slot>
    `;
  }

  /** @private */
  __toggleExpanded(e) {
    e.preventDefault();
    e.stopPropagation();
    this.expanded = !this.expanded;
  }

  /** @private */
  __updateActive() {
    if (!this.path && this.path !== '') {
      this._setActive(false);
      return;
    }
    this._setActive(this.__calculateActive());
    this.toggleAttribute('child-active', document.location.pathname.startsWith(this.path));
    if (this.active) {
      this.expanded = true;
    }
  }

  /** @private */
  __calculateActive() {
    const isPathAbsolute = this.path.startsWith('/');
    const hasBaseUri = document.baseURI !== document.location.href;
    // Absolute path or no base uri in use. No special comparison needed
    if (isPathAbsolute || !hasBaseUri) {
      return this.__doesPathMatchItem(document.location.pathname);
    }
    const pathRelativeToRoot = document.location.pathname;
    const basePath = new URL(document.baseURI).pathname;
    const pathRelativeToBase =
      basePath !== pathRelativeToRoot && pathRelativeToRoot.startsWith(basePath)
        ? pathRelativeToRoot.substring(basePath.length)
        : pathRelativeToRoot;
    return this.__doesPathMatchItem(pathRelativeToBase);
  }

  /** @private */
  __doesPathMatchItem(pathToMatch) {
    const sanitizedPathToMatch = pathToMatch.startsWith('/') ? pathToMatch.substring(1) : pathToMatch;
    const sanitizedItemPath = this.path.startsWith('/') ? this.path.substring(1) : this.path;
    if (sanitizedPathToMatch === sanitizedItemPath) {
      return true;
    }
    if (this.pathAliases || this.pathAliases === '') {
      return this.pathAliases.split(',').some((alias) => {
        const sanitizedAlias = alias.startsWith('/') ? alias.substring(1) : alias;
        return sanitizedPathToMatch === sanitizedAlias;
      });
    }
    return false;
  }
}

if (isEnabled()) {
  customElements.define(SideNavItem.is, SideNavItem);
}

export { SideNavItem };
