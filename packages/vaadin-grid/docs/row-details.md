# Row Details

In order to use row details, a template must be defined. The row details template has to be set as a direct child of `<vaadin-grid>` and it must have `is="row-detail"` attribute. The same variables can be used inside the template as in cell templates, namely `index`, `item` and `selected`. There is also a variable `expanded` available, which we will look into later. Variable `column` is excluded here.

```html
<vaadin-grid>
  <template is="row-detail">
    These are the details for [[item.value]]!
  </template>
  <vaadin-grid-column>
     ...
  </vaadin-grid-column>
</vaadin-grid>
```

### Expanding Rows

After a template has been set, details can be expanded and collapsed in various ways.

API can be used to expand and collapse items using `index`:

```js
grid.expandItem(0); //expands details for item with index 0.
grid.collapseItem(1); //collapses details for item with index 1.
```

> Keep in mind that the `index` refers to the order of *currently visible* items.

Additionally, you can use `attr-for-id` to define a custom property that will be used to match items for expansion:

```js
grid.attrForId = 'key';
grid.expandItem('foo'); //expands details for item with a property 'key' having value 'foo'.
```

### Accessing Expanded Items

After details have been expanded for a row, you can use `expandedItems` to access them.

```html
<vaadin-grid expanded-items="{{expandedItems}}">
  <template is="row-detail">
    These are the details for [[item.value]]!
  </template>
  <vaadin-grid-column>
     ...
  </vaadin-grid-column>
</vaadin-grid>

<ul>Currently Expanded:
  <template is="dom-repeat">
    <li>[[item.value]</li>
  </template>
</ul>
```

> Similarily to `selectedItems`, `expandedItems` will be cleared when the data source is updated, unless `attr-for-id` is defined.

`expandedItems` can also be modified to expand or collapse row details. This is especially handly when you want to close all expanded details:

```js
grid.expandedItems = []; //closes all expanded details.
grid.push('expandedItems', item); //expands row details for 'item'
```

> When modifying `expandedItems`, remember to use the array mutation methods from Polymer.Base

### Expanding and Collapsing Items on Click

When the property `detailsEnabled` is set to `true` rows will expand and collapse when the user
taps on the cells.

```html
<vaadin-grid details-enabled>
  <template is="row-detail">
    These are the details for [[item.value]]!
  </template>
  <vaadin-grid-column>
     ...
  </vaadin-grid-column>
</vaadin-grid>
```

To be more precise, row details will open when the user clicks on a non-focusable element inside a cell.

> Before the details expand, `item-expanding` is fired. Similarily, `item-collapsing` is fired before the details collapse. `e.preventDefault()` can be used to prevent details from expanding or collapsing, which enables customizing the behavior.

### Expanding and Collapsing Items using Two-Way binding

A variable `expanded` is available inside the row detail template. It is a `Boolean` variable which can be used two-way to determine if the details are expanded for this item.

```html
<vaadin-grid>
  <template is="row-detail">
    These are the details for [[item.value]]!
    <paper-checkbox checked="{{expanded}}">Show Details</paper-checkbox>
  </template>
  <vaadin-grid-column>
     ...
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
  <template is="row-detail">
    <div class="details">
      These are the details for [[item.value]]!
    </div>
  </template>
  <vaadin-grid-column>
     ...
  </vaadin-grid-column>
</vaadin-grid>
```
