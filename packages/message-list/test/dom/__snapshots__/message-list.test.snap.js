/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-message-list default"] = 
`<vaadin-message-list
  aria-relevant="additions"
  role="log"
>
</vaadin-message-list>
`;
/* end snapshot vaadin-message-list default */

snapshots["vaadin-message-list items"] = 
`<vaadin-message-list
  aria-relevant="additions"
  role="log"
>
  <vaadin-message
    role="listitem"
    tabindex="0"
  >
    Hi folks!
    <vaadin-avatar
      abbr="JD"
      aria-hidden="true"
      name="Jane Doe"
      role="button"
      slot="avatar"
      tabindex="-1"
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
      name="Lina Roy"
      role="button"
      slot="avatar"
      tabindex="-1"
    >
    </vaadin-avatar>
  </vaadin-message>
</vaadin-message-list>
`;
/* end snapshot vaadin-message-list items */

snapshots["vaadin-message-list theme"] = 
`<vaadin-message-list
  aria-relevant="additions"
  role="log"
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
      name="Admin"
      role="button"
      slot="avatar"
      tabindex="-1"
    >
    </vaadin-avatar>
  </vaadin-message>
</vaadin-message-list>
`;
/* end snapshot vaadin-message-list theme */

