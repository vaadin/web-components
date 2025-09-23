/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

const MINIMUM_DISPLAYED_AVATARS = 2;

const DEFAULT_I18N = {
  anonymous: 'anonymous',
  activeUsers: {
    one: 'Currently one active user',
    many: 'Currently {count} active users',
  },
  joined: '{user} joined',
  left: '{user} left',
};

/**
 * A mixin providing common avatar group functionality.
 *
 * @polymerMixin
 * @mixes I18nMixin
 * @mixes ResizeMixin
 */
export const AvatarGroupMixin = (superClass) =>
  class AvatarGroupMixinClass extends I18nMixin(DEFAULT_I18N, ResizeMixin(superClass)) {
    static get properties() {
      return {
        /**
         * An array containing the items which will be stamped as avatars.
         *
         * The items objects allow to configure [`name`](#/elements/vaadin-avatar#property-name),
         * [`abbr`](#/elements/vaadin-avatar#property-abbr), [`img`](#/elements/vaadin-avatar#property-img)
         * and [`colorIndex`](#/elements/vaadin-avatar#property-colorIndex) properties on the
         * stamped avatars, and set `className` to provide CSS class names.
         *
         * #### Example
         *
         * ```js
         * group.items = [
         *   {
         *     name: 'User name',
         *     img: 'url-to-image.png',
         *     className: 'even'
         *   },
         *   {
         *     abbr: 'JD',
         *     colorIndex: 1,
         *     className: 'odd'
         *   },
         * ];
         * ```
         *
         * @type {!Array<!AvatarGroupItem> | undefined}
         */
        items: {
          type: Array,
          sync: true,
        },

        /**
         * The maximum number of avatars to display. By default, all the avatars are displayed.
         * When _maxItemsVisible_ is set, the overflowing avatars are grouped into one avatar with
         * a dropdown. Setting 0 or 1 has no effect so there are always at least two avatars visible.
         * @attr {number} max-items-visible
         */
        maxItemsVisible: {
          type: Number,
          sync: true,
        },

        /** @private */
        __itemsInView: {
          type: Number,
          value: null,
          sync: true,
        },

        /** @private */
        _overflowItems: {
          type: Array,
        },

        /** @private */
        _overflowLimit: {
          type: Number,
        },

        /** @private */
        _opened: {
          type: Boolean,
          sync: true,
        },
      };
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The object has the following JSON structure and default values:
     * ```js
     * {
     *   // Translation of the anonymous user avatar tooltip.
     *   anonymous: 'anonymous',
     *   // Translation of the avatar group accessible label.
     *   // {count} is replaced with the actual count of users.
     *   activeUsers: {
     *     one: 'Currently one active user',
     *     many: 'Currently {count} active users'
     *   },
     *   // Screen reader announcement when user joins group.
     *   // {user} is replaced with the name or abbreviation.
     *   // When neither is set, "anonymous" is used instead.
     *   joined: '{user} joined',
     *   // Screen reader announcement when user leaves group.
     *   // {user} is replaced with the name or abbreviation.
     *   // When neither is set, "anonymous" is used instead.
     *   left: '{user} left'
     * }
     * ```
     * @return {!AvatarGroupI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    /** @protected */
    get _avatars() {
      return [...this.children].filter((node) => node.localName === 'vaadin-avatar');
    }

    /** @protected */
    ready() {
      super.ready();

      this._menuController = new SlotController(this, 'overlay', 'vaadin-avatar-group-menu', {
        initializer: (menu) => {
          menu.addEventListener('keydown', this._onListKeyDown.bind(this));
          this._menuElement = menu;
        },
      });

      this._overflowController = new SlotController(this, 'overflow', 'vaadin-avatar', {
        initializer: (overflow) => {
          overflow.setAttribute('role', 'button');
          overflow.setAttribute('tabindex', '0');
          overflow.setAttribute('aria-haspopup', 'menu');
          overflow.setAttribute('aria-expanded', 'false');
          overflow.addEventListener('click', (e) => this._onOverflowClick(e));
          overflow.addEventListener('keydown', (e) => this._onOverflowKeyDown(e));

          const tooltip = document.createElement('vaadin-tooltip');
          tooltip.setAttribute('slot', 'tooltip');
          overflow.appendChild(tooltip);

          this._overflow = overflow;
          this._overflowTooltip = tooltip;
        },
      });

      this.addController(this._menuController);
      this.addController(this._overflowController);

      this._overlayElement = this.$.overlay;
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this._opened = false;
    }

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      if (props.has('items') || props.has('__itemsInView') || props.has('maxItemsVisible')) {
        // Calculate overflow limit only once to reuse it in updated() observers
        const count = Array.isArray(this.items) ? this.items.length : 0;
        const limit = this.__getLimit(count, this.__itemsInView, this.maxItemsVisible);
        this._overflowLimit = limit;
        this._overflowItems = limit ? this.items.slice(limit) : [];
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('items')) {
        this.__itemsChanged(this.items, props.get('items'));
      }

      if (props.has('items') || props.has('_overflowLimit') || props.has('__effectiveI18n') || props.has('_theme')) {
        const limit = this._overflowLimit;
        this.__renderAvatars(limit ? this.items.slice(0, limit) : this.items || []);
      }

      if (props.has('items') || props.has('_overflowLimit')) {
        this.__updateOverflowTooltip(this.items, this._overflowLimit);
        this.__updateOverflowAvatar(this.items, this._overflowLimit, this.__itemsInView);
      }

      if (props.has('__effectiveI18n') || props.has('items')) {
        this.__i18nItemsChanged(this.__effectiveI18n, this.items);
      }

      if (props.has('_opened')) {
        this.__openedChanged(this._opened, props.get('_opened'));
      }

      if (props.has('_theme')) {
        if (this._theme) {
          this._overflow.setAttribute('theme', this._theme);
        } else {
          this._overflow.removeAttribute('theme');
        }
      }

      if (props.has('_overflowItems') || props.has('__effectiveI18n') || props.has('_theme')) {
        this.__renderMenu();
      }
    }

    /** @private */
    __getMessage(user, action) {
      return action.replace('{user}', user.name || user.abbr || this.__effectiveI18n.anonymous);
    }

    /**
     * Renders items when they are provided by the `items` property and clears the content otherwise.
     * @private
     */
    __renderMenu() {
      render(
        html`
          ${(this._overflowItems || []).map(
            (item) => html`
              <vaadin-avatar-group-menu-item>
                <vaadin-avatar
                  .name="${item.name}"
                  .abbr="${item.abbr}"
                  .img="${item.img}"
                  .colorIndex="${item.colorIndex}"
                  .i18n="${this.__effectiveI18n}"
                  class="${ifDefined(item.className)}"
                  theme="${ifDefined(this._theme)}"
                  aria-hidden="true"
                ></vaadin-avatar>
                ${item.name || ''}
              </vaadin-avatar-group-menu-item>
            `,
          )}
        `,
        this._menuElement,
        { host: this },
      );
    }

    /** @private */
    _onOverflowClick(e) {
      e.stopPropagation();
      if (this._opened) {
        this.$.overlay.close();
      } else if (!e.defaultPrevented) {
        this._opened = true;
      }
    }

    /** @private */
    _onOverflowKeyDown(e) {
      if (!this._opened) {
        if (/^(Enter|SpaceBar|\s)$/u.test(e.key)) {
          e.preventDefault();
          this._opened = true;
        }
      }
    }

    /** @private */
    _onListKeyDown(event) {
      if (event.key === 'Escape' || event.key === 'Tab') {
        this._opened = false;
      }
    }

    /**
     * @protected
     * @override
     */
    _onResize() {
      this.__setItemsInView();
    }

    /** @private */
    _onVaadinOverlayClose(e) {
      if (e.detail.sourceEvent && e.detail.sourceEvent.composedPath().includes(this)) {
        e.preventDefault();
      }
    }

    /** @private */
    _onVaadinOverlayOpen() {
      if (this._menuElement) {
        this._menuElement.focus();
      }
    }

    /** @private */
    __renderAvatars(items) {
      render(
        html`
          ${items.map(
            (item) => html`
              <vaadin-avatar
                .name="${item.name}"
                .abbr="${item.abbr}"
                .img="${item.img}"
                .colorIndex="${item.colorIndex}"
                .i18n="${this.__effectiveI18n}"
                theme="${ifDefined(this._theme)}"
                class="${ifDefined(item.className)}"
                tabindex="0"
                with-tooltip
              ></vaadin-avatar>
            `,
          )}
        `,
        this,
        { renderBefore: this._overflow },
      );
    }

    /** @private */
    __updateOverflowAvatar(items, limit, itemsInView) {
      const overflow = this._overflow;
      if (overflow) {
        const count = Array.isArray(items) ? items.length : 0;
        const maxReached = this.maxItemsVisible != null && count > this.__getMax(this.maxItemsVisible);

        overflow.abbr = `+${count - limit}`;
        const hasOverflow = maxReached || (itemsInView && itemsInView < count);
        overflow.toggleAttribute('hidden', !hasOverflow);
        this.toggleAttribute('has-overflow', hasOverflow);
      }
    }

    /** @private */
    __updateOverflowTooltip(items, limit) {
      if (!Array.isArray(items)) {
        return;
      }

      if (limit == null) {
        return;
      }

      const result = [];
      for (let i = limit; i < items.length; i++) {
        const item = items[i];
        if (item) {
          result.push(item.name || item.abbr || 'anonymous');
        }
      }

      this._overflowTooltip.text = result.join('\n');
    }

    /** @private */
    __getLimit(items, itemsInView, maxItemsVisible) {
      let limit = null;
      // Handle max set to 0 or 1
      const adjustedMax = this.__getMax(maxItemsVisible);
      if (maxItemsVisible != null && adjustedMax < items) {
        limit = adjustedMax - 1;
      } else if (itemsInView && itemsInView < items) {
        limit = itemsInView;
      }

      return Math.min(limit, this.__calculateAvatarsFitWidth());
    }

    /** @private */
    __getMax(maxItemsVisible) {
      return Math.max(maxItemsVisible, MINIMUM_DISPLAYED_AVATARS);
    }

    /** @private */
    __itemsChanged(items, oldItems) {
      this.__setItemsInView();

      let added = [];
      let removed = [];

      const hasNewItems = Array.isArray(items);
      const hasOldItems = Array.isArray(oldItems);

      if (hasOldItems) {
        removed = oldItems.filter((item) => hasNewItems && !items.includes(item));
      }

      if (hasNewItems) {
        added = items.filter((item) => hasOldItems && !oldItems.includes(item));
      }

      this.__announceItemsChange(added, removed);
    }

    /** @private */
    __announceItemsChange(added, removed) {
      let addedMsg = [];
      let removedMsg = [];
      if (added) {
        addedMsg = added.map((user) => this.__getMessage(user, this.__effectiveI18n.joined || '{user} joined'));
      }

      if (removed) {
        removedMsg = removed.map((user) => this.__getMessage(user, this.__effectiveI18n.left || '{user} left'));
      }

      const messages = removedMsg.concat(addedMsg);
      if (messages.length > 0) {
        announce(messages.join(', '));
      }
    }

    /** @private */
    __i18nItemsChanged(effectiveI18n, items) {
      if (effectiveI18n && effectiveI18n.activeUsers) {
        const count = Array.isArray(items) ? items.length : 0;
        const field = count === 1 ? 'one' : 'many';
        if (effectiveI18n.activeUsers[field]) {
          this.setAttribute('aria-label', effectiveI18n.activeUsers[field].replace('{count}', count || 0));
        }
      }
    }

    /** @private */
    __openedChanged(opened, oldOpened) {
      if (opened) {
        this._openedWithFocusRing = this._overflow.hasAttribute('focus-ring');
      } else if (oldOpened) {
        this._overflow.focus({ focusVisible: this._openedWithFocusRing });
      }

      this._overflow.setAttribute('aria-expanded', opened === true);
    }

    /** @private */
    __setItemsInView() {
      const avatars = this._avatars;
      const items = this.items;

      // Always show at least two avatars
      if (!items || !avatars || avatars.length < 3) {
        return;
      }

      let result = this.__calculateAvatarsFitWidth();

      // Only show overlay if two or more avatars don't fit
      if (result === items.length - 1) {
        result = items.length;
      }

      // Close overlay if all avatars become visible
      if (result >= items.length && this._opened) {
        this.$.overlay.close();
        // FIXME: hack to avoid jump before closing
        this.$.overlay._flushAnimation('closing');
      }

      // Reserve space for overflow avatar
      this.__itemsInView = result;
    }

    /** @private */
    __calculateAvatarsFitWidth() {
      if (!this.shadowRoot || this._avatars.length < MINIMUM_DISPLAYED_AVATARS) {
        return MINIMUM_DISPLAYED_AVATARS;
      }

      const avatars = this._avatars;

      // Assume all the avatars have the same width
      const avatarWidth = avatars[0].clientWidth;

      // Take negative margin into account
      const { marginLeft, marginRight } = getComputedStyle(avatars[1]);

      const offset = this.__isRTL
        ? parseInt(marginRight, 0) - parseInt(marginLeft, 0)
        : parseInt(marginLeft, 0) - parseInt(marginRight, 0);

      return Math.floor((this.$.container.offsetWidth - avatarWidth) / (avatarWidth + offset));
    }
  };
