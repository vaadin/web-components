import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-area';
import { html, LitElement } from 'lit';

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }
}

class AuraExportDialog extends LitElement {
  static get is() {
    return 'aura-export-dialog';
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
      },
      copyLabel: {
        type: String,
      },
      value: {
        type: String,
      },
    };
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <vaadin-dialog header-title="Export Theme CSS" .opened="${this.opened}">
        <vaadin-button slot="header-content" theme="tertiary" @click=${this.close}>Close</vaadin-button>
        <vaadin-text-area
          accessible-name="Copy these styles to your app"
          readonly
          .value=${this.value}
          style="max-width: 100%; width: min(42rem, 86vw); max-height: 100%; font-family: monospace; font-size: 0.8em; line-height: 1.3;"
        ></vaadin-text-area>
        <div slot="footer">
          <vaadin-button theme="primary" @click=${this.#onCopyClick}>${this.copyLabel}</vaadin-button>
        </div>
      </vaadin-dialog>
    `;
  }

  close() {
    this.opened = false;
  }

  open() {
    this.copyLabel = 'Copy';
    this.opened = true;
  }

  async #onCopyClick() {
    const original = this.copyLabel;
    let copied = false;
    try {
      copied = await copyText(this.value);
    } catch (_error) {
      copied = false;
    }

    this.copyLabel = copied ? 'Copied' : 'Copy failed';

    setTimeout(() => {
      this.copyLabel = original;
    }, 1200);
  }
}

customElements.define(AuraExportDialog.is, AuraExportDialog);
