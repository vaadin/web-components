customElements.define(
  'shadow-host',
  class extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
    }
  },
);
