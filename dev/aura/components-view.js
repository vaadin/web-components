import '@vaadin/avatar';
import '@vaadin/avatar-group';
import '@vaadin/card';
import '@vaadin/checkbox';
import '@vaadin/checkbox-group';
import '@vaadin/combo-box';
import '@vaadin/date-time-picker';
import '@vaadin/grid';
import '@vaadin/grid/src/vaadin-grid-selection-column.js';
import '@vaadin/horizontal-layout';
import '@vaadin/icon';
import '@vaadin/menu-bar';
import '@vaadin/message-list';
import '@vaadin/message-input';
import '@vaadin/multi-select-combo-box';
import '@vaadin/popover';
import '@vaadin/progress-bar';
import '@vaadin/radio-group';
import '@vaadin/rich-text-editor';
import '@vaadin/select';
import '@vaadin/scroller';
import '@vaadin/side-nav';
import '@vaadin/tabs';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import { html, render } from 'lit';
import { Notification } from '@vaadin/notification';

const generateItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    name: `First Lastname ${i + 1}`,
    email: `first.lastname${i + 1}@example.com`,
    address: `${i + 1} Main Street`,
    city: `City ${i + 1}`,
    country: `Country ${i + 1}`,
  }));
};

function createMenuItemWithFeatures(text, iconName, badgeLabel) {
  const item = document.createElement('vaadin-menu-bar-item');
  const icon = document.createElement('vaadin-icon');
  const badge = document.createElement('span');

  if (iconName) {
    icon.setAttribute('src', `./assets/lucide-icons/${iconName}.svg`);
    item.append(icon);
  }
  if (text) {
    item.append(document.createTextNode(text));
  }
  if (badgeLabel) {
    badge.classList.add('aura-badge', 'aura-accent-purple');
    badge.textContent = badgeLabel;
    item.append(badge);
  }
  return item;
}

function initView(view) {
  // Menu Bar
  const menuBar = view.querySelector('vaadin-menu-bar');
  menuBar.items = [
    {
      text: 'Actions',
      children: [
        { text: 'Edit' },
        { text: 'Duplicate' },
        { component: 'hr' },
        { component: createMenuItemWithFeatures('Archive', 'layers', '2') },
        {
          text: 'More',
          children: [
            { text: 'Move to Project…' },
            { text: 'Move to Folder…' },
            { component: 'hr' },
            {
              text: 'Advanced Options',
              children: [
                { text: 'Show All', checked: true },
                { text: 'Show Hidden Items' },
                { component: 'hr' },
                { text: 'Open…' },
              ],
            },
          ],
        },
        { component: 'hr' },
        { text: 'Share' },
        { text: 'Add to Favorites' },
        { component: 'hr' },
        { text: 'Delete', theme: 'danger' },
      ],
    },
  ];

  view.querySelector('#filled-menu-bar').addEventListener('change', (e) => {
    if (e.target.checked) {
      menuBar.setAttribute('theme', 'filled');
      menuBar.items[0].children[9].theme = 'danger filled';
    } else {
      menuBar.removeAttribute('theme');
      menuBar.items[0].children[9].theme = 'danger';
    }
  });

  view.querySelector('#filled-side-nav').addEventListener('change', (e) => {
    const sideNav = document.querySelector('components-view vaadin-side-nav');
    if (e.target.checked) {
      sideNav.setAttribute('theme', 'filled accent');
    } else {
      sideNav.setAttribute('theme', 'accent');
    }
  });

  // Select
  view.querySelector('vaadin-select').renderer = (root) => {
    render(
      html`
        <vaadin-select-list-box>
          <vaadin-select-item value="1">Option 1</vaadin-select-item>
          <vaadin-select-item value="2">Option 2</vaadin-select-item>
          <vaadin-select-item value="3">Option 3</vaadin-select-item>
        </vaadin-select-list-box>
      `,
      root,
    );
  };
  view.querySelector('vaadin-select').value = '1';

  // Combo Box
  view.querySelectorAll('vaadin-combo-box, vaadin-multi-select-combo-box').forEach((comboBox) => {
    comboBox.dataProvider = async (params, callback) => {
      const index = params.page * params.pageSize;
      const response = await fetch(
        `https://demo.vaadin.com/demo-data/1.0/filtered-countries?index=${index}&count=${params.pageSize}&filter=${params.filter}`,
      );
      if (response.ok) {
        const { result, size } = await response.json();
        // Emulate network latency for demo purpose
        setTimeout(() => {
          callback(result, size);
        }, 1000);
      }
    };

    if (!comboBox.placeholder) {
      if (comboBox.localName.startsWith('vaadin-multi-select')) {
        comboBox.selectedItems = ['Andorra', 'United Arab Emirates'];
      } else {
        comboBox.selectedItem = 'Andorra';
      }
    }
  });

  // Message List
  view.querySelector('vaadin-message-list').items = [
    {
      userName: 'Matt Mambo',
      text: 'Nature does not hurry, yet everything gets accomplished.',
      time: '2 minutes ago',
      userColorIndex: 1,
    },
    {
      userName: 'Lindsey Listy',
      text: 'Using your talent, hobby or profession in a way that makes you contribute with something good to this world is truly the way to go.',
      time: 'just now',
      userColorIndex: 2,
    },
  ];

  // Notification
  view.querySelector('#showNotificationBtn').addEventListener('click', () => {
    let notification;

    const close = () => {
      notification.close();
    };

    notification = Notification.show(
      html`
        <vaadin-card theme="horizontal footer-end no-frame">
          <vaadin-icon src="./assets/lucide-icons/messages-square.svg" slot="media"></vaadin-icon>
          <div slot="title">New Message from Olivia</div>
          <div>The AI chat UI is evolving with the integration of components…</div>
          <vaadin-button slot="footer" @click="${close}">Show</vaadin-button>
          <vaadin-button slot="footer" @click="${close}">Dismiss</vaadin-button>
        </vaadin-card>
      `,
      { duration: 0, position: 'top-end' },
    );
  });

  // Avatar Group
  view.querySelector('vaadin-avatar-group').items = [
    { name: 'AA', colorIndex: 0 },
    { name: 'BB', colorIndex: 1 },
    { name: 'CC', colorIndex: 2 },
    { name: 'DD', colorIndex: 3 },
    { name: 'EE', colorIndex: 4 },
    { name: 'FF', colorIndex: 5 },
    { name: 'GG', colorIndex: 6 },
    { name: 'HH', colorIndex: 7 },
    { name: 'II', colorIndex: 8 },
  ];

  // Grid
  const grid = view.querySelector('vaadin-grid');
  grid.items = generateItems(20);
  grid.selectedItems = [grid.items[0]];
  const badgeColors = ['neutral', 'green', 'yellow', 'purple', 'orange', 'blue', 'red'];
  grid.querySelector('vaadin-grid-column[header="Status"]').renderer = (root, _, model) => {
    root.innerHTML = `<span class="aura-badge aura-accent-${badgeColors[model.index % badgeColors.length]}">Status</span>`;
  };
  grid.querySelector('vaadin-grid-column.avatar').renderer = (root, _, model) => {
    root.innerHTML = `<vaadin-avatar name="${model.item.name}" color-index="${model.index % 9}"></vaadin-avatar>`;
  };
}

customElements.define(
  'components-view',
  class extends HTMLElement {
    connectedCallback() {
      if (!this._ready) {
        render(
          html`
            <style>
              components-view {
                display: block;
                height: 100%;
              }

              .components-view {
                container-type: inline-size;
                container-name: kitchen-sink;
              }

              components-view .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                grid-auto-flow: dense;
                --vaadin-field-default-width: 100%;
                align-items: stretch;
                gap: var(--vaadin-gap-s);
                padding: var(--vaadin-padding-l) var(--vaadin-padding-xs);
                padding-top: 0;
              }

              components-view .component {
                display: flex;
                height: 200px;
                align-items: center;
                justify-content: center;
                border-radius: var(--vaadin-radius-m);
                border: 1px solid var(--vaadin-border-color-secondary);
                gap: var(--vaadin-gap-s);
                padding: var(--vaadin-padding-l);
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
                background: var(--aura-surface-color);
                --aura-surface-level: 3;
                background-clip: padding-box;
              }

              components-view .component.column {
                flex-direction: column;
              }

              components-view .component.tall {
                height: 100%;
                min-height: calc(400px + var(--vaadin-gap-s));
                grid-row: auto / span 2;
              }

              @container kitchen-sink (min-width: 400px) {
                components-view .component.wide,
                components-view .component.widest {
                  grid-column: auto / span 2;
                }
              }

              @container kitchen-sink (min-width: 600px) {
                components-view .component.widest {
                  grid-column: auto / span 3;
                }
              }

              components-view .component.no-padding {
                padding: 0;
              }

              components-view .badges {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: var(--vaadin-gap-s);
              }

              components-view .sizes {
                display: flex;
                flex-direction: column;
                gap: 4px;
              }

              components-view .sizes > div {
                background: var(--aura-accent-color);
                height: 4px;
                width: var(--size);
              }
            </style>

            <div class="aura-view">
              <header>
                <vaadin-drawer-toggle theme="tertiary"></vaadin-drawer-toggle>
                <h1>Components</h1>
              </header>
              <vaadin-scroller theme="overflow-indicators" class="components-view">
                <div class="grid">
                  <div class="aura-surface component wide">
                    <vaadin-button theme="primary">Primary</vaadin-button>
                    <vaadin-button>Default</vaadin-button>
                    <vaadin-button theme="tertiary">Tertiary</vaadin-button>
                  </div>

                  <div class="aura-surface component">
                    <div class="flex justify-center">
                      <vaadin-button id="showNotificationBtn">
                        <vaadin-icon src="./assets/lucide-icons/layers.svg" slot="prefix"></vaadin-icon>
                        Show Notification
                      </vaadin-button>
                    </div>
                  </div>

                  <div class="aura-surface component wide tall">
                    <div class="badges">
                      <span class="aura-badge aura-accent-color">Accent</span>
                      <span class="aura-badge aura-accent-neutral">Neutral</span>
                      <span class="aura-badge aura-accent-red">Red</span>
                      <span class="aura-badge aura-accent-orange">Orange</span>
                      <span class="aura-badge aura-accent-yellow">Yellow</span>
                      <span class="aura-badge aura-accent-green">Green</span>
                      <span class="aura-badge aura-accent-blue">Blue</span>
                      <span class="aura-badge aura-accent-purple">Purple</span>
                    </div>

                    <div class="badges">
                      <span class="aura-badge aura-badge-filled">Accent</span>
                      <span class="aura-badge aura-badge-filled aura-accent-neutral">Neutral</span>
                      <span class="aura-badge aura-badge-filled aura-accent-red">Red</span>
                      <span class="aura-badge aura-badge-filled aura-accent-orange">Orange</span>
                      <span class="aura-badge aura-badge-filled aura-accent-yellow">Yellow</span>
                      <span class="aura-badge aura-badge-filled aura-accent-green">Green</span>
                      <span class="aura-badge aura-badge-filled aura-accent-blue">Blue</span>
                      <span class="aura-badge aura-badge-filled aura-accent-purple">Purple</span>
                    </div>

                    <div class="badges">
                      <span class="aura-badge aura-accent-color">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-accent-neutral">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-accent-red">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-accent-orange">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-accent-yellow">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-accent-green">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-accent-blue">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-accent-purple">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                    </div>

                    <div class="badges">
                      <span class="aura-badge aura-badge-filled">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-badge-filled aura-accent-neutral">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-badge-filled aura-accent-red">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-badge-filled aura-accent-orange">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-badge-filled aura-accent-yellow">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-badge-filled aura-accent-green">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-badge-filled aura-accent-blue">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                      <span class="aura-badge aura-badge-filled aura-accent-purple">
                        <vaadin-icon src="./assets/lucide-icons/file-text.svg"></vaadin-icon>
                      </span>
                    </div>
                  </div>

                  <div class="aura-surface component">
                    <vaadin-radio-group label="Options">
                      <vaadin-radio-button label="Option 1" value="1" checked></vaadin-radio-button>
                      <vaadin-radio-button label="Option 2" value="2"></vaadin-radio-button>
                      <vaadin-radio-button label="Option 3" value="3"></vaadin-radio-button>
                    </vaadin-radio-group>
                  </div>

                  <div class="aura-surface component tall column">
                    <vaadin-side-nav theme="accent filled">
                      <vaadin-side-nav-item path="">
                        <vaadin-icon src="./assets/lucide-icons/home.svg" slot="prefix"></vaadin-icon>
                        <span>Components</span>
                        <span class="aura-badge aura-accent-color" slot="suffix" aria-label="(2 new items)">2</span>
                      </vaadin-side-nav-item>
                      <vaadin-side-nav-item>
                        <vaadin-icon src="./assets/lucide-icons/chart-column-big.svg" slot="prefix"></vaadin-icon>
                        <span>Grid View</span>
                      </vaadin-side-nav-item>
                      <vaadin-side-nav-item>
                        <vaadin-icon src="./assets/lucide-icons/chart-pie.svg" slot="prefix"></vaadin-icon>
                        <span>Reporting</span>
                      </vaadin-side-nav-item>
                      <vaadin-side-nav-item>
                        <vaadin-icon src="./assets/lucide-icons/cog.svg" slot="prefix"></vaadin-icon>
                        <span>Settings</span>
                        <vaadin-side-nav-item slot="children">
                          <span>Account</span>
                        </vaadin-side-nav-item>
                        <vaadin-side-nav-item slot="children">
                          <span>Preferences</span>
                        </vaadin-side-nav-item>
                        <vaadin-side-nav-item slot="children">
                          <span>Subscription</span>
                        </vaadin-side-nav-item> </vaadin-side-nav-item
                      ><vaadin-side-nav-item>
                        <vaadin-icon src="./assets/lucide-icons/messages-square.svg" slot="prefix"></vaadin-icon>
                        <span>Support</span>
                        <span class="aura-badge aura-accent-green" slot="suffix">Online</span>
                      </vaadin-side-nav-item>
                    </vaadin-side-nav>
                    <vaadin-checkbox id="filled-side-nav" label="Filled" checked>
                      <vaadin-tooltip slot="tooltip" text="Apply the filled variant on the side nav"></vaadin-tooltip>
                    </vaadin-checkbox>
                  </div>

                  <div class="aura-surface component column">
                    <vaadin-menu-bar></vaadin-menu-bar>
                    <vaadin-checkbox id="filled-menu-bar" label="Filled">
                      <vaadin-tooltip slot="tooltip" text="Apply the filled variant on the menu items"></vaadin-tooltip>
                    </vaadin-checkbox>
                  </div>

                  <div class="aura-surface component wide">
                    <vaadin-tabs>
                      <vaadin-tab>Details<span class="aura-badge aura-accent-color">2</span></vaadin-tab>
                      <vaadin-tab>Preferences</vaadin-tab>
                      <vaadin-tab>Settings</vaadin-tab>
                    </vaadin-tabs>
                  </div>

                  <div class="aura-surface component wide">
                    <vaadin-date-time-picker style="width: 20em" value="2025-09-09T12:00"></vaadin-date-time-picker>
                  </div>

                  <div class="aura-surface component">
                    <div class="sizes">
                      <h5>Sizes</h5>
                      <div class="xs" style="--size: var(--vaadin-padding-xs)"></div>
                      <div class="s" style="--size: var(--vaadin-padding-s)"></div>
                      <div class="m" style="--size: var(--vaadin-padding-m)"></div>
                      <div class="l" style="--size: var(--vaadin-padding-l)"></div>
                      <div class="xl" style="--size: var(--vaadin-padding-xl)"></div>
                    </div>
                  </div>

                  <div class="aura-surface component wide tall">
                    <vaadin-rich-text-editor placeholder="Write something…"></vaadin-rich-text-editor>
                  </div>

                  <div class="aura-surface component">
                    <vaadin-checkbox-group label="Options" class="aura-surface">
                      <vaadin-checkbox label="Option 1" value="1" checked></vaadin-checkbox>
                      <vaadin-checkbox label="Option 2" value="2"></vaadin-checkbox>
                      <vaadin-checkbox label="Option 3" value="3"></vaadin-checkbox>
                    </vaadin-checkbox-group>
                  </div>

                  <div class="aura-surface component">
                    <vaadin-combo-box item-label-path="name" item-value-path="id" label="Country"></vaadin-combo-box>
                  </div>

                  <div class="aura-surface component">
                    <div class="type-scale" style="font-weight: var(--aura-font-weight-semibold)">
                      <div style="font-size: var(--aura-font-size-xl); line-height: var(--aura-line-height-xl)">
                        Heading
                      </div>
                      <div style="font-size: var(--aura-font-size-l); line-height: var(--aura-line-height-l)">
                        Heading
                      </div>
                      <div style="font-size: var(--aura-font-size-m); line-height: var(--aura-line-height-m)">
                        Heading
                      </div>
                      <div style="font-size: var(--aura-font-size-s); line-height: var(--aura-line-height-x)">
                        Heading
                      </div>
                      <div style="font-size: var(--aura-font-size-xs); line-height: var(--aura-line-height-xs)">
                        Heading
                      </div>
                    </div>
                  </div>

                  <div class="aura-surface component">
                    <vaadin-select label="Options"></vaadin-select>
                  </div>

                  <div class="aura-surface component widest tall no-padding">
                    <vaadin-grid theme="no-border">
                      <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
                      <vaadin-grid-column class="avatar" auto-width flex-grow="0"></vaadin-grid-column>
                      <vaadin-grid-column path="name"></vaadin-grid-column>
                      <vaadin-grid-column path="email"></vaadin-grid-column>
                      <vaadin-grid-column header="Status"></vaadin-grid-column>
                    </vaadin-grid>
                  </div>

                  <div class="aura-surface component">
                    <vaadin-avatar-group></vaadin-avatar-group>
                  </div>

                  <div class="aura-surface component tall wide column">
                    <vaadin-message-list></vaadin-message-list>
                    <vaadin-message-input></vaadin-message-input>
                  </div>

                  <div class="aura-surface component">
                    <vaadin-text-field clear-button-visible value="Projects">
                      <vaadin-icon src="./assets/lucide-icons/folder.svg" slot="prefix"></vaadin-icon>
                    </vaadin-text-field>
                  </div>

                  <div class="aura-surface component">
                    <vaadin-progress-bar value="0.5"></vaadin-progress-bar>
                  </div>

                  <div class="aura-surface component">
                    <vaadin-multi-select-combo-box
                      class="Countries"
                      class="w-full"
                      item-label-path="name"
                      item-value-path="id"
                    ></vaadin-multi-select-combo-box>
                  </div>
                </div>
              </vaadin-scroller>
              <footer style="display: flex; justify-content: space-between">
                <span theme="small">20 components</span>
                <vaadin-button theme="small">Browse…</vaadin-button>
              </footer>
            </div>
          `,
          this,
        );
        initView(this);
        this._ready = true;
      }
    }
  },
);
