import '@vaadin/icon';
import '@vaadin/popover';
import { css, html, LitElement, nothing } from 'lit';

// Page-local prototypes. The production Side Nav package is not loaded on this page.
class SideNavItem extends LitElement {
  static properties = {
    path: { type: String },
    current: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 0 minmax(0, 1fr) 0;
      min-inline-size: 0;
      min-block-size: 2.75rem;
      border-radius: 0.45rem;
      cursor: pointer;
    }

    :host(:hover) {
      background: #f1f4f8;
    }

    :host([current]) {
      color: var(--accent);
      background: #e9effa;
    }

    :host(:focus-visible),
    a:focus-visible {
      outline: 2px solid var(--focus);
      outline-offset: -2px;
    }

    a {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
      border-radius: inherit;
      color: inherit;
      text-decoration: none;
    }

    .content {
      grid-column: 2;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      min-inline-size: 0;
      padding-inline: 0.7rem;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.role === 'button') {
      this.tabIndex = 0;
    }
  }

  constructor() {
    super();
    this.addEventListener('keydown', (event) => {
      if (this.role === 'button' && ['Enter', ' '].includes(event.key)) {
        event.preventDefault();
        if (!event.repeat && event.key === 'Enter') {
          this.click();
        }
      }
    });
    this.addEventListener('keyup', (event) => {
      if (this.role === 'button' && event.key === ' ') {
        this.click();
      }
    });
  }

  render() {
    const content = html`<span class="content"
      ><slot name="prefix"></slot><slot></slot><slot name="suffix"></slot
    ></span>`;
    return this.path
      ? html`<a href=${this.path} aria-current=${this.current ? 'page' : nothing}>${content}</a>`
      : content;
  }
}

class SideNavGroup extends LitElement {
  static properties = {
    expanded: { type: Boolean, reflect: true },
    togglePosition: { attribute: 'toggle-position' },
    hasEntries: { state: true },
    itemLabel: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .row {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
    }

    ::slotted([slot='item']) {
      grid-area: 1 / 1 / 2 / -1;
      grid-template-columns: subgrid;
    }

    .start,
    .end {
      display: flex;
      grid-row: 1;
      z-index: 1;
    }

    .start {
      grid-column: 1;
    }
    .end {
      grid-column: 3;
    }

    button {
      width: 2.5rem;
      border: 0;
      border-radius: 0.4rem;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    button:hover {
      background: #e3eaf5;
    }
    button:focus-visible {
      outline: 2px solid var(--focus);
      outline-offset: -2px;
    }

    button::before {
      content: '';
      display: inline-block;
      width: 0.45rem;
      height: 0.45rem;
      border: solid currentColor;
      border-width: 0 2px 2px 0;
      transform: rotate(-45deg);
    }

    button[aria-expanded='true']::before {
      transform: rotate(45deg);
    }

    #entries {
      margin-inline-start: 1.25rem;
    }
  `;

  updateSlots() {
    const [item] = this.renderRoot.querySelector('slot[name="item"]').assignedElements();
    this.itemLabel = item?.textContent.trim();
    this.hasEntries = this.renderRoot.querySelector('#entries slot').assignedElements().length > 0;
    this.role = this.hasEntries ? 'group' : null;
    this.ariaLabel = this.hasEntries ? this.itemLabel : null;
    if (!this.hasEntries) {
      this.expanded = false;
    }
  }

  render() {
    const toggle = this.hasEntries
      ? html`<button
          type="button"
          aria-label=${`${this.itemLabel} subpages`}
          aria-controls="entries"
          aria-expanded=${String(Boolean(this.expanded))}
          @click=${() => {
            this.expanded = !this.expanded;
          }}
        ></button>`
      : nothing;
    const leading = this.togglePosition === 'start';
    return html`
      <div class="row">
        <div class="start"><slot name="prefix"></slot>${leading ? toggle : nothing}</div>
        <slot name="item" @slotchange=${this.updateSlots}></slot>
        <div class="end">${leading ? nothing : toggle}<slot name="suffix"></slot></div>
      </div>
      <div id="entries" ?hidden=${!this.expanded}><slot @slotchange=${this.updateSlots}></slot></div>
    `;
  }
}

customElements.define('vaadin-side-nav-item', SideNavItem);
customElements.define('vaadin-side-nav-group', SideNavGroup);

const pages = {
  '#home': ['Home', 'Open Notifications to see what’s new.'],
  '#reports': ['Reports', 'Use the ellipsis next to Reports to open the weekly report.'],
  '#weekly': ['Weekly report', 'This report was opened from the Reports actions.'],
  '#people': ['People', 'Expand People to browse the directory and org chart.'],
  '#directory': ['Directory', 'Browse people in the workspace.'],
  '#org-chart': ['Org Chart', 'Explore the reporting structure.'],
};

function showPage() {
  const path = Object.hasOwn(pages, location.hash) ? location.hash : '#home';
  const [title, description] = pages[path];
  document.querySelector('main h1').textContent = title;
  document.querySelector('main p').textContent = description;
  document.querySelectorAll('vaadin-side-nav-item[path]').forEach((item) => {
    item.current = item.path === path;
    if (item.current && !item.slot && item.parentElement instanceof SideNavGroup) {
      item.parentElement.expanded = true;
    }
  });
}

document.querySelector('#report-actions a').addEventListener('click', () => {
  document.querySelector('#report-actions').opened = false;
});
window.addEventListener('hashchange', showPage);
showPage();
