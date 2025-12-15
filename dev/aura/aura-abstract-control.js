export class AuraControl extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    const css = new CSSStyleSheet();
    css.replaceSync(`
      :host {
        display: block;
        --icon-rotate-ccw: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>');
      }

      .control {
        display: grid;
      }

      label {
        color: var(--vaadin-text-color);
        font-weight: var(--aura-font-weight-medium);
      }

      #reset {
        background: transparent;
        border: 0;
        gap: 0;
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
