/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-message-list default"] = 
`<vaadin-message-list
  aria-relevant="additions"
  role="region"
>
</vaadin-message-list>
`;
/* end snapshot vaadin-message-list default */

snapshots["vaadin-message-list items"] = 
`<vaadin-message-list
  aria-relevant="additions"
  role="region"
>
  <vaadin-message
    role="listitem"
    tabindex="0"
  >
    Hi folks!
    <vaadin-avatar
      abbr="JD"
      aria-hidden="true"
      aria-label="Jane Doe (JD)"
      name="Jane Doe"
      role="img"
      slot="avatar"
    >
    </vaadin-avatar>
  </vaadin-message>
  <vaadin-message
    role="listitem"
    tabindex="-1"
  >
    Good morning!
    <vaadin-avatar
      abbr="LR"
      aria-hidden="true"
      aria-label="Lina Roy (LR)"
      name="Lina Roy"
      role="img"
      slot="avatar"
    >
    </vaadin-avatar>
  </vaadin-message>
</vaadin-message-list>
`;
/* end snapshot vaadin-message-list items */

snapshots["vaadin-message-list theme"] = 
`<vaadin-message-list
  aria-relevant="additions"
  role="region"
>
  <vaadin-message
    role="listitem"
    tabindex="0"
    theme="danger"
  >
    Partial service outage.
    <vaadin-avatar
      abbr="A"
      aria-hidden="true"
      aria-label="Admin (A)"
      name="Admin"
      role="img"
      slot="avatar"
    >
    </vaadin-avatar>
  </vaadin-message>
</vaadin-message-list>
`;
/* end snapshot vaadin-message-list theme */

snapshots["vaadin-message-list className"] = 
`<vaadin-message-list
  aria-relevant="additions"
  role="region"
>
  <vaadin-message
    class="pinned"
    role="listitem"
    tabindex="0"
  >
    Where to start
    <vaadin-avatar
      abbr="A"
      aria-hidden="true"
      aria-label="Admin (A)"
      name="Admin"
      role="img"
      slot="avatar"
    >
    </vaadin-avatar>
  </vaadin-message>
</vaadin-message-list>
`;
/* end snapshot vaadin-message-list className */

snapshots["vaadin-message-list typing indicator default"] = 
`<vaadin-message-list
  aria-relevant="additions"
  role="region"
>
  <vaadin-message
    role="listitem"
    tabindex="0"
  >
    Hi folks!
    <vaadin-avatar
      abbr="JD"
      aria-hidden="true"
      aria-label="Jane Doe (JD)"
      name="Jane Doe"
      role="img"
      slot="avatar"
    >
    </vaadin-avatar>
  </vaadin-message>
  <vaadin-message
    aria-hidden="true"
    inert=""
    slot="typing-indicator"
    typing-indicator=""
  >
    <vaadin-avatar-group
      aria-hidden="true"
      aria-label="Currently 2 active users"
      slot="avatar"
    >
      <vaadin-avatar-group-menu
        aria-orientation="vertical"
        role="menu"
        slot="overlay"
      >
      </vaadin-avatar-group-menu>
      <vaadin-avatar
        abbr="LR"
        aria-describedby="vaadin-tooltip-1"
        aria-label="LR"
        has-tooltip=""
        name="Lina Roy"
        role="img"
        tabindex="0"
        with-tooltip=""
      >
        <vaadin-tooltip
          modeless=""
          slot="tooltip"
        >
          <div
            id="vaadin-tooltip-1"
            role="tooltip"
            slot="overlay"
          >
            Lina Roy (LR)
          </div>
        </vaadin-tooltip>
      </vaadin-avatar>
      <vaadin-avatar
        abbr="TV"
        aria-describedby="vaadin-tooltip-2"
        aria-label="TV"
        has-tooltip=""
        name="Tomi Virkki"
        role="img"
        tabindex="0"
        with-tooltip=""
      >
        <vaadin-tooltip
          modeless=""
          slot="tooltip"
        >
          <div
            id="vaadin-tooltip-2"
            role="tooltip"
            slot="overlay"
          >
            Tomi Virkki (TV)
          </div>
        </vaadin-tooltip>
      </vaadin-avatar>
      <vaadin-avatar
        abbr="+2"
        aria-describedby="vaadin-tooltip-0"
        aria-expanded="false"
        aria-haspopup="menu"
        aria-label="+2"
        has-tooltip=""
        hidden=""
        role="button"
        slot="overflow"
        tabindex="0"
      >
        <vaadin-tooltip
          modeless=""
          slot="tooltip"
        >
          <div
            id="vaadin-tooltip-0"
            role="tooltip"
            slot="overlay"
          >
            Lina Roy
Tomi Virkki
          </div>
        </vaadin-tooltip>
      </vaadin-avatar>
    </vaadin-avatar-group>
    <span>
      Typing…
    </span>
  </vaadin-message>
</vaadin-message-list>
`;
/* end snapshot vaadin-message-list typing indicator default */

snapshots["vaadin-message-list shadow default"] = 
`<div
  id="list"
  part="list"
  role="list"
>
  <slot>
  </slot>
  <slot name="typing-indicator">
  </slot>
</div>
<div
  class="sr-only"
  role="status"
>
</div>
`;
/* end snapshot vaadin-message-list shadow default */

