import '@vaadin/badge';
import '@vaadin/grid/all-imports';
import '@vaadin/horizontal-layout';
import '@vaadin/icon';
import '@vaadin/master-detail-layout';
import '@vaadin/scroller';
import '@vaadin/tabs';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-row.js';
import { html, render } from 'lit';

const productCategories = [
  { name: 'Electronics', icon: 'layers', minPrice: 159, maxPrice: 1499 },
  { name: 'Office', icon: 'file-text', minPrice: 19, maxPrice: 429 },
  { name: 'Apparel', icon: 'shuffle', minPrice: 25, maxPrice: 189 },
  { name: 'Home', icon: 'home', minPrice: 35, maxPrice: 699 },
  { name: 'Sports', icon: 'chart-column-big', minPrice: 49, maxPrice: 539 },
];

const productDescriptors = ['Pulse', 'Summit', 'Apex', 'Nova', 'Atlas', 'Echo', 'Orion', 'Vertex'];
const productTypes = [
  'Starter Kit',
  'Travel Pack',
  'Docking Hub',
  'Smart Lamp',
  'Desk Mount',
  'Training Set',
  'Core Bundle',
  'Pro Module',
];
const productBrands = ['Northline', 'Keystone', 'Blue Harbor', 'Elevate', 'Crafted Co.', 'Peak Labs'];

const integerFormatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const statusToBadgeColor = {
  Active: 'green',
  'Low stock': 'orange',
  Discontinued: 'red',
};

const generateItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    ...(() => {
      const category = productCategories[i % productCategories.length];
      const descriptor = productDescriptors[i % productDescriptors.length];
      const type = productTypes[(i * 3) % productTypes.length];
      const inventory = (i * 17 + 11) % 180;
      const isDiscontinued = i % 17 === 0;
      const status = isDiscontinued ? 'Discontinued' : inventory < 20 ? 'Low stock' : 'Active';
      const unitPrice = Number(
        (
          category.minPrice +
          ((i * 29) % (category.maxPrice - category.minPrice + 1)) +
          ((i % 5) * 0.25 + 0.99)
        ).toFixed(2),
      );
      const marginPct = Number((0.11 + ((i * 7) % 23) / 100).toFixed(3));
      const rating = Number((3.2 + ((i * 13) % 18) / 10).toFixed(1));
      const updatedAt = new Date(Date.UTC(2026, 0, 2 + ((i * 3) % 95))).toISOString();

      return {
        productId: i + 1,
        productName: `${descriptor} ${type} ${100 + (i % 900)}`,
        category: category.name,
        categoryIcon: category.icon,
        sku: `${category.name.slice(0, 3).toUpperCase()}-${String(i + 1001).padStart(5, '0')}`,
        brand: productBrands[(i * 5) % productBrands.length],
        status,
        inventory,
        unitPrice,
        marginPct,
        rating,
        updatedAt,
      };
    })(),
  }));
};

const updateDetailView = (detailView, item) => {
  const detailTitle = detailView.querySelector('#detail-title');
  const detailIcon = detailView.querySelector('#detail-product-icon');
  const statusBadge = detailView.querySelector('#detail-status-badge');
  const stockBadge = detailView.querySelector('#detail-stock-badge');

  detailTitle.textContent = item.productName;
  detailIcon.setAttribute('src', `./assets/lucide-icons/${item.categoryIcon}.svg`);

  statusBadge.className = `aura-accent-${statusToBadgeColor[item.status] ?? 'neutral'}`;
  statusBadge.textContent = item.status;

  stockBadge.className = `aura-accent-${item.inventory < 20 ? 'orange' : 'green'}`;
  stockBadge.textContent = item.inventory < 20 ? 'Reorder soon' : 'In stock';

  detailView.querySelector('#detail-field-product-id').value = String(item.productId);
  detailView.querySelector('#detail-field-category').value = item.category;
  detailView.querySelector('#detail-field-brand').value = item.brand;
  detailView.querySelector('#detail-field-sku').value = item.sku;
  detailView.querySelector('#detail-field-inventory').value = integerFormatter.format(item.inventory);
  detailView.querySelector('#detail-field-unit-price').value = currencyFormatter.format(item.unitPrice);
  detailView.querySelector('#detail-field-margin').value = percentFormatter.format(item.marginPct);
  detailView.querySelector('#detail-field-rating').value = `${item.rating.toFixed(1)} / 5.0`;
  detailView.querySelector('#detail-field-updated').value = dateFormatter.format(new Date(item.updatedAt));
};

function initView(view) {
  const grid = view.querySelector('vaadin-grid');

  const mdl = grid.closest('vaadin-master-detail-layout');
  grid.items = generateItems(100);

  const productColumn = grid.querySelector('vaadin-grid-sort-column[path="productName"]');
  const statusColumn = grid.querySelector('vaadin-grid-sort-column[path="status"]');
  const inventoryColumn = grid.querySelector('vaadin-grid-sort-column[path="inventory"]');
  const unitPriceColumn = grid.querySelector('vaadin-grid-sort-column[path="unitPrice"]');
  const marginColumn = grid.querySelector('vaadin-grid-sort-column[path="marginPct"]');
  const ratingColumn = grid.querySelector('vaadin-grid-sort-column[path="rating"]');
  const updatedColumn = grid.querySelector('vaadin-grid-sort-column[path="updatedAt"]');

  productColumn.renderer = (root, _, model) => {
    root.innerHTML = `
      <vaadin-horizontal-layout theme="spacing" style="align-items: center">
        <vaadin-icon
          src="./assets/lucide-icons/${model.item.categoryIcon}.svg"
          style="color: var(--aura-accent-text-color);"
        ></vaadin-icon>
        <div>
          <strong>
            ${model.item.productName}
          </strong>
          <div style="font-size: var(--aura-font-size-s); color: var(--vaadin-text-color-secondary);">
            ${model.item.sku} • ${model.item.brand}
          </div>
        </div>
      </vaadin-horizontal-layout>
    `;
  };

  statusColumn.renderer = (root, _, model) => {
    root.innerHTML = `<vaadin-badge class="aura-accent-${statusToBadgeColor[model.item.status] ?? 'neutral'}">${model.item.status}</vaadin-badge>`;
  };

  inventoryColumn.renderer = (root, _, model) => {
    root.innerHTML = `<span style="font-variant-numeric: tabular-nums;">${integerFormatter.format(model.item.inventory)}</span>`;
  };

  unitPriceColumn.renderer = (root, _, model) => {
    root.innerHTML = `<span style="font-variant-numeric: tabular-nums;">${currencyFormatter.format(model.item.unitPrice)}</span>`;
  };

  marginColumn.renderer = (root, _, model) => {
    root.innerHTML = `<span style="font-variant-numeric: tabular-nums;">${percentFormatter.format(model.item.marginPct)}</span>`;
  };

  ratingColumn.renderer = (root, _, model) => {
    root.innerHTML = `<span style="font-variant-numeric: tabular-nums;">${model.item.rating.toFixed(1)}</span>`;
  };

  updatedColumn.renderer = (root, _, model) => {
    root.textContent = dateFormatter.format(new Date(model.item.updatedAt));
  };

  const detailView = view.querySelector('#form-view').content.firstElementChild.cloneNode(true);
  detailView.addEventListener('click', (e) => {
    if (e.target.closest('vaadin-button')) {
      grid.activeItem = null;
    }
  });

  grid.addEventListener('active-item-changed', (e) => {
    const item = e.detail.value;
    if (item) {
      updateDetailView(detailView, item);
      mdl._setDetail(detailView);
    } else {
      mdl._setDetail(null);
    }
    // TODO: cell part name generator isn't triggered when the active item changes.
    // This triggers the cell part generator.
    grid.generateCellPartNames();
  });

  grid.cellPartNameGenerator = (_, model) => {
    let parts = 'nav-item';
    if (model.item === grid.activeItem) {
      parts += ' active-nav-item';
    }
    return parts;
  };

  mdl.addEventListener('backdrop-click', () => {
    grid.activeItem = null;
  });
}

customElements.define(
  'grid-mdl-view',
  class extends HTMLElement {
    connectedCallback() {
      if (!this._ready) {
        render(
          html`
            <style>
              grid-mdl-view {
                display: block;
                height: 100%;
              }
            </style>
            <vaadin-master-detail-layout
              class="aura-surface-solid"
              detail-size="25rem"
              overlay-containment="viewport"
              expand="master"
            >
              <div class="aura-view">
                <header>
                  <vaadin-drawer-toggle theme="tertiary"></vaadin-drawer-toggle>
                  <h1>Products</h1>
                  <vaadin-text-field aria-label="Search" placeholder="Search…">
                    <vaadin-icon icon="vaadin:search" slot="prefix"></vaadin-icon>
                  </vaadin-text-field>
                </header>
                <vaadin-grid multi-sort column-reordering-allowed theme="no-border inset-columns">
                  <vaadin-grid-selection-column frozen></vaadin-grid-selection-column>

                  <vaadin-grid-sort-column
                    path="productName"
                    header="Product"
                    resizable
                    frozen
                    auto-width
                  ></vaadin-grid-sort-column>
                  <vaadin-grid-sort-column path="category" header="Category" resizable></vaadin-grid-sort-column>
                  <vaadin-grid-sort-column path="status" header="Status" auto-width></vaadin-grid-sort-column>
                  <vaadin-grid-sort-column
                    path="inventory"
                    header="Inventory"
                    resizable
                    text-align="end"
                  ></vaadin-grid-sort-column>
                  <vaadin-grid-sort-column
                    path="unitPrice"
                    header="Unit Price"
                    resizable
                    text-align="end"
                  ></vaadin-grid-sort-column>
                  <vaadin-grid-sort-column
                    path="marginPct"
                    header="Margin"
                    resizable
                    text-align="end"
                  ></vaadin-grid-sort-column>
                  <vaadin-grid-sort-column
                    path="rating"
                    header="Rating"
                    resizable
                    text-align="end"
                  ></vaadin-grid-sort-column>
                  <vaadin-grid-sort-column path="updatedAt" header="Last Updated" resizable></vaadin-grid-sort-column>

                  <span slot="empty-state">No items</span>
                </vaadin-grid>
              </div>
            </vaadin-master-detail-layout>
            <template id="form-view">
              <div class="aura-view">
                <header>
                  <vaadin-horizontal-layout theme="spacing wrap" style="align-items: center; flex: 1;">
                    <vaadin-icon id="detail-product-icon" style="color: var(--aura-accent-text-color);"></vaadin-icon>
                    <h3 id="detail-title">Product details</h3>
                    <div slot="end">
                      <vaadin-badge id="detail-stock-badge" slot="end"></vaadin-badge>
                      <vaadin-badge id="detail-status-badge" slot="end"></vaadin-badge>
                    </div>
                  </vaadin-horizontal-layout>
                  <vaadin-button theme="tertiary" style="color: var(--vaadin-text-color-secondary)">
                    <vaadin-icon icon="vaadin:close" style="--vaadin-icon-visual-size: 60%"></vaadin-icon>
                  </vaadin-button>
                </header>
                <vaadin-scroller theme="overflow-indicators">
                  <vaadin-vertical-layout
                    theme="spacing"
                    style="gap: var(--vaadin-gap-l); padding-bottom: var(--vaadin-padding-l);"
                  >
                    <vaadin-form-layout auto-responsive max-cols="2" expand-columns expand-fields>
                      <vaadin-form-row>
                        <vaadin-text-field id="detail-field-product-id" label="Product ID" readonly></vaadin-text-field>
                        <vaadin-text-field id="detail-field-sku" label="SKU" readonly></vaadin-text-field>
                        <vaadin-text-field id="detail-field-brand" label="Brand" readonly></vaadin-text-field>
                        <vaadin-text-field id="detail-field-inventory" label="Inventory" readonly></vaadin-text-field>
                      </vaadin-form-row>
                      <vaadin-form-row>
                        <vaadin-text-field id="detail-field-unit-price" label="Unit Price" readonly></vaadin-text-field>
                        <vaadin-text-field id="detail-field-margin" label="Margin" readonly></vaadin-text-field>
                      </vaadin-form-row>
                      <vaadin-form-row>
                        <vaadin-text-field id="detail-field-category" label="Category" readonly></vaadin-text-field>
                        <vaadin-text-field id="detail-field-rating" label="Rating" readonly></vaadin-text-field>
                      </vaadin-form-row>
                      <vaadin-text-field
                        id="detail-field-updated"
                        label="Last Updated"
                        readonly
                        colspan="2"
                      ></vaadin-text-field>
                    </vaadin-form-layout>
                  </vaadin-vertical-layout>
                </vaadin-scroller>
                <footer>
                  <vaadin-button theme="primary">Edit Product</vaadin-button>
                  <vaadin-button>Close</vaadin-button>
                </footer>
              </div>
            </template>
          `,
          this,
        );
        initView(this);
        this._ready = true;
      }
    }
  },
);
