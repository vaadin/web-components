
# &lt;vaadin-grid&gt;

[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-grid.svg)](https://vaadin.com/directory/component/vaadinvaadin-grid)

[&lt;vaadin-grid&gt;](https://vaadin.com/components/vaadin-grid) is a free, high quality data grid / data table Web Component, part of the [Vaadin components](https://vaadin.com/components).


[<img src="https://raw.githubusercontent.com/vaadin/vaadin-grid/master/screenshot.png" alt="Screenshot of vaadin-grid, using the default Lumo theme">](https://vaadin.com/components/vaadin-grid)

## Example Usage
```html
<dom-bind>
  <template>
    <iron-ajax auto url="https://demo.vaadin.com/demo-data/1.0/people?count=20" handle-as="json" last-response="{{users}}"></iron-ajax>

    <vaadin-grid theme="row-dividers" items="[[users.result]]" column-reordering-allowed multi-sort>

      <vaadin-grid-selection-column auto-select frozen> </vaadin-grid-selection-column>

      <vaadin-grid-column width="9em">
        <template class="header">
          <vaadin-grid-sorter path="firstName">First Name</vaadin-grid-sorter>
        </template>
        <template>[[item.firstName]]</template>
      </vaadin-grid-column>

      <vaadin-grid-column width="9em">
        <template class="header">
          <vaadin-grid-sorter path="lastName">Last Name</vaadin-grid-sorter>
        </template>
        <template>[[item.lastName]]</template>
      </vaadin-grid-column>

      <vaadin-grid-column width="15em" flex-grow="2">
        <template class="header">
          <vaadin-grid-sorter path="address.street">Address</vaadin-grid-sorter>
        </template>
        <template>[[item.address.street]], [[item.address.city]]</template>
      </vaadin-grid-column>

    </vaadin-grid>
  </template>
</dom-bind>
```
