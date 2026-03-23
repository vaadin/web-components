export class AuraControl extends HTMLElement {
  _labelEl;
  _rowEl;
  _resetBtn;
  _lockBtn;

  constructor() {
    super();

    this.style.display = 'contents';
    this.classList.add('aura-theme-control');

    queueMicrotask(() => {
      this.#restoreLockState();
      this.#syncAllLockButtons();
    });

    this.addEventListener('click', (event) => {
      const lockButton = event
        .composedPath()
        .find((node) => node instanceof HTMLElement && node.classList?.contains('lock'));

      if (!lockButton || !this.contains(lockButton)) {
        return;
      }

      event.preventDefault();
      this.toggleLock();
    });
  }

  initControl({ label = '', content = '', controlPart } = {}) {
    const partAttr = controlPart ? ` part="${controlPart}"` : '';
    this.innerHTML = `
      <div class="control"${partAttr}>
        <div class="row">
          <label></label>
          <vaadin-button class="reset" aria-label="reset" theme="tertiary"></vaadin-button>
          <vaadin-button class="lock" aria-label="Lock shuffle" theme="tertiary"></vaadin-button>
        </div>
        <div class="row">
          ${content}
        </div>
      </div>
    `;

    this._labelEl = this.querySelector('label');
    this._rowEl = this.querySelector('.row');
    this._resetBtn = this.querySelector('.reset');
    this._lockBtn = this.querySelector('.lock');

    this.setControlLabel(label);
    this.#syncAllLockButtons();
  }

  setControlLabel(value) {
    if (this._labelEl) {
      this._labelEl.textContent = value || '';
    }
  }

  get labelElement() {
    return this._labelEl;
  }

  get rowElement() {
    return this._rowEl;
  }

  get resetButton() {
    return this._resetBtn;
  }

  get lockButton() {
    return this._lockBtn;
  }

  get isLocked() {
    return this.hasAttribute('data-locked');
  }

  set isLocked(value) {
    this.#setLocked(Boolean(value));
  }

  toggleLock() {
    this.#setLocked(!this.isLocked);
  }

  #syncLockButton(button) {
    button.setAttribute('aria-label', this.isLocked ? 'Unlock shuffle' : 'Lock shuffle');
    button.setAttribute('title', this.isLocked ? 'Unlock shuffle' : 'Lock shuffle');
    button.setAttribute('aria-pressed', String(this.isLocked));
  }

  #syncAllLockButtons() {
    this.querySelectorAll('.lock').forEach((button) => {
      if (button instanceof HTMLElement) {
        this.#syncLockButton(button);
      }
    });
  }

  #setLocked(locked, { persist = true } = {}) {
    this.toggleAttribute('data-locked', locked);
    this.#syncAllLockButtons();

    if (persist) {
      localStorage.setItem(this.#lockStorageKey(), locked ? '1' : '0');
    }
  }

  #restoreLockState() {
    const stored = localStorage.getItem(this.#lockStorageKey());
    if (stored === '1') {
      this.#setLocked(true, { persist: false });
    }
  }

  #lockStorageKey() {
    const identity = this.getAttribute('property') || this.id || this.localName;
    return `aura-lock:${this.localName}:${identity}`;
  }
}
