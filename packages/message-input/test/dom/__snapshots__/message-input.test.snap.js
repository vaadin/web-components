/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-message-input default"] = 
`<vaadin-message-input-text-area placeholder="Message">
  <label slot="label">
  </label>
  <div
    aria-live="assertive"
    slot="error-message"
  >
  </div>
  <textarea
    aria-label="Message"
    placeholder="Message"
    rows="1"
    slot="textarea"
    style="min-height: 0px;"
  >
  </textarea>
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
  <label slot="label">
  </label>
  <div
    aria-live="assertive"
    slot="error-message"
  >
  </div>
  <textarea
    aria-label="Message"
    disabled=""
    placeholder="Message"
    rows="1"
    slot="textarea"
    style="min-height: 0px;"
  >
  </textarea>
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

