/**
 * Theme switcher component for the charts examples.
 */
class ThemeSwitcher extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
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

    const buttons = this.shadowRoot.querySelectorAll('button');
    buttons[0].addEventListener('click', () => this.changeTheme(''));
    buttons[1].addEventListener('click', () => this.changeTheme('gradient'));
    buttons[2].addEventListener('click', () => this.changeTheme('monotone'));
  }

  // Crappy theme switcher that doesn't clear the previous theme
  changeTheme(theme) {
    [...document.getElementsByTagName('vaadin-chart')].forEach((chart) => {
      chart.setAttribute('theme', theme);
    });
  }
}

customElements.define('theme-switcher', ThemeSwitcher);
