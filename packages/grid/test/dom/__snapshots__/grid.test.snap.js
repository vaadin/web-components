/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-grid host default"] = 
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
/* end snapshot vaadin-grid host default */

snapshots["vaadin-grid shadow default"] = 
`<div
  id="scroller"
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="3"
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
        part="row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-0"
          part="cell header-cell first-column-cell last-header-row-cell"
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
          part="cell header-cell last-column-cell last-header-row-cell"
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
        part="row first-row even-row drag-disabled-row drop-disabled-row"
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
        part="row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(35px);"
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
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        hidden=""
        part="row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-2"
          part="cell footer-cell first-column-cell first-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-2">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-3"
          last-column=""
          part="cell footer-cell last-column-cell first-footer-row-cell"
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
/* end snapshot vaadin-grid shadow default */

snapshots["vaadin-grid shadow selected"] = 
`<div
  id="scroller"
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="3"
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
        part="row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-0"
          part="cell header-cell first-column-cell last-header-row-cell"
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
          part="cell header-cell last-column-cell last-header-row-cell"
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
        part="row first-row even-row drag-disabled-row drop-disabled-row"
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
        part="row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(35px);"
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
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        hidden=""
        part="row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-2"
          part="cell footer-cell first-column-cell first-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-2">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-3"
          last-column=""
          part="cell footer-cell last-column-cell first-footer-row-cell"
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
/* end snapshot vaadin-grid shadow selected */

snapshots["vaadin-grid shadow details opened"] = 
`<div
  id="scroller"
  style="touch-action: none;"
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="3"
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
        part="row"
        role="row"
        tabindex="-1"
      >
        <th
          first-column=""
          id="vaadin-grid-cell-0"
          part="cell header-cell first-column-cell last-header-row-cell"
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
          part="cell header-cell last-column-cell last-header-row-cell"
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
        part="row first-row even-row drag-disabled-row drop-disabled-row"
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
        part="row last-row odd-row drag-disabled-row drop-disabled-row"
        role="row"
        style="position: absolute; transform: translateY(35px);"
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
    <tfoot
      id="footer"
      role="rowgroup"
      style="transform: translate(0px, 0px);"
    >
      <tr
        aria-rowindex="4"
        hidden=""
        part="row"
        role="row"
        tabindex="-1"
      >
        <td
          first-column=""
          id="vaadin-grid-cell-2"
          part="cell footer-cell first-column-cell first-footer-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1; order: 10000000;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-cell-content-2">
          </slot>
        </td>
        <td
          id="vaadin-grid-cell-3"
          last-column=""
          part="cell footer-cell last-column-cell first-footer-row-cell"
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
/* end snapshot vaadin-grid shadow details opened */

