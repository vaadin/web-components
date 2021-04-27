export class XComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<div id="content"></div>`;
    this.__content = this.shadowRoot.querySelector('#content');
  }

  connectedCallback() {
    window.Vaadin.templateRendererCallback?.(this);
  }

  get content() {
    return this.__content;
  }

  set renderer(renderer) {
    this.__renderer = renderer;
    this.render();
  }

  render() {
    this.__renderer?.(this.__content);
  }
}

customElements.define('x-component', XComponent);
