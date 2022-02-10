/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-message-input default"] = 
`<vaadin-message-input-text-area placeholder="Message">
  <textarea
    aria-label="Message"
    placeholder="Message"
    rows="1"
    slot="textarea"
    style="min-height: 0px;"
  >
  </textarea>
  <label slot="label">
  </label>
  <div
    hidden=""
    slot="error-message"
  >
  </div>
</vaadin-message-input-text-area>
<vaadin-message-input-button
  role="button"
  tabindex="0"
  theme="primary contained"
>
  Send
</vaadin-message-input-button>
`;
/* end snapshot vaadin-message-input default */

snapshots["vaadin-message-input disabled"] = 
`<vaadin-message-input-text-area
  aria-disabled="true"
  disabled=""
  placeholder="Message"
>
  <textarea
    aria-label="Message"
    disabled=""
    placeholder="Message"
    rows="1"
    slot="textarea"
    style="min-height: 0px;"
    tabindex="-1"
  >
  </textarea>
  <label slot="label">
  </label>
  <div
    hidden=""
    slot="error-message"
  >
  </div>
</vaadin-message-input-text-area>
<vaadin-message-input-button
  aria-disabled="true"
  disabled=""
  role="button"
  tabindex="-1"
  theme="primary contained"
>
  Send
</vaadin-message-input-button>
`;
/* end snapshot vaadin-message-input disabled */

