/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DomModule } from '@polymer/polymer/lib/elements/dom-module.js';
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="vaadin-login-overlay-wrapper-template">
  <template>
    <style>
      [part="overlay"] {
        outline: none;
      }

      [part="card"] {
        max-width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      [part="brand"] {
        box-sizing: border-box;
        overflow: hidden;
        flex-grow: 1;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      [part="brand"] h1 {
        color: inherit;
        margin: 0;
      }
    </style>
    <section part="card">
      <div part="brand">
        <slot name="title">
          <h1 part="title">[[title]]</h1>
        </slot>
        <p part="description">[[description]]</p>
      </div>
      <div part="form">
        <slot></slot>
      </div>
    </section>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-login-overlay>`. Not intended to be used separately.
 *
 * @extends OverlayElement
 * @private
 */
class LoginOverlayWrapper extends OverlayElement {
  static get is() {
    return 'vaadin-login-overlay-wrapper';
  }

  static get properties() {
    return {
      /**
       * Title of the application.
       */
      title: {
        type: String
      },

      /**
       * Application description. Displayed under the title.
       */
      description: {
        type: String
      }
    };
  }

  static get template() {
    if (!memoizedTemplate) {
      // Clone the superclass template
      memoizedTemplate = super.template.cloneNode(true);

      // Retrieve the elements from component's template
      const thisTemplate = DomModule.import(this.is + '-template', 'template');
      const card = thisTemplate.content.querySelector('[part=card]');
      const styles = thisTemplate.content.querySelector('style');

      // Append elements to cloned template
      const content = memoizedTemplate.content.querySelector('#content');
      content.replaceChild(card, content.children[0]);
      content.appendChild(styles);
    }

    return memoizedTemplate;
  }
}

customElements.define(LoginOverlayWrapper.is, LoginOverlayWrapper);
