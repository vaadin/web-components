import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { DisabledMixin } from './disabled-mixin.js';

const ActiveMixinImplementation = (superclass) =>
  class ActiveMixinClass extends DisabledMixin(GestureEventListeners(superclass)) {
    /**
     * An array of activation keys.
     *
     * See possible values here:
     * https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/key/Key_Values
     */
    get activeKeys() {
      return ['Enter', ' '];
    }

    /** @protected */
    ready() {
      super.ready();

      // POINTERDOWN
      this._addEventListenerToNode(this, 'down', () => {
        if (this.disabled) return;

        this.setAttribute('active', '');
      });

      // POINTERUP
      this._addEventListenerToNode(this, 'up', () => {
        this.removeAttribute('active');
      });

      // KEYDOWN
      this.addEventListener('keydown', (event) => {
        if (this.disabled) return;

        if (this.activeKeys.includes(event.key)) {
          this.setAttribute('active', '');
        }
      });

      // KEYUP
      this.addEventListener('keyup', (event) => {
        if (this.activeKeys.includes(event.key)) {
          this.removeAttribute('active');
        }
      });

      // BLUR
      this.addEventListener('blur', () => {
        this.removeAttribute('active');
      });
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // When the element is disconnecting from the DOM at the moment being active,
      // the `active` attribute needs to be manually removed from the element.
      // Otherwise, it will preserve on the element until the element is activated once again.
      // The case reproduces for `<vaadin-date-picker>` when closing on `Cancel` or `Today` click.
      this.removeAttribute('active');
    }
  };

/**
 * A mixin to toggle the `active` attribute.
 *
 * The attribute is set whenever the user activates the element by a pointer
 * or presses an activation key on the element from the keyboard.
 *
 * The attribute is removed as soon as the element is deactivated
 * by the pointer or by releasing the activation key.
 */
export const ActiveMixin = dedupingMixin(ActiveMixinImplementation);
