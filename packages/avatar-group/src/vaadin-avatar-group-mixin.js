/**
 * @license
 * Copyright (c) 2020 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

const MINIMUM_DISPLAYED_AVATARS = 2;

/**
 * A mixin providing common avatar group functionality.
 *
 * @polymerMixin
 * @mixes ResizeMixin
 * @mixes OverlayClassMixin
 */
export const AvatarGroupMixin = (superClass) =>
  class AvatarGroupMixinClass extends ResizeMixin(OverlayClassMixin(superClass)) {
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
          observer: '__itemsChanged',
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

        /**
         * The object used to localize this component.
         * To change the default localization, replace the entire
         * _i18n_ object or just the property you want to modify.
         *
         * The object has the following JSON structure and default values:
         * ```
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
         * @type {!AvatarGroupI18n}
         * @default {English/US}
         */
        i18n: {
          type: Object,
          sync: true,
          value: () => {
            return {
              anonymous: 'anonymous',
              activeUsers: {
                one: 'Currently one active user',
                many: 'Currently {count} active users',
              },
              joined: '{user} joined',
              left: '{user} left',
            };
          },
        },

        /** @private */
        _avatars: {
          type: Array,
          value: () => [],
          sync: true,
        },

        /** @private */
        __itemsInView: {
          type: Number,
          value: null,
          sync: true,
        },

        /** @private */
        _overflow: {
          type: Object,
          sync: true,
        },

        /** @private */
        _overflowItems: {
          type: Array,
          observer: '__overflowItemsChanged',
          computed: '__computeOverflowItems(items, __itemsInView, maxItemsVisible)',
          sync: true,
        },

        /** @private */
        _overflowTooltip: {
          type: Object,
          sync: true,
        },

        /** @private */
        _opened: {
          type: Boolean,
          sync: true,
        },
      };
    }

    static get observers() {
      return [
        '__i18nItemsChanged(i18n, items)',
        '__openedChanged(_opened, _overflow)',
        '__updateAvatarsTheme(_overflow, _avatars, _theme)',
        '__updateAvatars(items, __itemsInView, maxItemsVisible, _overflow, i18n)',
        '__updateOverflowAvatar(_overflow, items, __itemsInView, maxItemsVisible)',
        '__updateOverflowTooltip(_overflowTooltip, items, __itemsInView, maxItemsVisible)',
      ];
    }

    /** @protected */
    ready() {
      super.ready();

      this._overflowController = new SlotController(this, 'overflow', 'vaadin-avatar', {
        initializer: (overflow) => {
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
      this.addController(this._overflowController);

      const overlay = this.$.overlay;
      overlay.renderer = this.__overlayRenderer.bind(this);
      this._overlayElement = overlay;

      afterNextRender(this, () => {
        this.__setItemsInView();
      });
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this._opened = false;
    }

    /** @private */
    __getMessage(user, action) {
      return action.replace('{user}', user.name || user.abbr || this.i18n.anonymous);
    }

    /**
     * Renders items when they are provided by the `items` property and clears the content otherwise.
     * @param {!HTMLElement} root
     * @param {!Select} _select
     * @private
     */
    __overlayRenderer(root) {
      let menu = root.firstElementChild;
      if (!menu) {
        menu = document.createElement('vaadin-avatar-group-menu');
        menu.addEventListener('keydown', (event) => this._onListKeyDown(event));
        root.appendChild(menu);
      }

      menu.textContent = '';

      if (!this._overflowItems) {
        return;
      }

      this._overflowItems.forEach((item) => {
        menu.appendChild(this.__createItemElement(item));
      });
    }

    /** @private */
    __createItemElement(item) {
      const itemElement = document.createElement('vaadin-avatar-group-menu-item');

      const avatar = document.createElement('vaadin-avatar');
      itemElement.appendChild(avatar);

      avatar.setAttribute('aria-hidden', 'true');
      avatar.setAttribute('tabindex', '-1');
      avatar.i18n = this.i18n;

      if (this._theme) {
        avatar.setAttribute('theme', this._theme);
      }

      avatar.name = item.name;
      avatar.abbr = item.abbr;
      avatar.img = item.img;
      avatar.colorIndex = item.colorIndex;
      if (item.className) {
        avatar.className = item.className;
      }

      if (item.name) {
        const text = document.createTextNode(item.name);
        itemElement.appendChild(text);
      }

      return itemElement;
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
                .i18n="${this.i18n}"
                class="${ifDefined(item.className)}"
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
    __updateAvatars(items, itemsInView, maxItemsVisible, overflow) {
      if (!overflow || !Array.isArray(items)) {
        return;
      }

      const limit = this.__getLimit(items.length, itemsInView, maxItemsVisible);

      this.__renderAvatars(limit ? items.slice(0, limit) : items);

      this._avatars = [...this.querySelectorAll('vaadin-avatar')];
    }

    /** @private */
    __computeOverflowItems(items, itemsInView, maxItemsVisible) {
      const count = Array.isArray(items) ? items.length : 0;
      const limit = this.__getLimit(count, itemsInView, maxItemsVisible);
      return limit ? items.slice(limit) : [];
    }

    /** @private */
    __updateOverflowAvatar(overflow, items, itemsInView, maxItemsVisible) {
      if (overflow) {
        const count = Array.isArray(items) ? items.length : 0;
        const maxReached = maxItemsVisible != null && count > this.__getMax(maxItemsVisible);

        overflow.abbr = `+${count - this.__getLimit(count, itemsInView, maxItemsVisible)}`;
        overflow.toggleAttribute('hidden', !maxReached && !(itemsInView && itemsInView < count));
      }
    }

    /** @private */
    __updateAvatarsTheme(overflow, avatars, theme) {
      if (overflow) {
        [overflow, ...avatars].forEach((avatar) => {
          if (theme) {
            avatar.setAttribute('theme', theme);
          } else {
            avatar.removeAttribute('theme');
          }
        });
      }
    }

    /** @private */
    __updateOverflowTooltip(tooltip, items, itemsInView, maxItemsVisible) {
      if (!tooltip || !Array.isArray(items)) {
        return;
      }

      const limit = this.__getLimit(items.length, itemsInView, maxItemsVisible);
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

      tooltip.text = result.join('\n');
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
        addedMsg = added.map((user) => this.__getMessage(user, this.i18n.joined || '{user} joined'));
      }

      if (removed) {
        removedMsg = removed.map((user) => this.__getMessage(user, this.i18n.left || '{user} left'));
      }

      const messages = removedMsg.concat(addedMsg);
      if (messages.length > 0) {
        announce(messages.join(', '));
      }
    }

    /** @private */
    __i18nItemsChanged(i18n, items) {
      if (i18n && i18n.activeUsers) {
        const count = Array.isArray(items) ? items.length : 0;
        const field = count === 1 ? 'one' : 'many';
        if (i18n.activeUsers[field]) {
          this.setAttribute('aria-label', i18n.activeUsers[field].replace('{count}', count || 0));
        }

        this._avatars.forEach((avatar) => {
          avatar.i18n = i18n;
        });
      }
    }

    /** @private */
    __openedChanged(opened, overflow) {
      if (!overflow) {
        return;
      }

      if (opened) {
        if (!this._menuElement) {
          this._menuElement = this.$.overlay.querySelector('vaadin-avatar-group-menu');
        }

        this._openedWithFocusRing = overflow.hasAttribute('focus-ring');
      } else if (this.__oldOpened) {
        overflow.focus();
        if (this._openedWithFocusRing) {
          overflow.setAttribute('focus-ring', '');
        }
      }

      overflow.setAttribute('aria-expanded', opened === true);
      this.__oldOpened = opened;
    }

    /** @private */
    __overflowItemsChanged(items, oldItems) {
      if (items || oldItems) {
        this.$.overlay.requestContentUpdate();
      }
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
