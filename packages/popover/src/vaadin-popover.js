/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-popover-overlay.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  getDeepActiveElement,
  getFocusableElements,
  isElementFocused,
  isKeyboardActive,
} from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import {
  hasOnlyNestedOverlays,
  isLastOverlay as isLastOverlayBase,
} from '@vaadin/overlay/src/vaadin-overlay-stack-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { PopoverPositionMixin } from './vaadin-popover-position-mixin.js';
import { PopoverTargetMixin } from './vaadin-popover-target-mixin.js';

const DEFAULT_DELAY = 500;

let defaultFocusDelay = DEFAULT_DELAY;
let defaultHoverDelay = DEFAULT_DELAY;
let defaultHideDelay = DEFAULT_DELAY;

/**
 * Controller for handling popover opened state.
 */
class PopoverOpenedStateController {
  constructor(host) {
    this.host = host;
  }

  /**
   * Whether closing is currently in progress.
   * @return {boolean}
   */
  get isClosing() {
    return this.__closeTimeout != null;
  }

  /** @private */
  get __focusDelay() {
    const popover = this.host;
    return popover.focusDelay != null && popover.focusDelay >= 0 ? popover.focusDelay : defaultFocusDelay;
  }

  /** @private */
  get __hoverDelay() {
    const popover = this.host;
    return popover.hoverDelay != null && popover.hoverDelay >= 0 ? popover.hoverDelay : defaultHoverDelay;
  }

  /** @private */
  get __hideDelay() {
    const popover = this.host;
    return popover.hideDelay != null && popover.hideDelay >= 0 ? popover.hideDelay : defaultHideDelay;
  }

  /**
   * Schedule opening the popover.
   * @param {Object} options
   */
  open(options = { immediate: false }) {
    if (this.isClosing) {
      // Abort closing on overlay mouseenter.
      this.__abortClose();
      return;
    }

    const { immediate, trigger } = options;
    const shouldDelayHover = trigger === 'hover' && this.__hoverDelay > 0;
    const shouldDelayFocus = trigger === 'focus' && this.__focusDelay > 0;

    if (!immediate && (shouldDelayHover || shouldDelayFocus)) {
      this.__scheduleOpen(trigger);
    } else {
      this.__showPopover();
    }
  }

  /**
   * Schedule closing the popover.
   * @param {boolean} immediate
   */
  close(immediate) {
    if (this.__openTimeout != null) {
      // Close immediately if still opening to not wait for hide delay.
      this.__abortOpen();
    } else if (immediate || this.__hideDelay === 0) {
      // Close immediately e.g. on Esc press or with zero hide delay.
      this.__abortClose();
      this.__setOpened(false);
    } else {
      this.__scheduleClose();
    }
  }

  /** @private */
  __setOpened(opened) {
    this.host.opened = opened;
  }

  /** @private */
  __showPopover() {
    this.__abortClose();
    this.__setOpened(true);
  }

  /** @private */
  __abortClose() {
    if (this.__closeTimeout) {
      clearTimeout(this.__closeTimeout);
      this.__closeTimeout = null;
    }
  }

  /** @private */
  __abortOpen() {
    if (this.__openTimeout) {
      clearTimeout(this.__openTimeout);
      this.__openTimeout = null;
    }
  }

  /** @private */
  __scheduleClose() {
    this.__closeTimeout = setTimeout(() => {
      this.__closeTimeout = null;
      this.__setOpened(false);
    }, this.__hideDelay);
  }

  /** @private */
  __scheduleOpen(trigger) {
    this.__abortOpen();

    const delay = trigger === 'focus' ? this.__focusDelay : this.__hoverDelay;
    this.__openTimeout = setTimeout(() => {
      this.__openTimeout = null;
      this.__showPopover();
    }, delay);
  }
}

/**
 * Returns true if the popover overlay is the last one in the opened overlays stack, ignoring tooltips.
 * @param {HTMLElement} overlay
 * @return {boolean}
 * @protected
 */
const isLastOverlay = (overlay) => {
  // Ignore tooltips, popovers should still close when a tooltip is present
  const filter = (o) => o.localName !== 'vaadin-tooltip-overlay';
  return isLastOverlayBase(overlay, filter);
};

/**
 * `<vaadin-popover>` is a Web Component for creating overlays
 * that are positioned next to specified DOM element (target).
 *
 * Unlike `<vaadin-tooltip>`, the popover supports rich content
 * that can be provided by using `renderer` function.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------------------------------------
 * `backdrop`       | Backdrop of the overlay
 * `overlay`        | The overlay container
 * `content`        | The overlay content
 * `arrow`          | Optional arrow pointing to the target when using `theme="arrow"`
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|----------------------------------------
 * `position`       | Reflects the `position` property value.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                      |
 * :----------------------------------------|
 * |`--vaadin-overlay-backdrop-background`  |
 * |`--vaadin-popover-arrow-border-radius`  |
 * |`--vaadin-popover-arrow-size`           |
 * |`--vaadin-popover-background`           |
 * |`--vaadin-popover-border-color`         |
 * |`--vaadin-popover-border-radius`        |
 * |`--vaadin-popover-border-width`         |
 * |`--vaadin-popover-offset-bottom`        |
 * |`--vaadin-popover-offset-end`           |
 * |`--vaadin-popover-offset-start`         |
 * |`--vaadin-popover-offset-top`           |
 * |`--vaadin-popover-padding`              |
 * |`--vaadin-popover-shadow`               |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} closed - Fired when the popover is closed.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes PopoverPositionMixin
 * @mixes PopoverTargetMixin
 * @mixes ThemePropertyMixin
 */
class Popover extends PopoverPositionMixin(
  PopoverTargetMixin(ThemePropertyMixin(ElementMixin(PolylitMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-popover';
  }

  static get styles() {
    return css`
      :host([opened]),
      :host([opening]),
      :host([closing]) {
        display: block !important;
        position: fixed;
        outline: none;
      }

      :host,
      :host([hidden]) {
        display: none !important;
      }

      :host(:focus-visible) ::part(overlay) {
        outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      }
    `;
  }

  static get properties() {
    return {
      /**
       * String used to label the popover to screen reader users.
       *
       * @attr {string} accessible-name
       * @deprecated Use `aria-label` attribute on the popover instead
       */
      accessibleName: {
        type: String,
      },

      /**
       * Id of the element used as label of the popover to screen reader users.
       *
       * @attr {string} accessible-name-ref
       * @deprecated Use `aria-labelledby` attribute on the popover instead
       */
      accessibleNameRef: {
        type: String,
      },

      /**
       * When true, the popover content automatically receives focus after
       * it is opened. Modal popovers use this behavior by default.
       */
      autofocus: {
        type: Boolean,
      },

      /**
       * Set the height of the popover.
       * If a unitless number is provided, pixels are assumed.
       */
      height: {
        type: String,
      },

      /**
       * Set the width of the popover.
       * If a unitless number is provided, pixels are assumed.
       */
      width: {
        type: String,
      },

      /**
       * The delay in milliseconds before the popover is opened
       * on focus when the corresponding trigger is used.
       *
       * When not specified, the global default (500ms) is used.
       *
       * @attr {number} focus-delay
       */
      focusDelay: {
        type: Number,
      },

      /**
       * The delay in milliseconds before the popover is closed
       * on losing hover, when the corresponding trigger is used.
       * On blur, the popover is closed immediately.
       *
       * When not specified, the global default (500ms) is used.
       *
       * @attr {number} hide-delay
       */
      hideDelay: {
        type: Number,
      },

      /**
       * The delay in milliseconds before the popover is opened
       * on hover when the corresponding trigger is used.
       *
       * When not specified, the global default (500ms) is used.
       *
       * @attr {number} hover-delay
       */
      hoverDelay: {
        type: Number,
      },

      /**
       * True if the popover is visible and available for interaction.
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true,
        observer: '__openedChanged',
      },

      /**
       * The `role` attribute value to be set on the popover.
       * When not specified, defaults to 'dialog'.
       */
      role: {
        type: String,
        reflectToAttribute: true,
      },

      /**
       * The `role` attribute value to be set on the popover.
       *
       * @attr {string} overlay-role
       * @deprecated Use standard `role` attribute on the popover instead
       */
      overlayRole: {
        type: String,
      },

      /**
       * Custom function for rendering the content of the popover.
       * Receives two arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `popover` The reference to the `vaadin-popover` element.
       *
       * @deprecated Use the content in the `vaadin-popover` via default slot
       */
      renderer: {
        type: Object,
      },

      /**
       * When true, the popover prevents interacting with background elements
       * by setting `pointer-events` style on the document body to `none`.
       * This also enables trapping focus inside the popover.
       */
      modal: {
        type: Boolean,
        value: false,
      },

      /**
       * Set to true to disable closing popover on outside click.
       *
       * @attr {boolean} no-close-on-outside-click
       */
      noCloseOnOutsideClick: {
        type: Boolean,
        value: false,
      },

      /**
       * Set to true to disable closing popover on Escape press.
       *
       * @attr {boolean} no-close-on-esc
       */
      noCloseOnEsc: {
        type: Boolean,
        value: false,
      },

      /**
       * Popover trigger mode, used to configure how the popover is opened or closed.
       * Could be set to multiple by providing an array, e.g. `trigger = ['hover', 'focus']`.
       *
       * Supported values:
       * - `click` (default) - opens and closes on target click.
       * - `hover` - opens on target mouseenter, closes on target mouseleave. Moving mouse
       * to the popover content keeps the popover opened.
       * - `focus` - opens on target focus, closes on target blur. Moving focus to the
       * popover content keeps the popover opened.
       *
       * In addition to the behavior specified by `trigger`, the popover can be closed by:
       * - pressing Escape key (unless `noCloseOnEsc` property is true)
       * - outside click (unless `noCloseOnOutsideClick` property is true)
       *
       * When setting `trigger` property to `null`, `undefined` or empty array, the popover
       * can be only opened programmatically by changing `opened` property. Note, closing
       * on Escape press or outside click is still allowed unless explicitly disabled.
       */
      trigger: {
        type: Array,
        value: () => ['click'],
      },

      /**
       * When true, the popover has a backdrop (modality curtain) on top of the
       * underlying page content, covering the whole viewport.
       *
       * @attr {boolean} with-backdrop
       */
      withBackdrop: {
        type: Boolean,
        value: false,
      },

      /** @private */
      __shouldRestoreFocus: {
        type: Boolean,
        value: false,
        sync: true,
      },
    };
  }

  static get observers() {
    return ['__updateAriaAttributes(opened, role, target)'];
  }

  /**
   * Sets the default focus delay to be used by all popover instances,
   * except for those that have focus delay configured using property.
   *
   * @param {number} focusDelay
   */
  static setDefaultFocusDelay(focusDelay) {
    defaultFocusDelay = focusDelay != null && focusDelay >= 0 ? focusDelay : DEFAULT_DELAY;
  }

  /**
   * Sets the default hide delay to be used by all popover instances,
   * except for those that have hide delay configured using property.
   *
   * @param {number} hideDelay
   */
  static setDefaultHideDelay(hideDelay) {
    defaultHideDelay = hideDelay != null && hideDelay >= 0 ? hideDelay : DEFAULT_DELAY;
  }

  /**
   * Sets the default hover delay to be used by all popover instances,
   * except for those that have hover delay configured using property.
   *
   * @param {number} hoverDelay
   */
  static setDefaultHoverDelay(hoverDelay) {
    defaultHoverDelay = hoverDelay != null && hoverDelay >= 0 ? hoverDelay : DEFAULT_DELAY;
  }

  constructor() {
    super();

    this.__generatedId = `vaadin-popover-${generateUniqueId()}`;

    this.__onGlobalKeyDown = this.__onGlobalKeyDown.bind(this);
    this.__onTargetClick = this.__onTargetClick.bind(this);
    this.__onTargetFocusIn = this.__onTargetFocusIn.bind(this);
    this.__onTargetFocusOut = this.__onTargetFocusOut.bind(this);
    this.__onTargetMouseEnter = this.__onTargetMouseEnter.bind(this);
    this.__onTargetMouseLeave = this.__onTargetMouseLeave.bind(this);

    this._openedStateController = new PopoverOpenedStateController(this);
  }

  /** @protected */
  render() {
    const effectivePosition = this.__effectivePosition;

    return html`
      <vaadin-popover-overlay
        id="overlay"
        .renderer="${this.renderer}"
        .owner="${this}"
        theme="${ifDefined(this._theme)}"
        .positionTarget="${this.target}"
        .position="${effectivePosition}"
        .opened="${this.opened}"
        .modeless="${!this.modal}"
        .focusTrap="${this.modal}"
        .withBackdrop="${this.withBackdrop}"
        ?no-horizontal-overlap="${this.__computeNoHorizontalOverlap(effectivePosition)}"
        ?no-vertical-overlap="${this.__computeNoVerticalOverlap(effectivePosition)}"
        .horizontalAlign="${this.__computeHorizontalAlign(effectivePosition)}"
        .verticalAlign="${this.__computeVerticalAlign(effectivePosition)}"
        @mousedown="${this.__onOverlayMouseDown}"
        @mouseenter="${this.__onOverlayMouseEnter}"
        @mouseleave="${this.__onOverlayMouseLeave}"
        @focusin="${this.__onOverlayFocusIn}"
        @focusout="${this.__onOverlayFocusOut}"
        @opened-changed="${this.__onOpenedChanged}"
        .restoreFocusOnClose="${this.__shouldRestoreFocus}"
        .restoreFocusNode="${this.target}"
        exportparts="backdrop, overlay, content, arrow"
        @vaadin-overlay-escape-press="${this.__onEscapePress}"
        @vaadin-overlay-outside-click="${this.__onOutsideClick}"
        @vaadin-overlay-open="${this.__onOverlayOpened}"
        @vaadin-overlay-closed="${this.__onOverlayClosed}"
      >
        <slot></slot>
      </vaadin-popover-overlay>
    `;
  }

  /**
   * Requests an update for the content of the popover.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   *
   * @deprecated Add content elements as children of the popover using default slot
   */
  requestContentUpdate() {
    if (!this.renderer || !this._overlayElement) {
      return;
    }

    this._overlayElement.requestContentUpdate();
  }

  /** @protected */
  ready() {
    super.ready();

    this._overlayElement = this.$.overlay;

    this.setAttribute('tabindex', '0');

    this.addEventListener('focusin', (e) => {
      this.__onFocusIn(e);
    });

    this.addEventListener('focusout', (e) => {
      this.__onFocusOut(e);
    });

    if (!this.hasAttribute('role')) {
      this.role = 'dialog';
    }
  }

  /** @protected */
  willUpdate(props) {
    super.willUpdate(props);

    if (props.has('overlayRole')) {
      this.role = this.overlayRole;
    }
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('width') || props.has('height')) {
      const { width, height } = this;
      requestAnimationFrame(() => this.$.overlay.setBounds({ width, height }, false));
    }

    if (props.has('accessibleName')) {
      if (this.accessibleName) {
        this.setAttribute('aria-label', this.accessibleName);
      } else {
        this.removeAttribute('aria-label');
      }
    }

    if (props.has('accessibleNameRef')) {
      if (this.accessibleNameRef) {
        this.setAttribute('aria-labelledby', this.accessibleNameRef);
      } else {
        this.removeAttribute('aria-labelledby');
      }
    }

    if (props.has('modal')) {
      if (this.modal) {
        this.setAttribute('aria-modal', 'true');
      } else {
        this.removeAttribute('aria-modal');
      }
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    // If no user ID is provided, set generated ID
    if (!this.id) {
      this.id = this.__generatedId;
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    // Automatically close popover when it is removed from DOM
    // Avoid closing if the popover is just moved in the DOM
    queueMicrotask(() => {
      if (!this.isConnected) {
        this._openedStateController.close(true);
      }
    });
  }

  /**
   * @param {HTMLElement} target
   * @protected
   * @override
   */
  _addTargetListeners(target) {
    target.addEventListener('click', this.__onTargetClick);
    target.addEventListener('mouseenter', this.__onTargetMouseEnter);
    target.addEventListener('mouseleave', this.__onTargetMouseLeave);
    target.addEventListener('focusin', this.__onTargetFocusIn);
    target.addEventListener('focusout', this.__onTargetFocusOut);
  }

  /**
   * @param {HTMLElement} target
   * @protected
   * @override
   */
  _removeTargetListeners(target) {
    target.removeEventListener('click', this.__onTargetClick);
    target.removeEventListener('mouseenter', this.__onTargetMouseEnter);
    target.removeEventListener('mouseleave', this.__onTargetMouseLeave);
    target.removeEventListener('focusin', this.__onTargetFocusIn);
    target.removeEventListener('focusout', this.__onTargetFocusOut);
  }

  /** @private */
  __openedChanged(opened, oldOpened) {
    if (opened) {
      document.addEventListener('keydown', this.__onGlobalKeyDown, true);
    } else if (oldOpened) {
      document.removeEventListener('keydown', this.__onGlobalKeyDown, true);
    }
  }

  /** @private */
  __updateAriaAttributes(opened, role, target) {
    if (this.__oldTarget) {
      const oldEffectiveTarget = this.__oldTarget.ariaTarget || this.__oldTarget;
      oldEffectiveTarget.removeAttribute('aria-haspopup');
      oldEffectiveTarget.removeAttribute('aria-expanded');
      oldEffectiveTarget.removeAttribute('aria-controls');
    }

    if (target) {
      const effectiveTarget = target.ariaTarget || target;

      const isDialog = role === 'dialog' || role === 'alertdialog';
      effectiveTarget.setAttribute('aria-haspopup', isDialog ? 'dialog' : 'true');

      effectiveTarget.setAttribute('aria-expanded', opened ? 'true' : 'false');

      if (opened) {
        effectiveTarget.setAttribute('aria-controls', this.id);
      } else {
        effectiveTarget.removeAttribute('aria-controls');
      }

      this.__oldTarget = target;
    }
  }

  /** @private */
  __onTargetClick() {
    if (this.__hasTrigger('click')) {
      if (!this.opened) {
        this.__shouldRestoreFocus = true;
      }
      if (this.opened) {
        this._openedStateController.close(true);
      } else {
        this._openedStateController.open({ immediate: true });
      }
    }
  }

  /**
   * Overlay's global Escape press listener doesn't work when
   * the overlay is modeless, so we use a separate listener.
   * @private
   */
  __onGlobalKeyDown(event) {
    // Modal popover uses overlay logic focus trap.
    if (this.modal) {
      return;
    }

    // Include popover content in the Tab order after the target.
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        this.__onGlobalShiftTab(event);
      } else {
        this.__onGlobalTab(event);
      }
    }
  }

  /** @private */
  __onGlobalTab(event) {
    // Move focus to the popover on target element Tab
    if (this.target && isElementFocused(this.__getTargetFocusable())) {
      event.preventDefault();
      this.focus();
      return;
    }

    // Move focus to the next element after target on content Tab
    const lastFocusable = this.__getLastFocusable(this);
    if (lastFocusable && isElementFocused(lastFocusable)) {
      const focusable = this.__getNextBodyFocusable(this.__getTargetFocusable());
      if (focusable && focusable !== this) {
        event.preventDefault();
        focusable.focus();
        return;
      }
    }

    // Prevent focusing the popover content on previous element Tab
    const activeElement = getDeepActiveElement();
    const nextFocusable = this.__getNextBodyFocusable(activeElement);
    if (nextFocusable === this && lastFocusable) {
      // Move focus to the last overlay focusable and do NOT prevent keydown
      // to move focus outside the popover content (e.g. to the URL bar).
      lastFocusable.focus();
    }
  }

  /** @private */
  __onGlobalShiftTab(event) {
    // Prevent restoring focus after target blur on Shift + Tab
    if (this.target && isElementFocused(this.__getTargetFocusable()) && this.__shouldRestoreFocus) {
      this.__shouldRestoreFocus = false;
      return;
    }

    // Move focus back to the target on popover Shift + Tab
    if (this.target && isElementFocused(this)) {
      event.preventDefault();
      this.__getTargetFocusable().focus();
      return;
    }

    // Move focus back to the popover on next element Shift + Tab
    const nextFocusable = this.__getNextBodyFocusable(this.__getTargetFocusable());
    if (nextFocusable && isElementFocused(nextFocusable)) {
      const lastFocusable = this.__getLastFocusable(this);
      if (lastFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    }
  }

  /** @private */
  __getNextBodyFocusable(target) {
    const focusables = getFocusableElements(document.body);
    const idx = focusables.findIndex((el) => el === target);
    return focusables[idx + 1];
  }

  /** @private */
  __getLastFocusable(container) {
    const focusables = getFocusableElements(container);
    return focusables.pop();
  }

  /** @private */
  __getTargetFocusable() {
    if (!this.target) {
      return null;
    }

    // If target has `focusElement`, check if that one is focused.
    return this.target.focusElement || this.target;
  }

  /** @private */
  __onTargetFocusIn() {
    this.__focusInside = true;

    if (this.__hasTrigger('focus')) {
      // When trigger is set to both focus and click, only open on
      // keyboard focus, to prevent issue when immediately closing
      // on click which occurs after the focus caused by mousedown.
      if (this.__hasTrigger('click') && !isKeyboardActive()) {
        return;
      }

      // Prevent overlay re-opening when restoring focus on close.
      if (!this.__shouldRestoreFocus) {
        this.__shouldRestoreFocus = true;
        this._openedStateController.open({ trigger: 'focus' });
      }
    }
  }

  /** @private */
  __onTargetFocusOut(event) {
    // Do not close if there is a nested overlay that should be closed through some method first.
    // This covers the case when focus moves to the nested popover opened
    // without focusing parent popover overlay (e.g. using hover trigger).
    if (
      this._overlayElement.opened &&
      !isLastOverlay(this._overlayElement) &&
      hasOnlyNestedOverlays(this._overlayElement)
    ) {
      return;
    }

    if ((this.__hasTrigger('focus') && this.__mouseDownInside) || this.contains(event.relatedTarget)) {
      return;
    }

    this.__handleFocusout();
  }

  /** @private */
  __onTargetMouseEnter() {
    this.__hoverInside = true;

    if (this.__hasTrigger('hover') && !this.opened) {
      // Prevent closing due to `pointer-events: none` set on body.
      if (this.modal) {
        this.target.style.pointerEvents = 'auto';
      }
      this._openedStateController.open({ trigger: 'hover' });
    }
  }

  /** @private */
  __onTargetMouseLeave(event) {
    // Do not close if the pointer moves to the overlay
    if (this.contains(event.relatedTarget)) {
      return;
    }
    // Do not close if there is a nested overlay that should be closed through some method first.
    if (
      this._overlayElement.opened &&
      !isLastOverlay(this._overlayElement) &&
      hasOnlyNestedOverlays(this._overlayElement)
    ) {
      return;
    }

    this.__handleMouseLeave();
  }

  /** @private */
  __onFocusIn() {
    this.__focusInside = true;

    // When using Tab to move focus, restoring focus is reset. However, if pressing Tab
    // causes focus to be moved inside the overlay, we should restore focus on close.
    if (this.__hasTrigger('focus') || this.__hasTrigger('click')) {
      this.__shouldRestoreFocus = true;
    }
  }

  /** @private */
  __onFocusOut(event) {
    // Do not close if there is a nested overlay that should be closed through some method first.
    // This covers the following cases of nested overlay based components:
    // 1. Moving focus to the nested overlay (e.g. vaadin-select, vaadin-menu-bar)
    // 2. Closing not focused nested overlay on outside (e.g. vaadin-combo-box)
    if (!isLastOverlay(this._overlayElement) && hasOnlyNestedOverlays(this._overlayElement)) {
      return;
    }

    if (
      (this.__hasTrigger('focus') && this.__mouseDownInside) ||
      event.relatedTarget === this.target ||
      this.contains(event.relatedTarget)
    ) {
      return;
    }

    this.__handleFocusout();
  }

  /** @private */
  __onOverlayMouseDown() {
    if (this.__hasTrigger('focus')) {
      this.__mouseDownInside = true;

      document.addEventListener(
        'mouseup',
        () => {
          this.__mouseDownInside = false;
        },
        { once: true },
      );
    }
  }

  /** @private */
  __onOverlayMouseEnter() {
    this.__hoverInside = true;

    // Prevent closing if cursor moves to the overlay during hide delay.
    if (this.__hasTrigger('hover') && this._openedStateController.isClosing) {
      this._openedStateController.open({ immediate: true });
    }
  }

  /** @private */
  __onOverlayMouseLeave(event) {
    // Do not close if the pointer moves to the target
    if (event.relatedTarget === this.target) {
      return;
    }
    // Do not close if there is a nested overlay that should be closed through some method first.
    if (!isLastOverlay(this._overlayElement) && hasOnlyNestedOverlays(this._overlayElement)) {
      return;
    }

    this.__handleMouseLeave();
  }

  /** @private */
  __handleFocusout() {
    this.__focusInside = false;

    if (this.__hasTrigger('hover') && this.__hoverInside) {
      return;
    }

    if (this.__hasTrigger('focus')) {
      // Do not restore focus if closed on focusout on Tab
      if (isKeyboardActive()) {
        this.__shouldRestoreFocus = false;
      }

      this._openedStateController.close(true);
    }
  }

  /** @private */
  __handleMouseLeave() {
    this.__hoverInside = false;

    if (this.__hasTrigger('focus') && this.__focusInside) {
      return;
    }

    if (this.__hasTrigger('hover')) {
      this._openedStateController.close();
    }
  }

  /** @private */
  __onOpenedChanged(event) {
    this.opened = event.detail.value;
  }

  /** @private */
  __onOverlayOpened() {
    if (this.autofocus && !this.modal) {
      this.focus();
    }
  }

  /** @private */
  __onOverlayClosed() {
    // Reset restoring focus state after a timeout to make sure focus was restored
    // and then allow re-opening overlay on re-focusing target with focus trigger.
    if (this.__shouldRestoreFocus) {
      setTimeout(() => {
        this.__shouldRestoreFocus = false;
      });
    }

    // Restore pointer-events set when opening on hover.
    if (this.modal && this.target && this.target.style.pointerEvents) {
      this.target.style.pointerEvents = '';
    }

    this.dispatchEvent(new CustomEvent('closed'));
  }

  /**
   * Close the popover if `noCloseOnEsc` isn't set to true.
   * @private
   */
  __onEscapePress(e) {
    if (this.noCloseOnEsc) {
      e.preventDefault();
    }
  }

  /**
   * Close the popover if `noCloseOnOutsideClick` isn't set to true.
   * @private
   */
  __onOutsideClick(e) {
    if (this.noCloseOnOutsideClick) {
      e.preventDefault();
    }
  }

  /** @private */
  __hasTrigger(trigger) {
    return Array.isArray(this.trigger) && this.trigger.includes(trigger);
  }

  /**
   * Fired when the popover is closed.
   *
   * @event closed
   */
}

defineCustomElement(Popover);

export { Popover };
