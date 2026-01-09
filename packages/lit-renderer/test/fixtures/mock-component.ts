type Renderer = (root: Element) => void;

export class MockComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<div id="content"></div>`;
  }

  #renderer?: Renderer | null;

  get $(): { content?: Element | null } {
    return {
      content: this.shadowRoot?.querySelector('#content'),
    };
  }

  get renderer(): Renderer | null | undefined {
    return this.#renderer;
  }

  set renderer(renderer: Renderer | null) {
    this.#renderer = renderer;
    this.requestContentUpdate();
  }

  requestContentUpdate(): void {
    if (this.$.content) {
      this.#renderer?.(this.$.content);
    }
  }
}

customElements.define('mock-component', MockComponent);
