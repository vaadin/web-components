import { html, PolymerElement } from '@polymer/polymer';

/**
 * Theme switcher component for the charts examples.
 */
class ThemeSwitcher extends PolymerElement {
  static get template() {
    return html`
      <style>
        .theme-switcher {
          display: flex;
          padding: 1rem;
          z-index: 1;
        }
        .theme-switcher button {
          margin-right: 0.5rem;
        }
      </style>
      <div class="theme-switcher">
        <button>Default theme</button>
        <button>Gradient theme</button>
        <button>Monotone theme</button>
      </div>
    `;
  }

  static get is() {
    return 'theme-switcher';
  }

  ready() {
    super.ready();
    const buttons = this.shadowRoot.querySelectorAll('button');
    buttons[0].addEventListener('click', () => this.changeTheme(''));
    buttons[1].addEventListener('click', () => this.changeTheme('gradient'));
    buttons[2].addEventListener('click', () => this.changeTheme('monotone'));
  }

  // Crappy theme switcher that doesn't clear the previous theme
  changeTheme(theme) {
    const charts = document.getElementsByTagName('vaadin-chart');
    for (let i = 0; i < charts.length; i++) {
      charts[i].setAttribute('theme', theme);
    }
  }
}

customElements.define(ThemeSwitcher.is, ThemeSwitcher);

export { ThemeSwitcher };
