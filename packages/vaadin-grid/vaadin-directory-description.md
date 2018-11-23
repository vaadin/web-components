
# &lt;vaadin-grid&gt;

[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-grid.svg)](https://vaadin.com/directory/component/vaadinvaadin-grid)

[&lt;vaadin-grid&gt;](https://vaadin.com/components/vaadin-grid) is a free, high quality data grid / data table Web Component, part of the [Vaadin components](https://vaadin.com/components).


[<img src="https://raw.githubusercontent.com/vaadin/vaadin-grid/master/screenshot.png" alt="Screenshot of vaadin-grid, using the default Lumo theme">](https://vaadin.com/components/vaadin-grid)

## Example Usage
```html
<vaadin-grid theme="row-dividers" column-reordering-allowed multi-sort>
  <vaadin-grid-selection-column auto-select frozen></vaadin-grid-selection-column>
  <vaadin-grid-sort-column width="9em" path="firstName"></vaadin-grid-sort-column>
  <vaadin-grid-sort-column width="9em" path="lastName"></vaadin-grid-sort-column>
  <vaadin-grid-column id="addresscolumn" width="15em" flex-grow="2" header="Address"></vaadin-grid-column>
</vaadin-grid>

<script>
  // Customize the "Address" column's renderer
  document.querySelector('#addresscolumn').renderer = (root, grid, rowData) => {
    root.textContent = `${rowData.item.address.street}, ${rowData.item.address.city}`;
  };

  // Populate the grid with data
  const grid = document.querySelector('vaadin-grid');
  fetch('https://demo.vaadin.com/demo-data/1.0/people?count=200')
    .then(res => res.json())
    .then(json => grid.items = json.result);
</script>
```
