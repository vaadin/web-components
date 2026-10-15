class AuraPresetThumbnail extends HTMLElement {
  static get is() {
    return 'aura-preset-thumbnail';
  }

  connectedCallback() {
    if (this.firstChild) {
      return;
    }
    this.innerHTML = `
      <span class="shape shape-nav-items"></span>
      <span class="shape shape-content aura-surface">
        <span class="shape shape-text"></span>
        <span class="shape shape-cards">
          <span class="shape shape-card aura-surface"></span>
          <span class="shape shape-card aura-surface"></span>
          <span class="shape shape-card aura-surface"></span>
        </span>
        <span class="shape shape-btn"></span>
      </span>
    `;
  }
}

customElements.define(AuraPresetThumbnail.is, AuraPresetThumbnail);
