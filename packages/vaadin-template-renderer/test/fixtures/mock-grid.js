export class MockGrid extends HTMLElement {
  constructor() {
    super();

    this.renderer = null;
    this.headerRenderer = null;
    this.footerRenderer = null;
    this.rowDetailsRenderer = null;
  }

  connectedCallback() {
    window.Vaadin.templateRendererCallback?.(this);
  }
}

customElements.define('mock-grid', MockGrid);
