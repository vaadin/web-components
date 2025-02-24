/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-form-layout auto-responsive basic host default"] =
`<vaadin-form-layout
  auto-responsive=""
  style="--_column-width: 13em; --_max-columns: 10;"
>
  <input placeholder="First name">
  <input placeholder="Last name">
  <input placeholder="Email">
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive basic host default */

snapshots["vaadin-form-layout auto-responsive basic host maxColumns"] =
`<vaadin-form-layout
  auto-responsive=""
  style="--_column-width: 13em; --_max-columns: 3;"
>
  <input placeholder="First name">
  <input placeholder="Last name">
  <input placeholder="Email">
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive basic host maxColumns */

snapshots["vaadin-form-layout auto-responsive basic host columnWidth"] =
`<vaadin-form-layout
  auto-responsive=""
  style="--_column-width: 15em; --_max-columns: 10;"
>
  <input placeholder="First name">
  <input placeholder="Last name">
  <input placeholder="Email">
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive basic host columnWidth */

snapshots["vaadin-form-layout auto-responsive basic shadow default"] =
`<div id="layout">
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive basic shadow default */

snapshots["vaadin-form-layout auto-responsive autoRows default"] =
`<vaadin-form-layout
  auto-responsive=""
  auto-rows=""
  style="--_column-width: 13em; --_max-columns: 10;"
>
  <input placeholder="First name">
  <input placeholder="Last name">
  <br>
  <input
    hidden=""
    placeholder="Address"
  >
  <input
    placeholder="Email"
    style="--_column-start: 1;"
  >
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive autoRows default */

snapshots["vaadin-form-layout auto-responsive basic host labelsAside"] =
`<vaadin-form-layout
  auto-responsive=""
  labels-aside=""
  style="--_column-width: 13em; --_max-columns: 10;"
>
  <input placeholder="First name">
  <input placeholder="Last name">
  <input placeholder="Email">
  <input placeholder="Phone">
</vaadin-form-layout>
`;
/* end snapshot vaadin-form-layout auto-responsive basic host labelsAside */

snapshots["vaadin-form-layout auto-responsive basic shadow labelsAside"] =
`<div
  fits-labels-aside=""
  id="layout"
>
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive basic shadow labelsAside */

snapshots["vaadin-form-layout auto-responsive basic shadow labelsAside with too narrow layout"] =
`<div id="layout">
  <slot id="slot">
  </slot>
</div>
`;
/* end snapshot vaadin-form-layout auto-responsive basic shadow labelsAside with too narrow layout */

