import '@vaadin/charts';
import '@vaadin/dashboard/vaadin-dashboard-layout.js';
import '@vaadin/dashboard/vaadin-dashboard-widget.js';
import '@vaadin/grid';
import '@vaadin/horizontal-layout';
import '@vaadin/icon';
import '@vaadin/scroller';
import '@vaadin/tabs';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import { html, render } from 'lit';

function initView(view) {
  const grid = view.querySelector('vaadin-grid');
  grid.items = [
    {
      symbol: 'ZEN',
      company: 'ZenCore Technologies',
      price: '$98.40',
      change: '+1.22',
      changePercent: '+1.26%',
      volume: '12,450,000',
      marketCap: '540B',
    },
    {
      symbol: 'FLEX',
      company: 'Flexora Digital',
      price: '$62.80',
      change: '-0.85',
      changePercent: '-1.34%',
      volume: '4,112,300',
      marketCap: '210B',
    },
    {
      symbol: 'NOVA',
      company: 'NovaNet Systems',
      price: '$142.10',
      change: '+4.50',
      changePercent: '+3.27%',
      volume: '9,840,500',
      marketCap: '720B',
    },
    {
      symbol: 'ALTA',
      company: 'AltaCore Finance',
      price: '$52.75',
      change: '+0.92',
      changePercent: '+1.77%',
      volume: '3,505,900',
      marketCap: '180B',
    },
    {
      symbol: 'LYNX',
      company: 'Lynxion Robotics',
      price: '$301.20',
      change: '-5.10',
      changePercent: '-1.66%',
      volume: '2,901,000',
      marketCap: '1.1T',
    },
    {
      symbol: 'ECHO',
      company: 'EchoData Cloud',
      price: '$415.60',
      change: '+8.12',
      changePercent: '+1.99%',
      volume: '6,780,200',
      marketCap: '890B',
    },
    {
      symbol: 'SPRX',
      company: 'Sparx Innovations',
      price: '$24.30',
      change: '-0.12',
      changePercent: '-0.49%',
      volume: '14,980,000',
      marketCap: '120B',
    },
    {
      symbol: 'QUAD',
      company: 'Quadium Analytics',
      price: '$188.45',
      change: '+3.18',
      changePercent: '+1.72%',
      volume: '7,431,700',
      marketCap: '460B',
    },
    {
      symbol: 'MIND',
      company: 'MindShift AI',
      price: '$73.20',
      change: '+0.65',
      changePercent: '+0.89%',
      volume: '10,223,100',
      marketCap: '390B',
    },
  ];

  grid.querySelector('vaadin-grid-column[header="Change"]').renderer = (root, _, model) => {
    root.innerHTML = `<span style="color: var(--aura-${model.item.change.startsWith('-') ? 'red' : 'green'}-text)">${model.item.change}</span>`;
  };

  grid.querySelector('vaadin-grid-column[header="Change %"]').renderer = (root, _, model) => {
    root.innerHTML = `<span class="aura-badge aura-accent-${model.item.changePercent.startsWith('-') ? 'red' : 'green'}">${model.item.changePercent}</span>`;
  };
}

customElements.define(
  'dashboard-view',
  class extends HTMLElement {
    connectedCallback() {
      if (!this._ready) {
        render(
          html`
            <style>
              dashboard-view {
                display: block;
                height: 100%;

                vaadin-dashboard-widget::part(content) {
                  padding: var(--vaadin-padding-m);
                  padding-top: 0;
                }

                vaadin-dashboard-widget.kpi {
                  &::part(header) {
                    padding-bottom: 0;
                  }

                  &::part(title) {
                    color: var(--vaadin-text-color-secondary);
                  }

                  vaadin-chart {
                    height: 200px;
                    margin-top: var(--vaadin-gap-m);
                  }
                }

                .kpi-name {
                  font-size: var(--aura-font-size-xl);
                  font-weight: var(--aura-font-weight-semibold);
                }

                [class^='kpi-change'] {
                  font-size: var(--aura-font-size-s);
                  margin-inline-start: var(--vaadin-gap-s);

                  &::before {
                    content: '';
                    display: inline-block;
                    border-inline: 5px solid transparent;
                    margin-inline-end: var(--vaadin-gap-xs);
                  }
                }

                .kpi-change-positive {
                  color: var(--aura-green-text);

                  &::before {
                    border-bottom: 5px solid currentColor;
                  }
                }

                .kpi-change-negative {
                  color: var(--aura-red-text);

                  &::before {
                    border-top: 5px solid currentColor;
                  }
                }

                vaadin-dashboard-widget table {
                  width: 100%;

                  :is(th, td) {
                    text-align: end;

                    &:first-child {
                      text-align: start;
                    }
                  }

                  th {
                    font-weight: var(--aura-font-weight-semibold);
                  }

                  td:not(:first-child) {
                    color: var(--vaadin-text-color-secondary);
                  }
                }
              }
            </style>
            <div class="aura-view">
              <div class="aura-view-header">
                <vaadin-drawer-toggle theme="tertiary"></vaadin-drawer-toggle>
                <h2>Dashboard</h2>
                <vaadin-horizontal-layout theme="spacing">
                  <vaadin-text-field aria-label="Search" placeholder="Search…">
                    <vaadin-icon icon="vaadin:search" slot="prefix"></vaadin-icon>
                  </vaadin-text-field>
                  <vaadin-button theme="tertiary" aria-label="Notifications">
                    <vaadin-tooltip slot="tooltip" text="Notifications"></vaadin-tooltip>
                    <vaadin-icon src="./assets/lucide-icons/bell.svg"></vaadin-icon>
                    <span class="aura-badge aura-badge-filled aura-accent-red" aria-label="Unread"></span>
                  </vaadin-button>
                  <vaadin-button aria-label="New Dashboard">
                    <vaadin-tooltip slot="tooltip" text="New Dashboard"></vaadin-tooltip>
                    <vaadin-icon icon="vaadin:plus"></vaadin-icon>
                  </vaadin-button>
                </vaadin-horizontal-layout>
              </div>

              <vaadin-scroller theme="overflow-indicator-top" style="--vaadin-scroller-padding-inline: 0px;">
                <vaadin-horizontal-layout
                  theme="wrap spacing"
                  style="padding-inline: var(--vaadin-padding-m); align-items: center;"
                >
                  <vaadin-tabs selected="0">
                    <vaadin-tab>Overview</vaadin-tab>
                    <vaadin-tab>Revenue</vaadin-tab>
                    <vaadin-tab>Engagement</vaadin-tab>
                    <vaadin-tab>Products</vaadin-tab>
                    <vaadin-tab>Integrations</vaadin-tab>
                    <vaadin-tab>Billing</vaadin-tab>
                  </vaadin-tabs>

                  <vaadin-horizontal-layout slot="end" theme="spacing">
                    <vaadin-date-picker aria-label="From" placeholder="From" theme="small"></vaadin-date-picker>
                    <vaadin-date-picker aria-label="To" placeholder="To" theme="small"></vaadin-date-picker>
                  </vaadin-horizontal-layout>
                </vaadin-horizontal-layout>

                <!-- Top cards with charts -->
                <vaadin-dashboard-layout
                  style="--vaadin-dashboard-gap: var(--vaadin-gap-l); --vaadin-dashboard-col-max-count: 3;"
                >
                  <!-- Revenue Overview -->
                  <vaadin-dashboard-widget widget-title="Revenue Overview" class="kpi">
                    <vaadin-button slot="header-content" theme="small">View Report</vaadin-button>
                    <span class="kpi-name">$248,400</span>
                    <span class="kpi-change-positive">6.4%</span>

                    <vaadin-chart
                      type="line"
                      additional-options='{
                "plotOptions": {
                  "series": {
                    "marker": { "enabled": false }
                  }
                },
                "yAxis": {
                  "title": {
                    "enabled": false
                  }
                }
              }'
                    >
                      <vaadin-chart-series
                        title="Revenue"
                        values="[180000,185500,189000,196000,205000,215000,225000,238000,248400]"
                      ></vaadin-chart-series>
                    </vaadin-chart>

                    <table>
                      <tr>
                        <th>Product</th>
                        <th>MRR</th>
                        <th>Growth</th>
                        <th>Category</th>
                      </tr>
                      <tr>
                        <td>Cloud Pro</td>
                        <td>$112,300</td>
                        <td><span class="aura-badge aura-accent-green">+3.1%</span></td>
                        <td>SaaS</td>
                      </tr>
                      <tr>
                        <td>Analytics Suite</td>
                        <td>$76,500</td>
                        <td><span class="aura-badge aura-accent-red">-0.8%</span></td>
                        <td>SaaS</td>
                      </tr>
                    </table>
                  </vaadin-dashboard-widget>

                  <!-- Customer Segments -->
                  <vaadin-dashboard-widget widget-title="Customer Segments" class="kpi">
                    <vaadin-button slot="header-content" theme="small">View Report</vaadin-button>
                    <span class="kpi-name">SMB vs Enterprise</span>
                    <span class="kpi-change-negative">-1.2%</span>

                    <vaadin-chart
                      type="line"
                      additional-options='{
                "plotOptions": {
                  "series": {
                    "marker": { "enabled": false }
                  }
                },
                "yAxis": {
                  "title": {
                    "enabled": false
                  }
                }
              }'
                    >
                      <vaadin-chart-series
                        title="SMB"
                        values="[60000,63000,66000,68000,71000,74500,78000,82000,86500]"
                      ></vaadin-chart-series>
                      <vaadin-chart-series
                        title="Enterprise"
                        values="[90000,94000,97500,100000,103000,108000,112500,118000,124700]"
                      ></vaadin-chart-series>
                    </vaadin-chart>

                    <table>
                      <tr>
                        <th>Type</th>
                        <th>ARR</th>
                        <th>Trend</th>
                        <th>Region</th>
                      </tr>
                      <tr>
                        <td>SMB</td>
                        <td>$86,500</td>
                        <td><span class="aura-badge aura-accent-green">+1.2%</span></td>
                        <td>Global</td>
                      </tr>
                      <tr>
                        <td>Enterprise</td>
                        <td>$124,700</td>
                        <td><span class="aura-badge aura-accent-green">+2.4%</span></td>
                        <td>Global</td>
                      </tr>
                    </table>
                  </vaadin-dashboard-widget>

                  <!-- Feature Adoption -->
                  <vaadin-dashboard-widget widget-title="Feature Adoption" class="kpi">
                    <vaadin-button slot="header-content" theme="small">View Report</vaadin-button>
                    <span class="kpi-name">Key Modules</span>
                    <span class="kpi-change-positive">9.1%</span>

                    <vaadin-chart
                      type="line"
                      additional-options='{
                "plotOptions": {
                  "series": {
                    "marker": { "enabled": false }
                  }
                },
                "yAxis": {
                  "title": {
                    "enabled": false
                  }
                }
              }'
                    >
                      <vaadin-chart-series
                        title="Automation Engine"
                        values="[54,56,59,61,63,66,69,72,75]"
                      ></vaadin-chart-series>
                      <vaadin-chart-series title="Data Hub" values="[40,41,42,44,45,47,49,50,53]"></vaadin-chart-series>
                    </vaadin-chart>

                    <table>
                      <tr>
                        <th>Module</th>
                        <th>Active Users</th>
                        <th>Usage</th>
                        <th>Tier</th>
                      </tr>
                      <tr>
                        <td>Automation Engine</td>
                        <td>75,200</td>
                        <td><span class="aura-badge aura-accent-green">+4.3%</span></td>
                        <td>Premium</td>
                      </tr>
                      <tr>
                        <td>Data Hub</td>
                        <td>53,100</td>
                        <td><span class="aura-badge aura-accent-green">+1.7%</span></td>
                        <td>Standard</td>
                      </tr>
                    </table>
                  </vaadin-dashboard-widget>

                  <vaadin-dashboard-widget
                    widget-title="Portfolio Assets"
                    style="--vaadin-dashboard-widget-colspan: var(--vaadin-dashboard-col-max-count); --vaadin-grid-cell-background-color: transparent; --vaadin-grid-row-background-color: transparent; --vaadin-grid-background: transparent;"
                  >
                    <vaadin-horizontal-layout slot="header-content" theme="spacing">
                      <vaadin-text-field placeholder="Search..." clear-button-visible theme="small">
                        <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
                      </vaadin-text-field>
                      <vaadin-button theme="small">
                        <vaadin-icon icon="vaadin:plus" slot="prefix"></vaadin-icon>
                        Add Asset
                      </vaadin-button>
                    </vaadin-horizontal-layout>

                    <vaadin-grid theme="no-border" all-rows-visible>
                      <vaadin-grid-column path="symbol" header="Symbol"></vaadin-grid-column>
                      <vaadin-grid-column path="company" header="Company Name" flex-grow="10"></vaadin-grid-column>
                      <vaadin-grid-column path="price" header="Price"></vaadin-grid-column>
                      <vaadin-grid-column path="change" header="Change" text-align="end"></vaadin-grid-column>
                      <vaadin-grid-column path="changePercent" header="Change %" text-align="end"></vaadin-grid-column>
                      <vaadin-grid-column path="volume" header="Volume" text-align="end"></vaadin-grid-column>
                      <vaadin-grid-column path="marketCap" header="Market Cap" text-align="end"></vaadin-grid-column>
                    </vaadin-grid>
                  </vaadin-dashboard-widget>
                </vaadin-dashboard-layout>
              </vaadin-scroller>
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
