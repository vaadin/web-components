/**
 * Palette switcher for the charts examples. Sets the `theme` attribute on every
 * chart. Theme and color scheme are handled by the global <theme-switcher>.
 * The palette is kept in the URL, so it survives the reload that switcher does.
 */
import { css, html, LitElement } from 'lit';

const PALETTES = ['', 'gradient', 'monotone', 'classic'];

class ChartPaletteSwitcher extends LitElement {
  // Matches <theme-switcher> in dev/common.js and sits right above it.
  static styles = css`
    :host {
      position: fixed;
      bottom: 4rem;
      right: 1rem;
      display: flex;
      gap: 0.25rem;
      align-items: center;
      padding: 0.5rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 9999;
    }

    span {
      padding-inline: 0.25rem;
      font-size: 0.75rem;
      color: #666;
    }

    button {
      padding: 0.25rem 0.5rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
      background: #f5f5f5;
      cursor: pointer;
      font-size: 0.75rem;
      color: #000;
    }

    button:hover {
      background: #e5e5e5;
    }

    button[active] {
      background: #0066cc;
      color: white;
      border-color: #0066cc;
    }
  `;

  get palette() {
    return new URL(window.location).searchParams.get('palette') || '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.applyPalette();
  }

  render() {
    return html`
      <span>Palette:</span>
      ${PALETTES.map(
        (palette) => html`
          <button ?active=${palette === this.palette} @click=${() => this.switchPalette(palette)}>
            ${palette ? palette[0].toUpperCase() + palette.slice(1) : 'Default'}
          </button>
        `,
      )}
    `;
  }

  switchPalette(palette) {
    const url = new URL(window.location);
    if (palette) {
      url.searchParams.set('palette', palette);
    } else {
      url.searchParams.delete('palette');
    }
    history.replaceState(null, '', url);
    this.applyPalette();
    this.requestUpdate();
  }

  applyPalette() {
    document.querySelectorAll('vaadin-chart').forEach((chart) => {
      if (this.palette) {
        chart.setAttribute('theme', this.palette);
      } else {
        chart.removeAttribute('theme');
      }
    });
  }
}

customElements.define('chart-palette-switcher', ChartPaletteSwitcher);
