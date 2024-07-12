/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './detect-ios-navbar.js';
import './safe-area-inset.js';
import { afterNextRender, beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { AriaModalController } from '@vaadin/a11y-base/src/aria-modal-controller.js';
import { FocusTrapController } from '@vaadin/a11y-base/src/focus-trap-controller.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * @typedef {import('./vaadin-app-layout.js').AppLayoutI18n} AppLayoutI18n
 */

/**
 * `<vaadin-app-layout>` is a Web Component providing a quick and easy way to get a common application layout structure done.
 *
 * ```
 * <vaadin-app-layout primary-section="navbar|drawer">
 *  <vaadin-drawer-toggle slot="navbar [touch-optimized]"></vaadin-drawer-toggle>
 *  <h3 slot="navbar [touch-optimized]">Company Name</h3>
 *  <vaadin-tabs orientation="vertical" slot="drawer">
 *    <vaadin-tab>Menu item 1</vaadin-tab>
 *  </vaadin-tabs>
 *  <!-- Everything else will be the page content -->
 *  <div>
 *    <h3>Page title</h3>
 *    <p>Page content</p>
 *  </div>
 * </vaadin-app-layout>
 * ```
 *
 * For best results, the component should be added to the root level of your application (i.e., as a direct child of `<body>`).
 *
 * The page should include a viewport meta tag which contains `viewport-fit=cover`, like the following:
 * ```
 * <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
 * ```
 * This causes the viewport to be scaled to fill the device display.
 * To ensure that important content is displayed, use the provided css variables.
 * ```
 * --safe-area-inset-top
 * --safe-area-inset-right
 * --safe-area-inset-bottom
 * --safe-area-inset-left
 * ```
 *
 * ### Styling
 *
 * The following Shadow DOM parts of the `<vaadin-app-layout>` are available for styling:
 *
 * Part name     | Description
 * --------------|---------------------------------------------------------|
 * `navbar`      | Container for the navigation bar
 * `drawer`      | Container for the drawer area
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * ### Component's slots
 *
 * The following slots are available to be set
 *
 * Slot name          | Description
 * -------------------|---------------------------------------------------|
 * no name            | Default container for the page content
 * `navbar `          | Container for the top navbar area
 * `drawer`           | Container for an application menu
 * `touch-optimized`  | Container for the bottom navbar area (only visible for mobile devices)
 *
 * #### Touch optimized
 *
 * App Layout has a pseudo-slot `touch-optimized` in order to give more control of the presentation of
 * elements with `slot[navbar]`. Internally, when the user is interacting with App Layout from a
 * touchscreen device, the component will search for elements with `slot[navbar touch-optimized]` and move
 * them to the bottom of the page.
 *
 * ### Navigation
 *
 * As the drawer opens as an overlay in small devices, it makes sense to close it once a navigation happens.
 * If you are using Vaadin Router, this will happen automatically unless you change the `closeDrawerOn` event name.
 *
 * In order to do so, there are two options:
 * - If the `vaadin-app-layout` instance is available, then `drawerOpened` can be set to `false`
 * - If not, a custom event `close-overlay-drawer` can be dispatched either by calling
 *  `window.dispatchEvent(new CustomEvent('close-overlay-drawer'))` or by calling
 *  `AppLayout.dispatchCloseOverlayDrawerEvent()`
 *
 * ### Scrolling areas
 *
 * By default, the component will act with the "body scrolling", so on mobile (iOS Safari and Android Chrome),
 * the toolbars will collapse when a scroll happens.
 *
 * To use the "content scrolling", in case of the content of the page relies on a pre-defined height (for instance,
 * it has a `height:100%`), then the developer can set `height: 100%` to both `html` and `body`.
 * That will make the `[content]` element of app layout scrollable.
 * On this case, the toolbars on mobile device won't collapse.
 *
 * @fires {CustomEvent} drawer-opened-changed - Fired when the `drawerOpened` property changes.
 * @fires {CustomEvent} overlay-changed - Fired when the `overlay` property changes.
 * @fires {CustomEvent} primary-section-changed - Fired when the `primarySection` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes ControllerMixin
 */
class AppLayout extends ElementMixin(ThemableMixin(ControllerMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          height: 100%;
          --vaadin-app-layout-transition: 200ms;
          transition: padding var(--vaadin-app-layout-transition);
          --_vaadin-app-layout-drawer-width: var(--vaadin-app-layout-drawer-width, 16em);
          --vaadin-app-layout-touch-optimized: false;
          --vaadin-app-layout-navbar-offset-top: var(--_vaadin-app-layout-navbar-offset-size);
          --vaadin-app-layout-navbar-offset-bottom: var(--_vaadin-app-layout-navbar-offset-size-bottom);
          padding-block: var(--vaadin-app-layout-navbar-offset-top) var(--vaadin-app-layout-navbar-offset-bottom);
          padding-inline-start: var(--vaadin-app-layout-navbar-offset-left);
        }

        :host([hidden]),
        [hidden] {
          display: none !important;
        }

        :host([no-anim]) {
          --vaadin-app-layout-transition: none !important;
        }

        :host([drawer-opened]) {
          --vaadin-app-layout-drawer-offset-left: var(--_vaadin-app-layout-drawer-offset-size);
        }

        :host([overlay]) {
          --vaadin-app-layout-drawer-offset-left: 0;
          --vaadin-app-layout-navbar-offset-left: 0;
        }

        :host(:not([no-scroll])) [content] {
          overflow: auto;
        }

        [content] {
          height: 100%;
        }

        @media (pointer: coarse) and (max-width: 800px) and (min-height: 500px) {
          :host {
            --vaadin-app-layout-touch-optimized: true;
          }
        }

        [part='navbar'] {
          position: fixed;
          display: flex;
          align-items: center;
          top: 0;
          inset-inline: 0;
          transition: inset-inline-start var(--vaadin-app-layout-transition);
          padding-top: var(--safe-area-inset-top);
          padding-left: var(--safe-area-inset-left);
          padding-right: var(--safe-area-inset-right);
          z-index: 1;
        }

        :host([primary-section='drawer'][drawer-opened]:not([overlay])) [part='navbar'] {
          inset-inline-start: var(--vaadin-app-layout-drawer-offset-left, 0);
        }

        :host([primary-section='drawer']) [part='drawer'] {
          top: 0;
        }

        [part='navbar'][bottom] {
          top: auto;
          bottom: 0;
          padding-bottom: var(--safe-area-inset-bottom);
        }

        [part='drawer'] {
          overflow: auto;
          position: fixed;
          top: var(--vaadin-app-layout-navbar-offset-top, 0);
          bottom: var(--vaadin-app-layout-navbar-offset-bottom, var(--vaadin-viewport-offset-bottom, 0));
          inset-inline: var(--vaadin-app-layout-navbar-offset-left, 0) auto;
          transition:
            transform var(--vaadin-app-layout-transition),
            visibility var(--vaadin-app-layout-transition);
          transform: translateX(-100%);
          max-width: 90%;
          width: var(--_vaadin-app-layout-drawer-width);
          box-sizing: border-box;
          padding: var(--safe-area-inset-top) 0 var(--safe-area-inset-bottom) var(--safe-area-inset-left);
          outline: none;
          /* The drawer should be inaccessible by the tabbing navigation when it is closed. */
          visibility: hidden;
          display: flex;
          flex-direction: column;
        }

        :host([drawer-opened]) [part='drawer'] {
          /* The drawer should be accessible by the tabbing navigation when it is opened. */
          visibility: visible;
          transform: translateX(0%);
          touch-action: manipulation;
        }

        [part='backdrop'] {
          background-color: #000;
          opacity: 0.3;
        }

        :host(:not([drawer-opened])) [part='backdrop'] {
          opacity: 0;
        }

        :host([overlay]) [part='backdrop'] {
          position: fixed;
          inset: 0;
          pointer-events: none;
          transition: opacity var(--vaadin-app-layout-transition);
          -webkit-tap-highlight-color: transparent;
        }

        :host([overlay]) [part='drawer'] {
          top: 0;
          bottom: 0;
        }

        :host([overlay]) [part='drawer'],
        :host([overlay]) [part='backdrop'] {
          z-index: 2;
        }

        :host([drawer-opened][overlay]) [part='backdrop'] {
          pointer-events: auto;
          touch-action: manipulation;
        }

        :host([dir='rtl']) [part='drawer'] {
          transform: translateX(100%);
        }

        :host([dir='rtl'][drawer-opened]) [part='drawer'] {
          transform: translateX(0%);
        }

        :host([drawer-opened]:not([overlay])) {
          padding-inline-start: var(--vaadin-app-layout-drawer-offset-left);
        }

        @media (max-width: 800px), (max-height: 600px) {
          :host {
            --vaadin-app-layout-drawer-overlay: true;
            --_vaadin-app-layout-drawer-width: var(--vaadin-app-layout-drawer-width, 20em);
          }
        }

        /* If a vaadin-scroller is used in the drawer, allow it to take all remaining space and contain scrolling */
        [part='drawer'] ::slotted(vaadin-scroller) {
          flex: 1;
          overscroll-behavior: contain;
        }
      </style>
      <div part="navbar" id="navbarTop">
        <slot name="navbar" on-slotchange="_updateTouchOptimizedMode"></slot>
      </div>
      <div part="backdrop" on-click="_onBackdropClick" on-touchend="_onBackdropTouchend"></div>
      <div part="drawer" id="drawer">
        <slot name="drawer" id="drawerSlot" on-slotchange="_updateDrawerSize"></slot>
      </div>
      <div content>
        <slot></slot>
      </div>
      <div part="navbar" id="navbarBottom" bottom hidden>
        <slot name="navbar-bottom"></slot>
      </div>
      <div hidden>
        <slot id="touchSlot" name="navbar touch-optimized" on-slotchange="_updateTouchOptimizedMode"></slot>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-app-layout';
  }

  static get properties() {
    return {
      /**
       * The object used to localize this component.
       * To change the default localization, replace the entire
       * `i18n` object with a custom one.
       *
       * To update individual properties, extend the existing i18n object as follows:
       * ```js
       * appLayout.i18n = {
       *   ...appLayout.i18n,
       *   drawer: 'Drawer'
       * }
       * ```
       *
       * The object has the following structure and default values:
       * ```
       * {
       *   drawer: 'Drawer'
       * }
       * ```
       *
       * @type {AppLayoutI18n}
       * @default {English/US}
       */
      i18n: {
        type: Object,
        observer: '__i18nChanged',
        value: () => {
          return {
            drawer: 'Drawer',
          };
        },
      },

      /**
       * Defines whether navbar or drawer will come first visually.
       * - By default (`primary-section="navbar"`), the navbar takes the full available width and moves the drawer down.
       * - If `primary-section="drawer"` is set, then the drawer will move the navbar, taking the full available height.
       * @attr {navbar|drawer} primary-section
       * @type {!PrimarySection}
       */
      primarySection: {
        type: String,
        value: 'navbar',
        notify: true,
        reflectToAttribute: true,
        observer: '__primarySectionChanged',
      },

      /**
       * Controls whether the drawer is opened (visible) or not.
       * Its default value depends on the viewport:
       * - `true`, for desktop size views
       * - `false`, for mobile size views
       * @attr {boolean} drawer-opened
       * @type {boolean}
       */
      drawerOpened: {
        type: Boolean,
        notify: true,
        value: true,
        reflectToAttribute: true,
        observer: '__drawerOpenedChanged',
      },

      /**
       * Drawer is an overlay on top of the content
       * Controlled via CSS using `--vaadin-app-layout-drawer-overlay: true|false`;
       * @type {boolean}
       */
      overlay: {
        type: Boolean,
        notify: true,
        readOnly: true,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * A global event that causes the drawer to close (be hidden) when it is in overlay mode.
       * - The default is `vaadin-router-location-changed` dispatched by Vaadin Router
       *
       * @attr {string} close-drawer-on
       * @type {string}
       */
      closeDrawerOn: {
        type: String,
        value: 'vaadin-router-location-changed',
        observer: '_closeDrawerOnChanged',
      },
    };
  }

  /**
   * Helper static method that dispatches a `close-overlay-drawer` event
   */
  static dispatchCloseOverlayDrawerEvent() {
    window.dispatchEvent(new CustomEvent('close-overlay-drawer'));
  }

  constructor() {
    super();
    // TODO(jouni): might want to debounce
    this.__boundResizeListener = this._resize.bind(this);
    this.__drawerToggleClickListener = this._drawerToggleClick.bind(this);
    this.__onDrawerKeyDown = this.__onDrawerKeyDown.bind(this);
    this.__closeOverlayDrawerListener = this.__closeOverlayDrawer.bind(this);
    this.__trapFocusInDrawer = this.__trapFocusInDrawer.bind(this);
    this.__releaseFocusFromDrawer = this.__releaseFocusFromDrawer.bind(this);

    // Hide all the elements except the drawer toggle and drawer content
    this.__ariaModalController = new AriaModalController(this, () => [
      ...this.querySelectorAll('vaadin-drawer-toggle, [slot="drawer"]'),
    ]);
    this.__focusTrapController = new FocusTrapController(this);
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    this._blockAnimationUntilAfterNextRender();

    window.addEventListener('resize', this.__boundResizeListener);
    this.addEventListener('drawer-toggle-click', this.__drawerToggleClickListener);

    beforeNextRender(this, this._afterFirstRender);

    this._updateTouchOptimizedMode();
    this._updateDrawerSize();
    this._updateOverlayMode();

    this._navbarSizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        // Prevent updating offset size multiple times
        // during the drawer open / close transition.
        if (this.__isDrawerAnimating) {
          this.__updateOffsetSizePending = true;
        } else {
          this._updateOffsetSize();
        }
      });
    });
    this._navbarSizeObserver.observe(this.$.navbarTop);
    this._navbarSizeObserver.observe(this.$.navbarBottom);

    window.addEventListener('close-overlay-drawer', this.__closeOverlayDrawerListener);
    window.addEventListener('keydown', this.__onDrawerKeyDown);
  }

  /** @protected */
  ready() {
    super.ready();
    this.addController(this.__focusTrapController);
    this.__setAriaExpanded();

    this.$.drawer.addEventListener('transitionstart', () => {
      this.__isDrawerAnimating = true;
    });

    this.$.drawer.addEventListener('transitionend', () => {
      // Update offset size after drawer animation.
      if (this.__updateOffsetSizePending) {
        this.__updateOffsetSizePending = false;
        this._updateOffsetSize();
      }

      // Delay resetting the flag until animation frame
      // to avoid updating offset size again on resize.
      requestAnimationFrame(() => {
        this.__isDrawerAnimating = false;
      });
    });
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('resize', this.__boundResizeListener);
    this.removeEventListener('drawer-toggle-click', this.__drawerToggleClickListener);
    window.removeEventListener('close-overlay-drawer', this.__drawerToggleClickListener);
    window.removeEventListener('keydown', this.__onDrawerKeyDown);
  }

  /**
   * A callback for the `primarySection` property observer.
   *
   * Ensures the property is set to its default value `navbar`
   * whenever the new value is not one of the valid values: `navbar`, `drawer`.
   *
   * @param {string} value
   * @private
   */
  __primarySectionChanged(value) {
    const isValid = ['navbar', 'drawer'].includes(value);
    if (!isValid) {
      this.set('primarySection', 'navbar');
    }
  }

  /**
   * A callback for the `drawerOpened` property observer.
   *
   * When the drawer opens, the method ensures the drawer has a proper height and sets focus on it.
   * As long as the drawer is open, the focus is trapped within the drawer.
   *
   * When the drawer closes, the method releases focus from the drawer, setting focus on the drawer toggle.
   *
   * @param {boolean} drawerOpened
   * @param {boolean} oldDrawerOpened
   * @private
   */
  __drawerOpenedChanged(drawerOpened, oldDrawerOpened) {
    if (this.overlay) {
      if (drawerOpened) {
        this.__trapFocusInDrawer();
      } else if (oldDrawerOpened) {
        this.__releaseFocusFromDrawer();
      }
    }

    this.__setAriaExpanded();
  }

  /**
   * A callback for the `i18n` property observer.
   *
   * The method ensures the drawer has ARIA attributes updated
   * once the `i18n` property changes.
   *
   * @private
   */
  __i18nChanged() {
    this.__updateDrawerAriaAttributes();
  }

  /** @protected */
  _afterFirstRender() {
    this._blockAnimationUntilAfterNextRender();
    this._updateOffsetSize();
  }

  /** @private */
  _drawerToggleClick(e) {
    e.stopPropagation();
    this.drawerOpened = !this.drawerOpened;
  }

  /** @private */
  __closeOverlayDrawer() {
    if (this.overlay) {
      this.drawerOpened = false;
    }
  }

  /** @private */
  __setAriaExpanded() {
    const toggle = this.querySelector('vaadin-drawer-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', this.drawerOpened);
    }
  }

  /** @protected */
  _updateDrawerSize() {
    const childCount = this.querySelectorAll('[slot=drawer]').length;
    const drawer = this.$.drawer;

    if (childCount === 0) {
      drawer.setAttribute('hidden', '');
      this.style.setProperty('--_vaadin-app-layout-drawer-width', 0);
    } else {
      drawer.removeAttribute('hidden');
      this.style.removeProperty('--_vaadin-app-layout-drawer-width');
    }
    this._updateOffsetSize();
  }

  /** @private */
  _resize() {
    this._blockAnimationUntilAfterNextRender();
    this._updateTouchOptimizedMode();
    this._updateOverlayMode();
  }

  /** @protected */
  _updateOffsetSize() {
    const navbar = this.$.navbarTop;
    const navbarRect = navbar.getBoundingClientRect();

    const navbarBottom = this.$.navbarBottom;
    const navbarBottomRect = navbarBottom.getBoundingClientRect();

    const drawer = this.$.drawer;
    const drawerRect = drawer.getBoundingClientRect();

    this.style.setProperty('--_vaadin-app-layout-navbar-offset-size', `${navbarRect.height}px`);
    this.style.setProperty('--_vaadin-app-layout-navbar-offset-size-bottom', `${navbarBottomRect.height}px`);
    this.style.setProperty('--_vaadin-app-layout-drawer-offset-size', `${drawerRect.width}px`);
  }

  /** @protected */
  _updateOverlayMode() {
    const overlay = this._getCustomPropertyValue('--vaadin-app-layout-drawer-overlay') === 'true';

    if (!this.overlay && overlay) {
      // Changed from not overlay to overlay
      this._drawerStateSaved = this.drawerOpened;
      this.drawerOpened = false;
    }

    this._setOverlay(overlay);

    if (!this.overlay && this._drawerStateSaved) {
      this.drawerOpened = this._drawerStateSaved;
      this._drawerStateSaved = null;
    }

    this.__updateDrawerAriaAttributes();
  }

  /**
   * Updates ARIA attributes on the drawer depending on the drawer mode.
   *
   * - In the overlay mode, the method marks the drawer with ARIA attributes as a dialog
   * labelled with the `i18n.drawer` property.
   * - In the normal mode, the method removes the ARIA attributes that has been set for the overlay mode.
   *
   * @private
   */
  __updateDrawerAriaAttributes() {
    const drawer = this.$.drawer;
    if (this.overlay) {
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('aria-label', this.i18n.drawer);
    } else {
      drawer.removeAttribute('role');
      drawer.removeAttribute('aria-modal');
      drawer.removeAttribute('aria-label');
    }
  }

  /**
   * Returns a promise that resolves when the drawer opening/closing CSS transition ends.
   *
   * The method relies on the `--vaadin-app-layout-transition` CSS variable to detect whether
   * the drawer has a CSS transition that needs to be awaited. If the CSS variable equals `none`,
   * the promise resolves immediately.
   *
   * @return {Promise}
   * @private
   */
  __drawerTransitionComplete() {
    return new Promise((resolve) => {
      if (this._getCustomPropertyValue('--vaadin-app-layout-transition') === 'none') {
        resolve();
        return;
      }

      this.$.drawer.addEventListener('transitionend', resolve, { once: true });
    });
  }

  /** @private */
  async __trapFocusInDrawer() {
    // Wait for the drawer CSS transition before focusing the drawer
    // in order for VoiceOver to have a proper outline.
    await this.__drawerTransitionComplete();

    if (!this.drawerOpened) {
      // The drawer has been closed during the CSS transition.
      return;
    }

    this.$.drawer.setAttribute('tabindex', '0');

    this.__ariaModalController.showModal();
    this.__focusTrapController.trapFocus(this.$.drawer);
  }

  /** @private */
  async __releaseFocusFromDrawer() {
    // Wait for the drawer CSS transition in order to restore focus to the toggle
    // only after `visibility` becomes `hidden`, that is, the drawer becomes inaccessible by the tabbing navigation.
    await this.__drawerTransitionComplete();

    if (this.drawerOpened) {
      // The drawer has been opened during the CSS transition.
      return;
    }

    this.__ariaModalController.close();
    this.__focusTrapController.releaseFocus();
    this.$.drawer.removeAttribute('tabindex');

    // Move focus to the drawer toggle when closing the drawer.
    const toggle = this.querySelector('vaadin-drawer-toggle');
    if (toggle) {
      toggle.focus();
      toggle.setAttribute('focus-ring', 'focus');
    }
  }

  /**
   * Closes the drawer on Escape press if it has been opened in the overlay mode.
   *
   * @param {KeyboardEvent} event
   * @private
   */
  __onDrawerKeyDown(event) {
    if (event.key === 'Escape' && this.overlay) {
      this.drawerOpened = false;
    }
  }

  /** @private */
  _closeDrawerOnChanged(closeDrawerOn, oldCloseDrawerOn) {
    if (oldCloseDrawerOn) {
      window.removeEventListener(oldCloseDrawerOn, this.__closeOverlayDrawerListener);
    }
    if (closeDrawerOn) {
      window.addEventListener(closeDrawerOn, this.__closeOverlayDrawerListener);
    }
  }

  /** @private */
  _onBackdropClick() {
    this._close();
  }

  /** @private */
  _onBackdropTouchend(event) {
    // Prevent the click event from being fired
    // on clickable element behind the backdrop
    event.preventDefault();

    this._close();
  }

  /** @protected */
  _close() {
    this.drawerOpened = false;
  }

  /** @private */
  _getCustomPropertyValue(customProperty) {
    const customPropertyValue = getComputedStyle(this).getPropertyValue(customProperty);
    return (customPropertyValue || '').trim().toLowerCase();
  }

  /** @protected */
  _updateTouchOptimizedMode() {
    const touchOptimized = this._getCustomPropertyValue('--vaadin-app-layout-touch-optimized') === 'true';

    const navbarItems = this.querySelectorAll('[slot*="navbar"]');

    if (navbarItems.length > 0) {
      Array.from(navbarItems).forEach((navbar) => {
        if (navbar.getAttribute('slot').indexOf('touch-optimized') > -1) {
          navbar.__touchOptimized = true;
        }

        if (touchOptimized && navbar.__touchOptimized) {
          navbar.setAttribute('slot', 'navbar-bottom');
        } else {
          navbar.setAttribute('slot', 'navbar');
        }
      });
    }

    if (this.$.navbarTop.querySelector('[name=navbar]').assignedNodes().length === 0) {
      this.$.navbarTop.setAttribute('hidden', '');
    } else {
      this.$.navbarTop.removeAttribute('hidden');
    }

    if (this.$.navbarBottom.querySelector('[name=navbar-bottom]').assignedNodes().length === 0) {
      this.$.navbarBottom.setAttribute('hidden', '');
    } else {
      this.$.navbarBottom.removeAttribute('hidden');
    }

    this._updateOffsetSize();
  }

  /** @protected */
  _blockAnimationUntilAfterNextRender() {
    this.setAttribute('no-anim', '');
    afterNextRender(this, () => {
      this.removeAttribute('no-anim');
    });
  }

  /**
   * App Layout listens to `close-overlay-drawer` on the window level.
   * A custom event can be dispatched and the App Layout will close the drawer in overlay.
   *
   * That can be used, for instance, when a navigation occurs when user clicks in a menu item inside the drawer.
   *
   * See `dispatchCloseOverlayDrawerEvent()` helper method.
   *
   * @event close-overlay-drawer
   */
}

defineCustomElement(AppLayout);

export { AppLayout };
