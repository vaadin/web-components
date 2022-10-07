/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-message-list default"] = 
`<div
  part="list"
  role="list"
>
  <dom-repeat style="display: none;">
    <template is="dom-repeat">
    </template>
  </dom-repeat>
</div>
`;
/* end snapshot vaadin-message-list default */

snapshots["vaadin-message-list items"] = 
`<div
  part="list"
  role="list"
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
  <dom-repeat style="display: none;">
    <template is="dom-repeat">
    </template>
  </dom-repeat>
</div>
`;
/* end snapshot vaadin-message-list items */

snapshots["vaadin-message-list theme"] = 
`<div
  part="list"
  role="list"
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
  <dom-repeat style="display: none;">
    <template is="dom-repeat">
    </template>
  </dom-repeat>
</div>
`;
/* end snapshot vaadin-message-list theme */

