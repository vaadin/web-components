/**
 * @license
 * Copyright (c) 2020 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/avatar/src/vaadin-avatar.js';
import './vaadin-avatar-group-menu.js';
import './vaadin-avatar-group-menu-item.js';
import './vaadin-avatar-group-overlay.js';
import { calculateSplices } from '@polymer/polymer/lib/utils/array-splice.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html as legacyHtml, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const MINIMUM_DISPLAYED_AVATARS = 2;

/**
 * `<vaadin-avatar-group>` is a Web Component providing avatar group displaying functionality.
 *
 * To create the avatar group, first add the component to the page:
 *
 * ```
 * <vaadin-avatar-group></vaadin-avatar-group>
 * ```
 *
 * And then use [`items`](#/elements/vaadin-avatar-group#property-items) property to initialize the structure:
 *
 * ```
 * document.querySelector('vaadin-avatar-group').items = [
 *   {name: 'John Doe'},
 *   {abbr: 'AB'}
 * ];
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name   | Description
 * ----------- | ---------------
 * `container` | The container element
 *
 * See the [`<vaadin-avatar>`](#/elements/vaadin-avatar) documentation for the available
 * state attributes and stylable shadow parts of avatar elements.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * ### Internal components
 *
 * In addition to `<vaadin-avatar-group>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-avatar-group-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 * - `<vaadin-avatar-group-menu>` - has the same API as [`<vaadin-list-box>`](#/elements/vaadin-list-box).
 * - `<vaadin-avatar-group-menu-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes ElementMixin
 * @mixes OverlayClassMixin
 * @mixes ThemableMixin
 * @mixes ResizeMixin
 */
class AvatarGroup extends ResizeMixin(OverlayClassMixin(ElementMixin(ThemableMixin(ControllerMixin(PolymerElement))))) {
  static get template() {
    return legacyHtml`
      <style>
        :host {
          display: block;
          width: 100%; /* prevent collapsing inside non-stretching column flex */
          --vaadin-avatar-group-overlap: 8px;
          --vaadin-avatar-group-overlap-border: 2px;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='container'] {
          display: flex;
          position: relative;
          width: 100%;
          flex-wrap: nowrap;
        }

        ::slotted(vaadin-avatar:not(:first-child)) {
          -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox=%220 0 300 300%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path fill-rule=%22evenodd%22 clip-rule=%22evenodd%22 d=%22M300 0H0V300H300V0ZM150 200C177.614 200 200 177.614 200 150C200 122.386 177.614 100 150 100C122.386 100 100 122.386 100 150C100 177.614 122.386 200 150 200Z%22 fill=%22black%22/></svg>');
          mask-image: url('data:image/svg+xml;utf8,<svg viewBox=%220 0 300 300%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path fill-rule=%22evenodd%22 clip-rule=%22evenodd%22 d=%22M300 0H0V300H300V0ZM150 200C177.614 200 200 177.614 200 150C200 122.386 177.614 100 150 100C122.386 100 100 122.386 100 150C100 177.614 122.386 200 150 200Z%22 fill=%22black%22/></svg>');
          -webkit-mask-size: calc(
            300% + var(--vaadin-avatar-group-overlap-border) * 6 - var(--vaadin-avatar-outline-width) * 6
          );
          mask-size: calc(
            300% + var(--vaadin-avatar-group-overlap-border) * 6 - var(--vaadin-avatar-outline-width) * 6
          );
        }

        ::slotted(vaadin-avatar:not([dir='rtl']):not(:first-child)) {
          margin-left: calc(var(--vaadin-avatar-group-overlap) * -1 - var(--vaadin-avatar-outline-width));
          -webkit-mask-position: calc(50% - var(--vaadin-avatar-size) + var(--vaadin-avatar-group-overlap));
          mask-position: calc(50% - var(--vaadin-avatar-size) + var(--vaadin-avatar-group-overlap));
        }

        ::slotted(vaadin-avatar[dir='rtl']:not(:first-child)) {
          margin-right: calc(var(--vaadin-avatar-group-overlap) * -1);
          -webkit-mask-position: calc(
            50% + var(--vaadin-avatar-size) - var(--vaadin-avatar-group-overlap) + var(--vaadin-avatar-outline-width)
          );
          mask-position: calc(
            50% + var(--vaadin-avatar-size) - var(--vaadin-avatar-group-overlap) + var(--vaadin-avatar-outline-width)
          );
        }
      </style>
      <div id="container" part="container">
        <slot></slot>
        <slot name="overflow"></slot>
      </div>
      <vaadin-avatar-group-overlay
        id="overlay"
        opened="{{_opened}}"
        position-target="[[_overflow]]"
        no-vertical-overlap
        on-vaadin-overlay-close="_onVaadinOverlayClose"
      ></vaadin-avatar-group-overlay>
    `;
  }

  static get is() {
    return 'vaadin-avatar-group';
  }

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
      },

      /**
       * The maximum number of avatars to display. By default, all the avatars are displayed.
       * When _maxItemsVisible_ is set, the overflowing avatars are grouped into one avatar with
       * a dropdown. Setting 0 or 1 has no effect so there are always at least two avatars visible.
       * @attr {number} max-items-visible
       */
      maxItemsVisible: {
        type: Number,
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
      },

      /** @private */
      __maxReached: {
        type: Boolean,
        computed: '__computeMaxReached(items.length, maxItemsVisible)',
      },

      /** @private */
      __items: {
        type: Array,
      },

      /** @private */
      __itemsInView: {
        type: Number,
        value: null,
      },

      /** @private */
      _overflow: {
        type: Object,
      },

      /** @private */
      _overflowItems: {
        type: Array,
        observer: '__overflowItemsChanged',
        computed: '__computeOverflowItems(items.*, __itemsInView, maxItemsVisible)',
      },

      /** @private */
      _overflowTooltip: {
        type: Object,
      },

      /** @private */
      _opened: {
        type: Boolean,
        observer: '__openedChanged',
      },
    };
  }

  static get observers() {
    return [
      '__itemsChanged(items.splices, items.*)',
      '__i18nItemsChanged(i18n.*, items.length)',
      '__updateAvatarsTheme(_overflow, _avatars, _theme)',
      '__updateAvatars(items.*, __itemsInView, maxItemsVisible, _overflow, i18n)',
      '__updateOverflowAbbr(_overflow, items.length, __itemsInView, maxItemsVisible)',
      '__updateOverflowHidden(_overflow, items.length, __itemsInView, __maxReached)',
      '__updateOverflowTooltip(_overflowTooltip, items.length, __itemsInView, maxItemsVisible)',
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
  __renderAvatars(items) {
    render(
      html`
        ${items.map(
          (item) =>
            html`
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
  __updateAvatars(arr, itemsInView, maxItemsVisible, overflow) {
    if (!overflow) {
      return;
    }

    const items = arr.base || [];
    const limit = this.__getLimit(items.length, itemsInView, maxItemsVisible);

    this.__renderAvatars(limit ? items.slice(0, limit) : items);

    this._avatars = [...this.querySelectorAll('vaadin-avatar')];
  }

  /** @private */
  __computeOverflowItems(arr, itemsInView, maxItemsVisible) {
    const items = arr.base || [];
    const limit = this.__getLimit(items.length, itemsInView, maxItemsVisible);
    return limit ? items.slice(limit) : [];
  }

  /** @private */
  __computeMaxReached(items, maxItemsVisible) {
    return maxItemsVisible != null && items > this.__getMax(maxItemsVisible);
  }

  /** @private */
  __updateOverflowAbbr(overflow, items, itemsInView, maxItemsVisible) {
    if (overflow) {
      overflow.abbr = `+${items - this.__getLimit(items, itemsInView, maxItemsVisible)}`;
    }
  }

  /** @private */
  __updateOverflowHidden(overflow, items, itemsInView, maxReached) {
    if (overflow) {
      overflow.toggleAttribute('hidden', !maxReached && !(itemsInView && itemsInView < items));
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
    if (!tooltip) {
      return;
    }

    const limit = this.__getLimit(items, itemsInView, maxItemsVisible);
    if (limit == null) {
      return;
    }

    const result = [];
    for (let i = limit; i < items; i++) {
      const item = this.items[i];
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
  __itemsChanged(splices, itemsChange) {
    const items = itemsChange.base;
    this.__setItemsInView();

    // Mutation using group.splice('items')
    if (splices && Array.isArray(splices.indexSplices)) {
      splices.indexSplices.forEach((mutation) => {
        this.__announceItemsChange(items, mutation);
      });
    } else if (Array.isArray(items) && Array.isArray(this.__oldItems)) {
      // Mutation using group.set('items')
      const diff = calculateSplices(items, this.__oldItems);
      diff.forEach((mutation) => {
        this.__announceItemsChange(items, mutation);
      });
    }

    this.__oldItems = items;
  }

  /** @private */
  __announceItemsChange(items, mutation) {
    const { addedCount, index, removed } = mutation;
    let addedMsg = [];
    let removedMsg = [];
    if (addedCount) {
      addedMsg = items
        .slice(index, index + addedCount)
        .map((user) => this.__getMessage(user, this.i18n.joined || '{user} joined'));
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
    const { base } = i18n;
    if (base && base.activeUsers) {
      const field = items === 1 ? 'one' : 'many';
      if (base.activeUsers[field]) {
        this.setAttribute('aria-label', base.activeUsers[field].replace('{count}', items || 0));
      }

      this._avatars.forEach((avatar) => {
        avatar.i18n = base;
      });
    }
  }

  /** @private */
  __openedChanged(opened, wasOpened) {
    if (opened) {
      if (!this._menuElement) {
        this._menuElement = this.$.overlay.querySelector('vaadin-avatar-group-menu');
      }

      this._openedWithFocusRing = this._overflow.hasAttribute('focus-ring');

      this._menuElement.focus();
    } else if (wasOpened) {
      this._overflow.focus();
      if (this._openedWithFocusRing) {
        this._overflow.setAttribute('focus-ring', '');
      }
    }
    this._overflow.setAttribute('aria-expanded', opened === true);
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
}

defineCustomElement(AvatarGroup);

export { AvatarGroup };
