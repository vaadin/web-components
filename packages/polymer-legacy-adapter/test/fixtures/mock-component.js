export class MockComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<div id="content"></div>`;
  }

  connectedCallback() {
    window.Vaadin.templateRendererCallback(this);
  }

  get $() {
    return {
      content: this.shadowRoot.querySelector('#content'),
    };
  }

  set renderer(renderer) {
    this.__renderer = renderer;
    this.render();
  }

  get renderer() {
    return this.__renderer;
  }

  render() {
    this.__renderer?.(this.$.content);
  }
}

customElements.define('mock-component', MockComponent);
