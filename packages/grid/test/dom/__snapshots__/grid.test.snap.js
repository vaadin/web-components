/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-grid basic host default"] = 
`<vaadin-grid style="">
  <vaadin-grid-column path="name.first">
  </vaadin-grid-column>
  <vaadin-grid-column path="name.last">
  </vaadin-grid-column>
  <vaadin-grid-cell-content slot="vaadin-grid-header-cell-content-0-0">
    First
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-header-cell-content-0-1">
    Last
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-footer-cell-content-0-0">
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-footer-cell-content-0-1">
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-body-cell-content-sizer-0">
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-body-cell-content-sizer-1">
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-body-cell-content-2-0">
    Laura
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-body-cell-content-2-1">
    Arnaud
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-body-cell-content-3-0">
    Fabien
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-body-cell-content-3-1">
    Le gall
  </vaadin-grid-cell-content>
</vaadin-grid>
`;
/* end snapshot vaadin-grid basic host default */

snapshots["vaadin-grid basic shadow default"] = 
`<div
  id="scroller"
  style=""
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
          class="body-cell cell first-column-cell"
          first-column=""
          part="cell body-cell first-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-4">
          </slot>
        </td>
        <td
          class="body-cell cell last-column-cell"
          last-column=""
          part="cell body-cell last-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-5">
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
        class="first-header-row header-row last-header-row row"
        part="row header-row first-header-row last-header-row "
        role="row"
        style="--_grid-horizontal-scroll-position: 0px;"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell first-header-row-cell header-cell last-header-row-cell"
          first-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell first-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-header-cell-content-0-4">
          </slot>
        </th>
        <th
          class="cell first-header-row-cell header-cell last-column-cell last-header-row-cell"
          last-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell last-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-header-cell-content-0-5">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 72px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row even-row first-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell"
          first-column=""
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-body-cell-content-6-4">
          </slot>
        </td>
        <td
          aria-selected="false"
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-row-cell last-column-cell"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-6-5">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-row-cell odd-row-cell"
          first-column=""
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-7-4">
          </slot>
        </td>
        <td
          aria-selected="false"
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell last-column-cell last-row-cell odd-row-cell"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-7-5">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          class="empty-state"
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
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell footer-cell"
          first-column=""
          part="cell footer-cell first-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-4">
          </slot>
        </td>
        <td
          class="cell footer-cell last-column-cell"
          last-column=""
          part="cell footer-cell last-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-5">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div
    class="reorder-ghost"
    part="reorder-ghost"
  >
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
  style=""
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
          class="body-cell cell first-column-cell"
          first-column=""
          part="cell body-cell first-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-8">
          </slot>
        </td>
        <td
          class="body-cell cell last-column-cell"
          last-column=""
          part="cell body-cell last-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-9">
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
        class="first-header-row header-row last-header-row row"
        part="row header-row first-header-row last-header-row "
        role="row"
        style="--_grid-horizontal-scroll-position: 0px;"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell first-header-row-cell header-cell last-header-row-cell"
          first-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell first-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-header-cell-content-0-8">
          </slot>
        </th>
        <th
          class="cell first-header-row-cell header-cell last-column-cell last-header-row-cell"
          last-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell last-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-header-cell-content-0-9">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 72px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="true"
        class="body-row drag-disabled-row drop-disabled-row even-row first-row row selected-row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell selected-row-cell"
          first-column=""
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell selected-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-body-cell-content-10-8">
          </slot>
        </td>
        <td
          aria-selected="true"
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-row-cell last-column-cell selected-row-cell"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell selected-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-10-9">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-row-cell odd-row-cell"
          first-column=""
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-11-8">
          </slot>
        </td>
        <td
          aria-selected="false"
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell last-column-cell last-row-cell odd-row-cell"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-11-9">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          class="empty-state"
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
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell footer-cell"
          first-column=""
          part="cell footer-cell first-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-8">
          </slot>
        </td>
        <td
          class="cell footer-cell last-column-cell"
          last-column=""
          part="cell footer-cell last-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-9">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div
    class="reorder-ghost"
    part="reorder-ghost"
  >
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
  style=""
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
          class="body-cell cell first-column-cell"
          first-column=""
          part="cell body-cell first-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-12">
          </slot>
        </td>
        <td
          class="body-cell cell last-column-cell"
          last-column=""
          part="cell body-cell last-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-13">
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
        class="first-header-row header-row last-header-row row"
        part="row header-row first-header-row last-header-row "
        role="row"
        style="--_grid-horizontal-scroll-position: 0px;"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell first-header-row-cell header-cell last-header-row-cell"
          first-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell first-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-header-cell-content-0-12">
          </slot>
        </th>
        <th
          class="cell first-header-row-cell header-cell last-column-cell last-header-row-cell"
          last-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell last-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-header-cell-content-0-13">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 72px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row even-row first-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell"
          first-column=""
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-body-cell-content-14-12">
          </slot>
        </td>
        <td
          aria-selected="false"
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-row-cell last-column-cell"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-14-13">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-row-cell odd-row-cell"
          first-column=""
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-15-12">
          </slot>
        </td>
        <td
          aria-selected="false"
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell last-column-cell last-row-cell odd-row-cell"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-15-13">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          class="empty-state"
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
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell footer-cell"
          first-column=""
          part="cell footer-cell first-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-12">
          </slot>
        </td>
        <td
          class="cell footer-cell last-column-cell"
          last-column=""
          part="cell footer-cell last-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-13">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div
    class="reorder-ghost"
    part="reorder-ghost"
  >
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
  style=""
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
          class="body-cell cell first-column-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell body-cell last-column-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-17">
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
        class="first-header-row header-row last-header-row row"
        part="row header-row first-header-row last-header-row "
        role="row"
        style="--_grid-horizontal-scroll-position: 0px;"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell first-header-row-cell header-cell last-column-cell last-header-row-cell"
          first-column=""
          last-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell last-column-cell first-column-cell"
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-header-cell-content-0-17">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 72px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row even-row first-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-body-cell-content-18-17">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-column-cell last-row-cell odd-row-cell"
          first-column=""
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-19-17">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          class="empty-state"
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
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell footer-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell footer-cell last-column-cell first-column-cell"
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-17">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div
    class="reorder-ghost"
    part="reorder-ghost"
  >
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
  style=""
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
          class="body-cell cell first-column-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell body-cell last-column-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-21">
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
        class="first-header-row header-row last-header-row row"
        part="row header-row first-header-row last-header-row "
        role="row"
        style="--_grid-horizontal-scroll-position: 0px;"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell first-header-row-cell header-cell last-column-cell last-header-row-cell"
          first-column=""
          last-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell last-column-cell first-column-cell"
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-header-cell-content-0-21">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 72px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="true"
        class="body-row drag-disabled-row drop-disabled-row even-row first-row row selected-row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell last-column-cell selected-row-cell"
          first-column=""
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell selected-row-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-body-cell-content-22-21">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-column-cell last-row-cell odd-row-cell"
          first-column=""
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-23-21">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          class="empty-state"
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
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell footer-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell footer-cell last-column-cell first-column-cell"
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-21">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div
    class="reorder-ghost"
    part="reorder-ghost"
  >
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
  style=""
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
          class="body-cell cell first-column-cell"
          first-column=""
          part="cell body-cell first-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-24">
          </slot>
        </td>
        <td
          class="body-cell cell last-column-cell"
          last-column=""
          part="cell body-cell last-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-25">
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
        class="first-header-row header-row last-header-row row"
        part="row header-row first-header-row last-header-row "
        role="row"
        style="--_grid-horizontal-scroll-position: 0px;"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell first-header-row-cell header-cell last-header-row-cell"
          first-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell first-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-header-cell-content-0-24">
          </slot>
        </th>
        <th
          class="cell first-header-row-cell header-cell last-column-cell last-header-row-cell"
          last-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell last-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-header-cell-content-0-25">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 72px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row even-row first-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell"
          first-column=""
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-body-cell-content-26-24">
          </slot>
        </td>
        <td
          aria-selected="false"
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-row-cell last-column-cell"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-26-25">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-row-cell odd-row-cell"
          first-column=""
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-27-24">
          </slot>
        </td>
        <td
          aria-selected="false"
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell last-column-cell last-row-cell odd-row-cell"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-27-25">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          class="empty-state"
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
        class="first-footer-row footer-row last-footer-row row"
        part="row footer-row first-footer-row last-footer-row"
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell first-footer-row-cell footer-cell last-footer-row-cell"
          first-column=""
          part="cell footer-cell first-column-cell first-footer-row-cell last-footer-row-cell"
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-footer-cell-content-0-24">
          </slot>
        </td>
        <td
          class="cell first-footer-row-cell footer-cell last-column-cell last-footer-row-cell"
          last-column=""
          part="cell footer-cell last-column-cell first-footer-row-cell last-footer-row-cell"
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-25">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div
    class="reorder-ghost"
    part="reorder-ghost"
  >
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
  style=""
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
          class="body-cell cell first-column-cell"
          first-column=""
          part="cell body-cell first-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-29">
          </slot>
        </td>
        <td
          class="body-cell cell last-column-cell"
          last-column=""
          part="cell body-cell last-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-30">
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
        class="header-row row"
        hidden=""
        part="row header-row  "
        role="row"
        tabindex="-1"
      >
        <th
          aria-colspan="2"
          class="cell first-column-cell header-cell last-column-cell"
          colspan="2"
          first-column=""
          last-column=""
          part="cell header-cell first-column-cell last-column-cell "
          role="columnheader"
          style="width:calc(100px + 100px);flex-grow:2;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-header-cell-content-0-28">
          </slot>
        </th>
      </tr>
      <tr
        aria-rowindex="2"
        class="first-header-row header-row last-header-row row"
        part="row header-row first-header-row last-header-row "
        role="row"
        style="--_grid-horizontal-scroll-position: 0px;"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell first-header-row-cell header-cell last-header-row-cell"
          first-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell first-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-header-cell-content-1-29">
          </slot>
        </th>
        <th
          class="cell first-header-row-cell header-cell last-column-cell last-header-row-cell"
          last-column=""
          part="cell header-cell first-header-row-cell last-header-row-cell last-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-header-cell-content-1-30">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 72px;"
    >
      <tr
        aria-rowindex="2"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row even-row first-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell"
          first-column=""
          part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-body-cell-content-31-29">
          </slot>
        </td>
        <td
          aria-selected="false"
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-row-cell last-column-cell"
          last-column=""
          part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-31-30">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="3"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-row-cell odd-row-cell"
          first-column=""
          part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-32-29">
          </slot>
        </td>
        <td
          aria-selected="false"
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell last-column-cell last-row-cell odd-row-cell"
          last-column=""
          part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-32-30">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          class="empty-state"
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
        class="first-footer-row footer-row last-footer-row row"
        part="row footer-row first-footer-row last-footer-row "
        role="row"
        style="--_grid-horizontal-scroll-position: 0px;"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell first-footer-row-cell footer-cell last-footer-row-cell"
          first-column=""
          part="cell footer-cell first-footer-row-cell last-footer-row-cell first-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-footer-cell-content-1-29">
          </slot>
        </td>
        <td
          class="cell first-footer-row-cell footer-cell last-column-cell last-footer-row-cell"
          last-column=""
          part="cell footer-cell first-footer-row-cell last-footer-row-cell last-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-1-30">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="5"
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          aria-colspan="2"
          class="cell first-column-cell footer-cell last-column-cell"
          colspan="2"
          first-column=""
          last-column=""
          part="cell footer-cell first-column-cell last-column-cell "
          role="gridcell"
          style="width:calc(100px + 100px);flex-grow:2;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-28">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div
    class="reorder-ghost"
    part="reorder-ghost"
  >
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

snapshots["vaadin-grid column groups with header"] = 
`<thead
  id="header"
  role="rowgroup"
  style="transform: translate(0px, 0px);"
>
  <tr
    aria-rowindex="1"
    class="first-header-row header-row row"
    part="row header-row first-header-row"
    role="row"
    tabindex="-1"
  >
    <th
      aria-colspan="2"
      class="cell first-column-cell first-header-row-cell header-cell last-column-cell"
      colspan="2"
      first-column=""
      last-column=""
      part="cell header-cell first-column-cell last-column-cell first-header-row-cell"
      role="columnheader"
      style="width:calc(100px + 100px);flex-grow:2;"
      tabindex="-1"
    >
      <slot name="vaadin-grid-header-cell-content-0-33">
      </slot>
    </th>
  </tr>
  <tr
    aria-rowindex="2"
    class="header-row last-header-row row"
    part="row header-row last-header-row"
    role="row"
    style="--_grid-horizontal-scroll-position: 0px;"
    tabindex="-1"
  >
    <th
      class="cell first-column-cell header-cell last-header-row-cell"
      first-column=""
      part="cell header-cell last-header-row-cell first-column-cell"
      role="columnheader"
      style="width:100px;flex-grow:1;"
      tabindex="0"
    >
      <slot name="vaadin-grid-header-cell-content-1-34">
      </slot>
    </th>
    <th
      class="cell header-cell last-column-cell last-header-row-cell"
      last-column=""
      part="cell header-cell last-header-row-cell last-column-cell"
      role="columnheader"
      style="width:100px;flex-grow:1;"
      tabindex="-1"
    >
      <slot name="vaadin-grid-header-cell-content-1-35">
      </slot>
    </th>
  </tr>
</thead>
`;
/* end snapshot vaadin-grid column groups with header */

snapshots["vaadin-grid column groups with footer"] = 
`<tfoot
  id="footer"
  role="rowgroup"
  style="transform: translate(0px, 0px);"
>
  <tr
    aria-rowindex="4"
    class="first-footer-row footer-row row"
    part="row footer-row first-footer-row"
    role="row"
    style="--_grid-horizontal-scroll-position: 0px;"
    tabindex="-1"
  >
    <td
      class="cell first-column-cell first-footer-row-cell footer-cell"
      first-column=""
      part="cell footer-cell first-footer-row-cell first-column-cell"
      role="gridcell"
      style="width:100px;flex-grow:1;"
      tabindex="0"
    >
      <slot name="vaadin-grid-footer-cell-content-1-39">
      </slot>
    </td>
    <td
      class="cell first-footer-row-cell footer-cell last-column-cell"
      last-column=""
      part="cell footer-cell first-footer-row-cell last-column-cell"
      role="gridcell"
      style="width:100px;flex-grow:1;"
      tabindex="-1"
    >
      <slot name="vaadin-grid-footer-cell-content-1-40">
      </slot>
    </td>
  </tr>
  <tr
    aria-rowindex="5"
    class="footer-row last-footer-row row"
    part="row footer-row last-footer-row"
    role="row"
    tabindex="-1"
  >
    <td
      aria-colspan="2"
      class="cell first-column-cell footer-cell last-column-cell last-footer-row-cell"
      colspan="2"
      first-column=""
      last-column=""
      part="cell footer-cell first-column-cell last-column-cell last-footer-row-cell"
      role="gridcell"
      style="width:calc(100px + 100px);flex-grow:2;"
      tabindex="-1"
    >
      <slot name="vaadin-grid-footer-cell-content-0-38">
      </slot>
    </td>
  </tr>
</tfoot>
`;
/* end snapshot vaadin-grid column groups with footer */

snapshots["vaadin-grid hidden column group with group header"] = 
`<div
  id="scroller"
  style=""
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="2"
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
          class="body-cell cell first-column-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell body-cell first-column-cell last-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-43">
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
        class="header-row row"
        hidden=""
        part="row header-row  "
        role="row"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell header-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell header-cell first-column-cell last-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-header-cell-content-0-43">
          </slot>
        </th>
      </tr>
      <tr
        aria-rowindex="2"
        class="header-row row"
        hidden=""
        part="row header-row  "
        role="row"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell header-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell header-cell first-column-cell last-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-header-cell-content-1-43">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 72px;"
    >
      <tr
        aria-rowindex="1"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row even-row first-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell body-cell first-column-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-body-cell-content-46-43">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="2"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-column-cell last-row-cell odd-row-cell"
          first-column=""
          last-column=""
          part="cell body-cell first-column-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-47-43">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          class="empty-state"
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
        aria-rowindex="3"
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell footer-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell footer-cell first-column-cell last-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-1-43">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="4"
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell footer-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell footer-cell first-column-cell last-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-43">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div
    class="reorder-ghost"
    part="reorder-ghost"
  >
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
/* end snapshot vaadin-grid hidden column group with group header */

snapshots["vaadin-grid hidden column group with group and column header"] = 
`<div
  id="scroller"
  style=""
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="4"
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
          class="body-cell cell first-column-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell body-cell first-column-cell last-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-48">
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
        class="header-row row"
        hidden=""
        part="row header-row  "
        role="row"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell header-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell header-cell first-column-cell last-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-header-cell-content-0-48">
          </slot>
        </th>
      </tr>
      <tr
        aria-rowindex="2"
        class="first-header-row header-row last-header-row row"
        part="row header-row first-header-row last-header-row"
        role="row"
        style="--_grid-horizontal-scroll-position: 0px;"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell first-header-row-cell header-cell last-column-cell last-header-row-cell"
          first-column=""
          last-column=""
          part="cell header-cell first-column-cell last-column-cell first-header-row-cell last-header-row-cell"
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-header-cell-content-1-48">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 72px;"
    >
      <tr
        aria-rowindex="1"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row even-row first-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell body-cell first-column-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-body-cell-content-51-48">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="2"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-column-cell last-row-cell odd-row-cell"
          first-column=""
          last-column=""
          part="cell body-cell first-column-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-52-48">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          class="empty-state"
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
        aria-rowindex="5"
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell footer-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell footer-cell first-column-cell last-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-1-48">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="6"
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell footer-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell footer-cell first-column-cell last-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-48">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div
    class="reorder-ghost"
    part="reorder-ghost"
  >
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
/* end snapshot vaadin-grid hidden column group with group and column header */

snapshots["vaadin-grid hidden column group with group footer"] = 
`<div
  id="scroller"
  style=""
>
  <table
    aria-colcount="2"
    aria-multiselectable="true"
    aria-rowcount="2"
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
          class="body-cell cell first-column-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell body-cell first-column-cell last-column-cell "
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-sizer-53">
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
        class="header-row row"
        hidden=""
        part="row header-row  "
        role="row"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell header-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell header-cell first-column-cell last-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-header-cell-content-0-53">
          </slot>
        </th>
      </tr>
      <tr
        aria-rowindex="2"
        class="header-row row"
        hidden=""
        part="row header-row  "
        role="row"
        tabindex="-1"
      >
        <th
          class="cell first-column-cell header-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell header-cell first-column-cell last-column-cell "
          role="columnheader"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-header-cell-content-1-53">
          </slot>
        </th>
      </tr>
    </thead>
    <tbody
      id="items"
      role="rowgroup"
      style="transform: translate(0px, 0px); height: 72px;"
    >
      <tr
        aria-rowindex="1"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row even-row first-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell body-cell first-column-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="0"
        >
          <slot name="vaadin-grid-body-cell-content-56-53">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="2"
        aria-selected="false"
        class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
          class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-column-cell last-row-cell odd-row-cell"
          first-column=""
          last-column=""
          part="cell body-cell first-column-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
          role="gridcell"
          style="width: 100px; flex-grow: 1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-body-cell-content-57-53">
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody id="emptystatebody">
      <tr id="emptystaterow">
        <td
          class="empty-state"
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
        aria-rowindex="3"
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell footer-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell footer-cell first-column-cell last-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-1-53">
          </slot>
        </td>
      </tr>
      <tr
        aria-rowindex="4"
        class="footer-row row"
        hidden=""
        part="row footer-row  "
        role="row"
        tabindex="-1"
      >
        <td
          class="cell first-column-cell footer-cell last-column-cell"
          first-column=""
          last-column=""
          part="cell footer-cell first-column-cell last-column-cell "
          role="gridcell"
          style="width:100px;flex-grow:1;"
          tabindex="-1"
        >
          <slot name="vaadin-grid-footer-cell-content-0-53">
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
  <div
    class="reorder-ghost"
    part="reorder-ghost"
  >
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
/* end snapshot vaadin-grid hidden column group with group footer */

snapshots["vaadin-grid column reordering reordered"] = 
`<table
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
    <td
      class="body-cell cell first-column-cell reorder--cell"
      first-column=""
      part="cell body-cell first-column-cell reorder--cell"
      reorder-status=""
      role="gridcell"
      style="width: 100px; flex-grow: 1;"
      tabindex="-1"
    >
      <slot name="vaadin-grid-body-cell-content-sizer-59">
      </slot>
    </td>
    <td
      class="body-cell cell last-column-cell reorder--cell"
      last-column=""
      part="cell body-cell last-column-cell reorder--cell"
      reorder-status=""
      role="gridcell"
      style="width: 100px; flex-grow: 1;"
      tabindex="-1"
    >
      <slot name="vaadin-grid-body-cell-content-sizer-58">
      </slot>
    </td>
  </caption>
  <thead
    id="header"
    role="rowgroup"
    style="transform: translate(0px, 0px);"
  >
    <tr
      aria-rowindex="1"
      class="first-header-row header-row last-header-row row"
      part="row header-row first-header-row last-header-row "
      role="row"
      style="--_grid-horizontal-scroll-position: 0px;"
      tabindex="-1"
    >
      <th
        class="cell first-column-cell first-header-row-cell header-cell last-header-row-cell reorder--cell"
        first-column=""
        part="cell header-cell first-header-row-cell last-header-row-cell first-column-cell reorder--cell"
        reorder-status=""
        role="columnheader"
        style="width:100px;flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-header-cell-content-0-59">
        </slot>
      </th>
      <th
        class="cell first-header-row-cell header-cell last-column-cell last-header-row-cell reorder--cell"
        last-column=""
        part="cell header-cell first-header-row-cell last-header-row-cell last-column-cell reorder--cell"
        reorder-status=""
        role="columnheader"
        style="width:100px;flex-grow:1;"
        tabindex="0"
      >
        <slot name="vaadin-grid-header-cell-content-0-58">
        </slot>
      </th>
    </tr>
  </thead>
  <tbody
    id="items"
    role="rowgroup"
    style="transform: translate(0px, 0px); height: 72px;"
  >
    <tr
      aria-rowindex="2"
      aria-selected="false"
      class="body-row drag-disabled-row drop-disabled-row even-row first-row row"
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
        class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell reorder--cell"
        first-column=""
        part="cell body-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-body-cell-content-60-59">
        </slot>
      </td>
      <td
        aria-selected="false"
        class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-row-cell last-column-cell reorder--cell"
        last-column=""
        part="cell body-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell last-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="0"
      >
        <slot name="vaadin-grid-body-cell-content-60-58">
        </slot>
      </td>
    </tr>
    <tr
      aria-rowindex="3"
      aria-selected="false"
      class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
        class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-row-cell odd-row-cell reorder--cell"
        first-column=""
        part="cell body-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-body-cell-content-61-59">
        </slot>
      </td>
      <td
        aria-selected="false"
        class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell last-column-cell last-row-cell odd-row-cell reorder--cell"
        last-column=""
        part="cell body-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell last-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-body-cell-content-61-58">
        </slot>
      </td>
    </tr>
  </tbody>
  <tbody id="emptystatebody">
    <tr id="emptystaterow">
      <td
        class="empty-state"
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
      class="footer-row row"
      hidden=""
      part="row footer-row  "
      role="row"
      tabindex="-1"
    >
      <td
        class="cell first-column-cell footer-cell reorder--cell"
        first-column=""
        part="cell footer-cell first-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width:100px;flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-footer-cell-content-0-59">
        </slot>
      </td>
      <td
        class="cell footer-cell last-column-cell reorder--cell"
        last-column=""
        part="cell footer-cell last-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width:100px;flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-footer-cell-content-0-58">
        </slot>
      </td>
    </tr>
  </tfoot>
</table>
`;
/* end snapshot vaadin-grid column reordering reordered */

snapshots["vaadin-grid column reordering reordered details opened"] = 
`<table
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
    style="padding-bottom: 0px;"
  >
    <td
      aria-controls="vaadin-grid-details-cell-sizer"
      class="body-cell cell first-column-cell reorder--cell"
      first-column=""
      part="cell body-cell first-column-cell reorder--cell"
      reorder-status=""
      role="gridcell"
      style="width: 100px; flex-grow: 1;"
      tabindex="-1"
    >
      <slot name="vaadin-grid-body-cell-content-sizer-63">
      </slot>
    </td>
    <td
      aria-controls="vaadin-grid-details-cell-sizer"
      class="body-cell cell last-column-cell reorder--cell"
      last-column=""
      part="cell body-cell last-column-cell reorder--cell"
      reorder-status=""
      role="gridcell"
      style="width: 100px; flex-grow: 1;"
      tabindex="-1"
    >
      <slot name="vaadin-grid-body-cell-content-sizer-62">
      </slot>
    </td>
    <td
      class="cell details-cell"
      frozen=""
      id="vaadin-grid-details-cell-sizer"
      part="cell details-cell"
      role="gridcell"
      tabindex="-1"
    >
      <slot name="vaadin-grid-details-cell-content-sizer">
      </slot>
    </td>
  </caption>
  <thead
    id="header"
    role="rowgroup"
    style="transform: translate(0px, 0px);"
  >
    <tr
      aria-rowindex="1"
      class="first-header-row header-row last-header-row row"
      part="row header-row first-header-row last-header-row "
      role="row"
      style="--_grid-horizontal-scroll-position: 0px;"
      tabindex="-1"
    >
      <th
        class="cell first-column-cell first-header-row-cell header-cell last-header-row-cell reorder--cell"
        first-column=""
        part="cell header-cell first-header-row-cell last-header-row-cell first-column-cell reorder--cell"
        reorder-status=""
        role="columnheader"
        style="width:100px;flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-header-cell-content-0-63">
        </slot>
      </th>
      <th
        class="cell first-header-row-cell header-cell last-column-cell last-header-row-cell reorder--cell"
        last-column=""
        part="cell header-cell first-header-row-cell last-header-row-cell last-column-cell reorder--cell"
        reorder-status=""
        role="columnheader"
        style="width:100px;flex-grow:1;"
        tabindex="0"
      >
        <slot name="vaadin-grid-header-cell-content-0-62">
        </slot>
      </th>
    </tr>
  </thead>
  <tbody
    id="items"
    role="rowgroup"
    style="transform: translate(0px, 0px); height: 108px;"
  >
    <tr
      aria-rowindex="2"
      aria-selected="false"
      class="body-row details-opened-row drag-disabled-row drop-disabled-row even-row first-row row"
      details-opened=""
      drag-disabled=""
      drop-disabled=""
      even=""
      first=""
      part="row body-row first-row even-row drag-disabled-row drop-disabled-row details-opened-row"
      role="row"
      style="position: absolute; transform: translateY(0px); padding-bottom: 36px;"
      tabindex="-1"
    >
      <td
        aria-controls="vaadin-grid-details-cell-64"
        aria-selected="false"
        class="body-cell cell details-opened-row-cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell reorder--cell"
        first-column=""
        part="cell body-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell details-opened-row-cell first-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-body-cell-content-64-63">
        </slot>
      </td>
      <td
        aria-controls="vaadin-grid-details-cell-64"
        aria-selected="false"
        class="body-cell cell details-opened-row-cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-row-cell last-column-cell reorder--cell"
        last-column=""
        part="cell body-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell details-opened-row-cell last-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="0"
      >
        <slot name="vaadin-grid-body-cell-content-64-62">
        </slot>
      </td>
      <td
        aria-selected="false"
        class="cell details-cell"
        frozen=""
        id="vaadin-grid-details-cell-64"
        part="cell details-cell"
        role="gridcell"
        style="transform: translate(0px, 0px);"
        tabindex="-1"
      >
        <slot name="vaadin-grid-details-cell-content-64">
        </slot>
      </td>
    </tr>
    <tr
      aria-rowindex="3"
      aria-selected="false"
      class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
      drag-disabled=""
      drop-disabled=""
      last=""
      odd=""
      part="row body-row last-row odd-row drag-disabled-row drop-disabled-row"
      role="row"
      style="position: absolute; transform: translateY(72px);"
      tabindex="-1"
    >
      <td
        aria-controls="vaadin-grid-details-cell-65"
        aria-selected="false"
        class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-row-cell odd-row-cell reorder--cell"
        first-column=""
        part="cell body-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-body-cell-content-65-63">
        </slot>
      </td>
      <td
        aria-controls="vaadin-grid-details-cell-65"
        aria-selected="false"
        class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell last-column-cell last-row-cell odd-row-cell reorder--cell"
        last-column=""
        part="cell body-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell last-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-body-cell-content-65-62">
        </slot>
      </td>
      <td
        aria-selected="false"
        class="cell details-cell"
        frozen=""
        hidden=""
        id="vaadin-grid-details-cell-65"
        part="cell details-cell"
        role="gridcell"
        style="transform: translate(0px, 0px);"
        tabindex="-1"
      >
        <slot name="vaadin-grid-details-cell-content-65">
        </slot>
      </td>
    </tr>
  </tbody>
  <tbody id="emptystatebody">
    <tr id="emptystaterow">
      <td
        class="empty-state"
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
      class="footer-row row"
      hidden=""
      part="row footer-row  "
      role="row"
      tabindex="-1"
    >
      <td
        class="cell first-column-cell footer-cell reorder--cell"
        first-column=""
        part="cell footer-cell first-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width:100px;flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-footer-cell-content-0-63">
        </slot>
      </td>
      <td
        class="cell footer-cell last-column-cell reorder--cell"
        last-column=""
        part="cell footer-cell last-column-cell reorder--cell"
        reorder-status=""
        role="gridcell"
        style="width:100px;flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-footer-cell-content-0-62">
        </slot>
      </td>
    </tr>
  </tfoot>
</table>
`;
/* end snapshot vaadin-grid column reordering reordered details opened */

snapshots["vaadin-grid column text align default"] = 
`<vaadin-grid style="">
  <vaadin-grid-column
    path="name.first"
    text-align="right"
  >
  </vaadin-grid-column>
  <vaadin-grid-column path="name.last">
  </vaadin-grid-column>
  <vaadin-grid-cell-content
    slot="vaadin-grid-header-cell-content-0-66"
    style="text-align: right;"
  >
    Header
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-header-cell-content-0-67">
    Header
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content
    slot="vaadin-grid-footer-cell-content-0-66"
    style="text-align: right;"
  >
    Footer
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-footer-cell-content-0-67">
    Footer
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content
    slot="vaadin-grid-body-cell-content-sizer-66"
    style="text-align: right;"
  >
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-body-cell-content-sizer-67">
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content
    slot="vaadin-grid-body-cell-content-68-66"
    style="text-align: right;"
  >
    Laura
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-body-cell-content-68-67">
    Arnaud
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content
    slot="vaadin-grid-body-cell-content-69-66"
    style="text-align: right;"
  >
    Fabien
  </vaadin-grid-cell-content>
  <vaadin-grid-cell-content slot="vaadin-grid-body-cell-content-69-67">
    Le gall
  </vaadin-grid-cell-content>
</vaadin-grid>
`;
/* end snapshot vaadin-grid column text align default */

snapshots["vaadin-grid column custom part names default"] = 
`<table
  aria-colcount="2"
  aria-multiselectable="true"
  aria-rowcount="6"
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
    <td
      class="body-cell cell first-column-cell"
      first-column=""
      part="cell body-cell first-column-cell "
      role="gridcell"
      style="width: 100px; flex-grow: 1;"
      tabindex="-1"
    >
      <slot name="vaadin-grid-body-cell-content-sizer-71">
      </slot>
    </td>
    <td
      class="body-cell cell last-column-cell"
      last-column=""
      part="cell body-cell last-column-cell "
      role="gridcell"
      style="width: 100px; flex-grow: 1;"
      tabindex="-1"
    >
      <slot name="vaadin-grid-body-cell-content-sizer-72">
      </slot>
    </td>
  </caption>
  <thead
    id="header"
    role="rowgroup"
    style="transform: translate(0px, 0px);"
  >
    <tr
      aria-rowindex="1"
      class="first-header-row header-row row"
      part="row header-row first-header-row "
      role="row"
      tabindex="-1"
    >
      <th
        aria-colspan="1"
        class="cell first-column-cell first-header-row-cell header-cell"
        colspan="1"
        first-column=""
        part="cell header-cell first-header-row-cell first-column-cell custom-group-header "
        role="columnheader"
        style="width:calc(100px);flex-grow:1;"
        tabindex="0"
      >
        <slot name="vaadin-grid-header-cell-content-0-70">
        </slot>
      </th>
      <th
        class="cell first-header-row-cell header-cell last-column-cell"
        last-column=""
        part="cell header-cell first-header-row-cell last-column-cell "
        role="columnheader"
        style="width:100px;flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-header-cell-content-0-72">
        </slot>
      </th>
    </tr>
    <tr
      aria-rowindex="2"
      class="header-row last-header-row row"
      part="row header-row last-header-row "
      role="row"
      style="--_grid-horizontal-scroll-position: 0px;"
      tabindex="-1"
    >
      <th
        class="cell first-column-cell header-cell last-header-row-cell"
        first-column=""
        part="cell header-cell last-header-row-cell first-column-cell custom-first-header "
        role="columnheader"
        style="width:100px;flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-header-cell-content-1-71">
        </slot>
      </th>
      <th
        class="cell header-cell last-column-cell last-header-row-cell"
        last-column=""
        part="cell header-cell last-header-row-cell last-column-cell custom-last-header "
        role="columnheader"
        style="width:100px;flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-header-cell-content-1-72">
        </slot>
      </th>
    </tr>
  </thead>
  <tbody
    id="items"
    role="rowgroup"
    style="transform: translate(0px, 0px); height: 72px;"
  >
    <tr
      aria-rowindex="3"
      aria-selected="false"
      class="body-row drag-disabled-row drop-disabled-row even-row first-row row"
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
        class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-column-cell first-row-cell"
        first-column=""
        part="cell body-cell first-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="0"
      >
        <slot name="vaadin-grid-body-cell-content-73-71">
        </slot>
      </td>
      <td
        aria-selected="false"
        class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell even-row-cell first-row-cell last-column-cell"
        last-column=""
        part="cell body-cell last-column-cell first-row-cell even-row-cell drag-disabled-row-cell drop-disabled-row-cell"
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-body-cell-content-73-72">
        </slot>
      </td>
    </tr>
    <tr
      aria-rowindex="4"
      aria-selected="false"
      class="body-row drag-disabled-row drop-disabled-row last-row odd-row row"
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
        class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell first-column-cell last-row-cell odd-row-cell"
        first-column=""
        part="cell body-cell first-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-body-cell-content-74-71">
        </slot>
      </td>
      <td
        aria-selected="false"
        class="body-cell cell drag-disabled-row-cell drop-disabled-row-cell last-column-cell last-row-cell odd-row-cell"
        last-column=""
        part="cell body-cell last-column-cell last-row-cell odd-row-cell drag-disabled-row-cell drop-disabled-row-cell"
        role="gridcell"
        style="width: 100px; flex-grow: 1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-body-cell-content-74-72">
        </slot>
      </td>
    </tr>
  </tbody>
  <tbody id="emptystatebody">
    <tr id="emptystaterow">
      <td
        class="empty-state"
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
      aria-rowindex="5"
      class="first-footer-row footer-row row"
      part="row footer-row first-footer-row "
      role="row"
      style="--_grid-horizontal-scroll-position: 0px;"
      tabindex="-1"
    >
      <td
        class="cell first-column-cell first-footer-row-cell footer-cell"
        first-column=""
        part="cell footer-cell first-footer-row-cell first-column-cell custom-first-footer "
        role="gridcell"
        style="width:100px;flex-grow:1;"
        tabindex="0"
      >
        <slot name="vaadin-grid-footer-cell-content-1-71">
        </slot>
      </td>
      <td
        class="cell first-footer-row-cell footer-cell last-column-cell"
        last-column=""
        part="cell footer-cell first-footer-row-cell last-column-cell custom-last-footer "
        role="gridcell"
        style="width:100px;flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-footer-cell-content-1-72">
        </slot>
      </td>
    </tr>
    <tr
      aria-rowindex="6"
      class="footer-row last-footer-row row"
      part="row footer-row last-footer-row "
      role="row"
      tabindex="-1"
    >
      <td
        aria-colspan="1"
        class="cell first-column-cell footer-cell last-footer-row-cell"
        colspan="1"
        first-column=""
        part="cell footer-cell last-footer-row-cell first-column-cell custom-group-footer "
        role="gridcell"
        style="width:calc(100px);flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-footer-cell-content-0-70">
        </slot>
      </td>
      <td
        class="cell footer-cell last-column-cell last-footer-row-cell"
        last-column=""
        part="cell footer-cell last-footer-row-cell last-column-cell "
        role="gridcell"
        style="width:100px;flex-grow:1;"
        tabindex="-1"
      >
        <slot name="vaadin-grid-footer-cell-content-0-72">
        </slot>
      </td>
    </tr>
  </tfoot>
</table>
`;
/* end snapshot vaadin-grid column custom part names default */
