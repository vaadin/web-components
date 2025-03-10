/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ActiveMixin } from '@vaadin/a11y-base/src/active-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { TabindexMixin } from '@vaadin/a11y-base/src/tabindex-mixin.js';

const INTERACTION_EVENTS = ['mousedown', 'mouseup', 'click', 'dblclick', 'keypress', 'keydown', 'keyup'];

/**
 * A mixin providing common button functionality.
 *
 * @polymerMixin
 * @mixes ActiveMixin
 * @mixes FocusMixin
 * @mixes TabindexMixin
 */
export const ButtonMixin = (superClass) =>
  class ButtonMixinClass extends ActiveMixin(TabindexMixin(FocusMixin(superClass))) {
    constructor() {
      super();

      this.__onInteractionEvent = this.__onInteractionEvent.bind(this);

      INTERACTION_EVENTS.forEach((eventType) => {
        this.addEventListener(eventType, this.__onInteractionEvent, true);
      });

      // Set tabindex to 0 by default
      this.tabindex = 0;
    }

    /**
     * By default, `Space` is the only possible activation key for a focusable HTML element.
     * Nonetheless, the button is an exception as it can be also activated by pressing `Enter`.
     * See the "Keyboard Support" section in https://www.w3.org/TR/wai-aria-practices/examples/button/button.html.
     *
     * @protected
     * @override
     */
    get _activeKeys() {
      return ['Enter', ' '];
    }

    /** @protected */
    ready() {
      super.ready();

      // By default, if the user hasn't provided a custom role,
      // the role attribute is set to "button".
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'button');
      }

      if (this.__shouldAllowFocusWhenDisabled()) {
        this.style.setProperty('--_vaadin-button-disabled-pointer-events', 'auto');
      }
    }

    /**
     * Since the button component is designed on the base of the `[role=button]` attribute,
     * and doesn't have a native <button> inside, in order to be fully accessible from the keyboard,
     * it should manually fire the `click` event once an activation key is pressed,
     * as it follows from the WAI-ARIA specifications:
     * https://www.w3.org/TR/wai-aria-practices-1.1/#button
     *
     * According to the UI Events specifications,
     * the `click` event should be fired exactly on `keydown`:
     * https://www.w3.org/TR/uievents/#event-type-keydown
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      if (event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (this._activeKeys.includes(event.key)) {
        event.preventDefault();

        // `DisabledMixin` overrides the standard `click()` method
        // so that it doesn't fire the `click` event when the element is disabled.
        this.click();
      }
    }

    /** @private */
    __onInteractionEvent(event) {
      if (this.__shouldSuppressInteractionEvent(event)) {
        event.stopImmediatePropagation();
      }
    }

    /**
     * Returns whether to suppress interaction events like `click`, `keydown`, etc.
     * By default suppresses all interaction events when the button is disabled.
     *
     * @private
     */
    __shouldSuppressInteractionEvent(_event) {
      return this.disabled;
    }
  };
