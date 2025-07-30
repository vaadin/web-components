/**
 * Theme switcher component for the charts examples.
 */
class ThemeSwitcher extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          padding-block: 1rem;
          z-index: 1;
          gap: 0.5rem;
          align-items: center;
        }
      </style>
      <button class="dark">Dark</button>
      <span>Lumo:</span>
      <button>Default theme</button>
      <button>Gradient theme</button>
      <button>Monotone theme</button>
    `;

    const buttons = this.shadowRoot.querySelectorAll('button:not(.dark)');
    buttons[0].addEventListener('click', () => this.changeTheme(''));
    buttons[1].addEventListener('click', () => this.changeTheme('gradient'));
    buttons[2].addEventListener('click', () => this.changeTheme('monotone'));

    this.shadowRoot.querySelector('.dark').addEventListener('click', (e) => {
      const currentTheme = document.documentElement.style['color-scheme'] || 'light';
      e.target.textContent = currentTheme === 'light' ? 'Light' : 'Dark';
      document.documentElement.style.setProperty('color-scheme', currentTheme === 'light' ? 'dark' : 'light');
      document.documentElement.setAttribute('theme', currentTheme === 'light' ? 'dark' : 'light');
    });
  }

  // Crappy theme switcher that doesn't clear the previous theme
  changeTheme(theme) {
    [...document.getElementsByTagName('vaadin-chart')].forEach((chart) => {
      chart.setAttribute('theme', theme);
    });
  }
}

customElements.define('theme-switcher', ThemeSwitcher);
