/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-message default"] = 
`<slot name="avatar">
</slot>
<div part="content">
  <div part="header">
    <span part="name">
    </span>
    <span part="time">
    </span>
  </div>
  <div part="message">
    <slot>
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-message default */

snapshots["vaadin-message userName"] = 
`<slot name="avatar">
</slot>
<div part="content">
  <div part="header">
    <span part="name">
      Joan Doe
    </span>
    <span part="time">
    </span>
  </div>
  <div part="message">
    <slot>
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-message userName */

snapshots["vaadin-message time"] = 
`<slot name="avatar">
</slot>
<div part="content">
  <div part="header">
    <span part="name">
    </span>
    <span part="time">
      long ago
    </span>
  </div>
  <div part="message">
    <slot>
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-message time */

snapshots["vaadin-message avatar username"] = 
`<vaadin-message>
  <vaadin-avatar
    abbr="JD"
    aria-hidden="true"
    aria-label="Joan Doe (JD)"
    name="Joan Doe"
    role="img"
    slot="avatar"
  >
  </vaadin-avatar>
</vaadin-message>
`;
/* end snapshot vaadin-message avatar username */

snapshots["vaadin-message avatar abbr"] = 
`<vaadin-message>
  <vaadin-avatar
    abbr="JD"
    aria-hidden="true"
    aria-label="JD"
    role="img"
    slot="avatar"
  >
  </vaadin-avatar>
</vaadin-message>
`;
/* end snapshot vaadin-message avatar abbr */

snapshots["vaadin-message avatar img"] = 
`<vaadin-message>
  <vaadin-avatar
    aria-hidden="true"
    img="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    role="img"
    slot="avatar"
  >
  </vaadin-avatar>
</vaadin-message>
`;
/* end snapshot vaadin-message avatar img */

snapshots["vaadin-message avatar userColorIndex"] = 
`<vaadin-message>
  <vaadin-avatar
    aria-hidden="true"
    has-color-index=""
    role="img"
    slot="avatar"
    style="--vaadin-avatar-user-color: var(--vaadin-user-color-2);"
  >
  </vaadin-avatar>
</vaadin-message>
`;
/* end snapshot vaadin-message avatar userColorIndex */

