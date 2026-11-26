import '@vaadin/icon';
import '@vaadin/popover';
import { css, html, LitElement, nothing } from 'lit';
// Page-local prototypes. The production Side Nav package is not loaded on this page.
class SideNavItem extends LitElement {
  static properties = {
    path: { type: String, reflect: true },
    disclosureExpanded: { attribute: false },
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

    :is(a, button):focus-visible {
      outline: 2px solid var(--focus);
      outline-offset: -2px;
    }

    button {
      appearance: none;
      border: 0;
      padding: 0;
      background: transparent;
      font: inherit;
      cursor: inherit;
      text-align: start;
    }

    a,
    button {
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

  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static get observedAttributes() {
    return [...super.observedAttributes, 'slot'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateRole();
  }

  attributeChangedCallback(name, oldValue, value) {
    super.attributeChangedCallback(name, oldValue, value);
    if (name === 'slot' && this.isConnected) this.updateRole();
  }

  updateRole() {
    this.role = this.slot === 'item' && this.parentElement?.localName === 'vaadin-side-nav-group' ? null : 'listitem';
  }

  updated(changed) {
    if (changed.has('path') && this.slot === 'item') this.parentElement?.requestUpdate?.();
  }

  get focusElement() {
    return this.renderRoot?.querySelector('a, button');
  }

  get ariaTarget() {
    return this.focusElement;
  }

  render() {
    const content = html`<span class="content"
      ><slot name="prefix"></slot><slot></slot><slot name="suffix"></slot
    ></span>`;
    return this.path != null
      ? html`<a href=${this.path} aria-current=${this.current ? 'page' : nothing}>${content}</a>`
      : html`<button type="button" aria-expanded=${this.disclosureExpanded ?? nothing}>${content}</button>`;
  }
}

class SideNavList extends LitElement {
  static styles = css`
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    ul:not([hidden]) {
      display: grid;
      gap: inherit;
    }
  `;

  render() {
    return html`<ul role="list"
      ><slot></slot
    ></ul>`;
  }
}

class SideNavGroup extends SideNavList {
  static properties = {
    expanded: { type: Boolean, reflect: true },
    togglePosition: { attribute: 'toggle-position' },
  };

  static styles = [
    SideNavList.styles,
    css`
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
        pointer-events: none;
      }

      .start {
        grid-column: 1;
      }

      .end {
        grid-column: 3;
      }

      button,
      ::slotted([slot='prefix']),
      ::slotted([slot='suffix']) {
        pointer-events: auto;
      }

      .indicator {
        display: grid;
        place-items: center;
        width: 2.5rem;
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

      button::before,
      .indicator::before {
        content: '';
        display: inline-block;
        width: 0.45rem;
        height: 0.45rem;
        border: solid currentColor;
        border-width: 0 2px 2px 0;
        transform: rotate(-45deg);
      }

      :host([expanded]) :is(button, .indicator)::before {
        transform: rotate(45deg);
      }

      #entries {
        margin-inline-start: 1.25rem;
      }
    `,
  ];

  updated() {
    const hasEntries = this.hasEntries;
    const disclosureItem = hasEntries ? this.pathlessItem : null;
    if (this.disclosureItem && this.disclosureItem !== disclosureItem) {
      this.disclosureItem.disclosureExpanded = undefined;
    }
    this.disclosureItem = disclosureItem;
    if (disclosureItem) {
      disclosureItem.disclosureExpanded = Boolean(this.expanded);
    }
    this.role = 'listitem';
    if (!hasEntries && this.expanded) {
      this.expanded = false;
    }
  }

  get hasEntries() {
    return Boolean(
      this.querySelector(
        ':scope > vaadin-side-nav-item:not([slot]), :scope > vaadin-side-nav-group:not([slot]), :scope > [slot=""]',
      ),
    );
  }

  get item() {
    return this.querySelector(':scope > vaadin-side-nav-item[slot="item"]');
  }

  get pathlessItem() {
    const item = this.item;
    return item?.path != null ? null : item;
  }

  refresh() {
    this.requestUpdate();
  }

  get itemLabel() {
    return this.item?.textContent.trim();
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  renderToggle(itemToggles) {
    if (itemToggles) {
      return html`<span class="indicator" aria-hidden="true"></span>`;
    }
    return html`<button
      type="button"
      aria-label=${`${this.itemLabel} subpages`}
      aria-controls="entries"
      aria-expanded=${Boolean(this.expanded)}
      @click=${this.toggleExpanded}
    ></button>`;
  }

  render() {
    const hasEntries = this.hasEntries;
    const itemToggles = hasEntries && this.pathlessItem;
    const toggle = hasEntries ? this.renderToggle(itemToggles) : nothing;
    const leading = this.togglePosition === 'start';
    return html`
      <div class="row">
        <div class="start"><slot name="prefix"></slot>${leading ? toggle : nothing}</div>
        <slot name="item" @slotchange=${this.refresh} @click=${itemToggles ? this.toggleExpanded : nothing}></slot>
        <div class="end">${leading ? nothing : toggle}<slot name="suffix"></slot></div>
      </div>
      <ul id="entries" role="list" ?hidden=${!hasEntries || !this.expanded}
        ><slot @slotchange=${this.refresh}></slot
      ></ul>
    `;
  }
}

customElements.define('vaadin-side-nav', SideNavList);
customElements.define('vaadin-side-nav-item', SideNavItem);
customElements.define('vaadin-side-nav-group', SideNavGroup);

const pages = {
  '#home': ['Home', 'Open Notifications to see what’s new.'],
  '#reports': ['Reports', 'Use the ellipsis next to Reports to open the weekly report.'],
  '#weekly': ['Weekly report', 'This report was opened from the Reports actions.'],
  '#people': ['People', 'Expand People to browse the directory and org chart.'],
  '#directory': ['Directory', 'Browse people in the workspace.'],
  '#appearance': ['Appearance', 'Customize the workspace theme.'],
  '#preferences': ['Preferences', 'Manage your workspace preferences.'],
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
