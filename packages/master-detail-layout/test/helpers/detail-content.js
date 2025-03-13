import { css, html, LitElement } from 'lit';

customElements.define(
  'detail-content',
  class extends LitElement {
    static get styles() {
      return css`
        :host {
          display: block;
        }

        .form {
          display: flex;
          flex-wrap: wrap;
          padding: 0.5rem;
          gap: 0.5rem;
        }

        input {
          width: 8rem;
        }
      `;
    }

    render() {
      return html`
        <div class="form">
          <div class="field"><input type="text" /></div>
          <div class="field"><input type="text" /></div>
          <div class="field"><input type="text" /></div>
          <div class="field"><input type="text" /></div>
          <div class="field"><input type="text" /></div>
          <div class="field"><input type="text" /></div>
          <div class="field"><input type="text" /></div>
          <div class="field"><input type="text" /></div>
          <div class="field"><input type="text" /></div>
          <div class="field"><input type="text" /></div>
          <div class="field"><input type="text" /></div>
          <div class="field"><input type="text" /></div>
        </div>
      `;
    }
  },
);
