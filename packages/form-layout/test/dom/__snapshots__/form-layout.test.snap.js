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

snapshots["vaadin-form-layout auto-responsive basic host expandFields"] = 
`<vaadin-form-layout
  auto-responsive=""
  expand-fields=""
  style="--_column-width: 13em; --_max-columns: 1;"
>
  <input placeholder="First name">
  <input placeholder="Last name">
  <input placeholder="Email">
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive basic host expandFields */

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

snapshots["vaadin-form-layout auto-responsive host autoRows default"] = 
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
  <input hidden="">
  <input
    colspan="2"
    placeholder="Address"
    style="--_grid-colstart: 1; --_grid-colspan: 2;"
  >
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive host autoRows default */

snapshots["vaadin-form-layout auto-responsive host autoRows maxColumns < number of columns"] = 
`<vaadin-form-layout
  auto-responsive=""
  auto-rows=""
  style="--_column-width: 13em; --_max-columns: 1;"
>
  <input
    placeholder="First name"
    style="--_grid-colstart: 1;"
  >
  <input placeholder="Last name">
  <br>
  <input hidden="">
  <input
    colspan="2"
    placeholder="Address"
    style="--_grid-colstart: 1; --_grid-colspan: 2;"
  >
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive host autoRows maxColumns < number of columns */

snapshots["vaadin-form-layout auto-responsive host autoRows maxColumns > number of columns"] = 
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
  <input hidden="">
  <input
    colspan="2"
    placeholder="Address"
    style="--_grid-colstart: 1; --_grid-colspan: 2;"
  >
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive host autoRows maxColumns > number of columns */

snapshots["vaadin-form-layout auto-responsive host explicit rows default"] = 
`<vaadin-form-layout
  auto-responsive=""
  style="--_column-width: 13em; --_max-columns: 2;"
>
  <vaadin-form-row>
    <input placeholder="First name">
    <input placeholder="Last name">
  </vaadin-form-row>
  <vaadin-form-row>
    <input hidden="">
    <input
      colspan="2"
      placeholder="Address"
      style="--_grid-colspan: 2;"
    >
  </vaadin-form-row>
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive host explicit rows default */

snapshots["vaadin-form-layout auto-responsive host explicit rows maxColumns < number of columns"] = 
`<vaadin-form-layout
  auto-responsive=""
  style="--_column-width: 13em; --_max-columns: 1;"
>
  <vaadin-form-row>
    <input placeholder="First name">
    <input placeholder="Last name">
  </vaadin-form-row>
  <vaadin-form-row>
    <input hidden="">
    <input
      colspan="2"
      placeholder="Address"
      style="--_grid-colspan: 2;"
    >
  </vaadin-form-row>
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive host explicit rows maxColumns < number of columns */

snapshots["vaadin-form-layout auto-responsive host explicit rows maxColumns > number of columns"] = 
`<vaadin-form-layout
  auto-responsive=""
  style="--_column-width: 13em; --_max-columns: 2;"
>
  <vaadin-form-row>
    <input placeholder="First name">
    <input placeholder="Last name">
  </vaadin-form-row>
  <vaadin-form-row>
    <input hidden="">
    <input
      colspan="2"
      placeholder="Address"
      style="--_grid-colspan: 2;"
    >
  </vaadin-form-row>
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive host explicit rows maxColumns > number of columns */

snapshots["vaadin-form-layout auto-responsive shadow autoRows default"] = 
`<div
  id="layout"
  style="--_grid-rendered-column-count: 2;"
>
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive shadow autoRows default */

snapshots["vaadin-form-layout auto-responsive shadow autoRows maxColumns < number of columns"] = 
`<div
  id="layout"
  style="--_grid-rendered-column-count: 1;"
>
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive shadow autoRows maxColumns < number of columns */

snapshots["vaadin-form-layout auto-responsive shadow autoRows maxColumns > number of columns"] = 
`<div
  id="layout"
  style="--_grid-rendered-column-count: 2;"
>
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive shadow autoRows maxColumns > number of columns */

snapshots["vaadin-form-layout auto-responsive shadow explicit rows default"] = 
`<div
  id="layout"
  style="--_grid-rendered-column-count: 2;"
>
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive shadow explicit rows default */

snapshots["vaadin-form-layout auto-responsive shadow explicit rows maxColumns < number of columns"] = 
`<div
  id="layout"
  style="--_grid-rendered-column-count: 1;"
>
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive shadow explicit rows maxColumns < number of columns */

snapshots["vaadin-form-layout auto-responsive shadow explicit rows maxColumns > number of columns"] = 
`<div
  id="layout"
  style="--_grid-rendered-column-count: 2;"
>
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive shadow explicit rows maxColumns > number of columns */

