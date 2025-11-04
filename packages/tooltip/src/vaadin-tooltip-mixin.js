/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { PopoverPositionMixin } from '@vaadin/popover/src/vaadin-popover-position-mixin.js';
import { PopoverTargetMixin } from '@vaadin/popover/src/vaadin-popover-target-mixin.js';

const DEFAULT_DELAY = 500;

let defaultFocusDelay = DEFAULT_DELAY;
let defaultHoverDelay = DEFAULT_DELAY;
let defaultHideDelay = DEFAULT_DELAY;

const closing = new Set();

let warmedUp = false;
let warmUpTimeout = null;
let cooldownTimeout = null;

/**
 * Resets the global tooltip warmup and cooldown state.
 * Only for internal use in tests.
 * @private
 */
export function resetGlobalTooltipState() {
  warmedUp = false;
  clearTimeout(warmUpTimeout);
  clearTimeout(cooldownTimeout);
  warmUpTimeout = null;
  cooldownTimeout = null;
  closing.clear();
}

/**
 * Controller for handling tooltip opened state.
 */
class TooltipStateController {
  constructor(host) {
    this.host = host;
  }

  /** @private */
  get focusDelay() {
    const tooltip = this.host;
    return tooltip.focusDelay != null && tooltip.focusDelay >= 0 ? tooltip.focusDelay : defaultFocusDelay;
  }

  /** @private */
  get hoverDelay() {
    const tooltip = this.host;
    return tooltip.hoverDelay != null && tooltip.hoverDelay >= 0 ? tooltip.hoverDelay : defaultHoverDelay;
  }

  /** @private */
  get hideDelay() {
    const tooltip = this.host;
    return tooltip.hideDelay != null && tooltip.hideDelay >= 0 ? tooltip.hideDelay : defaultHideDelay;
  }

  /**
   * Whether closing is currently in progress.
   * @return {boolean}
   */
  get isClosing() {
    return closing.has(this.host);
  }

  /**
   * Schedule opening the tooltip.
   * @param {Object} options
   */
  open(options = { immediate: false }) {
    const { immediate, hover, focus } = options;
    const isHover = hover && this.hoverDelay > 0;
    const isFocus = focus && this.focusDelay > 0;

    if (!immediate && (isHover || isFocus) && !this.__closeTimeout) {
      this.__warmupTooltip(isFocus);
    } else {
      this.__showTooltip();
    }
  }

  /**
   * Schedule closing the tooltip.
   * @param {boolean} immediate
   */
  close(immediate) {
    if (!immediate && this.hideDelay > 0) {
      this.__scheduleClose();
    } else {
      this.__abortClose();
      this._setOpened(false);
    }

    this.__abortWarmUp();

    if (warmedUp) {
      // Re-start cooldown timer on each tooltip closing.
      this.__abortCooldown();
      this.__scheduleCooldown();
    }
  }

  /** @private */
  _isOpened() {
    return this.host.opened;
  }

  /** @private */
  _setOpened(opened) {
    this.host.opened = opened;
  }

  /** @private */
  __flushClosingTooltips() {
    closing.forEach((tooltip) => {
      tooltip._stateController.close(true);
      closing.delete(tooltip);
    });
  }

  /** @private */
  __showTooltip() {
    this.__abortClose();
    this.__flushClosingTooltips();

    this._setOpened(true);
    warmedUp = true;

    // Abort previously scheduled timers.
    this.__abortWarmUp();
    this.__abortCooldown();
  }

  /** @private */
  __warmupTooltip(isFocus) {
    if (!this._isOpened()) {
      if (warmedUp) {
        // Warmed up, show the tooltip.
        this.__showTooltip();
      } else if (warmUpTimeout == null) {
        // Ensure there is no duplicate warm up.
        this.__scheduleWarmUp(isFocus);
      }
    }
  }

  /** @private */
  __abortClose() {
    if (this.__closeTimeout) {
      clearTimeout(this.__closeTimeout);
      this.__closeTimeout = null;
    }

    // Remove the tooltip from the closing queue.
    if (this.isClosing) {
      closing.delete(this.host);
    }
  }

  /** @private */
  __abortCooldown() {
    if (cooldownTimeout) {
      clearTimeout(cooldownTimeout);
      cooldownTimeout = null;
    }
  }

  /** @private */
  __abortWarmUp() {
    if (warmUpTimeout) {
      clearTimeout(warmUpTimeout);
      warmUpTimeout = null;
    }
  }

  /** @private */
  __scheduleClose() {
    // Do not schedule closing if it was already scheduled
    // to avoid overriding reference to the close timeout.
    if (this._isOpened() && !this.isClosing) {
      closing.add(this.host);

      this.__closeTimeout = setTimeout(() => {
        closing.delete(this.host);
        this.__closeTimeout = null;
        this._setOpened(false);
      }, this.hideDelay);
    }
  }

  /** @private */
  __scheduleCooldown() {
    cooldownTimeout = setTimeout(() => {
      cooldownTimeout = null;
      warmedUp = false;
    }, this.hideDelay);
  }

  /** @private */
  __scheduleWarmUp(isFocus) {
    const delay = isFocus ? this.focusDelay : this.hoverDelay;
    warmUpTimeout = setTimeout(() => {
      warmUpTimeout = null;
      warmedUp = true;
      this.__showTooltip();
    }, delay);
  }
}

/**
 * A mixin providing common tooltip functionality.
 *
 * @polymerMixin
 * @mixes PopoverPositionMixin
 * @mixes PopoverTargetMixin
 */
export const TooltipMixin = (superClass) =>
  class TooltipMixinClass extends PopoverPositionMixin(PopoverTargetMixin(superClass)) {
    static get properties() {
      return {
        /**
         * Element used to link with the `aria-describedby`
         * attribute. Supports array of multiple elements.
         * When not set, defaults to `target`.
         */
        ariaTarget: {
          type: Object,
        },

        /**
         * Object with properties passed to `generator` and
         * `shouldShow` functions for generating tooltip text
         * or detecting whether to show the tooltip or not.
         */
        context: {
          type: Object,
          value: () => {
            return {};
          },
        },

        /**
         * The delay in milliseconds before the tooltip
         * is opened on keyboard focus, when not in manual mode.
         * @attr {number} focus-delay
         */
        focusDelay: {
          type: Number,
        },

        /**
         * Function used to generate the tooltip content.
         * When provided, it overrides the `text` property.
         * Use the `context` property to provide argument
         * that can be passed to the generator function.
         */
        generator: {
          type: Object,
        },

        /**
         * The delay in milliseconds before the tooltip
         * is closed on losing hover, when not in manual mode.
         * On blur, the tooltip is closed immediately.
         * @attr {number} hide-delay
         */
        hideDelay: {
          type: Number,
        },

        /**
         * The delay in milliseconds before the tooltip
         * is opened on hover, when not in manual mode.
         * @attr {number} hover-delay
         */
        hoverDelay: {
          type: Number,
        },

        /**
         * When true, the tooltip is controlled programmatically
         * instead of reacting to focus and mouse events.
         */
        manual: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * When true, the tooltip is opened.
         * In manual mode, this can be set programmatically.
         * In automatic mode, this is set automatically by internal logic.
         */
        opened: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          observer: '__openedChanged',
          sync: true,
        },

        /**
         * Function used to detect whether to show the tooltip based on a condition,
         * called every time the tooltip is about to be shown on hover and focus.
         * The function takes two parameters: `target` and `context`, which contain
         * values of the corresponding tooltip properties at the time of calling.
         * The tooltip is only shown when the function invocation returns `true`.
         */
        shouldShow: {
          type: Object,
          value: () => {
            return (_target, _context) => true;
          },
        },

        /**
         * String used as a tooltip content.
         */
        text: {
          type: String,
        },

        /**
         * When enabled, the tooltip text is rendered as Markdown.
         *
         * **Note:** Using Markdown is discouraged if accessibility of the tooltip
         * content is essential, as semantics of the rendered HTML content
         * (headers, lists, ...) will not be conveyed to assistive technologies.
         */
        markdown: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * Element used to link with the `aria-describedby`
         * attribute. When not set, defaults to `target`.
         * @protected
         */
        _effectiveAriaTarget: {
          type: Object,
          computed: '__computeAriaTarget(ariaTarget, target)',
          observer: '__effectiveAriaTargetChanged',
        },

        /** @private */
        __isTargetHidden: {
          type: Boolean,
          value: false,
        },

        /** @private */
        _isConnected: {
          type: Boolean,
          sync: true,
        },
      };
    }

    /**
     * Sets the default focus delay to be used by all tooltip instances,
     * except for those that have focus delay configured using property.
     *
     * @param {number} focusDelay
     */
    static setDefaultFocusDelay(focusDelay) {
      defaultFocusDelay = focusDelay != null && focusDelay >= 0 ? focusDelay : DEFAULT_DELAY;
    }

    /**
     * Sets the default hide delay to be used by all tooltip instances,
     * except for those that have hide delay configured using property.
     *
     * @param {number} hideDelay
     */
    static setDefaultHideDelay(hideDelay) {
      defaultHideDelay = hideDelay != null && hideDelay >= 0 ? hideDelay : DEFAULT_DELAY;
    }

    /**
     * Sets the default hover delay to be used by all tooltip instances,
     * except for those that have hover delay configured using property.
     *
     * @param {number} hoverDelay
     */
    static setDefaultHoverDelay(hoverDelay) {
      defaultHoverDelay = hoverDelay != null && hoverDelay >= 0 ? hoverDelay : DEFAULT_DELAY;
    }

    constructor() {
      super();

      this._uniqueId = `vaadin-tooltip-${generateUniqueId()}`;

      this.__onFocusin = this.__onFocusin.bind(this);
      this.__onFocusout = this.__onFocusout.bind(this);
      this.__onMouseDown = this.__onMouseDown.bind(this);
      this.__onMouseEnter = this.__onMouseEnter.bind(this);
      this.__onMouseLeave = this.__onMouseLeave.bind(this);
      this.__onKeyDown = this.__onKeyDown.bind(this);
      this.__onOverlayOpen = this.__onOverlayOpen.bind(this);

      this.__targetVisibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => this.__onTargetVisibilityChange(entry.isIntersecting));
        },
        { threshold: 0 },
      );

      this._stateController = new TooltipStateController(this);
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      this._isConnected = true;

      document.body.addEventListener('vaadin-overlay-open', this.__onOverlayOpen);
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      if (this.opened && !this.manual) {
        this._stateController.close(true);
      }
      this._isConnected = false;

      document.body.removeEventListener('vaadin-overlay-open', this.__onOverlayOpen);
    }

    /** @protected */
    ready() {
      super.ready();

      this._overlayElement = this.$.overlay;

      this.__contentController = new SlotController(this, 'overlay', 'div', {
        initializer: (element) => {
          element.id = this._uniqueId;
          element.setAttribute('role', 'tooltip');
          this.__contentNode = element;
        },
      });
      this.addController(this.__contentController);
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('text') || props.has('generator') || props.has('context') || props.has('markdown')) {
        this.__updateContent();
      }
    }

    /** @private */
    __openedChanged(opened, oldOpened) {
      if (opened) {
        document.addEventListener('keydown', this.__onKeyDown, true);
      } else if (oldOpened) {
        document.removeEventListener('keydown', this.__onKeyDown, true);
      }
    }

    /**
     * @param {HTMLElement} target
     * @protected
     * @override
     */
    _addTargetListeners(target) {
      target.addEventListener('mouseenter', this.__onMouseEnter);
      target.addEventListener('mouseleave', this.__onMouseLeave);
      target.addEventListener('focusin', this.__onFocusin);
      target.addEventListener('focusout', this.__onFocusout);
      target.addEventListener('mousedown', this.__onMouseDown);

      // Wait before observing to avoid Chrome issue.
      requestAnimationFrame(() => {
        this.__targetVisibilityObserver.observe(target);
      });
    }

    /**
     * @param {HTMLElement} target
     * @protected
     * @override
     */
    _removeTargetListeners(target) {
      target.removeEventListener('mouseenter', this.__onMouseEnter);
      target.removeEventListener('mouseleave', this.__onMouseLeave);
      target.removeEventListener('focusin', this.__onFocusin);
      target.removeEventListener('focusout', this.__onFocusout);
      target.removeEventListener('mousedown', this.__onMouseDown);

      this.__targetVisibilityObserver.unobserve(target);
    }

    /** @private */
    __onFocusin(event) {
      if (this.manual) {
        return;
      }

      // Only open on keyboard focus.
      if (!isKeyboardActive()) {
        return;
      }

      // Do not re-open while focused if closed on Esc or mousedown.
      if (this.target.contains(event.relatedTarget)) {
        return;
      }

      if (!this.__isShouldShow()) {
        return;
      }

      this.__focusInside = true;

      if (!this.__isTargetHidden && (!this.__hoverInside || !this.opened)) {
        this._stateController.open({ focus: true });
      }
    }

    /** @private */
    __onFocusout(event) {
      if (this.manual) {
        return;
      }

      // Do not close when moving focus within a component.
      if (this.target.contains(event.relatedTarget)) {
        return;
      }

      this.__focusInside = false;

      if (!this.__hoverInside) {
        this._stateController.close(true);
      }
    }

    /** @private */
    __onKeyDown(event) {
      if (this.manual) {
        return;
      }

      if (event.key === 'Escape') {
        event.stopPropagation();
        this._stateController.close(true);
      }
    }

    /** @private */
    __onMouseDown() {
      if (this.manual) {
        return;
      }

      this._stateController.close(true);
    }

    /** @private */
    __onMouseEnter() {
      if (this.manual) {
        return;
      }

      if (!this.__isShouldShow()) {
        return;
      }

      if (this.__hoverInside) {
        // Already hovering inside the element, do nothing.
        return;
      }

      this.__hoverInside = true;

      if (!this.__isTargetHidden && (!this.__focusInside || !this.opened)) {
        this._stateController.open({ hover: true });
      }
    }

    /** @private */
    __onMouseLeave(event) {
      if (event.relatedTarget !== this._overlayElement) {
        this.__handleMouseLeave();
      }
    }

    /** @protected */
    __onOverlayMouseEnter() {
      if (this.manual) {
        return;
      }
      // Retain opened state when moving pointer over the overlay.
      // Closing can start due to an offset between the target and
      // the overlay itself. If that's the case, re-open overlay.
      // See https://github.com/vaadin/web-components/issues/6316
      if (this._stateController.isClosing) {
        this._stateController.open({ immediate: true });
      }
    }

    /** @protected */
    __onOverlayMouseLeave(event) {
      if (event.relatedTarget !== this.target) {
        this.__handleMouseLeave();
      }
    }

    /** @protected */
    __onOverlayMouseDown(event) {
      // Prevent mousedown listeners from being called when
      // the tooltip is slotted into the target element
      event.stopPropagation();
    }

    /** @protected */
    __onOverlayClick(event) {
      // Prevent click listeners from being called when
      // the tooltip is slotted into the target element
      event.stopPropagation();
    }

    /** @private */
    __handleMouseLeave() {
      if (this.manual) {
        return;
      }

      this.__hoverInside = false;

      if (!this.__focusInside) {
        this._stateController.close();
      }
    }

    /** @private */
    __onOverlayOpen() {
      if (this.manual) {
        return;
      }

      // Close tooltip if another overlay is opened on top of the tooltip's overlay
      if (this._overlayElement.opened && !this._overlayElement._last) {
        this._stateController.close(true);
      }
    }

    /** @private */
    __onTargetVisibilityChange(isVisible) {
      if (this.manual) {
        return;
      }

      const oldHidden = this.__isTargetHidden;
      this.__isTargetHidden = !isVisible;

      // Open the overlay when the target becomes visible and has focus or hover.
      if (oldHidden && isVisible && (this.__focusInside || this.__hoverInside)) {
        this._stateController.open({ immediate: true });
        return;
      }

      // Close the overlay when the target is no longer fully visible.
      if (!isVisible && this.opened) {
        this._stateController.close(true);
      }
    }

    /** @private */
    __isShouldShow() {
      if (typeof this.shouldShow === 'function' && this.shouldShow(this.target, this.context) !== true) {
        return false;
      }

      return true;
    }

    /** @private */
    async __updateContent() {
      const content = typeof this.generator === 'function' ? this.generator(this.context) : this.text;

      if (this.markdown && content) {
        const helpers = await this.constructor.__importMarkdownHelpers();
        helpers.renderMarkdownToElement(this.__contentNode, content);
      } else {
        this.__contentNode.textContent = content || '';
      }

      this.$.overlay.toggleAttribute('hidden', this.__contentNode.textContent.trim() === '');
      this.dispatchEvent(new CustomEvent('content-changed', { detail: { content: this.__contentNode.textContent } }));
    }

    /** @private */
    __computeAriaTarget(ariaTarget, target) {
      const isElementNode = (el) => el && el.nodeType === Node.ELEMENT_NODE;
      const isAriaTargetSet = Array.isArray(ariaTarget) ? ariaTarget.some(isElementNode) : ariaTarget;
      return ariaTarget === null || isAriaTargetSet ? ariaTarget : target;
    }

    /** @private */
    __effectiveAriaTargetChanged(ariaTarget, oldAriaTarget) {
      if (oldAriaTarget) {
        [oldAriaTarget].flat().forEach((target) => {
          removeValueFromAttribute(target, 'aria-describedby', this._uniqueId);
        });
      }

      if (ariaTarget) {
        [ariaTarget].flat().forEach((target) => {
          addValueToAttribute(target, 'aria-describedby', this._uniqueId);
        });
      }
    }

    /** @private **/
    static __importMarkdownHelpers() {
      if (!this.__markdownHelpers) {
        this.__markdownHelpers = import('@vaadin/markdown/src/markdown-helpers.js');
      }
      return this.__markdownHelpers;
    }

    /**
     * Fired when the tooltip text content is changed.
     *
     * @event content-changed
     */
  };
