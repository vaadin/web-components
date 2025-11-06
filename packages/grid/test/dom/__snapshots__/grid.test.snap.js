/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-grid basic host default"] = 
`<vaadin-grid style="touch-action: none;">
  <vaadin-grid-column path="name.first">
  </vaadin-grid-column>
  <vaadin-grid-column path="name.last">
  </vaadin-grid-column>
  <vaadin-grid-cell-content slot="vaadin-grid-cell-content-0">
    First
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-cell-content-1">
    Last
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-cell-content-2">
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-cell-content-3">
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-cell-content-4">
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-cell-content-5">
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-cell-content-6">
    Laura
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-cell-content-7">
    Arnaud
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-cell-content-8">
    Fabien
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-cell-content-9">
    Le gall
  </vaadin-grid-cell-content>
</vaadin-grid>
`;
/* end snapshot vaadin-grid basic host default */

snapshots["vaadin-grid basic shadow default"] = 
`<div
  id="scroller"
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="3"
    has-header=""
    id="table"
    role="treegrid"
    tabindex="0"
  >
    <caption
      id="sizer"
      part="row"
    >
    </caption>
    <tbody>
      <tr>
        <td
          first-column=""
          id="vaadin-grid-cell-4"
          part="cell body-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-4">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-5"
          last-column=""
          part="cell body-cell last-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-5">
          </slot>
        </td>
      </tr>
    </tbody>
    <thead
      id="header"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="1"
        part="row header-row first-header-row last-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-0"
          part="cell header-cell first-column-cell first-header-row-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-0">
          </slot>
        </th>
        <th
          id="vaadin-grid-cell-1"
          last-column=""
          part="cell header-cell last-column-cell first-header-row-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-1">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 71px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        even=""
        first=""
        part="row body-row first-row even-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(0px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-6"
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-6">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-7"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-7">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        last=""
        odd=""
        part="row body-row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(36px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-8"
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-8">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-9"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-9">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          id="emptystatecell"
          part="empty-state"
          tabindex="0"
        >
          <slot
            id="emptystateslot"
            name="empty-state"
          >
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        hidden=""
        part="row footer-row first-footer-row last-footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-2"
          part="cell footer-cell first-column-cell first-footer-row-cell last-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-2">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-3"
          last-column=""
          part="cell footer-cell last-column-cell first-footer-row-cell last-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-3">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div part="reorder-ghost">
  </div>
</div>
<slot name="tooltip">
</slot>
<div
  id="focusexit"
  tabindex="0"
>
</div>
`;
/* end snapshot vaadin-grid basic shadow default */

snapshots["vaadin-grid basic shadow selected"] = 
`<div
  id="scroller"
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="3"
    has-header=""
    id="table"
    role="treegrid"
    tabindex="0"
  >
    <caption
      id="sizer"
      part="row"
    >
    </caption>
    <tbody>
      <tr>
        <td
          first-column=""
          id="vaadin-grid-cell-4"
          part="cell body-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-4">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-5"
          last-column=""
          part="cell body-cell last-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-5">
          </slot>
        </td>
      </tr>
    </tbody>
    <thead
      id="header"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="1"
        part="row header-row first-header-row last-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-0"
          part="cell header-cell first-column-cell first-header-row-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-0">
          </slot>
        </th>
        <th
          id="vaadin-grid-cell-1"
          last-column=""
          part="cell header-cell last-column-cell first-header-row-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-1">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 71px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="true"
        drag-disabled=""
        drop-disabled=""
        even=""
        first=""
        part="row body-row first-row even-row drag-disabled-row drop-disabled-row selected-row"
        role="row"
        selected=""
        style="position: absolute; transform: translateY(0px);"
        tabindex="-1"
      >
        <td
          aria-selected="true"
          first-column=""
          id="vaadin-grid-cell-6"
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell selected-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-6">
          </slot>
        </td>
        <td
          aria-selected="true"
          id="vaadin-grid-cell-7"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell selected-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-7">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        last=""
        odd=""
        part="row body-row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(36px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-8"
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-8">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-9"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-9">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          id="emptystatecell"
          part="empty-state"
          tabindex="0"
        >
          <slot
            id="emptystateslot"
            name="empty-state"
          >
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        hidden=""
        part="row footer-row first-footer-row last-footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-2"
          part="cell footer-cell first-column-cell first-footer-row-cell last-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-2">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-3"
          last-column=""
          part="cell footer-cell last-column-cell first-footer-row-cell last-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-3">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div part="reorder-ghost">
  </div>
</div>
<slot name="tooltip">
</slot>
<div
  id="focusexit"
  tabindex="0"
>
</div>
`;
/* end snapshot vaadin-grid basic shadow selected */

snapshots["vaadin-grid basic shadow details opened"] = 
`<div
  id="scroller"
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="3"
    has-header=""
    id="table"
    role="treegrid"
    tabindex="0"
  >
    <caption
      id="sizer"
      part="row"
    >
    </caption>
    <tbody>
      <tr>
        <td
          first-column=""
          id="vaadin-grid-cell-4"
          part="cell body-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-4">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-5"
          last-column=""
          part="cell body-cell last-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-5">
          </slot>
        </td>
      </tr>
    </tbody>
    <thead
      id="header"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="1"
        part="row header-row first-header-row last-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-0"
          part="cell header-cell first-column-cell first-header-row-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-0">
          </slot>
        </th>
        <th
          id="vaadin-grid-cell-1"
          last-column=""
          part="cell header-cell last-column-cell first-header-row-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-1">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 71px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        even=""
        first=""
        part="row body-row first-row even-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(0px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-6"
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-6">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-7"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-7">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        last=""
        odd=""
        part="row body-row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(36px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-8"
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-8">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-9"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-9">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          id="emptystatecell"
          part="empty-state"
          tabindex="0"
        >
          <slot
            id="emptystateslot"
            name="empty-state"
          >
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        hidden=""
        part="row footer-row first-footer-row last-footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-2"
          part="cell footer-cell first-column-cell first-footer-row-cell last-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-2">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-3"
          last-column=""
          part="cell footer-cell last-column-cell first-footer-row-cell last-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-3">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div part="reorder-ghost">
  </div>
</div>
<slot name="tooltip">
</slot>
<div
  id="focusexit"
  tabindex="0"
>
</div>
`;
/* end snapshot vaadin-grid basic shadow details opened */

snapshots["vaadin-grid basic shadow hidden column"] = 
`<div
  id="scroller"
  scrolling=""
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="3"
    has-header=""
    id="table"
    role="treegrid"
    tabindex="0"
  >
    <caption
      id="sizer"
      part="row"
    >
    </caption>
    <tbody>
      <tr>
        <td
          first-column=""
          id="vaadin-grid-cell-5"
          last-column=""
          part="cell body-cell first-column-cell last-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-5">
          </slot>
        </td>
      </tr>
    </tbody>
    <thead
      id="header"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="1"
        part="row header-row first-header-row last-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-1"
          last-column=""
          part="cell header-cell last-column-cell first-header-row-cell last-header-row-cell first-column-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-1">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 71px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        even=""
        first=""
        part="row body-row first-row even-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(0px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-7"
          last-column=""
          part="cell body-cell first-column-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-7">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        last=""
        odd=""
        part="row body-row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(36px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-9"
          last-column=""
          part="cell body-cell first-column-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-9">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          id="emptystatecell"
          part="empty-state"
          tabindex="0"
        >
          <slot
            id="emptystateslot"
            name="empty-state"
          >
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        hidden=""
        part="row footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-3"
          last-column=""
          part="cell footer-cell last-column-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-3">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div part="reorder-ghost">
  </div>
</div>
<slot name="tooltip">
</slot>
<div
  id="focusexit"
  tabindex="0"
>
</div>
`;
/* end snapshot vaadin-grid basic shadow hidden column */

snapshots["vaadin-grid basic shadow hidden column selected"] = 
`<div
  id="scroller"
  scrolling=""
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="3"
    has-header=""
    id="table"
    role="treegrid"
    tabindex="0"
  >
    <caption
      id="sizer"
      part="row"
    >
    </caption>
    <tbody>
      <tr>
        <td
          first-column=""
          id="vaadin-grid-cell-5"
          last-column=""
          part="cell body-cell first-column-cell last-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-5">
          </slot>
        </td>
      </tr>
    </tbody>
    <thead
      id="header"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="1"
        part="row header-row first-header-row last-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-1"
          last-column=""
          part="cell header-cell last-column-cell first-header-row-cell last-header-row-cell first-column-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-1">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 71px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="true"
        drag-disabled=""
        drop-disabled=""
        even=""
        first=""
        part="row body-row first-row even-row drag-disabled-row drop-disabled-row selected-row"
        role="row"
        selected=""
        style="position: absolute; transform: translateY(0px);"
        tabindex="-1"
      >
        <td
          aria-selected="true"
          first-column=""
          id="vaadin-grid-cell-7"
          last-column=""
          part="cell body-cell first-column-cell last-column-cell first-row-cell even-row-cell selected-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-7">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        last=""
        odd=""
        part="row body-row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(36px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-9"
          last-column=""
          part="cell body-cell first-column-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-9">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          id="emptystatecell"
          part="empty-state"
          tabindex="0"
        >
          <slot
            id="emptystateslot"
            name="empty-state"
          >
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        hidden=""
        part="row footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-3"
          last-column=""
          part="cell footer-cell last-column-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-3">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div part="reorder-ghost">
  </div>
</div>
<slot name="tooltip">
</slot>
<div
  id="focusexit"
  tabindex="0"
>
</div>
`;
/* end snapshot vaadin-grid basic shadow hidden column selected */

snapshots["vaadin-grid basic shadow with footer"] = 
`<div
  id="scroller"
  scrolling=""
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="4"
    has-footer=""
    has-header=""
    id="table"
    role="treegrid"
    tabindex="0"
  >
    <caption
      id="sizer"
      part="row"
    >
    </caption>
    <tbody>
      <tr>
        <td
          first-column=""
          id="vaadin-grid-cell-4"
          part="cell body-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-4">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-5"
          last-column=""
          part="cell body-cell last-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-5">
          </slot>
        </td>
      </tr>
    </tbody>
    <thead
      id="header"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="1"
        part="row header-row first-header-row last-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-0"
          part="cell header-cell first-column-cell first-header-row-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-0">
          </slot>
        </th>
        <th
          id="vaadin-grid-cell-1"
          last-column=""
          part="cell header-cell last-column-cell first-header-row-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-1">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 71px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        even=""
        first=""
        part="row body-row first-row even-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(0px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-6"
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-6">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-7"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-7">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        last=""
        odd=""
        part="row body-row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(36px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-8"
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-8">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-9"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-9">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          id="emptystatecell"
          part="empty-state"
          tabindex="0"
        >
          <slot
            id="emptystateslot"
            name="empty-state"
          >
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        part="row footer-row first-footer-row last-footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-2"
          part="cell footer-cell first-column-cell first-footer-row-cell last-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-2">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-3"
          last-column=""
          part="cell footer-cell last-column-cell first-footer-row-cell last-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 20000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-3">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div part="reorder-ghost">
  </div>
</div>
<slot name="tooltip">
</slot>
<div
  id="focusexit"
  tabindex="0"
>
</div>
`;
/* end snapshot vaadin-grid basic shadow with footer */

snapshots["vaadin-grid column groups default"] = 
`<div
  id="scroller"
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="3"
    has-header=""
    id="table"
    role="treegrid"
    tabindex="0"
  >
    <caption
      id="sizer"
      part="row"
    >
    </caption>
    <tbody>
      <tr>
        <td
          first-column=""
          id="vaadin-grid-cell-6"
          part="cell body-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-6">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-7"
          last-column=""
          part="cell body-cell last-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-7">
          </slot>
        </td>
      </tr>
    </tbody>
    <thead
      id="header"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="1"
        hidden=""
        part="row header-row first-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-0"
          last-column=""
          part="cell header-cell first-column-cell last-column-cell first-header-row-cell"
          role="columnheader"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-0">
          </slot>
        </th>
      </tr>
      <tr
        aria-rowindex="2"
        part="row header-row last-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-1"
          part="cell header-cell first-column-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-1">
          </slot>
        </th>
        <th
          id="vaadin-grid-cell-2"
          last-column=""
          part="cell header-cell last-column-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-2">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 71px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        even=""
        first=""
        part="row body-row first-row even-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(0px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-8"
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-8">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-9"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-9">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        last=""
        odd=""
        part="row body-row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(36px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-10"
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-10">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-11"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-11">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          id="emptystatecell"
          part="empty-state"
          tabindex="0"
        >
          <slot
            id="emptystateslot"
            name="empty-state"
          >
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        hidden=""
        part="row footer-row first-footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-3"
          part="cell footer-cell first-column-cell first-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-3">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-4"
          last-column=""
          part="cell footer-cell last-column-cell first-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-4">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="5"
        hidden=""
        part="row footer-row last-footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-5"
          last-column=""
          part="cell footer-cell first-column-cell last-column-cell last-footer-row-cell"
          role="gridcell"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-5">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div part="reorder-ghost">
  </div>
</div>
<slot name="tooltip">
</slot>
<div
  id="focusexit"
  tabindex="0"
>
</div>
`;
/* end snapshot vaadin-grid column groups default */

snapshots["vaadin-grid column groups with footer"] = 
`<div
  id="scroller"
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="3"
    has-header=""
    id="table"
    role="treegrid"
    tabindex="0"
  >
    <caption
      id="sizer"
      part="row"
    >
    </caption>
    <tbody>
      <tr>
        <td
          first-column=""
          id="vaadin-grid-cell-6"
          part="cell body-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-6">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-7"
          last-column=""
          part="cell body-cell last-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-7">
          </slot>
        </td>
      </tr>
    </tbody>
    <thead
      id="header"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="1"
        hidden=""
        part="row header-row first-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-0"
          last-column=""
          part="cell header-cell first-column-cell last-column-cell first-header-row-cell"
          role="columnheader"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-0">
          </slot>
        </th>
      </tr>
      <tr
        aria-rowindex="2"
        part="row header-row last-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-1"
          part="cell header-cell first-column-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-1">
          </slot>
        </th>
        <th
          id="vaadin-grid-cell-2"
          last-column=""
          part="cell header-cell last-column-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-2">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 71px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        even=""
        first=""
        part="row body-row first-row even-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(0px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-8"
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-8">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-9"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-9">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        last=""
        odd=""
        part="row body-row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(36px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-10"
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-10">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-11"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-11">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          id="emptystatecell"
          part="empty-state"
          tabindex="0"
        >
          <slot
            id="emptystateslot"
            name="empty-state"
          >
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        hidden=""
        part="row footer-row first-footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-3"
          part="cell footer-cell first-column-cell first-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-3">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-4"
          last-column=""
          part="cell footer-cell last-column-cell first-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-4">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="5"
        hidden=""
        part="row footer-row last-footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-5"
          last-column=""
          part="cell footer-cell first-column-cell last-column-cell last-footer-row-cell"
          role="gridcell"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-5">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div part="reorder-ghost">
  </div>
</div>
<slot name="tooltip">
</slot>
<div
  id="focusexit"
  tabindex="0"
>
</div>
`;
/* end snapshot vaadin-grid column groups with footer */

snapshots["vaadin-grid column groups with header"] = 
`<div
  id="scroller"
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="3"
    has-header=""
    id="table"
    role="treegrid"
    tabindex="0"
  >
    <caption
      id="sizer"
      part="row"
    >
    </caption>
    <tbody>
      <tr>
        <td
          first-column=""
          id="vaadin-grid-cell-6"
          part="cell body-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-6">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-7"
          last-column=""
          part="cell body-cell last-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-7">
          </slot>
        </td>
      </tr>
    </tbody>
    <thead
      id="header"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="1"
        hidden=""
        part="row header-row first-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-0"
          last-column=""
          part="cell header-cell first-column-cell last-column-cell first-header-row-cell"
          role="columnheader"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-0">
          </slot>
        </th>
      </tr>
      <tr
        aria-rowindex="2"
        part="row header-row last-header-row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-1"
          part="cell header-cell first-column-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-1">
          </slot>
        </th>
        <th
          id="vaadin-grid-cell-2"
          last-column=""
          part="cell header-cell last-column-cell last-header-row-cell"
          role="columnheader"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-2">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 71px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        even=""
        first=""
        part="row body-row first-row even-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(0px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-8"
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-8">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-9"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-9">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        drag-disabled=""
        drop-disabled=""
        last=""
        odd=""
        part="row body-row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(36px);"
        tabindex="-1"
      >
        <td
          aria-selected="false"
          first-column=""
          id="vaadin-grid-cell-10"
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-10">
          </slot>
        </td>
        <td
          aria-selected="false"
          id="vaadin-grid-cell-11"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-11">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          id="emptystatecell"
          part="empty-state"
          tabindex="0"
        >
          <slot
            id="emptystateslot"
            name="empty-state"
          >
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        hidden=""
        part="row footer-row first-footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-3"
          part="cell footer-cell first-column-cell first-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-cell-content-3">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-4"
          last-column=""
          part="cell footer-cell last-column-cell first-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-4">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="5"
        hidden=""
        part="row footer-row last-footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-5"
          last-column=""
          part="cell footer-cell first-column-cell last-column-cell last-footer-row-cell"
          role="gridcell"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-5">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div part="reorder-ghost">
  </div>
</div>
<slot name="tooltip">
</slot>
<div
  id="focusexit"
  tabindex="0"
>
</div>
`;
/* end snapshot vaadin-grid column groups with header */

