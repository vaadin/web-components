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

