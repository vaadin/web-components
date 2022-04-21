import { LitElement, unsafeCSS } from 'lit';
import { ThemableMixin } from '../vaadin-themable-mixin.js';

/**
 * This is used for overriding the function that defines custom elements in the test suites.
 * By default, the suite creates PolymerElement based custom elements, but in the
 * -lit.test.js tests, we specifically want to create LitElement based custom elements instead.
 */
// eslint-disable-next-line max-params
window.defineCustomElementFunction = (name, parentName, content, styles, noIs) => {
  const parentElement = parentName ? customElements.get(parentName) : LitElement;
  class CustomElement extends ThemableMixin(parentElement) {
    static get styles() {
      return styles ? unsafeCSS(styles) : undefined;
    }
  }

  if (content) {
    CustomElement.prototype.render = function () {
      const template = document.createElement('template');
      template.innerHTML = content;
      return template.content;
    };
  }

  if (!noIs) {
    Object.defineProperty(CustomElement, 'is', {
      get() {
        return name;
      }
    });
  }

  customElements.define(name, CustomElement);
};
