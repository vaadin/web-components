/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-avatar-group default"] = 
`<div
  id="container"
  part="container"
>
  <dom-repeat
    id="items"
    style="display: none;"
  >
    <template is="dom-repeat">
    </template>
  </dom-repeat>
  <vaadin-avatar
    abbr="+NaN"
    aria-expanded="false"
    aria-haspopup="listbox"
    hidden=""
    id="overflow"
    part="avatar"
    role="button"
    tabindex="0"
    title=""
  >
  </vaadin-avatar>
</div>
<vaadin-avatar-group-overlay
  id="overlay"
  no-vertical-overlap=""
>
  <template>
  </template>
</vaadin-avatar-group-overlay>
`;
/* end snapshot vaadin-avatar-group default */

snapshots["vaadin-avatar-group items"] = 
`<div
  id="container"
  part="container"
>
  <vaadin-avatar
    abbr="YY"
    part="avatar"
    role="button"
    tabindex="0"
    title="YY"
  >
  </vaadin-avatar>
  <vaadin-avatar
    abbr="TV"
    name="Tomi Virkki"
    part="avatar"
    role="button"
    tabindex="0"
    title="Tomi Virkki"
  >
  </vaadin-avatar>
  <dom-repeat
    id="items"
    style="display: none;"
  >
    <template is="dom-repeat">
    </template>
  </dom-repeat>
  <vaadin-avatar
    abbr="+2"
    aria-expanded="false"
    aria-haspopup="listbox"
    hidden=""
    id="overflow"
    part="avatar"
    role="button"
    tabindex="0"
    title="YY
Tomi Virkki"
  >
  </vaadin-avatar>
</div>
<vaadin-avatar-group-overlay
  id="overlay"
  no-vertical-overlap=""
>
  <template>
  </template>
</vaadin-avatar-group-overlay>
`;
/* end snapshot vaadin-avatar-group items */

snapshots["vaadin-avatar-group theme"] = 
`<div
  id="container"
  part="container"
>
  <vaadin-avatar
    abbr="YY"
    part="avatar"
    role="button"
    tabindex="0"
    theme="small"
    title="YY"
  >
  </vaadin-avatar>
  <vaadin-avatar
    abbr="TV"
    name="Tomi Virkki"
    part="avatar"
    role="button"
    tabindex="0"
    theme="small"
    title="Tomi Virkki"
  >
  </vaadin-avatar>
  <dom-repeat
    id="items"
    style="display: none;"
  >
    <template is="dom-repeat">
    </template>
  </dom-repeat>
  <vaadin-avatar
    abbr="+2"
    aria-expanded="false"
    aria-haspopup="listbox"
    hidden=""
    id="overflow"
    part="avatar"
    role="button"
    tabindex="0"
    theme="small"
    title="YY
Tomi Virkki"
  >
  </vaadin-avatar>
</div>
<vaadin-avatar-group-overlay
  id="overlay"
  no-vertical-overlap=""
>
  <template>
  </template>
</vaadin-avatar-group-overlay>
`;
/* end snapshot vaadin-avatar-group theme */

snapshots["vaadin-avatar-group opened default"] = 
`<div
  id="container"
  part="container"
>
  <vaadin-avatar
    abbr="AD"
    name="Abc Def"
    part="avatar"
    role="button"
    tabindex="0"
    title="Abc Def"
  >
  </vaadin-avatar>
  <dom-repeat id="items">
    <template is="dom-repeat">
    </template>
  </dom-repeat>
  <vaadin-avatar
    abbr="+3"
    aria-expanded="true"
    aria-haspopup="listbox"
    id="overflow"
    part="avatar"
    role="button"
    tabindex="0"
    title="Ghi Jkl
Mno Pqr
Stu Vwx"
  >
  </vaadin-avatar>
</div>
`;
/* end snapshot vaadin-avatar-group opened default */

snapshots["vaadin-avatar-group opened overlay"] = 
`<vaadin-avatar-group-list-box
  aria-orientation="vertical"
  role="listbox"
>
  <vaadin-item
    aria-selected="false"
    focus-ring=""
    focused=""
    role="option"
    tabindex="0"
    theme="avatar-group-item"
  >
    <vaadin-avatar
      abbr="GJ"
      aria-hidden="true"
      name="Ghi Jkl"
      part="avatar"
      role="button"
      tabindex="-1"
    >
    </vaadin-avatar>
    Ghi Jkl
  </vaadin-item>
  <vaadin-item
    aria-selected="false"
    role="option"
    tabindex="-1"
    theme="avatar-group-item"
  >
    <vaadin-avatar
      abbr="MP"
      aria-hidden="true"
      name="Mno Pqr"
      part="avatar"
      role="button"
      tabindex="-1"
    >
    </vaadin-avatar>
    Mno Pqr
  </vaadin-item>
  <vaadin-item
    aria-selected="false"
    role="option"
    tabindex="-1"
    theme="avatar-group-item"
  >
    <vaadin-avatar
      abbr="SV"
      aria-hidden="true"
      name="Stu Vwx"
      part="avatar"
      role="button"
      tabindex="-1"
    >
    </vaadin-avatar>
    Stu Vwx
  </vaadin-item>
  <dom-repeat>
    <template is="dom-repeat">
    </template>
  </dom-repeat>
</vaadin-avatar-group-list-box>
`;
/* end snapshot vaadin-avatar-group opened overlay */

