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
  </vaadin-message>
  <vaadin-message
    role="listitem"
    tabindex="-1"
  >
    Good morning!
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
  </vaadin-message>
  <dom-repeat style="display: none;">
    <template is="dom-repeat">
    </template>
  </dom-repeat>
</div>
`;
/* end snapshot vaadin-message-list theme */

