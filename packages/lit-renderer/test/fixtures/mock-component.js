export class MockComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<div id="content"></div>`;
  }

  get $() {
    return {
      content: this.shadowRoot.querySelector('#content'),
    };
  }

  get renderer() {
    return this.__renderer;
  }

  set renderer(renderer) {
    this.__renderer = renderer;
    this.requestContentUpdate();
  }

  requestContentUpdate() {
    this.__renderer?.(this.$.content);
  }
}

customElements.define('mock-component', MockComponent);
