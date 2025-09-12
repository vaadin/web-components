export class AuraControl extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    const css = new CSSStyleSheet();
    css.replaceSync(`
      :host {
        display: block;
      }

      .control {
        display: grid;
      }

      label {
        color: var(--vaadin-color);
        font-weight: var(--aura-font-weight-medium);
      }

      #reset {
        background: transparent;
        border: 0;
      }

      #reset:not(:hover, :focus-visible) {
        opacity: 0.6;
      }

      #reset::before {
        content: "";
        width: 1lh;
        height: 1lh;
        mask-image: var(--icon-rotate-ccw);
        background: currentColor;
      }
    `);
    this.shadowRoot.adoptedStyleSheets.push(css);
  }
}
