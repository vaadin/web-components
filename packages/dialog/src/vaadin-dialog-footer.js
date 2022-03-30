import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

export class DialogFooter extends PolymerElement {
  static get is() {
    return 'vaadin-dialog-footer';
  }

  static get template() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define(DialogFooter.is, DialogFooter);
