import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

export class DialogHeader extends PolymerElement {
  static get is() {
    return 'vaadin-dialog-header';
  }

  static get template() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define(DialogHeader.is, DialogHeader);
