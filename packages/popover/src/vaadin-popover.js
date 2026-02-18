/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-popover-overlay.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { getActiveTrappingNode } from '@vaadin/a11y-base/src/focus-trap-controller.js';
import {
  getDeepActiveElement,
  getFocusableElements,
  isElementFocused,
  isKeyboardActive,
} from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
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
 * `<vaadin-popover>` uses `<vaadin-popover-overlay>` internal
 * themable component as the actual visible overlay.
 *
 * See [`<vaadin-overlay>`](#/elements/vaadin-overlay) documentation
 * for `<vaadin-popover-overlay>` parts.
 *
 * In addition to `<vaadin-overlay>` parts, the following parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------------------------------------
 * `arrow`          | Optional arrow pointing to the target when using `theme="arrow"`
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|----------------------------------------
 * `position`       | Reflects the `position` property value.
 *
 * Note: the `theme` attribute value set on `<vaadin-popover>` is
 * propagated to the internal `<vaadin-popover-overlay>` component.
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available on the `<vaadin-popover>` element:
 *
 * Custom CSS property              | Description
 * ---------------------------------|-------------
 * `--vaadin-popover-offset-top`    | Used as an offset when the popover is aligned vertically below the target
 * `--vaadin-popover-offset-bottom` | Used as an offset when the popover is aligned vertically above the target
 * `--vaadin-popover-offset-start`  | Used as an offset when the popover is aligned horizontally after the target
 * `--vaadin-popover-offset-end`    | Used as an offset when the popover is aligned horizontally before the target
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} closed - Fired when the popover is closed.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes OverlayClassMixin
 * @mixes PopoverPositionMixin
 * @mixes PopoverTargetMixin
 * @mixes ThemePropertyMixin
 */
class Popover extends PopoverPositionMixin(
  PopoverTargetMixin(OverlayClassMixin(ThemePropertyMixin(ElementMixin(PolylitMixin(LitElement))))),
) {
  static get is() {
    return 'vaadin-popover';
  }

  static get styles() {
    return css`
      :host {
        display: none !important;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * String used to label the overlay to screen reader users.
       *
       * @attr {string} accessible-name
       */
      accessibleName: {
        type: String,
      },

      /**
       * Id of the element used as label of the overlay to screen reader users.
       *
       * @attr {string} accessible-name-ref
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
       * Height to be set on the overlay content.
       *
       * @attr {string} content-height
       */
      contentHeight: {
        type: String,
      },

      /**
       * Width to be set on the overlay content.
       *
       * @attr {string} content-width
       */
      contentWidth: {
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
       * True if the popover overlay is opened, false otherwise.
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true,
        observer: '__openedChanged',
      },

      /**
       * The `role` attribute value to be set on the overlay.
       *
       * @attr {string} overlay-role
       */
      overlayRole: {
        type: String,
        value: 'dialog',
      },

      /**
       * Custom function for rendering the content of the overlay.
       * Receives two arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `popover` The reference to the `vaadin-popover` element (overlay host).
       */
      renderer: {
        type: Object,
      },

      /**
       * When true, the popover prevents interacting with background elements
       * by setting `pointer-events` style on the document body to `none`.
       * This also enables trapping focus inside the overlay.
       */
      modal: {
        type: Boolean,
        value: false,
      },

      /**
       * Set to true to disable closing popover overlay on outside click.
       *
       * @attr {boolean} no-close-on-outside-click
       */
      noCloseOnOutsideClick: {
        type: Boolean,
        value: false,
      },

      /**
       * Set to true to disable closing popover overlay on Escape press.
       * When the popover is modal, pressing Escape anywhere in the
       * document closes the overlay. Otherwise, only Escape press
       * from the popover itself or its target closes the overlay.
       *
       * @attr {boolean} no-close-on-esc
       */
      noCloseOnEsc: {
        type: Boolean,
        value: false,
      },

      /**
       * Popover trigger mode, used to configure how the overlay is opened or closed.
       * Could be set to multiple by providing an array, e.g. `trigger = ['hover', 'focus']`.
       *
       * Supported values:
       * - `click` (default) - opens and closes on target click.
       * - `hover` - opens on target mouseenter, closes on target mouseleave. Moving mouse
       * to the popover overlay content keeps the overlay opened.
       * - `focus` - opens on target focus, closes on target blur. Moving focus to the
       * popover overlay content keeps the overlay opened.
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
       * When true, the overlay has a backdrop (modality curtain) on top of the
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

      /** @private */
      __overlayId: {
        type: String,
      },
    };
  }

  static get observers() {
    return [
      '__updateContentHeight(contentHeight, _overlayElement)',
      '__updateContentWidth(contentWidth, _overlayElement)',
      '__updateAriaAttributes(opened, overlayRole, target)',
    ];
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

    this.__overlayId = `vaadin-popover-${generateUniqueId()}`;

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
        id="${this.__overlayId}"
        role="${this.overlayRole}"
        aria-label="${ifDefined(this.accessibleName)}"
        aria-labelledby="${ifDefined(this.accessibleNameRef)}"
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
        @vaadin-overlay-escape-press="${this.__onEscapePress}"
        @vaadin-overlay-outside-click="${this.__onOutsideClick}"
        @vaadin-overlay-open="${this.__onOverlayOpened}"
        @vaadin-overlay-closed="${this.__onOverlayClosed}"
      ></vaadin-popover-overlay>
    `;
  }

  /**
   * Requests an update for the content of the popover.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
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

    this._overlayElement = this.$[this.__overlayId];
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
  __updateAriaAttributes(opened, overlayRole, target) {
    if (this.__oldTarget) {
      const oldEffectiveTarget = this.__oldTarget.ariaTarget || this.__oldTarget;
      oldEffectiveTarget.removeAttribute('aria-haspopup');
      oldEffectiveTarget.removeAttribute('aria-expanded');
      oldEffectiveTarget.removeAttribute('aria-controls');
    }

    if (target) {
      const effectiveTarget = target.ariaTarget || target;

      const isDialog = overlayRole === 'dialog' || overlayRole === 'alertdialog';
      effectiveTarget.setAttribute('aria-haspopup', isDialog ? 'dialog' : 'true');

      effectiveTarget.setAttribute('aria-expanded', opened ? 'true' : 'false');

      if (opened) {
        effectiveTarget.setAttribute('aria-controls', this.__overlayId);
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
    const overlayPart = this._overlayElement.$.overlay;

    // Move focus to the popover content on target element Tab
    if (this.target && isElementFocused(this.__getTargetFocusable())) {
      event.preventDefault();
      overlayPart.focus();
      return;
    }

    // Handle Tab within the overlay content explicitly. The overlay is
    // teleported to the body and is outside the dialog's focus trap, so the
    // FocusTrapController would otherwise intercept the Tab event.
    if (isElementFocused(overlayPart)) {
      const contentFocusables = getFocusableElements(this._overlayElement.$.content);
      if (contentFocusables.length > 0) {
        event.preventDefault();
        contentFocusables[0].focus();
        return;
      }
      // No focusable content - fall through to isFocusOut handling below
    } else if (this._overlayElement.contains(getDeepActiveElement())) {
      const contentFocusables = getFocusableElements(this._overlayElement.$.content);
      const activeEl = getDeepActiveElement();
      const idx = contentFocusables.indexOf(activeEl);
      if (idx >= 0 && idx < contentFocusables.length - 1) {
        event.preventDefault();
        contentFocusables[idx + 1].focus();
        return;
      }
      // Last content focusable - fall through to isFocusOut handling below
    }

    // Cache filtered focusable list for this keystroke to avoid redundant DOM traversals
    const focusables = this.__getScopeFocusables();

    // Move focus to the next element after target on last content Tab,
    // or when overlay part itself is focused and has no focusable content
    const lastFocusable = this.__getLastFocusable();
    const isFocusOut = lastFocusable ? isElementFocused(lastFocusable) : isElementFocused(overlayPart);
    if (isFocusOut) {
      let focusable = this.__getNextScopeFocusable(this.__getTargetFocusable(), focusables);
      // If the next element after the target is the overlay part (DOM position
      // differs from logical position), skip past it to the actual next element.
      if (focusable === overlayPart) {
        focusable = this.__getNextScopeFocusable(overlayPart, focusables);
      }
      if (focusable) {
        event.preventDefault();
        focusable.focus();
        return;
      }
      // No next element after the target in the scope. When inside a focus trap,
      // wrap explicitly to the first focusable. Don't fall through - the
      // FocusTrapController uses DOM order which may differ from the popover's
      // logical tab position.
      if (getActiveTrappingNode(this) && focusables[0]) {
        event.preventDefault();
        focusables[0].focus();
        return;
      }
    }

    // Handle cases where Tab from the current element would land on the overlay
    const activeElement = getDeepActiveElement();
    const nextFocusable = this.__getNextScopeFocusable(activeElement, focusables);
    if (nextFocusable === overlayPart) {
      // The overlay should only be Tab-reachable from its target (handled above).
      // Skip the overlay when Tab from any other element would land on it
      // due to its DOM position.
      const focusableAfterOverlay = this.__getNextScopeFocusable(overlayPart, focusables);
      if (focusableAfterOverlay) {
        event.preventDefault();
        focusableAfterOverlay.focus();
      } else if (getActiveTrappingNode(this) && focusables[0]) {
        // Overlay is last in DOM scope but shouldn't be Tab-reachable from
        // non-target elements. Wrap to first focusable in focus trap.
        event.preventDefault();
        focusables[0].focus();
      }
    }
  }

  /** @private */
  __onGlobalShiftTab(event) {
    const overlayPart = this._overlayElement.$.overlay;

    // Prevent restoring focus after target blur on Shift + Tab
    if (this.target && isElementFocused(this.__getTargetFocusable()) && this.__shouldRestoreFocus) {
      this.__shouldRestoreFocus = false;
      return;
    }

    // Move focus back to the target on overlay content Shift + Tab
    if (this.target && isElementFocused(overlayPart)) {
      event.preventDefault();
      this.__getTargetFocusable().focus();
      return;
    }

    // Handle Shift+Tab within the overlay content explicitly. The overlay is
    // teleported to the body and is outside the dialog's focus trap, so the
    // FocusTrapController would otherwise intercept the Shift+Tab event.
    const activeElement = getDeepActiveElement();
    if (this._overlayElement.contains(activeElement)) {
      const contentFocusables = getFocusableElements(this._overlayElement.$.content);
      const idx = contentFocusables.indexOf(activeElement);
      if (idx > 0) {
        event.preventDefault();
        contentFocusables[idx - 1].focus();
        return;
      }
      // First content focusable or not found - move to overlay part
      event.preventDefault();
      overlayPart.focus();
      return;
    }

    // Cache filtered focusable list for this keystroke to avoid redundant DOM traversals
    const focusables = this.__getScopeFocusables();

    // Get previous focusable element excluding the overlay
    const prevFocusable = this.__getPrevScopeFocusable(activeElement, focusables);
    const targetFocusable = this.__getTargetFocusable();

    // Intercept Shift+Tab when the previous focusable (excluding the overlay)
    // is the target. Instead of moving to the target, redirect focus into
    // the overlay's last focusable content (or the overlay part itself).
    if (prevFocusable === targetFocusable) {
      event.preventDefault();
      this.__focusLastOrSelf();
      return;
    }

    // Move focus into the overlay when:
    // 1. There is no previous focusable element in the focus trap (at the
    //    beginning, would wrap around), and
    // 2. The target is the last focusable in the focus trap (making the
    //    overlay logically last).
    // Don't fall through - the FocusTrapController uses DOM order which
    // may differ from the popover's logical tab position.
    if (!prevFocusable && getActiveTrappingNode(this)) {
      const list = focusables.filter((el) => el !== overlayPart);
      if (list.at(-1) === targetFocusable) {
        event.preventDefault();
        this.__focusLastOrSelf();
        return;
      }
      // Overlay is last in DOM but target is not the last focusable.
      // Wrap to last non-overlay focusable to prevent FocusTrapController
      // from landing on the overlay.
      const last = list.at(-1);
      if (last) {
        event.preventDefault();
        last.focus();
        return;
      }
    }

    // Get previous focusable element including the overlay (simulates native Tab order)
    const prevFocusableNative = this.__getPrevScopeFocusable(activeElement, focusables, true);
    // Skip the overlay when native Shift+Tab would land on it
    // and redirect to the actual previous element
    if (prevFocusableNative === overlayPart) {
      if (prevFocusable) {
        event.preventDefault();
        prevFocusable.focus();
      } else if (getActiveTrappingNode(this)) {
        // Overlay is first in DOM scope but shouldn't be Shift+Tab-reachable
        // from non-target elements. Wrap to last non-overlay focusable.
        const list = focusables.filter((el) => el !== overlayPart);
        const last = list.at(-1);
        if (last) {
          event.preventDefault();
          last.focus();
        }
      }
    }
  }

  /**
   * Returns whether the element is an overlay content child of this popover
   * (i.e. content rendered inside the overlay, excluding the overlay part itself).
   * @param {Element} el
   * @return {boolean}
   * @private
   */
  __isPopoverContent(el) {
    return this._overlayElement && el !== this._overlayElement && this._overlayElement.contains(el);
  }

  /**
   * Returns focusable elements within the current scope (active focus trap or
   * document body) with popover overlay content children filtered out.
   * @return {Element[]}
   * @private
   */
  __getScopeFocusables() {
    const scope = getActiveTrappingNode(this) || document.body;
    return getFocusableElements(scope).filter((el) => !this.__isPopoverContent(el));
  }

  /** @private */
  __getNextScopeFocusable(target, focusables = this.__getScopeFocusables()) {
    const idx = focusables.findIndex((el) => el === target);
    return idx >= 0 ? focusables[idx + 1] : undefined;
  }

  /** @private */
  __getPrevScopeFocusable(target, focusables = this.__getScopeFocusables(), includeOverlay = false) {
    const overlayPart = this._overlayElement.$.overlay;
    const list = includeOverlay ? focusables : focusables.filter((el) => el !== overlayPart);
    const idx = list.findIndex((el) => el === target);
    // Returns null both when target is the first element (idx === 0)
    // and when target is not found in the list (idx === -1)
    return idx > 0 ? list[idx - 1] : null;
  }

  /** @private */
  __getLastFocusable() {
    // Search within the overlay's content area to avoid returning the overlay part itself
    const focusables = getFocusableElements(this._overlayElement.$.content);
    return focusables.pop();
  }

  /** @private */
  __focusLastOrSelf() {
    (this.__getLastFocusable() || this._overlayElement.$.overlay).focus();
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

    if ((this.__hasTrigger('focus') && this.__mouseDownInside) || this._overlayElement.contains(event.relatedTarget)) {
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
    if (this._overlayElement.contains(event.relatedTarget)) {
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
  __onOverlayFocusIn() {
    this.__focusInside = true;

    // When using Tab to move focus, restoring focus is reset. However, if pressing Tab
    // causes focus to be moved inside the overlay, we should restore focus on close.
    if (this.__hasTrigger('focus') || this.__hasTrigger('click')) {
      this.__shouldRestoreFocus = true;
    }
  }

  /** @private */
  __onOverlayFocusOut(event) {
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
      this._overlayElement.contains(event.relatedTarget)
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
      this._overlayElement.$.overlay.focus();
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

  /** @private */
  __updateDimension(overlay, dimension, value) {
    const prop = `--_vaadin-popover-content-${dimension}`;

    if (value) {
      overlay.style.setProperty(prop, value);
    } else {
      overlay.style.removeProperty(prop);
    }
  }

  /** @private */
  __updateContentHeight(height, overlay) {
    if (overlay) {
      this.__updateDimension(overlay, 'height', height);
    }
  }

  /** @private */
  __updateContentWidth(width, overlay) {
    if (overlay) {
      this.__updateDimension(overlay, 'width', width);
    }
  }

  /**
   * Fired when the popover is closed.
   *
   * @event closed
   */
}

defineCustomElement(Popover);

export { Popover };
