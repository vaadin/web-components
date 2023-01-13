/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-login-overlay-wrapper',
  css`
    [part='overlay'] {
      outline: none;
    }

    [part='card'] {
      max-width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    [part='brand'] {
      box-sizing: border-box;
      overflow: hidden;
      flex-grow: 1;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    [part='brand'] h1 {
      color: inherit;
      margin: 0;
    }
  `,
  { moduleId: 'vaadin-login-overlay-wrapper-styles' },
);

const template = html`
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
`;

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-login-overlay>`. Not intended to be used separately.
 *
 * @extends Overlay
 * @private
 */
class LoginOverlayWrapper extends Overlay {
  static get is() {
    return 'vaadin-login-overlay-wrapper';
  }

  static get properties() {
    return {
      /**
       * Title of the application.
       */
      title: {
        type: String,
      },

      /**
       * Application description. Displayed under the title.
       */
      description: {
        type: String,
      },
    };
  }

  static get template() {
    if (!memoizedTemplate) {
      // Clone the superclass template
      memoizedTemplate = super.template.cloneNode(true);

      // Replace overlay slot with card
      const card = template.content.querySelector('[part=card]');
      const content = memoizedTemplate.content.querySelector('#content');
      content.replaceChild(card, content.children[0]);
    }

    return memoizedTemplate;
  }
}

customElements.define(LoginOverlayWrapper.is, LoginOverlayWrapper);
