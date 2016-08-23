# Row Details

In order to use row details, a template must be defined. The row details template has to be set as a direct child of `<vaadin-grid>` and it must have `is="row-details"` attribute. The same variables can be used inside the template as in cell templates, namely `index`, `item`, `selected` and `expanded`.

```html
<vaadin-grid>
  <template is="row-details">
    These are the details for [[item.value]]!
  </template>
  <vaadin-grid-column>
     ...
  </vaadin-grid-column>
</vaadin-grid>
```

### Expanding Rows

After a template has been set, details can be expanded and collapsed in various ways.

API can be used to expand and collapse items using reference to the item object:

```js
grid.expandItem(item1);
grid.collapseItem(item2);
```

### Accessing Expanded Items

After details have been expanded for a row, you can use `expandedItems` to access them.

```html
<vaadin-grid expanded-items="{{expandedItems}}">
  <template is="row-details">
    These are the details for [[item.value]]!
  </template>
  <vaadin-grid-column>
     ...
  </vaadin-grid-column>
</vaadin-grid>

<ul>Currently Expanded:
  <template is="dom-repeat" items="[[expandedItems]]">
    <li>[[item.value]</li>
  </template>
</ul>
```

> Similarily to `selectedItems`, `expandedItems` will be cleared when the data source is updated.

`expandedItems` can also be modified to expand or collapse row details. This is especially handy when you want to close all expanded details:

```js
grid.expandedItems = []; //closes all expanded details.
grid.push('expandedItems', item); //expands row details for 'item'
```

> When modifying `expandedItems`, remember to use the array mutation methods from Polymer.Base

### Expanding and Collapsing Items on Click

You can listen to an event `cell-clicked` which is fired when a user clicks on a *non-focusable* element
inside a cell. Event details contain a reference to the instance model of the cell which can be used
to access the item.

```html
<vaadin-grid id="grid" on-cell-clicked="_onCellClicked">
  <template is="row-details">
    These are the details for [[item.value]]!
  </template>
  <vaadin-grid-column>
     ...
  </vaadin-grid-column>
</vaadin-grid>
<script>
  ...
    _onCellClicked: function(e) {
      var item = e.detail.model.item;

      if (this.$.grid.expandedItems.indexOf(item) < -1) {
        this.$.grid.expandItem(item);
      } else {
        this.$.grid.collapseItem(item);
      }
    }
  ...
</script>
```

### Expanding and Collapsing Items using Two-Way binding

A variable `expanded` is available inside the row detail template. It is a `Boolean` variable which can be used two-way to determine if the details are expanded for this item.

```html
<vaadin-grid>
  <template is="row-details">
    These are the details for [[item.value]]!
  </template>
  <vaadin-grid-column>
    ...
  </vaadin-grid-column>
  <vaadin-grid-column width="30px">
    <template>
      <paper-checkbox checked="{{expanded}}">Details</paper-checkbox>
    </template>
  </vaadin-grid-column>
</vaadin-grid>
```

## Styling Row Details

Same way as with other templates, their contents can be fully styled by placing CSS rules in the same scope with `<vaadin-grid>`:

```html
<style>
  vaadin-grid .details {
    background-color: red;
  }
</style>
<vaadin-grid>
  <template is="row-details">
    <div class="details">
      These are the details for [[item.value]]!
    </div>
  </template>
  <vaadin-grid-column>
     ...
  </vaadin-grid-column>
</vaadin-grid>
```
