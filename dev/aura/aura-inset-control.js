class AuraInsetControl extends HTMLElement {
  static get is() {
    return 'aura-inset-control';
  }
  static get storageKey() {
    return 'aura:app-layout-inset';
  }

  #slider;
  #out;
  #reset;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
        <style>
          :host { display: block; }
          .control {
            display: grid; gap: .2rem;
          }
          label { font-weight: 600; }
          .row { display: grid; grid-template-columns: 1fr auto auto; gap: .75rem; align-items: center; }
          input[type="range"] { width: 100%; }
          output {
            min-width: 4ch; justify-self: end;
            font-variant-numeric: tabular-nums;
            text-align: end;
          }
          #reset {
            background: transparent;
            border: 0;
          }

          #reset:not(:hover, :focus-visible) {
            opacity: 0.6;
          }

          #reset::before {
            content: "";
            width: 1lh;
            height: 1lh;
            mask-image: var(--lucide-icon-rotate-ccw);
            background: currentColor;
          }
        </style>
        <div class="control">
          <label for="slider">--aura-app-layout-inset</label>
          <div class="row">
            <input id="slider" type="range" min="0" max="50" step="1" />
            <output id="val">0px</output>
            <vaadin-button id="reset" aria-label="reset"></vaadin-button>
          </div>
        </div>
      `;
    this.#slider = shadow.getElementById('slider');
    this.#out = shadow.getElementById('val');
    this.#reset = shadow.getElementById('reset');
  }

  connectedCallback() {
    this.#initialize();

    this.#slider.addEventListener('input', () => this.#applyFromSlider());
    this.#reset.addEventListener('click', () => this.#resetToComputed());

    // Demo-only hook if you mirror the value elsewhere in the page:
    const ro = document.getElementById('readout');
    this.addEventListener('value-change', (e) => {
      if (ro) ro.textContent = e.detail.css;
    });
  }

  // --- Init / Reset -----------------------------------------------------------

  #initialize() {
    const stored = localStorage.getItem(AuraInsetControl.storageKey);
    if (stored) {
      const px = this.#lengthToPx(stored);
      this.#setSliderPx(px, { persist: false, setVar: true });
      return;
    }
    // Start from stylesheet-computed value (ignoring any previous inline override)
    const computed = this.#getStylesheetComputedToken();
    const px = this.#lengthToPx(computed || '0px');
    this.#setSliderPx(px, { persist: false, setVar: false }); // don’t override stylesheet on load
  }

  #resetToComputed() {
    // 1) Clear persistence
    localStorage.removeItem(AuraInsetControl.storageKey);

    // 2) Remove inline override so computed comes from stylesheets again
    document.documentElement.style.removeProperty('--aura-app-layout-inset');

    // 3) Re-read the stylesheet-computed token and update slider/readout
    const token = this.#getStylesheetComputedToken();
    const px = this.#lengthToPx(token || '0px');

    // Set slider to computed px (clamped) and update readout text to the **token**
    this.#setSliderPx(px, { persist: false, setVar: false, readoutToken: token });

    // 4) Fire event to let listeners know we’re back to stylesheet value
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { css: token || '0px', px: this.#clampPx(px), source: 'reset' },
      }),
    );
  }

  // --- Apply from slider ------------------------------------------------------

  #applyFromSlider(opts = { persist: true }) {
    const px = this.#clampPx(Number(this.#slider.value));
    const css = `${px}px`;
    // Update :root (inline override) and readout
    document.documentElement.style.setProperty('--aura-app-layout-inset', css);
    this.#out.textContent = css;

    if (opts.persist) {
      localStorage.setItem(AuraInsetControl.storageKey, css);
    }
    this.dispatchEvent(new CustomEvent('value-change', { detail: { css, px } }));
  }

  // --- Helpers ----------------------------------------------------------------

  #setSliderPx(px, { persist = false, setVar = false, readoutToken } = {}) {
    const clamped = this.#clampPx(px);
    this.#slider.value = String(Math.round(clamped));
    if (setVar) {
      const css = `${Math.round(clamped)}px`;
      document.documentElement.style.setProperty('--aura-app-layout-inset', css);
      this.#out.textContent = css;
      if (persist) localStorage.setItem(AuraInsetControl.storageKey, css);
    } else {
      // Keep stylesheet-driven token in the readout if provided; otherwise show px
      this.#out.textContent = readoutToken ?? `${Math.round(clamped)}px`;
    }
  }

  #clampPx(px) {
    return Math.min(50, Math.max(0, Number.isFinite(px) ? px : 0));
  }

  #getStylesheetComputedToken() {
    // Temporarily ensure no inline override, read computed value from stylesheets
    const el = document.documentElement;
    // const hadInline = el.style.getPropertyValue('--aura-app-layout-inset');
    // (We already remove inline in reset; in init we don’t touch it.)
    return getComputedStyle(el).getPropertyValue('--aura-app-layout-inset').trim();
  }

  #lengthToPx(token) {
    // Measure any valid CSS length (px, em, rem, lh, vw, vh, vmin, vmax, calc(), …)
    const probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.boxSizing = 'border-box';
    probe.style.width = token;
    document.body.appendChild(probe);
    const px = probe.getBoundingClientRect().width;
    document.body.removeChild(probe);
    return Number.isFinite(px) ? px : 0;
  }
}

customElements.define(AuraInsetControl.is, AuraInsetControl);
