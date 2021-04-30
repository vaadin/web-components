export class XList extends HTMLElement {
  constructor() {
    super();

    this.__items = [];
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<div id="items"></div>`;
  }

  connectedCallback() {
    window.Vaadin.templateRendererCallback?.(this);
  }

  set renderer(renderer) {
    this.__renderer = renderer;
    this.render();
  }

  get items() {
    return this.__items;
  }

  set items(items) {
    this.__items = items;
    this.render();
  }

  get $() {
    return {
      items: this.shadowRoot.querySelector('#items')
    };
  }

  render() {
    if (!this.__renderer) return;

    this.$.items.innerHTML = '';

    this.items.forEach((item) => {
      const root = document.createElement('div');
      this.__renderer(root, this, { item });
      this.$.items.appendChild(root);
    });
  }
}

customElements.define('x-list', XList);
