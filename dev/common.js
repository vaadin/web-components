import { css, html, LitElement } from 'lit';
import { addGlobalStyles } from '@vaadin/component-base/src/styles/add-global-styles.js';

addGlobalStyles(
  'dev-common',
  css`
    [data-theme$='dark'] {
      color-scheme: dark;
    }

    :where(body) {
      font-family: system-ui, sans-serif;
      line-height: 1.25;
      margin: 2rem;
    }

    .heading {
      font-weight: 600;
      font-size: calc(18 / 16 * 1rem);
      line-height: calc(20 / 16 * 1rem);
      margin: 2em 0 1.25em;
      text-box: cap alphabetic;
    }

    .section {
      display: flex;
      flex-wrap: wrap;
      gap: 1lh 1.5lh;
      margin: 2lh 0;
      align-items: baseline;
    }

    .section > :is(.heading, p) {
      width: 100%;
      margin: 0;
    }
  `,
);

class ThemeSwitcher extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.25rem;
      padding: 0.5rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 9999;
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

  get currentTheme() {
    return document.documentElement.dataset.theme?.split(':')[0] || 'base';
  }

  get currentColorScheme() {
    return document.documentElement.dataset.theme?.split(':')[1] || 'light';
  }

  render() {
    return html`
      <button ?active=${this.currentTheme.startsWith('base')} @click=${() => this.switchTheme('base')}>Base</button>
      <button ?active=${this.currentTheme.startsWith('lumo')} @click=${() => this.switchTheme('lumo')}>Lumo</button>
      <button ?active=${this.currentTheme.startsWith('aura')} @click=${() => this.switchTheme('aura')}>Aura</button>
      <hr />
      <button ?active=${this.currentColorScheme === 'light'} @click=${() => this.switchColorScheme('light')}
        >Light</button
      >
      <button ?active=${this.currentColorScheme === 'dark'} @click=${() => this.switchColorScheme('dark')}>Dark</button>
    `;
  }

  switchTheme(theme) {
    const url = new URL(window.location);
    url.searchParams.set('theme', `${theme}:${this.currentColorScheme}`);
    history.replaceState(null, '', url);
    location.reload();
  }

  switchColorScheme(scheme) {
    const url = new URL(window.location);
    url.searchParams.set('theme', `${this.currentTheme}:${scheme}`);
    history.replaceState(null, '', url);
    location.reload();
  }
}

customElements.define('theme-switcher', ThemeSwitcher);
