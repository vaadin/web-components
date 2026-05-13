import '@vaadin/button';
import { html, LitElement } from 'lit';

/**
 * Lit-based base class for Aura dev-page controls.
 *
 * Renders the shared label / reset / lock chrome in light DOM so the
 * existing `dev/aura/aura-control.css` rules keep matching, and exposes
 * two override hooks for subclasses:
 *   - `renderContent()` — return the row-2 body for this control.
 *   - `onReset()` — invoked when the reset button is clicked.
 *
 * Public surface preserved for cross-control consumers:
 *   - `label` / `isLocked` reactive properties (latter reflects to
 *     `data-locked` attribute).
 *   - `toggleLock()` method.
 *   - `labelElement` / `rowElement` / `resetButton` / `lockButton`
 *     getters that query the rendered light-DOM subtree.
 */
export class AuraLitControl extends LitElement {
  static get properties() {
    return {
      label: {
        type: String,
      },
      isLocked: {
        type: Boolean,
        reflect: true,
        attribute: 'data-locked',
      },
    };
  }

  constructor() {
    super();
    this.label = '';
    this.isLocked = false;
    this.style.display = 'contents';
    this.classList.add('aura-theme-control');
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.#restoreLockState();
  }

  /**
   * Override in subclasses to render the row-2 body of the control.
   * Default: empty.
   */
  renderContent() {
    return html``;
  }

  /**
   * Override in subclasses to handle the reset button click — for
   * example, clear persisted state and remove the inline custom
   * property from the document root. Default: no-op.
   */
  onReset() {}

  toggleLock() {
    this.isLocked = !this.isLocked;
    this.#persistLockState();
  }

  get labelElement() {
    return this.querySelector(':scope > .control > .row > label');
  }

  get rowElement() {
    return this.querySelector(':scope > .control > .row');
  }

  get resetButton() {
    return this.querySelector(':scope > .control > .row > .reset');
  }

  get lockButton() {
    return this.querySelector(':scope > .control > .row > .lock');
  }

  render() {
    const lockTitle = this.isLocked ? 'Unlock shuffle' : 'Lock shuffle';
    return html`
      <div class="control">
        <div class="row">
          <label>${this.label}</label>
          <vaadin-button class="reset" theme="tertiary" aria-label="reset" @click=${this.#onResetClick}></vaadin-button>
          <vaadin-button
            class="lock"
            theme="tertiary"
            aria-label=${lockTitle}
            title=${lockTitle}
            aria-pressed=${String(this.isLocked)}
            @click=${this.#onLockClick}
          ></vaadin-button>
        </div>
        <div class="row">${this.renderContent()}</div>
      </div>
    `;
  }

  #onResetClick() {
    this.onReset();
  }

  #onLockClick(event) {
    event.preventDefault();
    this.toggleLock();
  }

  #persistLockState() {
    localStorage.setItem(this.#lockStorageKey(), this.isLocked ? '1' : '0');
  }

  #restoreLockState() {
    const stored = localStorage.getItem(this.#lockStorageKey());
    if (stored === '1' && !this.isLocked) {
      this.isLocked = true;
    }
  }

  #lockStorageKey() {
    const identity = this.getAttribute('property') || this.id || this.localName;
    return `aura-lock:${this.localName}:${identity}`;
  }
}
