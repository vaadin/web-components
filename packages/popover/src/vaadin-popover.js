/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-popover-overlay.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { PopoverPositionMixin } from './vaadin-popover-position-mixin.js';
import { PopoverTargetMixin } from './vaadin-popover-target-mixin.js';

/**
 * `<vaadin-popover>` is a Web Component for creating overlays
 * that are positioned next to specified DOM element (target).
 *
 * Unlike `<vaadin-tooltip>`, the popover supports rich content
 * that can be provided by using `renderer` function.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ElementMixin
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
       * can be only opened or closed programmatically by changing `opened` property.
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
      '__openedOrTargetChanged(opened, target)',
      '__overlayRoleOrTargetChanged(overlayRole, target)',
    ];
  }

  constructor() {
    super();

    this.__overlayId = `vaadin-popover-${generateUniqueId()}`;

    this.__onGlobalClick = this.__onGlobalClick.bind(this);
    this.__onGlobalKeyDown = this.__onGlobalKeyDown.bind(this);
    this.__onTargetClick = this.__onTargetClick.bind(this);
    this.__onTargetKeydown = this.__onTargetKeydown.bind(this);
    this.__onTargetFocusIn = this.__onTargetFocusIn.bind(this);
    this.__onTargetFocusOut = this.__onTargetFocusOut.bind(this);
    this.__onTargetMouseEnter = this.__onTargetMouseEnter.bind(this);
    this.__onTargetMouseLeave = this.__onTargetMouseLeave.bind(this);
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
        @mouseenter="${this.__onOverlayMouseEnter}"
        @mouseleave="${this.__onOverlayMouseLeave}"
        @focusin="${this.__onOverlayFocusIn}"
        @focusout="${this.__onOverlayFocusOut}"
        @opened-changed="${this.__onOpenedChanged}"
        .restoreFocusOnClose="${this.__shouldRestoreFocus}"
        .restoreFocusNode="${this.target}"
        @vaadin-overlay-escape-press="${this.__onEscapePress}"
        @vaadin-overlay-outside-click="${this.__onOutsideClick}"
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

    this._overlayElement = this.shadowRoot.querySelector('vaadin-popover-overlay');
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', this.__onGlobalClick, true);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    document.removeEventListener('click', this.__onGlobalClick, true);

    this.opened = false;
  }

  /**
   * @param {HTMLElement} target
   * @protected
   * @override
   */
  _addTargetListeners(target) {
    target.addEventListener('click', this.__onTargetClick);
    target.addEventListener('keydown', this.__onTargetKeydown);
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
    target.removeEventListener('keydown', this.__onTargetKeydown);
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
  __openedOrTargetChanged(opened, target) {
    if (target) {
      target.setAttribute('aria-expanded', opened ? 'true' : 'false');

      if (opened) {
        target.setAttribute('aria-controls', this.__overlayId);
      } else {
        target.removeAttribute('aria-controls');
      }
    }
  }

  /** @private */
  __overlayRoleOrTargetChanged(overlayRole, target) {
    if (this.__oldTarget) {
      this.__oldTarget.removeAttribute('aria-haspopup');
    }

    if (target) {
      const isDialog = overlayRole === 'dialog' || overlayRole === 'alertdialog';
      target.setAttribute('aria-haspopup', isDialog ? 'dialog' : 'true');

      this.__oldTarget = target;
    }
  }

  /**
   * Overlay's global outside click listener doesn't work when
   * the overlay is modeless, so we use a separate listener.
   * @private
   */
  __onGlobalClick(event) {
    if (
      this.opened &&
      !this.__isManual &&
      !this.modal &&
      !event.composedPath().some((el) => el === this._overlayElement || el === this.target) &&
      !this.noCloseOnOutsideClick
    ) {
      this.opened = false;
    }
  }

  /** @private */
  __onTargetClick() {
    if (this.__hasTrigger('click')) {
      if (!this.opened) {
        this.__shouldRestoreFocus = true;
      }
      this.opened = !this.opened;
    }
  }

  /**
   * Overlay's global Escape press listener doesn't work when
   * the overlay is modeless, so we use a separate listener.
   * @private
   */
  __onGlobalKeyDown(event) {
    if (event.key === 'Escape' && !this.modal && !this.noCloseOnEsc && this.opened && !this.__isManual) {
      // Prevent closing parent overlay (e.g. dialog)
      event.stopPropagation();
      this.opened = false;
    }
  }

  /** @private */
  __onTargetKeydown(event) {
    // Prevent restoring focus after target blur on Tab key
    if (event.key === 'Tab' && this.__shouldRestoreFocus) {
      this.__shouldRestoreFocus = false;
    }
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
        this.opened = true;
      }
    }
  }

  /** @private */
  __onTargetFocusOut(event) {
    if (this._overlayElement.contains(event.relatedTarget)) {
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
      this.opened = true;
    }
  }

  /** @private */
  __onTargetMouseLeave(event) {
    if (this._overlayElement.contains(event.relatedTarget)) {
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
    if (event.relatedTarget === this.target || this._overlayElement.contains(event.relatedTarget)) {
      return;
    }

    this.__handleFocusout();
  }

  /** @private */
  __onOverlayMouseEnter() {
    this.__hoverInside = true;
  }

  /** @private */
  __onOverlayMouseLeave(event) {
    if (event.relatedTarget === this.target) {
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
      this.opened = false;
    }
  }

  /** @private */
  __handleMouseLeave() {
    this.__hoverInside = false;

    if (this.__hasTrigger('focus') && this.__focusInside) {
      return;
    }

    if (this.__hasTrigger('hover')) {
      this.opened = false;
    }
  }

  /** @private */
  __onOpenedChanged(event) {
    this.opened = event.detail.value;
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
    if (this.modal && this.target.style.pointerEvents) {
      this.target.style.pointerEvents = '';
    }
  }

  /**
   * Close the popover if `noCloseOnEsc` isn't set to true.
   * @private
   */
  __onEscapePress(e) {
    if (this.noCloseOnEsc || this.__isManual) {
      e.preventDefault();
    }
  }

  /**
   * Close the popover if `noCloseOnOutsideClick` isn't set to true.
   * @private
   */
  __onOutsideClick(e) {
    if (this.noCloseOnOutsideClick || this.__isManual) {
      e.preventDefault();
    }
  }

  /** @private */
  __hasTrigger(trigger) {
    return Array.isArray(this.trigger) && this.trigger.includes(trigger);
  }

  /** @private */
  get __isManual() {
    return this.trigger == null || (Array.isArray(this.trigger) && this.trigger.length === 0);
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
}

defineCustomElement(Popover);

export { Popover };
