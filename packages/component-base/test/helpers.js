import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html, LitElement } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ControllerMixin } from '../src/controller-mixin.js';
import { PolylitMixin } from '../src/polylit-mixin.js';

export const define = {
  polymer: (prefix, htmlString, classFactory) => {
    const tag = `${prefix}-polymer-element`;

    customElements.define(
      tag,
      class extends classFactory(ControllerMixin(PolymerElement)) {
        static get template() {
          const tpl = document.createElement('template');
          tpl.innerHTML = htmlString;
          return tpl;
        }
      },
    );

    return tag;
  },
  lit: (prefix, htmlString, classFactory) => {
    const tag = `${prefix}-lit-element`;

    customElements.define(
      tag,
      class extends classFactory(PolylitMixin(LitElement)) {
        render() {
          return html`${unsafeHTML(htmlString)}`;
        }
      },
    );

    return tag;
  },
};
