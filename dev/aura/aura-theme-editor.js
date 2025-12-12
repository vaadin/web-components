import './aura-color-control.js';
import './aura-font-family-control.js';
import './aura-inset-control.js';
import './aura-number-control.js';
import './aura-scheme-control.js';

function clearLocalStorage() {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (/^aura/u.test(key)) {
      localStorage.removeItem(key);
    }
  }
}

function useNavbar(useNavbar) {
  const drawerToggle = document.querySelector('vaadin-app-layout > header[slot] vaadin-drawer-toggle');
  if (useNavbar) {
    localStorage.setItem('aura-navbar', useNavbar);
    document.querySelector('vaadin-app-layout > header[slot]').setAttribute('slot', 'navbar');
    document.querySelector('vaadin-app-layout > footer[slot]').setAttribute('slot', 'navbar');
    document.querySelector('vaadin-app-layout > header[slot]').prepend(drawerToggle);
  } else {
    localStorage.removeItem('aura-navbar');
    document.querySelector('vaadin-app-layout > header[slot]').setAttribute('slot', 'drawer');
    document.querySelector('vaadin-app-layout > footer[slot]').setAttribute('slot', 'drawer');
    document.querySelector('vaadin-app-layout > header[slot]').append(drawerToggle);
  }
}

useNavbar(localStorage.getItem('aura-navbar') !== null);

customElements.define(
  'aura-theme-editor',
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <vaadin-button theme="tertiary" id="theme-editor-btn" aria-label="Edit Theme" class="aura-accent-color">
          <vaadin-icon src="./assets/lucide-icons/paint-brush.svg"></vaadin-icon>
          <vaadin-tooltip slot="tooltip" text="Edit Theme"></vaadin-tooltip>
        </vaadin-button>
        <vaadin-popover for="theme-editor-btn" position="top-start" width="320px" theme="small">
          <vaadin-vertical-layout
            class="editor"
            theme="padding"
            style="gap: var(--vaadin-gap-xl); align-items: stretch"
          >
            <h3>Edit Theme</h3>
            <vaadin-checkbox label="Use Navbar" id="useNavbar"></vaadin-checkbox>
            <aura-scheme-control property="color-scheme" label="color-scheme"></aura-scheme-control>
            <aura-scheme-control
              property="--aura-content-color-scheme"
              label="--aura-content-color-scheme"
            ></aura-scheme-control>
            <aura-scheme-control
              property="--aura-notification-color-scheme"
              label="--aura-notification-color-scheme"
            ></aura-scheme-control>
            <aura-color-control
              property="--aura-accent-color-light"
              label="--aura-accent-color-light"
            ></aura-color-control>
            <aura-color-control
              property="--aura-background-color-light"
              label="--aura-background-color-light"
            ></aura-color-control>
            <aura-color-control
              property="--aura-accent-color-dark"
              label="--aura-accent-color-dark"
            ></aura-color-control>
            <aura-color-control
              property="--aura-background-color-dark"
              label="--aura-background-color-dark"
            ></aura-color-control>
            <aura-number-control property="--aura-contrast-level" min="0" max="2" step="0.1"></aura-number-control>
            <aura-number-control property="--aura-surface-level" min="-2" max="2" step="0.1"></aura-number-control>
            <aura-number-control
              property="--aura-overlay-surface-opacity"
              min="0.5"
              max="1"
              step="0.01"
            ></aura-number-control>
            <aura-inset-control></aura-inset-control>
            <aura-number-control property="--aura-base-radius" min="0" max="8" step="0.5"></aura-number-control>
            <aura-number-control property="--aura-base-size" min="12" max="20"></aura-number-control>
            <aura-number-control
              property="--aura-base-font-size"
              label="--aura-base-font-size"
              min="12"
              max="18"
            ></aura-number-control>
            <aura-font-family-control label="--aura-font-family"></aura-font-family-control>
            <hr />
            <vaadin-button id="resetAll">
              <vaadin-icon src="./assets/lucide-icons/rotate-ccw.svg" slot="prefix"></vaadin-icon>
              Reset All
            </vaadin-button>
          </vaadin-vertical-layout>
        </vaadin-popover>
    `;

      this.querySelector('#resetAll').addEventListener('click', () => {
        clearLocalStorage();
        window.location.reload();
      });

      const useNavbarToggle = this.querySelector('#useNavbar');
      useNavbarToggle.addEventListener('change', (e) => {
        useNavbar(e.target.checked);
      });

      useNavbarToggle.checked = localStorage.getItem('aura-navbar') !== null;
    }
  },
);
