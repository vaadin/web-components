/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-form-layout auto-responsive basic host default"] = 
`<vaadin-form-layout
  auto-responsive=""
  style="--_column-width: 13em; --_max-columns: 1;"
>
  <input placeholder="First name">
  <input placeholder="Last name">
  <input placeholder="Email">
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive basic host default */

snapshots["vaadin-form-layout auto-responsive basic host maxColumns < number of columns"] = 
`<vaadin-form-layout
  auto-responsive=""
  style="--_column-width: 13em; --_max-columns: 1;"
>
  <input placeholder="First name">
  <input placeholder="Last name">
  <input placeholder="Email">
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive basic host maxColumns < number of columns */

snapshots["vaadin-form-layout auto-responsive basic host maxColumns > number of columns"] = 
`<vaadin-form-layout
  auto-responsive=""
  auto-rows=""
  style="--_column-width: 13em; --_max-columns: 4;"
>
  <input
    placeholder="First name"
    style="--_grid-colstart: 1;"
  >
  <input placeholder="Last name">
  <input placeholder="Email">
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive basic host maxColumns > number of columns */

snapshots["vaadin-form-layout auto-responsive basic host columnWidth"] = 
`<vaadin-form-layout
  auto-responsive=""
  style="--_column-width: 15em; --_max-columns: 1;"
>
  <input placeholder="First name">
  <input placeholder="Last name">
  <input placeholder="Email">
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive basic host columnWidth */

snapshots["vaadin-form-layout auto-responsive basic host labelsAside"] = 
`<vaadin-form-layout
  auto-responsive=""
  labels-aside=""
  style="--_column-width: 13em; --_max-columns: 1;"
>
  <input placeholder="First name">
  <input placeholder="Last name">
  <input placeholder="Email">
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive basic host labelsAside */

snapshots["vaadin-form-layout auto-responsive basic host expandColumns"] = 
`<vaadin-form-layout
  auto-responsive=""
  expand-columns=""
  style="--_column-width: 13em; --_max-columns: 1;"
>
  <input placeholder="First name">
  <input placeholder="Last name">
  <input placeholder="Email">
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive basic host expandColumns */

snapshots["vaadin-form-layout auto-responsive basic shadow default"] = 
`<div
  id="layout"
  style="--_grid-rendered-column-count: 1;"
>
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive basic shadow default */

snapshots["vaadin-form-layout auto-responsive basic shadow labelsAside in narrow container"] = 
`<div
  id="layout"
  style="--_grid-rendered-column-count: 1;"
>
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive basic shadow labelsAside in narrow container */

snapshots["vaadin-form-layout auto-responsive basic shadow labelsAside in wide container"] = 
`<div
  fits-labels-aside=""
  id="layout"
  style="--_grid-rendered-column-count: 1;"
>
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive basic shadow labelsAside in wide container */

snapshots["vaadin-form-layout auto-responsive autoRows default"] = 
`<vaadin-form-layout
  auto-responsive=""
  auto-rows=""
  style="--_column-width: 13em; --_max-columns: 2;"
>
  <input
    placeholder="First name"
    style="--_grid-colstart: 1;"
  >
  <input placeholder="Last name">
  <br>
  <input
    hidden=""
    placeholder="Address"
  >
  <input
    placeholder="Email"
    style="--_grid-colstart: 1;"
  >
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive autoRows default */

