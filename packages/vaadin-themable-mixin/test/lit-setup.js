import { LitElement, unsafeCSS } from 'lit';
import { ThemableMixin } from '../vaadin-themable-mixin.js';

/**
 * This is used for overriding the function that defines custom elements in the test suites.
 * By default, the suite creates PolymerElement based custom elements, but in the
 * -lit.test.js tests, we specifically want to create LitElement based custom elements instead.
 */
window.defineCustomElementFunction = (name, parentName, content, styles) => {
  const parentElement = parentName ? customElements.get(parentName) : LitElement;
  class CustomElement extends ThemableMixin(parentElement) {
    static get is() {
      return name;
    }

    static get styles() {
      return unsafeCSS(styles);
    }

    render() {
      if (content) {
        const template = document.createElement('template');
        template.innerHTML = content;
        return template.content;
      } else {
        return super.render();
      }
    }
  }

  customElements.define(name, CustomElement);
};
