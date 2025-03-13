import { css, html, LitElement } from 'lit';

customElements.define(
  'master-content',
  class extends LitElement {
    static get styles() {
      return css`
        :host {
          display: block;
        }

        .list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          padding: 0.5rem;
          grid-gap: 0.25rem;
        }

        .item {
          padding: 1rem;
          border: solid 1px #e2e2e2;
        }

        h3 {
          margin: 0 0 0.25rem;
        }
      `;
    }

    render() {
      return html`
        <div class="list">
          <div class="item">
            <h3>Lorem</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
          </div>
          <div class="item">
            <h3>Lorem</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
          </div>
          <div class="item">
            <h3>Lorem</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
          </div>
          <div class="item">
            <h3>Lorem</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
          </div>
          <div class="item">
            <h3>Lorem</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
          </div>
          <div class="item">
            <h3>Lorem</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
          </div>
        </div>
      `;
    }
  },
);
