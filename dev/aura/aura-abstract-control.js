let AURA_CONTROL_STYLES = false;

export class AuraControl extends HTMLElement {
  _labelEl;
  _rowEl;
  _resetBtn;
  _lockBtn;

  constructor() {
    super();

    this.style.display = 'contents';
    this.classList.add('aura-theme-control');

    if (!AURA_CONTROL_STYLES) {
      const style = document.createElement('style');
      style.textContent = `
        .aura-theme-control {
          .control {
            --control-surface: oklch(from var(--vaadin-background-color) clamp(0, (0.62 - l) * 1000, 1) 0 0 / 0.05);
            --icon-rotate-ccw: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>');
            --icon-lock: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>');
            --icon-lock-open: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.2-2.4"/></svg>');
            display: grid;
          }

          &.span .control {
            grid-column: 1 / -1;
          }

          .row {
            display: flex;
            align-items: center;

            > :first-child {
              flex: 1;
              min-width: 0;
              width: 100%;
            }
          }

          label {
            color: var(--vaadin-text-color);
            font-weight: var(--aura-font-weight-medium);
            flex: auto;
          }

          .lock,
          .reset {
            flex: none;
            gap: 0;
            color: var(--vaadin-text-color-disabled);
            padding: var(--vaadin-padding-xs);

            &:hover {
              color: var(--vaadin-text-color-secondary);
            }

            &[aria-pressed='true'] {
              color: var(--aura-accent-text-color);
            }

            &::after {
              content: "";
              width: 0.9lh;
              height: 0.9lh;
              flex: none;
              background: currentColor;
            }
          }

          .reset::after {
            mask-image: var(--icon-rotate-ccw);
          }

          .reset {
            display: var(--reset-button-display, inline-flex);
          }

          .lock {
            display: var(--lock-button-display, none);
          }

          .lock::after {
            mask-image: var(--icon-lock-open);
          }

          .lock[aria-pressed='true']::after {
            mask-image: var(--icon-lock);
          }

          .segmented {
            display: inline-grid;
            grid-auto-flow: column;
            padding: 3px;
            border-radius: calc(var(--vaadin-radius-m) + 3px);
            background: var(--control-surface);
            overflow: hidden;
            flex: auto;
          }

          .segmented input {
            position: absolute;
            opacity: 0;
            pointer-events: none;
          }

          .segmented label {
            padding: var(--vaadin-padding-xs) var(--vaadin-padding-s);
            cursor: pointer;
            user-select: none;
            display: inline-block;
            font-weight: 500;
            color: var(--vaadin-text-color-secondary);
            text-align: center;

            &:hover {
              color: var(--vaadin-text-color);
            }

            &:not(:first-of-type) {
              box-shadow: -5px 0 0 -4px var(--vaadin-border-color-secondary);
            }

            &:has(:focus-visible) {
              outline: 2px solid var(--vaadin-focus-ring-color);
            }
          }

          /* Selected state */
          .segmented label:has(input:checked) {
            backdrop-filter: brightness(1.8) saturate(0.8);
            color: var(--vaadin-text-color);
            box-shadow: var(--aura-shadow-s);
            border-radius: var(--vaadin-radius-m);

            + label {
              box-shadow: none;
            }
          }

          output {
            min-width: 4ch;
            text-align: right;
            font-variant-numeric: tabular-nums;
          }

          input[type="color"] {
            width: 2rem;
            height: 2rem;
            border: none;
            border-radius: 1rem;
            background: transparent;
          }

          vaadin-select::part(input-field) {
            box-shadow: none;
            background: var(--control-surface);
            border: 0;
            --vaadin-field-default-width: 5em;
          }

          vaadin-select-item::part(checkmark) {
            order: 1;
          }

          select {
            border: 1px solid transparent;
            border-radius: var(--vaadin-radius-m);
            font: inherit;
            font-weight: var(--aura-font-weight-medium);
            color: inherit;
            padding: var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container);
            background: var(--control-surface);
          }
        }
      `;
      document.head.append(style);
      AURA_CONTROL_STYLES = true;
    }

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
