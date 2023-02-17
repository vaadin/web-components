import '@vaadin/text-area';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { TextAreaValueChangedEvent } from '@vaadin/text-area';

@customElement('lit-component')
class LitComponent extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  private charLimit = 140;

  @state()
  private text = 'Great job. This is excellent!';

  protected override render() {
    return html`
      <vaadin-text-area
        label="Comment"
        .maxlength="${this.charLimit}"
        .value="${this.text}"
        .helperText="${`${this.text.length}/${this.charLimit}`}"
        @value-changed="${(event: TextAreaValueChangedEvent) => {
          this.text = event.detail.value;
        }}"
      ></vaadin-text-area>
    `;
  }
}
