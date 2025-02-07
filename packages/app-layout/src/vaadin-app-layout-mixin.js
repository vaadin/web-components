/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { afterNextRender, beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { AriaModalController } from '@vaadin/a11y-base/src/aria-modal-controller.js';
import { FocusTrapController } from '@vaadin/a11y-base/src/focus-trap-controller.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';

/**
 * @typedef {import('./vaadin-app-layout.js').AppLayoutI18n} AppLayoutI18n
 */

const DEFAULT_I18N = {
  drawer: 'Drawer',
};

/**
 * @polymerMixin
 * @mixes I18nMixin
 */
export const AppLayoutMixin = (superclass) =>
  class AppLayoutMixinClass extends I18nMixin(DEFAULT_I18N, superclass) {
    static get properties() {
      return {
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
          sync: true,
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
          sync: true,
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
          sync: true,
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

    static get observers() {
      return ['__i18nChanged(__effectiveI18n)'];
    }

    /**
     * Helper static method that dispatches a `close-overlay-drawer` event
     */
    static dispatchCloseOverlayDrawerEvent() {
      window.dispatchEvent(new CustomEvent('close-overlay-drawer'));
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The object has the following structure and default values:
     * ```
     * {
     *   drawer: 'Drawer'
     * }
     * ```
     * @return {!AppLayoutI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
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
        this.primarySection = 'navbar';
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
        drawer.setAttribute('aria-label', this.__effectiveI18n.drawer);
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
  };
