import { LitElement, unsafeCSS } from 'lit';
import { ThemableMixin } from '../vaadin-themable-mixin.js';

/**
 * This is used for overriding the function that defined custom elements in themable-mixin.test.js suite.
 * By default, the suite creates PolymerElement based custom elements, but here in the
 * Lit tests, we specifically want to create LitElement based custom elements instead.
 */
window.defineCustomElementFunction = (name, parentName, content = '', styles) => {
  class CustomElement extends ThemableMixin(parentName ? customElements.get(parentName) : LitElement) {
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
