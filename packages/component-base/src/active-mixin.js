/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { DisabledMixin } from './disabled-mixin.js';
import { KeyboardMixin } from './keyboard-mixin.js';

/**
 * A mixin to toggle the `active` attribute.
 *
 * The attribute is set whenever the user activates the element by a pointer
 * or presses an activation key on the element from the keyboard.
 *
 * The attribute is removed as soon as the element is deactivated
 * by the pointer or by releasing the activation key.
 *
 * @polymerMixin
 */
export const ActiveMixin = (superclass) =>
  class ActiveMixinClass extends DisabledMixin(GestureEventListeners(KeyboardMixin(superclass))) {
    /**
     * An array of activation keys.
     *
     * See possible values here:
     * https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/key/Key_Values
     *
     * @protected
     * @return {!Array<!string>}
     */
    get _activeKeys() {
      return [' '];
    }

    /** @protected */
    ready() {
      super.ready();

      this._addEventListenerToNode(this, 'down', (event) => {
        if (this._shouldSetActive(event)) {
          this._setActive(true);
        }
      });

      this._addEventListenerToNode(this, 'up', () => {
        this._setActive(false);
      });
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // When the element is disconnecting from the DOM at the moment being active,
      // the `active` attribute needs to be manually removed from the element.
      // Otherwise, it will preserve on the element until the element is activated once again.
      // The case reproduces for `<vaadin-date-picker>` when closing on `Cancel` or `Today` click.
      this._setActive(false);
    }

    /**
     * @param {KeyboardEvent | MouseEvent} _event
     * @protected
     */
    _shouldSetActive(_event) {
      return !this.disabled;
    }

    /**
     * Sets the `active` attribute on the element if an activation key is pressed.
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      if (this._shouldSetActive(event) && this._activeKeys.includes(event.key)) {
        this._setActive(true);
      }
    }

    /**
     * Removes the `active` attribute from the element if the activation key is released.
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyUp(event) {
      super._onKeyUp(event);

      if (this._activeKeys.includes(event.key)) {
        this._setActive(false);
      }
    }

    /**
     * Toggles the `active` attribute on the element.
     *
     * @param {boolean} active
     * @protected
     */
    _setActive(active) {
      this.toggleAttribute('active', active);
    }
  };
